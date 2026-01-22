import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getPromotions, getStudentsByPromotion, assignWork } from '@/lib/api';

interface WorkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  workId: string;
  workType: 'individuel'|'collectif';
}

export const WorkAssignModal: React.FC<WorkAssignModalProps> = ({ isOpen, onClose, workId, workType }) => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getPromotions();
        setPromotions(res || []);
      } catch (err) {
        console.error('Failed to load promotions', err);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!selectedPromotion) { setStudents([]); return; }
    (async () => {
      try {
        const res = await getStudentsByPromotion(selectedPromotion);
        setStudents(res || []);
        setSelectedStudents(new Set());
      } catch (err) {
        console.error('Failed to load students', err);
      }
    })();
  }, [selectedPromotion]);

  const toggleStudent = (id: string) => {
    const next = new Set(selectedStudents);
    if (next.has(id)) next.delete(id); else next.add(id);
    if (workType === 'individuel' && next.size > 1) {
      toast({ title: 'Individuel', description: "Sélectionnez un seul étudiant.", variant: 'destructive' });
      return;
    }
    setSelectedStudents(next);
  };

  const submit = async () => {
    try {
      const ids = Array.from(selectedStudents);
      if (workType === 'individuel' && ids.length !== 1) {
        toast({ title: 'Individuel', description: 'Veuillez sélectionner exactement un étudiant.', variant: 'destructive' });
        return;
      }
      if (!startDate || !endDate) {
        toast({ title: 'Dates requises', description: 'Veuillez fixer la date de début et la date de fin.', variant: 'destructive' });
        return;
      }
      await assignWork(workId, { assignees: ids, startDate, endDate, groupName: groupName || undefined });
      toast({ title: 'Assignation réussie', description: 'Le travail a été assigné.' });
      onClose();
    } catch (err: any) {
      console.error('assignWork error', err);
      toast({ title: 'Erreur', description: err?.body?.message || 'Impossible d\'assigner le travail.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Assigner le travail</DialogTitle>
          <DialogDescription className="text-gray-600">
            Choisissez une promotion puis sélectionnez {workType === 'individuel' ? 'un étudiant' : 'les étudiants'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-popover-foreground">Promotion</Label>
            <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
              <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                <SelectValue placeholder="Sélectionner une promotion" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {promotions.map((p: any) => (
                  <SelectItem key={p._id || p.id} value={p._id || p.id} className="text-popover-foreground">
                    {p.label} — {p.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-popover-foreground">Étudiants</Label>
            <div className="max-h-64 overflow-auto border rounded-md p-2 space-y-1 bg-gray-50">
              {students.length === 0 ? (
                <div className="text-sm text-gray-600">Aucun étudiant trouvé</div>
              ) : students.map((s: any) => {
                const id = s._id || s.id;
                const checked = selectedStudents.has(id);
                return (
                  <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={checked} onChange={() => toggleStudent(id)} />
                    <span>{s.name} — {s.email}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-red-600">Date de début (obligatoire)</Label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-md p-2 border-red-500 text-red-700" />
            </div>
            <div className="space-y-2">
              <Label className="text-red-600">Date de fin (obligatoire)</Label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-md p-2 border-red-500 text-red-700" />
            </div>
          </div>

          {workType === 'collectif' && (
            <div className="space-y-2">
              <Label className="text-popover-foreground">Nom du groupe (optionnel)</Label>
              <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="border rounded-md p-2 border-gray-300" placeholder="Ex: Groupe A" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={submit} className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
