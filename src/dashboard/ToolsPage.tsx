import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { PLAN_LIMITS, type PlanId } from '../lib/plans';
import { CheckCircle } from 'lucide-react';
import MyWokiLoader from '../components/MyWokiLoader';
import { subscribeToolActivationChange } from '../lib/tool-activation-events';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface UserData {
  plan: string;
  activeTools: string[];
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [userData, setUserData] = useState<UserData>({ plan: 'starter', activeTools: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');

      // Fetch all tools
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select('id, name, description, category');
      if (toolsError) throw toolsError;
      setTools(toolsData || []);

      if (userId) {
        // Fetch user's plan
        const { data: userPlanData, error: userPlanError } = await supabase
          .from('users')
          .select('plan')
          .eq('id', userId)
          .single();
        
        let plan = 'starter';
        if (userPlanError) {
          console.warn('Error fetching user plan, using default:', userPlanError);
        } else {
          plan = userPlanData?.plan || 'starter';
        }

        // Fetch user's active tools
        const { data: activeToolsData, error: activeToolsError } = await supabase
          .from('user_tool_activations')
          .select('tool_id')
          .eq('user_id', userId)
          .eq('is_active', true);
        
        if (activeToolsError) throw activeToolsError;
        const activeTools = activeToolsData?.map(t => t.tool_id) || [];
        
        setUserData({ plan, activeTools });
      } else {
        setUserData({ plan: 'starter', activeTools: [] });
      }
    } catch (err) {
      console.error('Failed to load tools page data', err);
      setUserData({ plan: 'starter', activeTools: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToolActivationChange(() => {
      fetchData();
    });
    return () => unsubscribe();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <MyWokiLoader />
        <div className="text-[color:var(--dashboard-muted)] text-sm">Loading tools...</div>
      </div>
    );
  }
  
  const { plan, activeTools } = userData;
  const limit = (PLAN_LIMITS[plan as PlanId] || PLAN_LIMITS['starter']).maxActiveTools;
  const activeCount = activeTools.length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-[color:var(--dashboard-text)]">
          Tools
        </h1>
        <p className="text-[color:var(--dashboard-muted)]">
          Browse and activate tools to enhance your workflow.
        </p>
        <div className="pt-2">
          <p className="text-sm text-[color:var(--dashboard-text)] font-medium">
            Your current plan: <span className="capitalize bg-[color:var(--dashboard-border)] text-[color:var(--dashboard-text)] rounded-md px-2 py-1">
              {plan}
            </span>
          </p>
          <p className="text-sm text-[color:var(--dashboard-muted)]">
            Active tools: {activeCount} / {isFinite(limit) ? limit : 'Unlimited'}
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const isActive = activeTools.includes(tool.id);
          return (
            <Link 
              to={`/dashboard/tools/${tool.id}`} 
              key={tool.id} 
              className="block hover:no-underline group"
            >
              <Card className="p-6 space-y-3 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-200 group-hover:border-emerald-300 dark:group-hover:border-emerald-600 bg-[color:var(--dashboard-surface)] border-[color:var(--dashboard-border)]">
                {isActive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {tool.category}
                  </span>
                  <h2 className="text-lg font-medium text-[color:var(--dashboard-text)] mt-1">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-[color:var(--dashboard-muted)] leading-relaxed mt-2">
                    {tool.description}
                  </p>
                </div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {isActive ? 'View Configuration' : 'View Details'} →
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {tools.length === 0 && !loading && (
        <Card className="p-8 text-center bg-[color:var(--dashboard-surface)]">
          <p className="text-[color:var(--dashboard-text)]">
            No tools available yet.
          </p>
          <p className="text-sm text-[color:var(--dashboard-muted)] mt-2">
            Tools will appear here once they're added to the platform.
          </p>
        </Card>
      )}
    </div>
  );
}
