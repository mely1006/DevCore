import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/RoleContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simulation de connexion — forcer rôle directeur
    login(email || 'Utilisateur', 'directeur');
    // naviguer après que le contexte ait été mis à jour
    setTimeout(() => navigate('/dashboard'), 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-2 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@exemple.com" />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Mot de passe</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button type="submit" className="w-full">Se connecter</Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Pas de compte ? <Link to="/register" className="text-primary">Inscrivez-vous</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
