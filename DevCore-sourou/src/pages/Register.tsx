import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/RoleContext';
import { addUser } from '@/lib/db';
import { apiRegister, apiLogin } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useRole();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const location = useLocation();
  const toast = useToast().toast;
  const promotionId = (location.state as any)?.promotionId as string | undefined;
  const promotionLabel = (location.state as any)?.promotionLabel as string | undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    if (promotionId) {
      // Admin adding a student to a promotion: save to DB as student
      (async () => {
        try {
          const generatePassword = () => Math.random().toString(36).slice(-8);
          const pwd = password || generatePassword();

          const newUser = {
            id: uuidv4(),
            name: fullName || email,
            email,
            role: 'etudiant' as const,
            status: 'active' as const,
            createdOn: new Date().toISOString().split('T')[0],
            password: pwd,
            promotion: promotionId,
            phone: phone || undefined,
          };
          // try to create on backend first
          try {
            await apiRegister({ name: newUser.name, email: newUser.email, password: newUser.password, role: 'etudiant', phone: newUser.phone, promotion: newUser.promotion });
            toast({ title: 'Étudiant ajouté', description: `Email: ${email} — Mot de passe: ${pwd}` });
            try {
              await navigator.clipboard.writeText(`Email: ${email}\nMot de passe: ${pwd}`);
              toast({ title: 'Identifiants copiés', description: 'Les identifiants ont été copiés dans le presse-papiers.' });
            } catch (_) {}
            navigate('/promotions');
          } catch (err) {
            // fallback to local IndexedDB if backend unavailable
            console.warn('Backend register failed, falling back to local DB', err);
            await addUser(newUser);
            toast({ title: 'Étudiant ajouté (local)', description: `Email: ${email} — Mot de passe: ${pwd}` });
            try { await navigator.clipboard.writeText(`Email: ${email}\nMot de passe: ${pwd}`); } catch (_) {}
            navigate('/promotions');
          }
        } catch (err) {
          console.error('Failed to add student:', err);
          toast({ title: 'Erreur', description: 'Impossible de créer l\'étudiant.', variant: 'destructive' });
        }
      })();
      return;
    }

    // simulation d'inscription -> connexion (rôle par défaut : directeur)
    (async () => {
      try {
        const pwd = password || Math.random().toString(36).slice(-8);
        await apiRegister({ name: fullName || email, email, password: pwd, role: 'directeur', phone: phone || undefined });
        // auto-login
        const res = await apiLogin(email, pwd);
        if (res.token) localStorage.setItem('token', res.token);
        const user = res.user || { name: fullName || email, role: 'directeur' };
        login(user.name, user.role);
        navigate('/dashboard');
      } catch (err) {
        console.error('Register error', err);
        toast({ title: 'Erreur', description: 'Impossible de s\'inscrire via le serveur.', variant: 'destructive' });
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-2 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{promotionId ? "Ajouter un étudiant" : 'Inscription'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Prénom</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Votre prénom" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nom</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Votre nom" />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Téléphone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2126XXXXXXXX" />
            </div>

            {promotionId && (
              <div className="p-2 bg-muted rounded-md text-sm text-muted-foreground">
                <strong>Promotion :</strong> {promotionLabel || promotionId}
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@exemple.com" />
            </div>

            {!promotionId && (
              <div>
                <label className="text-sm text-muted-foreground">Mot de passe</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <Button type="submit" className="w-full">{promotionId ? "Créer l'étudiant" : "S'inscrire"}</Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ? <Link to="/login" className="text-primary">Se connecter</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
