import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { updateUserApi } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; name: string; email: string; phone?: string; role: string };
}

export const UserEditModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', role: '', phone: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email.trim().toLowerCase(),
        role: formData.role || undefined,
        phone: formData.phone || undefined,
      };
      await updateUserApi(user.id, payload);
      toast({ title: 'Utilisateur modifié', description: "Les informations de l'utilisateur ont été mises à jour." });
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({ title: 'Erreur', description: "Impossible de modifier l'utilisateur.", variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Modifier l'utilisateur</DialogTitle>
          <DialogDescription className="text-gray-600">Mettre à jour les informations du compte</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-popover-foreground">Nom complet</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-popover-foreground">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-popover-foreground">Rôle</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="directeur" className="text-popover-foreground">Directeur des Études</SelectItem>
                  <SelectItem value="formateur" className="text-popover-foreground">Formateur</SelectItem>
                  <SelectItem value="etudiant" className="text-popover-foreground">Étudiant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-popover-foreground">Téléphone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400" />
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
