import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addPedagogicalSpace, getAllPromotions, getAllUsers, seedDatabase } from '@/lib/db';
import type { PedagogicalSpace, Promotion, User } from '@/lib/db';
import { getPromotions, getUsers } from '@/lib/api';

interface PedagogicalSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (space: PedagogicalSpace) => void;
}

export const PedagogicalSpaceModal: React.FC<PedagogicalSpaceModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', formateurId: '', studentId: '', promotionId: '' });
  const [users, setUsers] = useState<User[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Essaye backend
        let apiUsers: any[] | null = null;
        let apiPromos: any[] | null = null;
        try {
          const u = await getUsers();
          apiUsers = Array.isArray(u) ? u : null;
        } catch {
          apiUsers = null;
        }
        try {
          const p = await getPromotions();
          apiPromos = Array.isArray(p) ? p : null;
        } catch {
          apiPromos = null;
        }
        // Normaliser les données API (id vs _id) puis fusionner avec IndexedDB
        const normalizedApiUsers: User[] = (apiUsers ?? [])
          .map((u: any) => ({
            id: String(u._id ?? u.id ?? ''),
            name: u.name,
            email: u.email,
            role: u.role,
            status: (u.status ?? 'active') as User['status'],
            createdOn: u.createdOn ?? new Date().toLocaleDateString('fr-FR'),
            phone: u.phone,
            promotion: u.promotion,
          }))
          .filter((u: User) => !!u.id);

        const normalizedApiPromos: Promotion[] = (apiPromos ?? [])
          .map((p: any) => ({
            id: String(p._id ?? p.id ?? ''),
            year: String(p.year ?? ''),
            label: p.label,
            students: Number(p.students ?? 0),
            spaces: Number(p.spaces ?? 0),
          }))
          .filter((p: Promotion) => !!p.id);

        const [localUsers, localPromos] = await Promise.all([
          getAllUsers(),
          getAllPromotions(),
        ]);

        const mergeById = <T extends { id: string }>(a: T[], b: T[]) => {
          const map = new Map<string, T>();
          for (const item of [...a, ...b]) {
            if (item?.id) map.set(item.id, item);
          }
          return Array.from(map.values());
        };

        let mergedUsers = mergeById(normalizedApiUsers, localUsers);
        let mergedPromos = mergeById(normalizedApiPromos, localPromos);

        // Si aucune donnée disponible, tenter de seed la base locale
        if (mergedUsers.length === 0 || mergedPromos.length === 0) {
          try {
            await seedDatabase();
            const [seededUsers, seededPromos] = await Promise.all([
              getAllUsers(),
              getAllPromotions(),
            ]);
            mergedUsers = mergeById(mergedUsers, seededUsers);
            mergedPromos = mergeById(mergedPromos, seededPromos);
          } catch (seedErr) {
            console.warn('Seed error:', seedErr);
          }
        }

        setUsers(mergedUsers);
        setPromotions(mergedPromos);
      } catch (e) {
        console.error('Failed loading data', e);
      }
    }
    if (isOpen) loadData();
  }, [isOpen]);

  const formateurs = useMemo(() => users.filter(u => u.role === 'formateur'), [users]);
  const etudiants = useMemo(() => users.filter(u => u.role === 'etudiant'), [users]);

  const selectedFormateur = useMemo(() => users.find(u => u.id === formData.formateurId), [users, formData.formateurId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.formateurId || !formData.promotionId || !formData.studentId) {
      toast({ title: 'Champs requis', description: 'Veuillez remplir toutes les sélections.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Pas d’API dédiée côté back pour l’instant — on enregistre localement
      const space: PedagogicalSpace = {
        id: uuidv4(),
        name: formData.name,
        formateur: selectedFormateur?.name || '',
        formateurId: formData.formateurId,
        promotion: formData.promotionId,
        studentId: formData.studentId,
        students: 1, // on commence avec un étudiant sélectionné
        createdOn: new Date().toLocaleDateString('fr-FR'),
      };
      await addPedagogicalSpace(space);

      toast({ title: 'Espace créé', description: 'L’espace pédagogique a été ajouté.' });
      setFormData({ name: '', formateurId: '', studentId: '', promotionId: '' });
      onCreated?.(space);
      onClose();
    } catch (error) {
      console.error('Failed to create pedagogical space:', error);
      toast({ title: 'Erreur', description: "Impossible de créer l’espace pédagogique.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[520px] bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>Créer un espace pédagogique</DialogTitle>
          <DialogDescription className="text-gray-600">Sélectionnez le formateur, l’étudiant, la promotion et la matière.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Matière</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Programmation Web" required />
            </div>

            <div className="space-y-2">
              <Label>Formateur</Label>
              <Select value={formData.formateurId} onValueChange={(v) => setFormData({ ...formData, formateurId: v })} disabled={formateurs.length === 0}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue placeholder="Choisir un formateur" />
                </SelectTrigger>
                <SelectContent>
                  {formateurs.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                  {formateurs.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucun formateur disponible. Créez d’abord un utilisateur "formateur".</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Étudiant</Label>
              <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })} disabled={etudiants.length === 0}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue placeholder="Choisir un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {etudiants.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                  {etudiants.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucun étudiant disponible. Créez d’abord un utilisateur "étudiant".</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Promotion</Label>
              <Select value={formData.promotionId} onValueChange={(v) => setFormData({ ...formData, promotionId: v })} disabled={promotions.length === 0}>
                <SelectTrigger className="bg-gray-50 border-gray-200 text-foreground">
                  <SelectValue placeholder="Choisir une promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.label ?? `Promotion ${p.year}`}</SelectItem>
                  ))}
                  {promotions.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucune promotion disponible. Créez d’abord une promotion.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
              {loading ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PedagogicalSpaceModal;
