import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DetailRequestPage from "./DetailRequestPage";

export default function ResponsPage() {
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/donor-requests/my-responses/${userId}`)
        .then((res) => {
          const sortedResponses = res.data.sort((a, b) => b.id - a.id);
          setMyResponses(sortedResponses);
        })
        .catch((err) => console.error("Gagal memuat respon:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
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

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-xs font-medium shadow-sm animate-pulse">
          ⏳ Memuat daftar permintaan...
        </div>
      ) : myResponses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-extrabold text-gray-700 mb-2">Belum Ada Permintaan Masuk</h3>
          <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
            Anda belum menerima permintaan donor dari siapapun. Pastikan status ketersediaan Anda aktif agar dapat ditemukan oleh peminta donor.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myResponses.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">

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

              <div className="flex flex-col gap-2 w-full md:w-48">
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(r.id, 'accepted')} className="w-full bg-[#c80040] hover:bg-[#a80034] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all">
                      Terima Permintaan
                    </button>
                    <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-black transition-all">
                      Tolak
                    </button>
                  </>
                )}

                {r.status === 'fulfilled' && (
                  <span className="text-xs font-bold text-blue-600 px-4 py-2 text-center">Permintaan ini sudah selesai</span>
                )}

                <button
                  onClick={() => setSelectedId(r.id_request)}
                  className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-black transition-all bg-white"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}