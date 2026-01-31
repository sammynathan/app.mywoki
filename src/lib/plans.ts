export type PlanId = 'starter' | 'core' | 'growth';

interface Plan {
  name: string;
  price: number;
  note: string;
  features: string[];
  yearly?: number;
  recommended?: boolean;
  maxActiveTools?: number;
  maxTools?: number;
  getPlanLimit?: () => number;
}

export const plans: Record<PlanId, Plan> = {
  starter: {
    name: 'Starter',
    price: 0,
    note: 'For exploring calmly',
    features: [
      'Access curated tools',
      'Limited activations',
      'Basic insights',
    ],
  },
  core: {
    name: 'Core',
    price: 29,
    yearly: 290,
    note: 'For consistent progress',
    features: [
      'More active tools',
      'Smart recommendations',
      'Usage insights',
    ],
    recommended: true,
  },
  growth: {
    name: 'Growth',
    price: 79,
    yearly: 790,
    note: 'For teams & momentum',
    features: [
      'Unlimited tools',
      'Team access',
      'Priority support',
    ],
  },
};

export const PLAN_LIMITS: Record<PlanId, { maxActiveTools: number }> = {
  starter: {
    maxActiveTools: 3
  },
  core: {
    maxActiveTools: 7
  },
  growth: {
    maxActiveTools: Infinity
  }
};
