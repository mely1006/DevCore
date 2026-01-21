import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Credentials {
  email: string;
  password: string;
  name?: string;
  promotionId?: string;
  promotionLabel?: string | null;
  createdOn?: string;
}

interface RecentCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'lastStudentCredentials';

export const RecentCredentialsModal: React.FC<RecentCredentialsModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast().toast;
  const [creds, setCreds] = useState<Credentials | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setCreds(JSON.parse(raw));
        else setCreds(null);
      } catch (e) {
        setCreds(null);
      }
    }
  }, [isOpen]);

  const handleCopy = async () => {
    if (!creds) return;
    const text = `Email: ${creds.email}\nMot de passe: ${creds.password}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié', description: 'Identifiants copiés dans le presse-papiers.' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de copier.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCreds(null);
    toast({ title: 'Supprimé', description: 'Historique des identifiants supprimé.' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>Derniers identifiants créés</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {creds ? (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm">Nom: <strong>{creds.name || '—'}</strong></p>
                <p className="text-sm">Email: <strong>{creds.email}</strong></p>
                <p className="text-sm">Mot de passe: <strong>{creds.password}</strong></p>
                <p className="text-sm">Promotion: <strong>{creds.promotionLabel || creds.promotionId || '—'}</strong></p>
                <p className="text-xs text-gray-400">Créé le: {creds.createdOn || '—'}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1">Copier</Button>
                <Button variant="destructive" onClick={handleClear} className="flex-1">Supprimer</Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Aucun identifiant récent trouvé.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecentCredentialsModal;
