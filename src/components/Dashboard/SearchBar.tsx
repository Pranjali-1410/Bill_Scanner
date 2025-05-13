
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative flex-1 max-w-md">
        <Input 
          type="text" 
          placeholder="Search records..." 
          className="pl-10 pr-4 py-2 w-full"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
