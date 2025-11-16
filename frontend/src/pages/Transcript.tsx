// src/Transcript.tsx

import React, { useState, useEffect } from "react";

const Transcript: React.FC = () => {
  // 1. State: Transkript verilerini tutacak olan "değişkenimiz".
  // Başlangıçta boş bir dizi [] olarak tanımladık.
  const [transcripts] = useState<string[]>([]);

  // 2. Loading State: Veri gelene kadar "Yükleniyor..." göstermek için.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. useEffect: Sayfa ilk açıldığında çalışacak kod bloğu.
  // API bağlantısını ileride tam buraya yazacağız.
  useEffect(() => {
    const fakeApiCall = async () => {
      setIsLoading(true);

      setIsLoading(false);
    };

    fakeApiCall();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transcript</h1>

      {/* Transkript Kutusu */}
      <div className="w-full border border-gray-200 rounded-lg p-4 mb-8 bg-gray-50 h-64 overflow-y-auto relative">
        {/* Eğer yükleniyorsa dönen bir yuvarlak veya yazı göster */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : (
          <div className="space-y-2">
            {/* Eğer veri varsa listele, yoksa "Veri yok" yaz */}
            {transcripts.length > 0 ? (
              transcripts.map((line, index) => (
                <p key={index} className="text-gray-700 text-sm">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center mt-20">
                No transcript data available.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-gray-100 mb-6"></div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-48"
        onClick={() => alert("Analiz sayfasına gidiliyor...")}
      >
        View Analysis
      </button>
    </div>
  );
};

export default Transcript;
