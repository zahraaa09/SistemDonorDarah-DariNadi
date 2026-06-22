import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Mundur 2 folder ke src/services/api

const BloodDropIcon = ({ size = 22, color = "#c80040" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" /></svg>
);
const StarBadgeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="#c80040"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const MailIcon2 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const PhoneIcon2 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.82 19.79 19.79 0 0 1 2 1.18 2 2 0 0 1 4 .01h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const PinIcon2 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function ProfilePage({ onEditProfile }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/master/users/${userId}`)
        .then((res) => {
          setUserProfile(res.data);
          setIsAvailable(res.data.is_available ?? true);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal mengambil data profil user:", err);
          setLoading(false);
        });
    }
  }, [userId]);

  const handleToggleAvailability = async () => {
    const newStatus = !isAvailable;
    setTogglingStatus(true);
    try {
      await api.patch(`/users/${userId}/status?is_available=${newStatus}`);
      setIsAvailable(newStatus);
      setUserProfile((prev) => ({ ...prev, is_available: newStatus }));
    } catch (err) {
      console.error("Gagal mengubah status donor:", err);
      alert("Gagal mengubah status. Coba beberapa saat lagi.");
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center text-gray-400 text-xs font-medium bg-[#FAF8F5]">
        <div className="animate-pulse flex flex-col items-center justify-center space-y-2 mt-12">
          <span>🩸</span>
          <span>Memuat data profil pahlawan kemanusiaan...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex-1 p-8 text-center text-red-500 text-xs font-semibold bg-[#FAF8F5]">
        Profil tidak ditemukan. Sila lakukan login ulang.
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#FAF8F5] font-sans antialiased">
      
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Saya</h1>
        <p className="text-gray-400 text-xs mt-1">Kelola data keanggotaan dan status ketersediaan donor Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-50/40 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                  <circle cx="40" cy="40" r="40" fill="#F3F4F6" />
                  <circle cx="40" cy="30" r="13" fill="#9CA3AF" />
                  <path d="M12 73c0-15 12-23 28-23s28 8 28 23" fill="#9CA3AF" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white border border-gray-100 rounded-full p-1.5 shadow-sm">
                <StarBadgeIcon />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">{userProfile.name}</h2>
              <p className="text-xs font-mono font-bold text-gray-400 mb-3 tracking-wide">ID ANGGOTA: #{userProfile.id}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                  userProfile.is_available 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {userProfile.is_available ? "● SIAP MEMBANTU" : "TIDAK AKTIF"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 min-w-30 text-center shadow-sm/5 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">GOL DARAH</span>
            <div className="flex items-center gap-1.5">
              <BloodDropIcon size={18} />
              <span className="text-2xl font-black text-[#c80040] leading-none tracking-tighter">{userProfile.blood_type}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
<h3 className="font-extrabold text-gray-900 text-sm mb-5 pb-3 border-b border-gray-50 tracking-tight uppercase">
          Informasi Kontak & Wilayah
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="flex items-start gap-4 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-red-50/80 flex items-center justify-center shrink-0 border border-red-100/50">
              <MailIcon2 />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Alamat Email</div>
              <div className="text-gray-800 text-xs font-bold truncate">{userProfile.email}</div>
              <span className="text-emerald-500 text-[10px] font-extrabold block mt-1 bg-emerald-50 px-1.5 py-0.5 rounded w-max">
                ✓ Terverifikasi
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-red-50/80 flex items-center justify-center shrink-0 border border-red-100/50">
              <PhoneIcon2 />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Nomor Telepon</div>
              <div className="text-gray-800 text-xs font-bold tracking-wide">{userProfile.phone || "-"}</div>
              <span className="text-gray-400 text-[10px] font-semibold block mt-1">Terhubung WhatsApp</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-red-50/80 flex items-center justify-center shrink-0 border border-red-100/50">
              <PinIcon2 />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Wilayah Domisili</div>
              <div className="text-gray-800 text-xs font-bold leading-relaxed">
                {userProfile.location?.name || userProfile.location_name || `ID Wilayah: ${userProfile.id_location || "-"}`}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm tracking-tight uppercase">Detail Personal</h3>
            <p className="text-[11px] text-gray-500 mt-1">Tanggal lahir, jenis kelamin, dan berat badan Anda.</p>
          </div>
          <button
            onClick={() => onEditProfile?.()}
            className="self-start rounded-full border border-[#c80040] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#c80040] transition hover:bg-[#c80040] hover:text-white"
          >
            Edit Detail
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Tanggal Lahir</p>
            <p className="text-sm font-bold text-gray-900">{userProfile.dob || "-"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Jenis Kelamin</p>
            <p className="text-sm font-bold text-gray-900">{userProfile.gender || "-"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Berat Badan</p>
            <p className="text-sm font-bold text-gray-900">{userProfile.weight ? `${userProfile.weight} kg` : "-"}</p>
          </div>
        </div>
      </div>

    </div>
  );
}