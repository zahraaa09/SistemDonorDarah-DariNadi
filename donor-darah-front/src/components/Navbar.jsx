import React from "react";

// --- Komponen SVG Ikon Grafis Pendukung (Sesuai Mockup) ---
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onNavigate, onNavigateNotification }) {
  // Mengecek status login secara real-time dari session storage penanda token JWT
  const isLoggedIn = !!localStorage.getItem("token");

  // 📝 BERSIH & EFISIEN: Menu tengah selalu sama (Requests) baik sebelum maupun sesudah login
  const links = [
    { id: "Home", label: "Home" },
    { id: "Requests", label: "Requests" },
    { id: "Donors", label: "Donors" }
  ];

  return (
    // ✅ UKURAN DIKECILKAN: Mengubah h-16 menjadi h-12
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm/5 h-12 flex items-center">
      <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
        
        {/* 1. SISI KIRI: BRAND LOGO MAROON TYPOGRAPHY */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none" 
          onClick={() => {
            setActiveTab("Home");
            onNavigate("home");
          }}
        >
          {/* ✅ UKURAN DIKECILKAN: Mengubah text-2xl menjadi text-xl */}
          <span className="text-[#c80040] font-black text-xl tracking-tight font-sans">
            DariNadi
          </span>
        </div>

        {/* 2. SISI TENGAH: TAB NAVIGASI MINIMALIS */}
        <div className="flex items-center gap-8">
          {links.map((link) => {
            // Cek kondisi keaktifan tab agar teks merah menyala presisi
            const isCurrentActive = activeTab?.toLowerCase() === link.id.toLowerCase();
            
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`text-sm font-bold transition-colors cursor-pointer bg-transparent border-none py-1 px-0 ${
                  isCurrentActive ? "text-[#c80040]" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* 3. SISI KANAN: KENDALI MENU ADAPTIF SINKRON (Hanya bagian ini yang berubah saat login) */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* 🔔 KONDISI LOGIN: Tombol Notifikasi Bel Pusat */}
              <button 
                onClick={onNavigateNotification}
                className="relative p-1 bg-transparent border-none cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <BellIcon />
                {/* Dot Bulat Merah Penanda Notifikasi Baru */}
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#c80040] rounded-full ring-2 ring-white" />
              </button>
              
              {/* 👤 KONDISI LOGIN: Avatar Foto Profil User (Klik Menuju Dashboard Internal) */}
              {/* ✅ UKURAN DIKECILKAN: Mengubah w-9 h-9 menjadi w-8 h-8 */}
              <div 
                onClick={() => onNavigate("dashboard")}
                className="w-8 h-8 rounded-full bg-amber-100 overflow-hidden border border-gray-200 cursor-pointer hover:border-[#c80040] transition-all p-0.5 flex items-center justify-center shadow-sm"
              >
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#F59E0B" />
                  <circle cx="20" cy="16" r="7" fill="#92400E" />
                  <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#92400E" />
                </svg>
              </div>
            </>
          ) : (
            <>
              {/* 🔑 KONDISI BELUM LOGIN: Button Outline & Maroon Rounded Pill */}
              {/* ✅ UKURAN DIKECILKAN: Mengurangi padding px-5 py-2 menjadi px-4 py-1.5 */}
              <button 
                onClick={() => onNavigate("login")} 
                className="text-sm font-black text-[#c80040] hover:text-[#a80034] bg-white border border-[#c80040] px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm/5"
              >
                Login
              </button>
              {/* ✅ UKURAN DIKECILKAN: Mengurangi padding px-5 py-2.5 menjadi px-4 py-1.5 */}
              <button 
                onClick={() => onNavigate("register")} 
                className="bg-[#c80040] hover:bg-[#a80034] text-white text-sm font-black px-4 py-1.5 rounded-full transition-colors border-none shadow-md shadow-red-900/5 cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}