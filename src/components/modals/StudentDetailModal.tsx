import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getAllUsers } from '@/lib/db';
import type { User } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const StudentDetailModal: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast().toast;

  const load = async () => {
    if (!userId) return setUser(null);
    setLoading(true);
    try {
      const all = await getAllUsers();
      const u = all.find((x) => x.id === userId) || null;
      setUser(u);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: "Impossible de charger l'étudiant.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, userId]);

  const handleCopy = async () => {
    if (!user) return;
    const text = `Nom: ${user.name}\nEmail: ${user.email}\nTéléphone: ${user.phone || '-'}\nPromotion: ${user.promotion || '-'}\nStatut: ${user.status}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié', description: 'Informations copiées.' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de copier.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Détails étudiant</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : user ? (
            <div className="space-y-3">
              <div>
                <Label>Nom</Label>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <Label>Téléphone</Label>
                <div className="font-medium">{user.phone || '-'}</div>
              </div>
              <div>
                <Label>Promotion</Label>
                <div className="font-medium">{user.promotion || '-'}</div>
              </div>
              <div>
                <Label>Statut</Label>
                <div className="font-medium">{user.status}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Étudiant introuvable.</p>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={handleCopy}>Copier</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;
