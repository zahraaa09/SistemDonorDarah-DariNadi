import { useState, useEffect } from "react";
import api from "../services/api";

const BloodDropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#c80040" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
);

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [backendLocations, setBackendLocations] = useState([]);
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    blood_type: "",
    id_location: "", 
    password: ""
  });

  useEffect(() => {
    api.get("/master/locations")
      .then((res) => {
        console.log("Lokasi loaded:", res.data);
        // Ensure res.data is an array
        const locations = Array.isArray(res.data) ? res.data : [];
        setBackendLocations(locations);
        if (locations.length === 0) {
          console.warn("No locations returned from server");
        }
      })
      .catch((err) => {
        console.error("Error loading locations:", err);
        console.error("Error details:", err.response?.data || err.message);
        setErrorMsg("Gagal memuat wilayah lokasi dari server. Pastikan backend berjalan.");
      });
  }, []);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      blood_type: registerData.blood_type,
      id_location: parseInt(registerData.id_location, 10),
      is_available: true,
      password: registerData.password
    };

    try {
      await api.post("/users/register", payload);
      setSuccessMsg("Registrasi sukses! Mengalihkan ke halaman login...");
      setTimeout(() => {
        onNavigate("login");
      }, 2000);
    } catch (err) {
      const backendDetail = err.response?.data?.detail;
      if (Array.isArray(backendDetail)) {
        const parsed = backendDetail.map((e) => `${e.loc[1] || e.loc[0]}: ${e.msg}`).join(", ");
        setErrorMsg(`Validasi gagal: ${parsed}`);
      } else if (typeof backendDetail === "string") {
        setErrorMsg(backendDetail);
      } else {
        setErrorMsg("Gagal melakukan registrasi. Periksa koneksi backend.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased">
      <div className="hidden lg:flex border-r border-gray-100 overflow-hidden items-center justify-center bg-slate-50">
        <img 
          src="src/assets/auth.png" 
          alt="DariNadi Graphic Cover" 
          className="w-full h-full object-cover select-none"
        />
      </div>
      <div className="flex flex-col min-h-screen overflow-y-auto">
        <div className="lg:px-10 pt-8 flex items-center justify-between flex-shrink-0">
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Kembali
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 pb-12 pt-4">
          <div className="w-full max-w-lg">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Daftar Akun Baru</h1>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Mari bergabung dalam misi kemanusiaan untuk menyelamatkan nyawa.</p>
            </div>

            {errorMsg && <div className="mb-4 text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 shadow-sm font-semibold">{errorMsg}</div>}
            {successMsg && <div className="mb-4 text-xs bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 shadow-sm font-semibold">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Lengkap"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="nama@gmail.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700 min-w-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleChange}
                    placeholder="+62 000-0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700 min-w-0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Golongan Darah</label>
                  <div className="relative">
                    <select 
                      name="blood_type" 
                      value={registerData.blood_type} 
                      onChange={handleChange} 
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-[#c80040]/20 text-gray-700 appearance-none pr-10 cursor-pointer" 
                      required
                    >
                      <option value="">Pilih Golongan</option>
                      {bloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Lokasi</label>
                  <div className="relative flex items-center">
                    <select 
                      name="id_location" 
                      value={registerData.id_location} 
                      onChange={handleChange} 
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-[#c80040]/20 text-gray-700 appearance-none pr-10 cursor-pointer" 
                      required
                    >
                      <option value="">Pilih Kota</option>
                      {backendLocations.map((loc) => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Kata Sandi</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    placeholder="Buat kata sandi yang kuat"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700 pr-12"
                    required
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center" 
                    type="button"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#c80040] hover:bg-[#a80034] text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer border-none shadow-md shadow-red-900/10 mt-2">
                Daftar Sekarang
              </button>
            </form>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="space-y-2.5">
              <button onClick={() => alert("Fitur OAuth Google segera hadir")} type="button" className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-200 text-xs transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                Daftar dengan Google
              </button>
              <button onClick={() => alert("Fitur OAuth Apple segera hadir")} type="button" className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-200 text-xs transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/></svg>
                Daftar dengan Apple
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              Sudah punya akun?{" "}
              <button onClick={() => onNavigate("login")} className="text-[#c80040] font-bold hover:underline bg-transparent border-none cursor-pointer">
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}