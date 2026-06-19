import React, { useState, useEffect } from "react";
import api from "../../services/api";

// --- Ikon-Ikon SVG Pendukung Premium ---
const SearchIcon2 = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const FilterIcon2 = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  // 🚀 AMBIL & GABUNGKAN DATA DARI DUA ROUTER BACKEND SEKALIGUS
  useEffect(() => {
    if (userId) {
      setLoading(true);
      
      // Menembak rute permohonan darah dan rute respon donor secara paralel
      Promise.all([
        api.get(`/donor-requests/my-requests/${userId}`),
        api.get(`/request-responses/my-responses/${userId}`)
      ])
        .then(([requestsRes, responsesRes]) => {
          // 1. Normalisasi Data Permintaan (Requests)
          const normalizedRequests = (requestsRes.data || []).map((req) => ({
            id: req.id,
            type: "Permintaan",
            blood: req.blood_type,
            location: req.hospital?.name || req.hospital_name || "Rumah Sakit",
            status: req.status === "pending" ? "Aktif" : "Selesai",
            statusColor: req.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100",
            icon: "🧬",
            raw_date: req.created_at || ""
          }));

          // 2. Normalisasi Data Respon Donor (Responses)
          const normalizedResponses = (responsesRes.data || []).map((res) => ({
            id: res.id,
            type: "Respon Donor",
            blood: res.request?.blood_type || res.blood_type || "-",
            location: res.request?.hospital?.name || res.hospital_name || "Rumah Sakit",
            status: res.status === "pending" ? "Menunggu" : res.status === "accepted" ? "Selesai" : "Dibatalkan",
            statusColor: res.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : res.status === "accepted" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-red-50 text-red-600 border border-red-100",
            icon: "🩸",
            raw_date: res.created_at || ""
          }));

          // 3. Gabungkan kedua rumpun data dan urutkan berdasarkan ID/waktu terbaru
          const combined = [...normalizedRequests, ...normalizedResponses].sort((a, b) => b.id - a.id);
          
          setActivities(combined);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal menggabungkan riwayat aktivitas:", err);
          setLoading(false);
        });
    }
  }, [userId]);

  // 🔍 LOGIKA FILTER: Menyaring gabungan data secara real-time lewat kolom search
  const filteredActivities = activities.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.type.toLowerCase().includes(query) ||
      item.blood.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  // 📊 HITUNG STATISTIK OTOMATIS BERDASARKAN HASIL DATA REAL
  const totalRequests = activities.filter((a) => a.type === "Permintaan").length;
  const totalResponses = activities.filter((a) => a.type === "Respon Donor").length;
  const totalCompleted = activities.filter((a) => a.status === "Selesai").length;

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center text-xs text-gray-400 bg-[#FAF8F5] min-h-screen">
        Mengompilasi seluruh riwayat transaksi akun Anda...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#FAF8F5] font-sans antialiased">
      
      {/* 🔴 BAGIAN 1: HEADER HALAMAN */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Riwayat Aktivitas</h2>
        <p className="text-gray-400 text-xs mt-1">Pantau kontribusi donor darah serta manajemen seluruh permohonan yang pernah Anda buat.</p>
      </div>

      

      {/* 🔴 BAGIAN 3: BOX UTAMA TABEL TRANSAKSI */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Header Kontrol Internal Tabel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-gray-50 gap-4">
          <h3 className="font-extrabold text-gray-900 text-sm tracking-tight">Daftar Aktivitas</h3>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center border border-gray-200 bg-gray-50/50 rounded-xl px-3 py-2 gap-2 focus-within:border-[#c80040] transition-colors w-full sm:w-auto">
              <SearchIcon2 />
              <input 
                type="text"
                placeholder="Cari riwayat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-xs bg-transparent text-gray-600 w-full sm:w-40 font-medium placeholder-gray-400"
              />
            </div>
            <button className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0">
              <FilterIcon2 />
            </button>
          </div>
        </div>

        {/* Render Tabel Data Hasil Gabungan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-gray-500">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] text-gray-400 font-black uppercase tracking-wider">
                <th className="px-6 py-4">AKTIVITAS</th>
                <th className="px-6 py-4">GOLONGAN</th>
                <th className="px-6 py-4">LOKASI</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-xs font-medium">
                    Belum ada rekaman riwayat aktivitas yang cocok dengan kata kunci pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-gray-800 flex items-center gap-2">
                      <span className="text-sm select-none">{a.icon}</span>
                      <span>{a.type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-sm text-gray-900">{a.blood}</td>
                    <td className="px-6 py-4 text-gray-400 font-semibold">{a.location}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide ${a.statusColor}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔴 BAGIAN 4: FOOTER PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-50 gap-4 text-xs text-gray-400 font-bold">
          <span>Menampilkan 1-{filteredActivities.length} dari {activities.length} aktivitas</span>
          <div className="flex space-x-1 select-none">
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-500 cursor-pointer">‹</button>
            <button className="w-7 h-7 flex items-center justify-center bg-[#c80040] text-white rounded-lg font-black shadow-sm">1</button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-500 cursor-pointer">›</button>
          </div>
        </div>

      </div>
    </div>
  );
}