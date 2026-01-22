import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getWorkById } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workId: string;
}

export const WorkAssignmentsListModal: React.FC<Props> = ({ isOpen, onClose, workId }) => {
  const { toast } = useToast();
  const [work, setWork] = useState<any | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
  const w = await getWorkById(workId);
        setWork(w);
      } catch (err) {
        console.error('Failed to load work', err);
        toast({ title: 'Erreur', description: "Impossible de charger les assignations", variant: 'destructive' });
      }
    })();
  }, [isOpen, workId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Assignations</DialogTitle>
          <DialogDescription className="text-gray-600">Liste des assignations pour ce travail</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {!work || !Array.isArray(work.assignments) || work.assignments.length === 0 ? (
            <div className="text-sm text-gray-600">Aucune assignation</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Groupe</th>
                  <th className="p-2">Étudiants</th>
                  <th className="p-2">Début</th>
                  <th className="p-2">Fin</th>
                </tr>
              </thead>
              <tbody>
                {work.assignments.map((a: any, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 text-foreground">{a.groupName || (a.assignees?.length > 1 ? `Groupe (${a.assignees?.length})` : 'Individuel')}</td>
                    <td className="p-2 text-gray-700">
                      {Array.isArray(a.assignees) && a.assignees.length > 0 ? (
                        a.assignees.map((s: any) => s?.name || s?.email || s?._id || s?.id).join(', ')
                      ) : '—'}
                    </td>
                    <td className="p-2 text-red-600 font-medium">{String(a.startDate).slice(0,10)}</td>
                    <td className="p-2 text-red-600 font-medium">{String(a.endDate).slice(0,10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
