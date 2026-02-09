import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, RotateCcw } from 'lucide-react';
import { AgentTimeline } from '@/components/agent/AgentTimeline';
import { useProjectStore } from '@/stores/useProjectStore';
import { mockAgentSteps, generateMockTickets } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import type { AgentStepStatus } from '@/types/project';

const AgentProcessing = () => {
  const navigate = useNavigate();
  const { agentSteps, setAgentSteps, updateAgentStep, setTickets, setCurrentPhase } = useProjectStore();
  const startedRef = useRef(false);

  const isComplete = agentSteps.length > 0 && agentSteps.every((s) => s.status === 'complete');
  const hasError = agentSteps.some((s) => s.status === 'error');

  const runSimulation = useCallback(() => {
    const steps = mockAgentSteps.map((s) => ({ ...s, status: 'pending' as AgentStepStatus }));
    setAgentSteps(steps);

    const delays = [
      { id: '1', activeAt: 300, completeAt: 2300 },
      { id: '2', activeAt: 2300, completeAt: 3800 },
      { id: '3', activeAt: 3800, completeAt: 5800 },
      { id: '4', activeAt: 5800, completeAt: 6800 },
      { id: '5', activeAt: 6800, completeAt: 7800 },
      { id: '6', activeAt: 7800, completeAt: 8800 },
      { id: '7', activeAt: 8800, completeAt: 10300 },
      { id: '8', activeAt: 10300, completeAt: 11300 },
    ];

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    delays.forEach(({ id, activeAt, completeAt }) => {
      timeouts.push(
        setTimeout(() => updateAgentStep(id, { status: 'active', timestamp: new Date() }), activeAt),
        setTimeout(() => updateAgentStep(id, { status: 'complete', timestamp: new Date() }), completeAt)
      );
    });

    timeouts.push(setTimeout(() => setTickets(generateMockTickets()), 11500));

    return () => timeouts.forEach(clearTimeout);
  }, [setAgentSteps, updateAgentStep, setTickets]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const cleanup = runSimulation();
    return cleanup;
  }, [runSimulation]);

  const handleProceed = () => {
    setCurrentPhase('review');
    navigate('/review');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <Bot className="h-3.5 w-3.5" />
          AI Processing
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Agents at Work</h1>
        <p className="mt-2 text-muted-foreground">
          Our multi-agent system is analyzing your project and generating a comprehensive plan.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <AgentTimeline />
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {hasError && (
          <Button variant="outline" onClick={() => { startedRef.current = false; runSimulation(); }} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        )}
        {isComplete && (
          <Button onClick={handleProceed} size="lg" className="gap-2 font-semibold animate-fade-in">
            Review Results
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AgentProcessing;
