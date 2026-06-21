import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DetailRequestPage from "./DetailRequestPage";

export default function ResponsPage() {
  const [myResponses, setMyResponses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/donor-requests/my-responses/${userId}`)
        .then((res) => setMyResponses(res.data))
        .catch((err) => console.error("Gagal memuat respon:", err));
    }
  }, [userId]);

  const handleUpdateStatus = async (responseId, newStatus) => {
    try {
      await api.put(`/donor-requests/response/${responseId}?status=${newStatus}`);
      setMyResponses(prev => prev.map(r => r.id === responseId ? { ...r, status: newStatus } : r));
    } catch (err) { alert("Gagal update status."); }
  };

  if (selectedId) {
    return <DetailRequestPage requestId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#FAF8F5] min-h-screen">
      <h1 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Respon Saya</h1>
      
      <div className="space-y-4">
        {myResponses.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider 
                  ${r.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                    r.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-100' : 
                    r.status === 'fulfilled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-red-50 text-red-700 border border-red-100'}`}>
                  {r.status === 'fulfilled' ? 'TERPENUHI' : r.status.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-gray-400">ID: {r.id_request}</span>
              </div>
              
              <h3 className="font-extrabold text-lg text-gray-900 mt-1">
                {r.status === 'fulfilled' ? "Permintaan Selesai" : `Dibutuhkan Darah Golongan ${r.request?.blood_type || "-"}`}
              </h3>
              
              <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                📍 {r.request?.hospital?.name || "Lokasi tidak tersedia"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {r.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdateStatus(r.id, 'accepted')} className="bg-[#c80040] hover:bg-[#a80034] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all">
                    Terima Permintaan
                  </button>
                  <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-black transition-all">
                    Tolak
                  </button>
                </>
              )}
              
              {r.status === 'fulfilled' && (
                <span className="text-xs font-bold text-blue-600 px-4 py-2">Permintaan ini sudah selesai</span>
              )}

              <button 
                onClick={() => setSelectedId(r.id_request)} 
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-black transition-all bg-white"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}