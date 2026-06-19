import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeRequest from "./HomeRequest";
import HomeDonors from "./HomeDonors";

// --- Ikon SVG Pendukung Tambahan Sesuai Mockup Image_902c87.jpg ---
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const RegistrationIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M16 11h6" />
    </svg>
  </div>
);

const NotificationIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  </div>
);

const SaveLifeIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </div>
);

export default function HomePage({ onNavigate }) {
  // State utama menggunakan nama "Requests" secara konsisten
  const [activeTab, setActiveTab] = useState("Home");

  // 🚀 Mendengarkan sinyal perpindahan tab dari modul eksternal secara langsung tanpa percabangan teks
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    
    window.addEventListener("changePublicTab", handleTabChange);
    return () => window.removeEventListener("changePublicTab", handleTabChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* 🤝 MURNI & SINKRON: Oper variabel langsung apa adanya tanpa manipulasi string kondisional */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNavigate={onNavigate} 
        onNavigateNotification={() => onNavigate("notifications")} 
      />

      {/* Konten Tengah Dinamis */}
      <div className="flex-1">
        {activeTab === "Home" && (
          <div className="bg-white">
            {activeTab === "Donors" && <HomeDonors onNavigate={onNavigate} />}
            
            {/* 🔴 SECTION 1: HERO BANNER UTAMA (SESUAI MOCKUP IMAGE_902C87.JPG) */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white">
              {/* Sisi Kiri: Teks & Aksi */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-gray-900 font-extrabold text-2xl md:text-3xl tracking-tight">
                    Selamatkan Nyawa Dengan
                  </h2>
                  <h1 className="text-[#c80040] font-black text-4xl md:text-5xl tracking-tight leading-none">
                    Donor Darah Hari Ini
                  </h1>
                </div>
                
                <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
                  Menghubungkan pendonor darah dengan pasien dalam situasi darurat. Platform kami memastikan respons cepat dan manajemen pasokan darah yang aman karena setiap detik yang sangat berharga.
                </p>

                {/* Pengalihan Rute Aksi Tombol */}
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={() => setActiveTab("Requests")} 
                    className="bg-[#c80040] hover:bg-[#a80034] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-red-900/10 transition-all flex items-center gap-2 border-none cursor-pointer"
                  >
                    Donor Sekarang ❤️
                  </button>
                  <button 
                    onClick={() => setActiveTab("Donors")} 
                    className="bg-white hover:bg-slate-50 text-gray-800 border-2 border-gray-200 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Mencari Donor 🔍
                  </button>
                </div>
              </div>

              {/* Sisi Kanan: Visual Maskot Blood Drops */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <img 
                  src="src/assets/blood.png" 
                  alt="DariNadi Maskot Darah" 
                  className="w-72 md:w-80 h-auto object-contain select-none animate-pulse-slow"
                />
              </div>
            </div>

            {/* 📊 SECTION 2: GRID COUNTER UTAMA GRID (10,000+ NYAWA TERSELAMATKAN) */}
            <div className="bg-slate-50 border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#c80040] mb-0.5">10,000+</div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Nyawa Terselamatkan</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#c80040] mb-0.5">250+</div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Rumah Sakit</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#c80040] mb-0.5">50k</div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Pendonor Terverifikasi</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#c80040] mb-0.5">15m</div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Waktu Respon</div>
                </div>
              </div>
            </div>

            {/* 🛠️ SECTION 3: ALUR ALIR CARA KERJA SISTEM */}
            <div className="max-w-7xl mx-auto px-6 py-16 bg-white text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cara Kerja</h2>
                <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2 leading-relaxed">
                  Proses kami yang efisien memastikan bahwa darah sampai kepada mereka yang membutuhkan secepat dan seaman mungkin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                {/* Langkah 1 */}
                <div className="space-y-3 p-4">
                  <RegistrationIcon />
                  <h3 className="font-bold text-gray-900 text-base">1. Registrasi</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Buat profil, verifikasi golongan darah Anda, dan jadilah bagian dari komunitas donor darah kami.
                  </p>
                </div>
                {/* Langkah 2 */}
                <div className="space-y-3 p-4">
                  <NotificationIcon />
                  <h3 className="font-bold text-gray-900 text-base">2. Dapatkan Notifikasi</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Terima peringatan instan ketika rumah sakit atau pasien di dekat Anda membutuhkan darah yang cocok dengan darah Anda dalam keadaan darurat.
                  </p>
                </div>
                {/* Langkah 3 */}
                <div className="space-y-3 p-4">
                  <SaveLifeIcon />
                  <h3 className="font-bold text-gray-900 text-base">3. Selamatkan Nyawa</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Kunjungi pusat medis yang telah ditunjuk dan selesaikan pendonoran Anda. Lacak pendonoran Anda secara langsung di aplikasi.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "Requests" && <HomeRequest onNavigate={onNavigate} />}
        {activeTab === "Donors" && <HomeDonors onNavigate={onNavigate} />}
      </div>

      {/* Footer Bawah */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="text-white font-black text-lg tracking-tight">DariNadi</div>
            <p className="text-xs leading-relaxed max-w-xs text-gray-400">
              Berkomitmen untuk menjembatani kesenjangan antara para pendonor dan mereka yang membutuhkan.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">Quick Links</div>
            <ul className="space-y-2 text-xs p-0 list-none">
              <li><button onClick={() => setActiveTab("Home")} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-0">Tentang Kami</button></li>
              <li><button onClick={() => setActiveTab("Home")} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-0">Cara Kerja</button></li>
              <li><button onClick={() => alert("Hubungi kami di: support@darinadi.com")} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-0">Hubungi Kami</button></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#c80040] tracking-widest mb-4 uppercase">Medical Trust</div>
            <div className="grid grid-cols-1 gap-2">
              {["FDA APPROVED", "WHO STANDARDS", "HIPAA SECURE", "ISO CERTIFIED"].map((b) => (
                <div key={b} className="border border-gray-800 rounded-md px-2.5 py-1.5 text-[9px] text-gray-400 flex items-center gap-2 bg-gray-900/50">
                  <ShieldIcon /> {b}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#c80040] tracking-widest mb-3 uppercase">Hak Cipta</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              &copy; 2026 DariNadi Medical Systems. Hak Cipta dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
