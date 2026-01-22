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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createWork, getUsers } from '@/lib/api';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [type, setType] = useState<'individuel'|'collectif' | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const creationDate = new Date().toISOString().split('T')[0];
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getUsers();
        const studs = (res || []).filter((u: any) => u.role === 'etudiant');
        setStudents(studs);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    })();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!type || !title || !startDate || !endDate) {
        toast({ title: 'Champs requis', description: 'Veuillez remplir tous les champs obligatoires.', variant: 'destructive' });
        return;
      }
      let assignees: string[] | undefined = undefined;
      if (type === 'individuel') {
        if (!selectedStudent) {
          toast({ title: 'Individuel', description: "Sélectionnez l'étudiant.", variant: 'destructive' });
          return;
        }
        assignees = [selectedStudent];
      } else if (type === 'collectif') {
        const ids = Array.from(selectedGroup);
        if (ids.length < 1) {
          toast({ title: 'Collectif', description: 'Sélectionnez au moins un étudiant.', variant: 'destructive' });
          return;
        }
        assignees = ids;
      }
      const payload = {
        title,
        description,
        type: type as 'individuel'|'collectif',
        startDate,
        endDate,
        assignees,
        groupName: groupName || undefined,
      };
      await createWork(payload);
      toast({ title: 'Travail créé', description: 'Le travail a été créé avec succès.' });
      setType(''); setTitle(''); setDescription(''); setStartDate(''); setEndDate(''); setSelectedStudent(''); setSelectedGroup(new Set()); setGroupName('');
      onClose();
    } catch (err: any) {
      console.error('createWork error', err);
      toast({ title: 'Erreur', description: err?.body?.message || 'Impossible de créer le travail.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Créer un travail</DialogTitle>
          <DialogDescription className="text-gray-600">
            Choisissez le type (individuel ou collectif) puis renseignez les informations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-popover-foreground">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as any)}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="individuel" className="text-popover-foreground">Individuel</SelectItem>
                  <SelectItem value="collectif" className="text-popover-foreground">Collectif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-popover-foreground">Titre</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du travail" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-popover-foreground">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnel)" />
            </div>

            <div className="space-y-2">
              <Label className="text-popover-foreground">Date de création</Label>
              <Input value={creationDate} readOnly className="bg-gray-100 border-gray-200 text-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start" className="text-popover-foreground">Date de début</Label>
                <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end" className="text-popover-foreground">Date de fin</Label>
                <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            {type === 'individuel' && (
              <div className="space-y-2">
                <Label className="text-popover-foreground">Étudiant</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                    <SelectValue placeholder="Sélectionner un étudiant" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    {students.map((s: any) => (
                      <SelectItem key={s._id || s.id} value={s._id || s.id} className="text-popover-foreground">
                        {s.name} — {s.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {type === 'collectif' && (
              <div className="space-y-2">
                <Label className="text-popover-foreground">Étudiants (sélection multiple)</Label>
                <div className="max-h-64 overflow-auto border rounded-md p-2 space-y-1 bg-gray-50">
                  {students.length === 0 ? (
                    <div className="text-sm text-gray-600">Aucun étudiant</div>
                  ) : students.map((s: any) => {
                    const id = s._id || s.id;
                    const checked = selectedGroup.has(id);
                    return (
                      <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={checked} onChange={() => {
                          const next = new Set(selectedGroup);
                          if (checked) next.delete(id); else next.add(id);
                          setSelectedGroup(next);
                        }} />
                        <span>{s.name} — {s.email}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <Label className="text-popover-foreground">Nom du groupe (optionnel)</Label>
                  <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ex: Groupe A" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
