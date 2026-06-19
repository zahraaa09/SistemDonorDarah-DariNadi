import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { isCompatible } from "../../utils/bloodTypeCompatibility";

export default function DetailRequestPage({ requestId, onBack }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
const currentUserId = localStorage.getItem("user_id");

  // Ambil ID user yang sedang login untuk analisis kecocokan donor
  const myBloodType = localStorage.getItem("user_blood_type") || "O-"; 

  useEffect(() => {
    if (requestId) {
      api.get(`/donor-requests/${requestId}`)
        .then((res) => {
          setRequest(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal memuat detail permintaan:", err);
          setLoading(false);
        });
    }
  }, [requestId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm font-semibold text-gray-500">
        ⏳ Memuat detail permohonan darah...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center p-8 text-gray-500">
        ❌ Data permintaan tidak ditemukan atau telah dihapus.
        <button onClick={onBack} className="block mx-auto mt-4 text-[#c80040] font-bold">Kembali</button>
      </div>
    );
  }

  // 🩸 Hitung Progress Batang Sesuai Gambar Mockup
  // (Misal default simulasi terisi 1 kantong, atau kamu bisa kaitkan dengan database respon donor nantinya)
  const promisedUnits = request.promised_quantity || 1; 
  const percentage = Math.round((promisedUnits / request.quantity) * 100);

  // 🎯 Hitung Analisis Kesesuaian Match % antara Pendonor & Pasien
  const isMatch = myBloodType === request.blood_type;
  const matchPercentage = isMatch ? 90 : 30;

  const handleTanggap = () => {
    // 1. Validasi diri sendiri
    if (parseInt(request.user_id) === parseInt(currentUserId)) {
      alert("Anda tidak bisa menanggapi permintaan Anda sendiri.");
      return;
    }

    // 2. Validasi Kompatibilitas
    const compatibility = isCompatible(myBloodType, request.blood_type);
    if (!compatibility.isCompatible) {
      alert(`Tidak bisa menanggapi: ${compatibility.reason}`);
      return;
    }

    // 3. Konfirmasi Rhesus (jika beda tapi kompatibel)
    if (compatibility.needsConfirmation) {
      const confirmRhesus = window.confirm("Perhatian: Rhesus berbeda namun kompatibel. Lanjutkan?");
      if (!confirmRhesus) return;
    }

    setIsResponding(true);
    // Panggil API untuk submit respon donor
    api.post("/donor-requests/respond", { request_id: requestId, donor_id: currentUserId })
      .then(() => {
        alert("Tanggapan berhasil direkam!");
        setIsResponding(false);
      })
      .catch((err) => {
        alert("Gagal mengirim tanggapan.");
        setIsResponding(false);
      });
  };

  if (loading) return <div className="text-center p-10">⏳ Memuat...</div>;
  if (!request) return <div className="text-center p-10">❌ Data tidak ditemukan.</div>;

  const compatibility = isCompatible(myBloodType, request.blood_type);
  const isOwner = parseInt(request.user_id) === parseInt(currentUserId);
  const isDisabled = !compatibility.isCompatible || isOwner || request.status !== 'pending';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Navigasi Back */}
      <button 
        onClick={onBack} 
        className="text-sm font-bold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer mb-6 flex items-center gap-1"
      >
        ← Kembali ke Daftar
      </button>

      {/* HEADER UTAMA CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-red-100 text-[#c80040] tracking-wider uppercase">
              Sangat Mendesak
            </span>
            <span className="text-xs text-gray-400">Diposting baru-baru ini</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Dibutuhkan Darah Golongan {request.blood_type}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Pasien membutuhkan {request.quantity} kantong darah untuk prosedur medis segera.
          </p>
        </div>
        
        {/* Badge Golongan Darah Besar */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#c80040] border border-red-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-xl font-black">{request.blood_type}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Gol Darah</span>
        </div>
      </div>

      {/* KONTEN GRID 3 KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* 1. INFORMASI PASIEN */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Informasi Pasien</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">👤</span>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Nama</div>
                <div className="text-sm font-black text-gray-900">{request.patient_name}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">🎂</span>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Status Permintaan</div>
                <div className="text-sm font-black text-gray-900 capitalize">{request.status === 'pending' ? 'Aktif Menunggu' : 'Terpenuhi'}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">🏥</span>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Kontak Darurat</div>
                <div className="text-sm font-black text-[#c80040]">{request.contact_phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AREA PETA LOKASI RUMAH SAKIT */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="bg-slate-800 p-12 text-center text-white font-bold flex flex-col items-center justify-center gap-2 flex-1 min-h-[160px] relative bg-[url('https://api.mapbox.com/')] bg-cover">
            {/* Representasi Visual Map Pin Bawaan Mockup */}
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-ping absolute"></div>
            <span className="text-2xl z-10">📍</span>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="text-sm font-black text-gray-900">🏥 {request.hospital?.name || "Rumah Sakit Mitra"}</div>
            <div className="text-xs text-gray-400 mt-0.5">{request.hospital?.address || "Lokasi Makassar Area"}</div>
          </div>
        </div>

        {/* 3. PANEL AKSI KANAN (TANGGAPI & PROGRESS) */}
        <div className="space-y-4">
          
          {/* Tombol Aksi Tanggap */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2">
            <button 
          onClick={handleTanggap}
          disabled={isDisabled}
          className={`w-full font-bold py-3 rounded-xl text-sm transition-all border-none shadow-sm flex items-center justify-center gap-2 ${
            isDisabled 
              ? "bg-gray-300 cursor-not-allowed text-gray-600" 
              : "bg-[#c80040] hover:bg-[#a80034] text-white cursor-pointer"
          }`}
        >
          {isOwner 
            ? "Permintaan Anda" 
            : !compatibility.isCompatible 
              ? "Tidak Cocok" 
              : "❤️ Tanggapi Permintaan"}
        </button>
            
            <a 
              href={`https://wa.me/${request.contact_phone}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-slate-100 hover:bg-gray-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors text-center block no-underline border-none"
            >
              💬 Hubungi via WhatsApp
            </a>
          </div>

          {/* Bar Progress Respon Terkini */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Respon Terkini</h4>
            <div className="flex justify-between items-end mb-1.5">
              <div className="text-sm font-black text-gray-900">
                {promisedUnits} <span className="text-xs font-normal text-gray-400">dari {request.quantity} unit</span>
              </div>
              <div className="text-xs font-black text-[#c80040]">{percentage}%</div>
            </div>
            
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#c80040] h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Dibutuhkan {request.quantity - promisedUnits} pendonor lagi untuk memenuhi kebutuhan.
            </p>
          </div>

        </div>
      </div>

      {/* BARIS BAWAH: ANALISIS KESESUAIAN */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4">Analisis Kesesuaian</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Cincin Presentase Lingkaran */}
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-gray-100">
            <div className="absolute inset-0 rounded-full border-4 border-t-[#c80040] border-r-[#c80040] rotate-45"></div>
            <span className="text-lg font-black text-gray-900">{matchPercentage}%</span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="text-green-500">✓</span> 
              <span>Kecocokan Golongan Darah: Golongan darah Anda ({myBloodType}) {isMatch ? "sangat cocok" : "kurang cocok"} untuk pasien ini.</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="text-green-500">✓</span> 
              <span>Verifikasi Keamanan Jaringan: Data rumah sakit terdaftar sah di wilayah aglomerasi Mamminasata.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}