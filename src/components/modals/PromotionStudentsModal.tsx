import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getStudentsByPromotion, deleteUser } from '@/lib/db';
import type { User } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import StudentDetailModal from '@/components/modals/StudentDetailModal';
import StudentModal from '@/components/modals/StudentModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promotionId: string;
  promotionLabel?: string | null;
}

const PromotionStudentsModal: React.FC<Props> = ({ isOpen, onClose, promotionId, promotionLabel }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const toast = useToast().toast;

  const load = async () => {
    setLoading(true);
    try {
      const s = await getStudentsByPromotion(promotionId);
      setStudents(s);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: `Impossible de charger les étudiants.`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, promotionId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet étudiant ? Cette action est irréversible.')) return;
    try {
      await deleteUser(id);
      toast({ title: 'Supprimé', description: "L'étudiant a été supprimé." });
      load();
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: "Impossible de supprimer l'étudiant.", variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Étudiants — {promotionLabel || promotionId}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-sm text-gray-500">Aucun étudiant inscrit pour cette promotion.</TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phone || '-'}</TableCell>
                      <TableCell className="capitalize">{s.role}</TableCell>
                      <TableCell>{s.status}</TableCell>
                      <TableCell>{s.createdOn}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setDetailId(s.id)} title="Voir">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditId(s.id)} title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} title="Supprimer">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
      {/* Detail modal */}
      <StudentDetailModal isOpen={!!detailId} onClose={() => setDetailId(null)} userId={detailId} />
      {/* Edit modal: reuse StudentModal in edit mode by passing initial values via load */}
      {editId && (
        <StudentModal
          isOpen={!!editId}
          onClose={() => { setEditId(null); load(); }}
          promotionId={promotionId}
          promotionLabel={promotionLabel || undefined}
          editUserId={editId}
        />
      )}
    </Dialog>
  );
};

export default PromotionStudentsModal;

