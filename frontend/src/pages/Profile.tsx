
import React, { useState, useCallback } from 'react';

interface IFormData {
  fullName: string;
  email: string;
  phone: string;
}

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

function ProfileForm() {
  
  const [formData, setFormData] = useState<IFormData>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const completeFormData = { ...formData, resume: file };
    console.log('Form Data Submitted:', completeFormData);
    alert('Profil bilgileri alındı! Konsolu (F12) kontrol edin.');
  };

  const handleDragEvent = useCallback((e: React.DragEvent<HTMLDivElement>, action: 'over' | 'leave' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case 'over':
        setIsDragging(true);
        break;
      case 'leave':
        setIsDragging(false);
        break;
      case 'drop':
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          setFile(e.dataTransfer.files[0]);
        }
        break;
    }
  }, []);

  const dropZoneClass = `
    flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
  `;

  return (
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
        Your Profile
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Enter your personal information and resume.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="form-input w-full px-4 py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Alex Doe"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>

        {/* Email Address */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input w-full px-4 py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="alex.doe@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="form-input w-full px-4 py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        {/* Your Resume (Drag & Drop) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Resume
          </label>
          <div
            className={dropZoneClass}
            onDragEnter={(e) => handleDragEvent(e, 'over')}
            onDragOver={(e) => handleDragEvent(e, 'over')}
            onDragLeave={(e) => handleDragEvent(e, 'leave')}
            onDrop={(e) => handleDragEvent(e, 'drop')}
            onClick={() => document.getElementById('resumeUpload')?.click()}
          >
            <UploadIcon />
            <span className="text-gray-600">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX (MAX. 5MB)
            </span>
            
            <span className="text-sm font-medium text-blue-600 mt-2">
              {file ? file.name : 'resume_alex_doe_2024.pdf'}
            </span>
            
            <input
              type="file"
              id="resumeUpload"
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Confirm Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;