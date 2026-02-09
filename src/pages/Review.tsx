import { useNavigate } from 'react-router-dom';
import { ListChecks } from 'lucide-react';
import { PrioritizationGrid } from '@/components/review/PrioritizationGrid';
import { useProjectStore } from '@/stores/useProjectStore';

const Review = () => {
  const navigate = useNavigate();
  const { setCurrentPhase } = useProjectStore();

  const handleApprove = () => {
    setCurrentPhase('dashboard');
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <ListChecks className="h-3.5 w-3.5" />
          Review & Prioritize
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Prioritization Grid</h1>
        <p className="mt-2 text-muted-foreground">
          Review the generated tickets, adjust priorities, and approve the allocation plan.
        </p>
      </div>

      <PrioritizationGrid onApprove={handleApprove} />
    </div>
  );
};

export default Review;
