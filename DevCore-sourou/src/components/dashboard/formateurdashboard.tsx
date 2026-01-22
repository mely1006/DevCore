import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkModal } from '@/components/modals/WorkModal';
import { WorkEditModal } from '@/components/modals/WorkEditModal';
import { WorkAssignmentsListModal } from '@/components/modals/WorkAssignmentsListModal';
import { getMyWorks, deleteWork } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const matieres = [
  { name: 'Programmation Web', students: 45, promotion: '2023', nextSession: '15 Jan 2024' },
  { name: 'Base de données', students: 38, promotion: '2023', nextSession: '16 Jan 2024' },
  { name: 'Algorithmique', students: 42, promotion: '2024', nextSession: '17 Jan 2024' },
];

export const FormateurDashboard: React.FC = () => {
  const [openWorkModal, setOpenWorkModal] = useState(false);
  const [works, setWorks] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all'|'individuel'|'collectif'>('all');
  const [editing, setEditing] = useState<any | null>(null);
  const [showAssignments, setShowAssignments] = useState<any | null>(null);
  const { toast } = useToast();

  const loadWorks = async () => {
    try {
      const res = await getMyWorks();
      setWorks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load works', err);
    }
  };

  useEffect(() => { loadWorks(); }, []);
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground" onClick={() => setOpenWorkModal(true)}>
          Créer un travail
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes matières
            </CardTitle>
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">3</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total étudiants
            </CardTitle>
            <Users className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">125</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documents partagés
            </CardTitle>
            <FileText className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">47</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Mes espaces pédagogiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matieres.map((matiere, index) => (
              <Card key={index} className="bg-tertiary text-tertiary-foreground border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-tertiary-foreground">{matiere.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-tertiary-foreground">
                    <p><span className="font-medium">Étudiants:</span> {matiere.students}</p>
                    <p><span className="font-medium">Promotion:</span> {matiere.promotion}</p>
                    <p><span className="font-medium">Prochaine session:</span> {matiere.nextSession}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                    >
                      Voir détails
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-transparent text-tertiary-foreground border-tertiary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                    >
                      <Upload className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des travaux */}
      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-foreground">Mes travaux</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-40 bg-gray-50 border-gray-200 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="all" className="text-popover-foreground">Tous</SelectItem>
                <SelectItem value="individuel" className="text-popover-foreground">Individuels</SelectItem>
                <SelectItem value="collectif" className="text-popover-foreground">Collectifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-foreground">
                  <th className="p-2">Titre</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Début</th>
                  <th className="p-2">Fin</th>
                  <th className="p-2">Assignés</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {works.filter(w => filter === 'all' ? true : w.type === filter).map((w) => (
                  <tr key={w._id || w.id} className="border-t">
                    <td className="p-2 text-foreground">{w.title}</td>
                    <td className="p-2 text-gray-600">{w.type}</td>
                    <td className="p-2 text-gray-600">{String(w.startDate).slice(0,10)}</td>
                    <td className="p-2 text-gray-600">{String(w.endDate).slice(0,10)}</td>
                    <td className="p-2 text-gray-600">{Array.isArray(w.assignees) ? w.assignees.length : 0}</td>
                    <td className="p-2">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="border-gray-300" onClick={() => setShowAssignments(w)}>Voir assignations</Button>
                        <Button size="sm" variant="outline" className="border-gray-300" onClick={() => setEditing(w)}>Modifier</Button>
                        <Button size="sm" variant="destructive" onClick={async () => {
                          try { await deleteWork(w._id || w.id); toast({ title: 'Supprimé', description: 'Travail supprimé.' }); loadWorks(); }
                          catch (err: any) { toast({ title: 'Erreur', description: err?.body?.message || 'Suppression impossible', variant: 'destructive' }); }
                        }}>Supprimer</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {works.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-600">Aucun travail</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <WorkModal isOpen={openWorkModal} onClose={() => { setOpenWorkModal(false); loadWorks(); }} />
    {editing && <WorkEditModal isOpen={!!editing} onClose={() => { setEditing(null); loadWorks(); }} work={editing} />}
  {showAssignments && <WorkAssignmentsListModal isOpen={!!showAssignments} onClose={() => setShowAssignments(null)} workId={showAssignments._id || showAssignments.id} />}
    </div>
  );
};
