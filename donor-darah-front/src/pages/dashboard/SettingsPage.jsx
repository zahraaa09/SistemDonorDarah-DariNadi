import React, { useState, useEffect } from "react";
import api from "../../services/api"; 

const UserEditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c80040" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const BellSettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const PrivacyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Perempuan",
    weight: "",
    address: "",
    email_notify: true,
    wa_notify: false,
    public_profile: true
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/master/users/${userId}`)
        .then((res) => {
          const parseDob = (value) => {
            if (!value) return "";
            const parsed = new Date(value);
            if (!Number.isNaN(parsed.getTime())) {
              return parsed.toISOString().split("T")[0];
            }
            const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
              return `${match[3]}-${match[1]}-${match[2]}`;
            }
            return "";
          };
          const dobValue = parseDob(res.data.dob);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            dob: dobValue,
            gender: res.data.gender || "Laki-laki",
            weight: res.data.weight || "",
            address: res.data.address || "",
            email_notify: res.data.email_notify !== undefined ? res.data.email_notify : true,
            wa_notify: res.data.wa_notify !== undefined ? res.data.wa_notify : false,
            public_profile: res.data.public_profile !== undefined ? res.data.public_profile : true
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal memuat pengaturan profil:", err);
          setLoading(false);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveChanges = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Kolom Nama, Email, dan Nomor Telepon wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };
      if (payload.dob === "") {
        delete payload.dob;
      }
      if (payload.weight === "") {
        delete payload.weight;
      }
      await api.patch(`/master/users/${userId}`, payload);
      
      localStorage.setItem("user_name", formData.name);
      alert("Perubahan pengaturan akun Anda berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan perubahan profil:", err);
      alert("Terjadi kegagalan saat mencoba memperbarui data konfigurasi akun.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center text-gray-400 text-xs font-medium bg-[#FAF8F5]">
        Menyiapkan formulir kendali profil...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#FAF8F5] font-sans antialiased">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-400 text-xs mt-1">Kelola informasi profil, notifikasi, dan preferensi privasi Anda.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm border-l-4 border-l-[#c80040]">
          <h3 className="text-sm font-black text-gray-800 mb-5 flex items-center gap-2">
            <UserEditIcon /> <span>Edit Profil</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
              <input 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email} 
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Nomor Telepon</label>
              <input 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Tanggal Lahir</label>
              <input 
                type="date"
                name="dob"
                value={formData.dob} 
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Jenis Kelamin</label>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-700 pt-1 select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Laki-laki"
                    checked={formData.gender === "Laki-laki"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#c80040] cursor-pointer" 
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Perempuan"
                    checked={formData.gender === "Perempuan"}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#c80040] cursor-pointer" 
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Berat Badan</label>
              <div className="relative flex items-center">
                <input 
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold appearance-none" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400 pointer-events-none select-none">kg</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Alamat Rumah</label>
              <textarea 
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 bg-gray-50/20 focus:border-[#c80040] outline-none transition-colors font-semibold resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-2 flex items-center gap-2">
              <BellSettingsIcon /> <span>Pengaturan Notifikasi</span>
            </h3>
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-800">Email Notifikasi</h4>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">Dapatkan update permintaan darah lewat email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" name="email_notify" checked={formData.email_notify} onChange={handleChange} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c80040]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-50 pt-3">
              <div>
                <h4 className="text-xs font-bold text-gray-800">WhatsApp Notifikasi</h4>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">Terima pesan darurat langsung ke WA</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" name="wa_notify" checked={formData.wa_notify} onChange={handleChange} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c80040]"></div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              <PrivacyIcon /> <span>Privasi</span>
            </h3>
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-800">Profil Publik</h4>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5 max-w-[210px] leading-relaxed">
                  Izinkan pencari donor untuk melihat profil Anda di direktori umum.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" name="public_profile" checked={formData.public_profile} onChange={handleChange} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c80040]"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-6 pt-2">
          <button 
            type="button" 
            className="text-xs font-black text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer select-none transition-colors"
            onClick={() => window.location.reload()}
          >
            Batal
          </button>
          
          <button 
            onClick={handleSaveChanges}
            disabled={submitting}
            className={`bg-[#c80040] hover:bg-[#a80034] text-white font-black px-6 py-2.5 rounded-xl text-xs border-none cursor-pointer transition-all shadow-md shadow-red-900/5 ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </div>
    </div>
  );
}