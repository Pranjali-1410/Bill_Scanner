
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { LogOut } from 'lucide-react';

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userName = "PRANJALI YADAV";
  
  const handleLogout = () => {
    // Show toast notification
    toast({
      title: "Logging out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to login page after a brief delay
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <header className="bg-kpmg-blue text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-2">KPMG</div>
          <div className="text-xl ml-2">KPMG Portal</div>
        </div>
        <div className="flex items-center">
          <div className="mr-4">{userName}</div>
          <button 
            onClick={handleLogout}
            className="bg-white text-kpmg-blue font-bold py-1 px-4 rounded flex items-center hover:bg-gray-100 transition-colors"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
