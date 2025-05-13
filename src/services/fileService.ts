
import { getBackendUrl, createTimeoutController } from '../utils/apiUtils';

const BACKEND_URL = getBackendUrl();

interface ScanResult {
  success: boolean;
  results: any;
  error?: string;
}

export const uploadFile = async (file: File): Promise<{ filePath: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { controller, clearTimeout, signal } = createTimeoutController(30000);
  
  try {
    console.log("Uploading to:", `${BACKEND_URL}/upload`);
    
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      body: formData,
      signal,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    return await response.json();
  } finally {
    clearTimeout();
  }
};

export const scanDocument = async (filePath: string, fileName: string | null): Promise<ScanResult> => {
  const { controller, clearTimeout, signal } = createTimeoutController(60000); // 60 second timeout for scanning
  
  try {
    const response = await fetch(`${BACKEND_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        filePath,
        fileName 
      }),
      signal
    });
    
    if (!response.ok) {
      throw new Error(`Scan failed with status: ${response.status}`);
    }
    
    return await response.json();
  } finally {
    clearTimeout();
  }
};

export const saveToDatabase = async (data: any): Promise<any> => {
  const { controller, clearTimeout, signal } = createTimeoutController(30000);
  
  try {
    const response = await fetch(`${BACKEND_URL}/upload-bill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save to database with status: ${response.status}. Details: ${errorText}`);
    }
    
    return await response.json();
  } finally {
    clearTimeout();
  }
};
