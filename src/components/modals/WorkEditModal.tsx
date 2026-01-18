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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateWork } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface WorkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: any;
}

export const WorkEditModal: React.FC<WorkEditModalProps> = ({ isOpen, onClose, work }) => {
  const { toast } = useToast();
  const [type, setType] = useState<'individuel'|'collectif'>(work?.type || 'individuel');
  const [title, setTitle] = useState(work?.title || '');
  const [description, setDescription] = useState(work?.description || '');
  const [startDate, setStartDate] = useState(work?.startDate?.slice(0,10) || '');
  const [endDate, setEndDate] = useState(work?.endDate?.slice(0,10) || '');

  useEffect(() => {
    setType(work?.type || 'individuel');
    setTitle(work?.title || '');
    setDescription(work?.description || '');
    setStartDate(work?.startDate?.slice(0,10) || '');
    setEndDate(work?.endDate?.slice(0,10) || '');
  }, [work]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWork(work._id || work.id, { title, description, type, startDate, endDate });
      toast({ title: 'Travail mis à jour', description: 'Les modifications ont été enregistrées.' });
      onClose();
    } catch (err: any) {
      console.error('updateWork error', err);
      toast({ title: 'Erreur', description: err?.body?.message || 'Impossible de mettre à jour le travail.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Modifier le travail</DialogTitle>
          <DialogDescription className="text-gray-600">Mettez à jour les informations du travail.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-popover-foreground">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="individuel" className="text-popover-foreground">Individuel</SelectItem>
                  <SelectItem value="collectif" className="text-popover-foreground">Collectif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-popover-foreground">Titre</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-popover-foreground">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
