
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="text-2xl font-bold mb-8">
        KPMG
      </div>
      
      <div className="mt-auto">
        <Link to="/login" className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
          <LogOut size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
