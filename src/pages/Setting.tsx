import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Configurer les préférences de votre compte
        </p>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Notifications</CardTitle>
          <CardDescription className="text-gray-600">
            Gérer vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-foreground">
                Notifications par email
              </Label>
              <p className="text-sm text-gray-600">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch id="email-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-foreground">
                Notifications push
              </Label>
              <p className="text-sm text-gray-600">
                Recevoir des notifications dans le navigateur
              </p>
            </div>
            <Switch id="push-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="course-updates" className="text-foreground">
                Mises à jour des cours
              </Label>
              <p className="text-sm text-gray-600">
                Être notifié des nouveaux contenus de cours
              </p>
            </div>
            <Switch id="course-updates" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="announcements" className="text-foreground">
                Annonces
              </Label>
              <p className="text-sm text-gray-600">
                Recevoir les annonces importantes
              </p>
            </div>
            <Switch id="announcements" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Préférences</CardTitle>
          <CardDescription className="text-gray-600">
            Personnaliser votre expérience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-foreground">Langue</Label>
            <Select defaultValue="fr">
              <SelectTrigger id="language" className="bg-gray-50 border-gray-200 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="fr" className="text-popover-foreground">Français</SelectItem>
                <SelectItem value="ar" className="text-popover-foreground">العربية</SelectItem>
                <SelectItem value="en" className="text-popover-foreground">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-foreground">Fuseau horaire</Label>
            <Select defaultValue="casablanca">
              <SelectTrigger id="timezone" className="bg-gray-50 border-gray-200 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="casablanca" className="text-popover-foreground">
                  (GMT+1) Casablanca
                </SelectItem>
                <SelectItem value="paris" className="text-popover-foreground">
                  (GMT+1) Paris
                </SelectItem>
                <SelectItem value="london" className="text-popover-foreground">
                  (GMT+0) London
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="dark-mode" className="text-foreground">
                Mode sombre
              </Label>
              <p className="text-sm text-gray-600">
                Activer le thème sombre
              </p>
            </div>
            <Switch id="dark-mode" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          Enregistrer les modifications
        </Button>
        <Button 
          variant="outline"
          className="bg-transparent text-foreground border-gray-300 hover:bg-gray-100 hover:text-foreground"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};
