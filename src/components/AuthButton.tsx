
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{user.email}</span>
        </div>
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:ml-2 sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </Link>
  );
};

export default AuthButton;
