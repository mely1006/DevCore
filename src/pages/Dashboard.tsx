import React from 'react';
import { useRole } from '../context/RoleContext';
import { DirecteurDashboard } from '../components/dashboard/directeurdashboard';
import { FormateurDashboard } from '../components/dashboard/formateurdashboard';
import { EtudiantDashboard } from '../components/dashboard/etudiantdashboard';

export const Dashboard: React.FC = () => {
  const { role } = useRole();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {role === 'directeur' && <DirecteurDashboard />}
      {role === 'formateur' && <FormateurDashboard />}
      {role === 'etudiant' && <EtudiantDashboard />}
    </div>
  );
};
