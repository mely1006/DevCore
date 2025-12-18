import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { role, userName } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'directeur':
        return 'Directeur des Études';
      case 'formateur':
        return 'Formateur';
      case 'etudiant':
        return 'Étudiant';
      default:
        return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-neutral border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden bg-transparent text-foreground hover:bg-gray-100 hover:text-foreground"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <Input
              type="search"
              placeholder="Rechercher espaces ou étudiants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-transparent text-foreground hover:bg-gray-100 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground border-0"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 bg-transparent text-foreground hover:bg-gray-100 hover:text-foreground"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-gray-600">{getRoleLabel(role)}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
              <DropdownMenuLabel className="text-popover-foreground">Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-popover-foreground cursor-pointer">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-popover-foreground cursor-pointer">Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-popover-foreground cursor-pointer">Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
