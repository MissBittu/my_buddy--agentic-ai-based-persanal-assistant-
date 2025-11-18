import React from 'react';
import { Upload, Download, Trash2, FileText, Image, Film, Music } from 'lucide-react';

const FileVault = ({ darkMode, cardClass, files, deleteFile, handleFileUpload }) => {
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
      case 'application': 
        return <FileText className="w-8 h-8 text-red-400" />;
      case 'image': 
        return <Image className="w-8 h-8 text-blue-400" />;
      case 'video': 
        return <Film className="w-8 h-8 text-purple-400" />;
      case 'audio': 
        return <Music className="w-8 h-8 text-green-400" />;
      default: 
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">File Vault 📁</h2>
        <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          Upload File
          <input 
            type="file" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <div 
            key={file.id} 
            className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate mb-1">{file.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {file.size}
                </p>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {file.uploadedAt}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button 
                onClick={() => deleteFile(file.id)} 
                className="p-2 hover:bg-red-500/20 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileVault;