import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Confirmer la déconnexion</DialogTitle>
          <DialogDescription className="text-gray-600">Voulez-vous vraiment vous déconnecter ?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button onClick={() => { onConfirm(); }} className="flex-1 bg-destructive text-destructive-foreground">Déconnexion</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
