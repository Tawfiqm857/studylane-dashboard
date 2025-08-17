import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, User, LogOut, Home, BarChart3, Trophy, Shield, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            StudyLane
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              isActivePath('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/leaderboard"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/leaderboard') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              {user?.email === 'admin@example.com' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath('/admin') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;