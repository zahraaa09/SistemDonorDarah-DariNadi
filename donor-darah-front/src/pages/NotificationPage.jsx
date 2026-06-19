import React, { useState } from "react";

// Definisikan Ikon SVG sesuai Mockup Image_92cfdb.jpg
const BloodIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#c80040"><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" /></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;

export default function NotificationPage({ onBack, onNavigateToDetail }) {
  // Data Dummy internal terstruktur presisi sesuai isi teks gambar mockup
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "DARURAT",
      title: "Permintaan Darah Golongan O+",
      description: "Rumah Sakit Umum Pusat membutuhkan segera 2 kantong darah O+ untuk prosedur operasi mendesak. Lokasi: 2.5km dari Anda.",
      time: "Baru saja",
      requestId: 5 // ID mapping jika user klik "Bantu Sekarang"
    },
    {
      id: 2,
      type: "SUKSES",
      title: "Pendaftaran Berhasil",
      description: "Konfirmasi pendaftaran donasi Anda untuk acara \"Donor Darah Serentak\" telah divalidasi. Sampai jumpa di lokasi!",
      time: "2 jam yang lalu"
    },
    {
      id: 3,
      type: "PENGINGAT",
      title: "Waktunya Berbagi Lagi",
      description: "Halo! Sudah 3 bulan sejak donasi terakhir Anda. Tubuh Anda sudah siap untuk mendonorkan darah kembali dan membantu mereka yang membutuhkan.",
      time: "Kemarin"
    },
    {
      id: 4,
      type: "INFORMASI",
      title: "Pembaruan Kebijakan Donor",
      description: "Terdapat pembaruan kecil pada protokol kesehatan pra-donasi kami untuk kenyamanan dan keamanan Anda. Silakan baca detailnya.",
      time: "2 hari yang lalu"
    }
  ]);

  const handleMarkAllRead = () => {
    alert("Semua notifikasi telah ditandai sebagai dibaca.");
  };

  // Helper untuk menentukan gaya visual kotak berdasarkan tipe notifikasi
  const getTypeStyles = (type) => {
    switch (type) {
      case "DARURAT":
        return {
          border: "border-l-[#c80040]",
          badge: "bg-red-50 text-[#c80040] border-red-100",
          iconBg: "bg-red-50",
          icon: <BloodIcon />
        };
      case "SUKSES":
        return {
          border: "border-l-blue-400",
          badge: "bg-blue-50 text-blue-600 border-blue-100",
          iconBg: "bg-blue-50",
          icon: <CheckIcon />
        };
      case "PENGINGAT":
        return {
          border: "border-l-indigo-500",
          badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
          iconBg: "bg-indigo-50",
          icon: <CalendarIcon />
        };
      case "INFORMASI":
        return {
          border: "border-l-gray-400",
          badge: "bg-gray-100 text-gray-600 border-gray-200",
          iconBg: "bg-gray-100",
          icon: <InfoIcon />
        };
      default:
        return { border: "border-l-gray-200", badge: "bg-gray-50", iconBg: "bg-gray-50", icon: <InfoIcon /> };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans min-h-screen">
      {/* Header Utama Navigasi Notifikasi */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button 
            onClick={onBack}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-2 flex items-center gap-1"
          >
            ← Kembali ke Halaman Sebelumnya
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifikasi</h1>
          <p className="text-sm text-gray-500 mt-1">Tetap terinformasi dengan aktivitas terbaru Anda.</p>
        </div>
        
        <button 
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-red-700 hover:text-red-900 bg-transparent border-none cursor-pointer pt-6"
        >
          Tandai semua dibaca
        </button>
      </div>

      {/* RENDER LIST CONTAINER */}
      <div className="space-y-4">
        {notifications.map((n) => {
          const styles = getTypeStyles(n.type);
          return (
            <div 
              key={n.id} 
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${styles.border} p-5 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow`}
            >
              {/* Bulatan Lingkaran Ikon Sisi Kiri */}
              <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                {styles.icon}
              </div>

              {/* Blok Konten Teks Tengah */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md border ${styles.badge}`}>
                      {n.type}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base">{n.title}</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{n.time}</span>
                </div>
                
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                  {n.description}
                </p>

                {/* AREA TOMBOL AKSI JIKA TERSEDIA */}
                {n.type === "DARURAT" && (
                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => onNavigateToDetail(n.requestId)}
                      className="bg-[#c80040] hover:bg-[#a80034] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Bantu Sekarang
                    </button>
                    <button 
                      onClick={() => alert("Menampilkan peta rumah sakit tujuan...")}
                      className="bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                    >
                      Detail Lokasi
                    </button>
                  </div>
                )}

                {n.type === "PENGINGAT" && (
                  <div className="pt-1">
                    <button 
                      onClick={() => alert("Mengalihkan ke formulir penjadwalan donor darah...")}
                      className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Atur Jadwal Donasi
                    </button>
                  </div>
                )}

                {n.type === "INFORMASI" && (
                  <div className="pt-1">
                    <button 
                      onClick={() => alert("Membuka dokumen pembaruan protokol kesehatan...")}
                      className="text-xs font-bold text-red-700 hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Baca Selengkapnya
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Tombol Lihat Notifikasi Lama */}
      <button 
        onClick={() => alert("Memuat notifikasi arsip lama...")}
        className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer mt-8 flex items-center justify-center gap-1"
      >
        Lihat Notifikasi Lama <span>∨</span>
      </button>

    </div>
  );
}