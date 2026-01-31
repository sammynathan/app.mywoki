import { supabase } from '../lib/supabase';
import type { SubscriptionPlan, UserSubscription, PaymentMethod, BillingHistory } from '../lib/billing-types';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export class BillingService {
  // Get all subscription plans
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) throw error;
    return data || [];
  }

  // Get user's current subscription
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  // Get user's payment methods
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get billing history
  static async getBillingHistory(userId: string): Promise<BillingHistory[]> {
    const { data, error } = await supabase
      .from('billing_history')
      .select('*')
      .eq('user_id', userId)
      .order('billed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Subscribe to a plan
  static async subscribeToPlan(userId: string, planId: string): Promise<UserSubscription> {
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;
    if (!plan) throw new Error('Plan not found');

    // If free plan, create subscription directly
    if (plan.price === 0) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .select(`
          *,
          subscription_plans (*)
        `)
        .single();

      if (error) throw error;
      return data;
    }

    // For paid plans, integrate with Paystack
    // This would normally initialize a Paystack transaction
    // For now, we'll create a pending subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'incomplete',
      })
      .select(`
        *,
        subscription_plans (*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Add payment method
  static async addPaymentMethod(userId: string, paystackAuthCode: string): Promise<PaymentMethod> {
    // In a real implementation, you'd verify the auth code with Paystack
    // For now, we'll store it directly
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        paystack_auth_code: paystackAuthCode,
        last4: '****', // Would get from Paystack
        brand: 'Card', // Would get from Paystack
        expiry_month: 12,
        expiry_year: 2025,
        is_default: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete payment method
  static async deletePaymentMethod(paymentMethodId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Update subscription (cancel, etc.)
  static async updateSubscription(subscriptionId: string, userId: string, updates: Partial<UserSubscription>): Promise<UserSubscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .select(`
        *,
        subscription_plans (*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Paystack integration helpers
  static initializePaystackTransaction(amount: number, email: string, callback: (response: any) => void) {
    // This would use the Paystack inline JS
    // For now, return a mock
    return {
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'NGN',
      callback,
      onClose: () => console.log('Payment closed'),
    };
  }
}
