import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function CreateRequestPage({ onBack }) {
  const [patientName, setPatientName] = useState("");
  const [bloodType, setBloodType] = useState("A+"); 
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [urgency, setUrgency] = useState("Siaga"); 
  const [hospitals, setHospitals] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [selectedDonor, setSelectedDonor] = useState(null);
  useEffect(() => {
    api.get("/master/hospitals")
      .then((res) => {
        setHospitals(res.data);
        if (res.data.length > 0) setHospitalId(res.data[0].id);
      })
      .catch((err) => console.error("Gagal memuat master rumah sakit:", err));
  }, []);

useEffect(() => {
  const raw = localStorage.getItem("selected_donor");
  if (raw) {
    const donor = JSON.parse(raw);
    setSelectedDonor(donor);
    setBloodType(donor.blood_type); 
    localStorage.removeItem("selected_donor");
  }
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hospitalId) {
      alert("Silakan pilih Rumah Sakit terlebih dahulu.");
      return;
    }

    setSubmitting(true);

    const payload = {
      id_user: parseInt(userId),          
      id_hospital: parseInt(hospitalId),  
      patient_name: patientName,
      blood_type: bloodType,
      quantity: parseInt(quantity),
      contact_phone: phone,               
      status: "pending",
      urgency: urgency
    };

    try {
      await api.post("/donor-requests/create", payload);
      alert("Permintaan darah berhasil dibuat dan disiarkan!");
      onBack(); 
    } catch (err) {
      console.error("Detail Validasi Error:", err.response?.data);
      if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
        const msg = err.response.data.detail.map(e => `${e.loc.join('.')} -> ${e.msg}`).join("\n");
        alert(`Gagal Validasi Pydantic:\n${msg}`);
      } else {
        alert(`Gagal mengirim permintaan: ${err.response?.data?.detail || "Error Server (500)"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-2 font-sans">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer mb-2 flex items-center gap-1"
        >
          ← Kembali 
        </button>
        <h2 className="text-2xl font-black text-gray-900">Buat Permintaan Darah</h2>
        <p className="text-xs text-gray-400 mt-1">Isi detail di bawah ini untuk mengajukan permintaan darah melalui jaringan DariNadi.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 border-l-4 border-l-[#c80040] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Nama Pasien</label>
                <input 
                  type="text"
                  placeholder="Nama Lengkap"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 focus:bg-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Golongan Darah</label>
                <select 
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none"
                  required
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Jumlah (Unit)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none"
                    required
                  />
                  <span className="text-xs text-gray-500 font-medium">Kantong</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Nomor Telepon</label>
                <input 
                  type="text"
                  placeholder="+62 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Rumah Sakit</label>
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none"
                required
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Tingkat Urgensi</label>
              <div className="grid grid-cols-3 gap-3">
                {["Siaga", "Darurat", "Kritis"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      urgency === level 
                        ? "bg-blue-100 border-blue-400 text-blue-700 shadow-sm" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#c80040] hover:bg-[#a80034] text-white font-bold py-3 rounded-xl text-sm border-none shadow-md cursor-pointer transition-colors mt-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
              {submitting ? "Memproses Penyiaran..." : "Kirim Permintaan"}
            </button>
          </form>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              Pemeriksaan Stok Real-Time
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">Golongan O-</span>
                  <span className="text-[#c80040]">Sangat Rendah</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#c80040] h-full w-[20%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">Golongan A+</span>
                  <span className="text-gray-700">Stabil</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[75%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-900 border border-blue-100 rounded-xl p-4 text-xs space-y-2 leading-relaxed">
            <h4 className="font-extrabold uppercase tracking-wide text-blue-900">Panduan Pengajuan</h4>
            <div className="flex gap-2">✓ <span>Pastikan persediaan darah di Rumah Sakit sebelum mengajukan permohonan.</span></div>
            <div className="flex gap-2">✓ <span>Pastikan nomor kontak dapat dihubungi.</span></div>
            <div className="flex gap-2">✓ <span>Permintaan Darah berurgensi 'Perlu' akan kadaluwarsa dalam 72 jam.</span></div>
          </div>

          <div className="bg-slate-100 rounded-xl border border-gray-200 p-8 text-center text-xs font-bold text-gray-400 flex flex-col items-center justify-center gap-2">
            Mencari Rumah Sakit terdekat...
          </div>
        </div>

      </div>
    </div>
  );
}