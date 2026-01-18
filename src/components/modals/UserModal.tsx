import React, { useState } from 'react';
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
import { createUser as apiCreateUser } from '@/lib/api';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
          const payload = {
            name: formData.name,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            role: formData.role || undefined,
            phone: formData.phone || undefined,
          };

          await apiCreateUser(payload as any);
      
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été ajouté avec succès.",
      });
      
  setFormData({ name: '', email: '', role: '', phone: '', password: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur. L'email existe peut-être déjà.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[500px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Ajouter un utilisateur</DialogTitle>
          <DialogDescription className="text-gray-600">
            Créer un nouveau compte utilisateur pour la plateforme
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-popover-foreground">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
                required
                className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-popover-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean.dupont@univ.ma"
                required
                className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-popover-foreground">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
              />
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
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+2126XXXXXXXX"
                className="bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
              />
            </div>
            
            
          </div>
          
          <DialogFooter>
            <Button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
