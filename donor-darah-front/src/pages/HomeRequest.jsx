import { useState, useEffect } from "react";
import api from "../services/api";

// Mengarahkan masuk ke dalam folder dashboard tempat DetailRequestPage berada
import DetailRequestPage from "./dashboard/DetailRequestPage";

const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const bloodBg = {
  "A+": "bg-red-50 text-red-700 border border-red-200",
  "B+": "bg-pink-50 text-pink-700 border border-pink-200",
  "AB+": "bg-purple-50 text-purple-700 border border-purple-200",
  "O+": "bg-rose-50 text-rose-700 border border-rose-200",
  "A-": "bg-red-50 text-red-600 border border-red-100",
  "B-": "bg-pink-50 text-pink-600 border border-pink-100",
  "AB-": "bg-purple-50 text-purple-600 border border-purple-100",
  "O-": "bg-rose-50 text-rose-600 border border-rose-100"
};

export default function HomeRequest({ onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodFilter, setBloodFilter] = useState("Semua");
  const [selectedId, setSelectedId] = useState(null);
  
  // 🔄 State untuk mengontrol jumlah data awal yang dimuat (diubah ke 6 agar pas dengan grid kelipatan 3)
  const [visibleCount, setVisibleCount] = useState(6);
  // State tambahan untuk memantau status loading dan error API
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // AMBIL DATA ASLI DARI BACKEND FASTAPI
  useEffect(() => {
    setLoading(true);
    api.get("/donor-requests/open")
      .then((res) => {
        // PERBAIKAN 1: Validasi data untuk memastikan res.data berbentuk Array sebelum disimpan
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          console.error("Format data backend salah, bukan array:", res.data);
          setErrorMsg("Format data dari server tidak sesuai.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat permintaan donor:", err);
        setErrorMsg("Tidak dapat terhubung ke database server.");
        setLoading(false);
      });
  }, []);

  if (selectedId) {
    return <DetailRequestPage requestId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  // PERBAIKAN 2: Antisipasi jika nilai database berupa null/undefined agar filter tidak crash (.toLowerCase() aman)
  const filtered = requests.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    
    const patientName = r.patient_name ? r.patient_name.toLowerCase() : "";
    const hospitalNameDirect = r.hospital_name ? r.hospital_name.toLowerCase() : "";
    const hospitalNameNested = r.hospital?.name ? r.hospital.name.toLowerCase() : "";

    const matchSearch = 
      patientName.includes(query) ||
      hospitalNameDirect.includes(query) ||
      hospitalNameNested.includes(query);
      
    const matchBlood = bloodFilter === "Semua" || r.blood_type === bloodFilter;
    return matchSearch && matchBlood;
  });

  // Memotong data yang ditampilkan sesuai limit pagination dinamis
  const displayedRequests = filtered.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans antialiased">
      
      {/* CONTAINER FILTER ATAS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-end justify-between gap-4 mb-10">
        <div className="w-full md:flex-1">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wide">
            Cari berdasarkan Lokasi atau Rumah Sakit
          </label>
          <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50/50 px-3 py-2.5 gap-2 focus-within:border-[#c80040] transition-colors">
            <span className="text-gray-400 text-sm select-none">🔍</span>
            <input
              type="text"
              placeholder="Ketik sesuatu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wide">
            Tipe Darah
          </label>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50/50 text-gray-700 font-semibold focus:outline-none focus:border-[#c80040] transition-colors appearance-none cursor-pointer"
          >
            <option value="Semua">Semua</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* PERBAIKAN 3: Tombol filter sekarang tidak melakukan submit form kaku yang merusak state render */}
        <button 
          type="button"
          onClick={() => setVisibleCount(6)} // Reset count view saat filter baru ditekan
          className="w-full md:w-auto bg-[#c80040] hover:bg-[#a80034] text-white font-black text-xs px-6 py-3 rounded-xl border-none cursor-pointer tracking-wide transition-colors"
        >
          Terapkan Filter
        </button>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Daftar Permintaan</h2>
      
      {/* PERBAIKAN 4: Kondisi penanganan Loading dan Error agar terlihat jelas letak kerusakannya */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-xs font-medium shadow-sm animate-pulse">
          ⏳ Sedang menyambungkan ke database server...
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 text-red-700 rounded-2xl border border-red-100 p-12 text-center text-xs font-semibold shadow-sm">
          ⚠️ {errorMsg} <br />
          <span className="text-gray-400 font-normal mt-2 block">Pastikan Backend FastAPI Anda sudah dinyalakan dan port CORS-nya sudah sesuai.</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-xs font-medium shadow-sm">
          Belum ada data permintaan aktif yang cocok dengan kriteria filter pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRequests.map((r) => {
            const urgencyLabel = r.urgency_level || "MENDESAK";
            return (
              <div key={r.id || Math.random()} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between gap-6 hover:border-gray-200 transition-all relative">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm/5 ${bloodBg[r.blood_type] || "bg-red-50 text-red-700"}`}>
                    {r.blood_type}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    urgencyLabel === 'KRITIS' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    💥 {urgencyLabel}
                  </span>
                </div>
                
                <div>
                  <div className="font-extrabold text-gray-900 text-base mb-1.5 tracking-tight">
                    {r.patient_name}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium leading-snug">
                    <MapPinIcon />
                    <span className="truncate">{r.hospital?.name || r.hospital_name || "Rumah Sakit Umum Daerah"}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedId(r.id)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#c80040] hover:bg-[#a80034] text-white cursor-pointer transition-colors border-none shadow-sm"
                >
                  Lihat Detail
                </button>
              </div>
            );
          })}

          {/* KARTU CTA UTAMAKAN CORAK DAN KESESUAIAN VISUAL */}
          <div className="bg-[#c80040] rounded-2xl text-white p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-red-900/10 min-h-[250px] relative overflow-hidden">
            
            <div className="w-11 h-11 rounded-full border-2 border-white/90 flex items-center justify-center mb-4 select-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>

            <div className="mb-5 space-y-1.5">
              <h3 className="font-extrabold text-xl tracking-tight leading-tight">
                Lebih Banyak Permintaan
              </h3>
              <p className="text-red-100/90 text-xs font-medium max-w-[210px] mx-auto leading-relaxed">
                Masih ada {filtered.length > visibleCount ? filtered.length - visibleCount : "0"} permintaan darah terverifikasi di wilayah Anda.
              </p>
            </div>

            <button 
              onClick={() => {
                if (filtered.length > visibleCount) {
                  setVisibleCount((prev) => prev + 6);
                } else {
                  setVisibleCount(6);
                }
              }}
              className="bg-white hover:bg-red-50 text-[#c80040] font-extrabold px-8 py-2.5 rounded-full text-xs transition-all border-none cursor-pointer shadow-md tracking-wide z-10"
            >
              {filtered.length > visibleCount ? "Muat Lainnya" : "Reset Tampilan"}
            </button>

            <div className="absolute -bottom-6 -right-6 text-7xl opacity-10 pointer-events-none select-none">
              ❤️
            </div>
          </div>

        </div>
      )}
    </div>
  );
}