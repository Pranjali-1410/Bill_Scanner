
interface RecentFile {
  name: string;
  createdDays: number;
}

interface RecentFilesProps {
  files: RecentFile[];
}

const RecentFiles: React.FC<RecentFilesProps> = ({ files }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-kpmg-purple">Recent files</h3>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-kpmg-purple">
            <span className="sr-only">View</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-kpmg-purple">
            <span className="sr-only">Edit</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-kpmg-purple">{file.name}</span>
              <span className="text-sm text-gray-500">Created {file.createdDays} days ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFiles;
