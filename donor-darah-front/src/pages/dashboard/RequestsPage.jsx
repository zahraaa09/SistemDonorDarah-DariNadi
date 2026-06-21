import React, { useState, useEffect } from "react";
import api from "../../services/api"; 
import DetailRequestPage from "./DetailRequestPage";

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const UrgentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const MapPinIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const BloodDropIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="#c80040"><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" /></svg>;

export default function RequestsPage({ onCreateTrigger }) {
  const [myRequests, setMyRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null); 
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/donor-requests/my-requests/${userId}`)
        .then((res) => setMyRequests(res.data))
        .catch((err) => console.error("Gagal mengambil data permintaan saya:", err));
    }
  }, [userId]);
  if (selectedId) {
    return <DetailRequestPage requestId={selectedId} onBack={() => setSelectedId(null)} />;
  }
  const activeCount = myRequests.filter((r) => r.status === "pending").length;
  const completedCount = myRequests.filter((r) => r.status === "closed").length;
  const handleCloseRequest = async (requestId) => {
    if (window.confirm("Apakah anda ingin menandai permintaan ini sebagai telah terpenuhi?")) {
      try {
        await api.post(`/donor-requests/${requestId}/close?user_id=${userId}`);
        setMyRequests(myRequests.map(r => r.id === requestId ? { ...r, status: "closed" } : r));
      } catch (err) {
        console.error("Gagal memperbarui status permintaan:", err);
        alert("Gagal memperbarui status permintaan. Silakan coba beberapa saat lagi.");
      }
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#FAF8F5] font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Permintaan Saya</h1>
          <p className="text-gray-400 text-xs mt-1">Kelola dan lacak riwayat serta status permohonan kantong darah Anda.</p>
        </div>
        
        <button 
          onClick={onCreateTrigger}
          className="flex items-center justify-center gap-2 bg-[#c80040] hover:bg-[#a80034] text-white font-bold px-4 py-2.5 rounded-xl text-xs border-none cursor-pointer transition-all shadow-md shadow-red-900/5 select-none w-full sm:w-auto self-end"
        >
          <PlusIcon /> <span>Buat Permintaan</span>
        </button>
      </div>

      <div className="space-y-4">
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-xs font-medium shadow-sm">
            Anda belum pernah membuat postingan permohonan donor darah.
          </div>
        ) : (
          myRequests.map((r) => {
            const isPending = r.status === "pending";
            
            return (
              <div 
                key={r.id} 
                className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${
                  isPending ? "border-l-[#c80040]" : "border-l-blue-400"
                } p-5 shadow-sm transition-all hover:border-gray-200`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md tracking-wider ${
                        isPending ? "bg-red-50 text-[#c80040]" : "bg-blue-50 text-blue-600"
                      }`}>
                        {isPending ? "DIBUTUHKAN" : "TERPENUHI"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wide">ID: #{r.id}</span>
                    </div>
                    
                    <h3 className="font-extrabold text-gray-900 text-base tracking-tight">
                      Dibutuhkan Darah Golongan {r.blood_type}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                      <MapPinIcon /> <span>{r.hospital?.name || r.hospital_name || "Rumah Sakit Mitra Terkait"}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-bold pt-1">
                      <BloodDropIcon /> <span>{r.quantity} Kantong Kebutuhan</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto justify-end">
                    {isPending && (
                      <button 
                        onClick={() => handleCloseRequest(r.id)}
                        className="text-xs font-black px-4 py-2.5 rounded-xl bg-[#c80040] hover:bg-[#a80034] text-white cursor-pointer transition-all border-none shadow-sm flex-1 sm:flex-initial text-center whitespace-nowrap"
                      >
                        Telah Terpenuhi
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedId(r.id)}
                      className="text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 cursor-pointer transition-all flex-1 sm:flex-initial text-center whitespace-nowrap"
                    >
                      Lihat Detail
                    </button>
                  </div>

                </div>
                {r.responses && r.responses.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Status Respon Pendonor:</span>
                    <div className="flex flex-wrap gap-2">
                      {r.responses.map((resp) => (
                        <div key={resp.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
                          <span className="text-xs font-bold text-gray-700">{resp.user?.name || "Pendonor"}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                            resp.status === 'accepted' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : resp.status === 'rejected' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {resp.status === 'accepted' ? 'Diterima' : resp.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}