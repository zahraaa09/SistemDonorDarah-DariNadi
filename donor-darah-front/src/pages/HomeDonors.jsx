import { useState, useEffect } from "react";
import api from "../services/api";
import { isCompatible } from "../utils/bloodTypeCompatibility";

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SendIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const RequestBloodIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const avatarBgs = ["bg-amber-100", "bg-sky-100", "bg-orange-100", "bg-pink-100", "bg-emerald-100"];

export default function HomeDonors({ onNavigate = () => {} }) {
  const [donors, setDonors] = useState([]);
  const [bloodFilter, setBloodFilter] = useState("Semua");
  const [radiusFilter, setRadiusFilter] = useState(25);
  const [visibleCount, setVisibleCount] = useState(5);
  const [requestingId, setRequestingId] = useState(null);

  const currentUserId = localStorage.getItem("user_id");
  const patientBloodType = localStorage.getItem("user_blood_type");

  useEffect(() => {
    api.get("/master/users")
      .then((res) => {
        const enrichedData = res.data
          .filter((u) => u.is_available === true || u.is_available === undefined)
          .map((u, index) => ({
            ...u,
            distance: u.distance || parseFloat((Math.random() * 8 + 0.5).toFixed(1)),
            last_donor_date: u.last_donor_date || ["12 Jan 2026", "05 Feb 2025", "28 Nov 2025", "15 Jan 2026"][index % 4]
          }));
        setDonors(enrichedData);
      })
      .catch((err) => console.error("Gagal memuat daftar relawan:", err));
  }, []);

const handleSendDirectRequest = async (donor) => {
    // 1. Validasi Sesi & Data Dasar
    if (!currentUserId) {
      alert("Sila login terlebih dahulu!");
      return;
    }

    if (parseInt(donor.id) === parseInt(currentUserId)) {
      alert("Anda tidak bisa mengajukan permintaan donor kepada diri sendiri.");
      return;
    }

    if (!patientBloodType) {
      alert("Data golongan darah Anda tidak ditemukan. Silakan perbarui profil Anda.");
      return;
    }

    // 2. Validasi Kompatibilitas
    const compatibilityCheck = isCompatible(donor.blood_type, patientBloodType);
    if (!compatibilityCheck.isCompatible) {
      alert(`Golongan darah tidak cocok!\n\n${compatibilityCheck.reason}`);
      return;
    }

    if (compatibilityCheck.needsConfirmation) {
      const confirmRhesus = window.confirm(`⚠️ Perhatian: Rhesus berbeda tapi masih kompatibel. Lanjutkan?`);
      if (!confirmRhesus) return;
    }

    // 3. LOGIKA OTOMATIS: Buat Request jika belum ada
    let activeRequestId = localStorage.getItem("active_request_id");

    if (!activeRequestId || activeRequestId === "null" || activeRequestId === "") {
      try {
        const confirmAuto = window.confirm("Anda belum memiliki permintaan aktif. Apakah Anda ingin membuat permintaan baru secara otomatis?");
        if (!confirmAuto) return;

        // payload sesuai schema backend: id_hospital, patient_name, blood_type, quantity, contact_phone
        const newReq = await api.post("/donor-requests/create", {
          id_hospital: 0, // Pastikan ini angka 0 murni (bukan string)
          patient_name: String(localStorage.getItem("user_name") || "Pasien"),
          blood_type: String(patientBloodType),
          quantity: 1, // Pastikan ini angka 1 murni (bukan string)
          contact_phone: String("6289512275480"), // Pastikan string sesuai schema
          status: "pending"
        });
        
        activeRequestId = newReq.data.id;
        localStorage.setItem("active_request_id", activeRequestId);
      } catch (err) {
        console.error("Gagal buat request:", err.response?.data);
        alert("Gagal membuat permintaan donor otomatis. Pastikan data profil lengkap.");
        return;
      }
    }

    // 4. Kirim Permintaan ke Donor
    const confirmRequest = window.confirm(`Apakah Anda yakin ingin mengirim permintaan donor kepada ${donor.name}?`);
    if (!confirmRequest) return;

    try {
      setRequestingId(donor.id);
      
      const payload = {
        id_user: parseInt(currentUserId),
        id_donor: parseInt(donor.id),
        id_request: parseInt(activeRequestId),
        blood_type: donor.blood_type
      };

      await api.post(`/donor-requests/direct-request`, payload);
      alert("Permintaan berhasil terkirim!");
    } catch (err) {
      // Jika terjadi error pada direct-request, mungkin request ID sudah tidak valid
      if (err.response?.status === 404) {
        localStorage.removeItem("active_request_id");
        alert("Sesi permintaan lama sudah tidak aktif. Silakan coba klik 'Minta Donor' sekali lagi.");
      } else {
        alert("Gagal: " + (err.response?.data?.detail || "Terjadi kesalahan"));
      }
    } finally {
      setRequestingId(null);
    }
  };

  const filtered = donors.filter((d) => {
    const matchBlood = bloodFilter === "Semua" || d.blood_type === bloodFilter;
    const matchRadius = d.distance <= radiusFilter;
    return matchBlood && matchRadius;
  });

  const displayedDonors = filtered.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans antialiased">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
        <div className="w-full md:w-48">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wide">Tipe Darah</label>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50/50 text-gray-700 font-bold focus:outline-none focus:border-[#c80040] appearance-none cursor-pointer"
          >
            <option value="Semua">Semua</option>
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select>
        </div>

        <div className="w-full md:flex-1">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wide">Radius (KM)</label>
            <span className="text-xs font-bold text-[#c80040] bg-red-50 px-2 py-0.5 rounded-md">{radiusFilter} km</span>
          </div>
          <input
            type="range" min="1" max="50" value={radiusFilter}
            onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c80040]"
          />
        </div>

        <button className="w-full md:w-auto bg-[#c80040] hover:bg-[#a80034] text-white font-black text-xs px-6 py-3 rounded-xl transition-all border-none cursor-pointer tracking-wide">
          Terapkan Filter
        </button>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Daftar Pendonor</h2>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-xs font-medium shadow-sm">
          Tidak ditemukan relawan aktif dalam radius jangkauan golongan darah ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDonors.map((d, index) => (
            <div key={d.id || index} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-[#c80040] flex flex-col justify-between gap-5 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${avatarBgs[index % avatarBgs.length]} flex items-center justify-center text-lg font-bold border border-white shadow-sm flex-shrink-0 overflow-hidden`}>
                  <svg className="w-8 h-8 text-gray-600 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base tracking-tight leading-tight">{d.name || d.username}</h4>
                  <div className="flex items-center gap-1 text-gray-400 text-[11px] font-semibold mt-0.5">
                    <MapPinIcon /> <span>{d.distance} km dari Anda</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-b border-gray-50 py-3 my-1">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Golongan Darah</span>
                  <span className="text-xl font-black text-[#c80040] mt-0.5 block">{d.blood_type || "O+"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block text-right">Terakhir Donor</span>
                  <span className="text-xs font-bold text-gray-700 mt-1 block text-right">{d.last_donor_date}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <a
                  href={`https://wa.me/${(d.phone || "0").replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-2 text-center decoration-none shadow-sm/5"
                >
                  <SendIcon /> <span>Hubungi via Chat</span>
                </a>

                {(() => {
                  const compatibility = isCompatible(d.blood_type, patientBloodType);
                  const isIncompatible = !compatibility.isCompatible;
                  const isSelf = parseInt(d.id) === parseInt(currentUserId);

                  if (isIncompatible) {
                      console.log("DEBUG INCOMPATIBLE:", {
                      donorName: d.name,
                      donorBlood: `"${d.blood_type}"`,
                      patientBlood: `"${patientBloodType}"`,
                      matchResult: compatibility
                    });
                  }
                  return (
                    <button
                      onClick={() => handleSendDirectRequest(d)}
                      disabled={isIncompatible || isSelf || requestingId === d.id}
                      title={compatibility.reason}
                      className={`w-full py-2.5 rounded-xl text-xs font-black text-white transition-all flex items-center justify-center gap-2 border-none shadow-sm ${
                        isIncompatible
                          ? "bg-gray-300 cursor-not-allowed text-gray-600"
                          : "bg-[#c80040] hover:bg-[#a80034] cursor-pointer"
                      } ${requestingId === d.id ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <RequestBloodIcon /> 
                      <span>
                        {requestingId === d.id
                          ? "Mengirim..."
                          : isSelf
                          ? "Akun Anda"
                          : isIncompatible
                          ? "Tidak Cocok"
                          : "Minta Donor"}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}

          <div className="bg-[#c80040] rounded-2xl text-white p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-red-900/10 min-h-[250px] relative overflow-hidden">
            <div className="w-11 h-11 rounded-full border-2 border-white/90 flex items-center justify-center mb-4 select-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            <div className="mb-5 space-y-1.5">
              <h3 className="font-extrabold text-xl tracking-tight leading-tight">Lebih Banyak Pendonor</h3>
              <p className="text-red-100/90 text-xs font-medium max-w-[210px] mx-auto leading-relaxed">
                Masih ada {filtered.length > visibleCount ? filtered.length - visibleCount : "120+"} pendonor terverifikasi di wilayah Anda.
              </p>
            </div>
            <button 
              onClick={() => filtered.length > visibleCount ? setVisibleCount((prev) => prev + 6) : setVisibleCount(5)}
              className="bg-white text-[#c80040] font-extrabold px-8 py-2.5 rounded-full text-xs transition-all border-none cursor-pointer shadow-md tracking-wide z-10"
            >
              {filtered.length > visibleCount ? "Muat Lainnya" : "Reset Tampilan"}
            </button>
            <div className="absolute -bottom-6 -right-6 text-7xl opacity-10 pointer-events-none select-none">❤️</div>
          </div>
        </div>
      )}
    </div>
  );
}