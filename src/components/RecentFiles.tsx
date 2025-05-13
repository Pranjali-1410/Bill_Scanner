
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RecentFile {
  name: string;
  createdDays: number;
}

interface RecentFilesProps {
  files: RecentFile[];
}

const RecentFiles: React.FC<RecentFilesProps> = ({ files }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Files</h3>
      
      <div className="space-y-3">
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No recent files found</p>
        ) : (
          files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer"
              title={file.name}
            >
              <FileText size={16} className="text-kpmg-blue mr-2 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.createdDays === 1 ? 'Today' : 
                   file.createdDays < 7 ? `${file.createdDays}d ago` :
                   file.createdDays < 30 ? `${Math.floor(file.createdDays/7)}w ago` :
                   `${Math.floor(file.createdDays/30)}mo ago`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentFiles;
