// src/AnalysisResults.tsx

import React, { useState, useEffect } from 'react';

// Veri yapımızın şablonu (Interface)
interface AnalysisData {
  summary: string;
  followUp: string;
  coachingTips: string;
}

const AnalysisResults: React.FC = () => {
  // Verileri tutacak state
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // SİMÜLASYON: API'den analiz sonuçları geliyormuş gibi yapıyoruz.
    const fetchAnalysis = async () => {
      setIsLoading(true);
      
      // Yapay bir bekleme süresi (1.5 saniye)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Örnek veriler (İleride burası backend'den gelecek)
      setData({
        summary: "The candidate demonstrated strong technical skills but seemed hesitant when discussing project management experience.",
        followUp: "Ask more specific questions about how they handle conflict resolution in a team setting.",
        coachingTips: "Try to maintain more eye contact and avoid using filler words like 'um' and 'uh' too frequently."
      });
      
      setIsLoading(false);
    };

    fetchAnalysis();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col">
      
      {/* Başlık */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Analysis Results
      </h1>

      {/* İçerik Alanı */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Analyzing data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Box */}
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-900 mb-2 ml-1">Summary</h3>
            <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-700 text-sm min-h-[80px]">
              {data?.summary || "No summary available."}
            </div>
          </div>

          {/* Follow Up Box */}
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-900 mb-2 ml-1">Follow Up</h3>
            <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-700 text-sm min-h-[80px]">
              {data?.followUp || "No follow up items."}
            </div>
          </div>

          {/* Coaching Tips Box */}
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-900 mb-2 ml-1">Coaching Tips</h3>
            <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-700 text-sm min-h-[80px]">
              {data?.coachingTips || "No tips available."}
            </div>
          </div>

        </div>
      )}

      {/* Ayırıcı Çizgi */}
      <div className="w-full h-px bg-gray-100 my-8"></div>

      {/* Exit Butonu */}
      <div className="flex justify-center">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-12 rounded-lg transition-colors"
          onClick={() => alert('Çıkış yapılıyor...')}
        >
          Exit
        </button>
      </div>

    </div>
  );
};

export default AnalysisResults;