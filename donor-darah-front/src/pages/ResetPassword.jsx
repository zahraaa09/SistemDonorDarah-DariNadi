import { useEffect, useState } from "react";
import api from "../services/api";

export default function ResetPassword({ onNavigate, resetToken }) {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialToken = resetToken || searchParams.get("token");
    if (initialToken) {
      setToken(initialToken);
      setStep("confirm");
    }
  }, [resetToken]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/users/reset-password-request", { email });
      setMessage(res.data.message);
      setStep("confirm");
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal membuat permintaan reset sandi.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/users/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage(res.data.message);
      setError("");
      setStep("done");
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal mengubah kata sandi.");
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
      <div className="flex flex-col min-h-screen overflow-y-auto bg-white">
        <div className="lg:px-10 pt-8 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => onNavigate("login")}
            className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Kembali ke Login
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-start items-center px-8 lg:px-16 pb-12 pt-4">
          <div className="w-full max-w-lg">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reset Kata Sandi</h1>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                Gunakan email terdaftar untuk mendapatkan token reset sandi.
              </p>
            </div>

            {message && (
              <div className="mb-4 text-xs bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 shadow-sm font-semibold">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 shadow-sm font-semibold">
                {error}
              </div>
            )}

            {step === "request" && (
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Terdaftar</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-[#c80040] hover:bg-[#a80034] text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer border-none shadow-md shadow-red-900/10 mt-2">
                  Minta Token Reset
                </button>
              </form>
            )}

            {step === "confirm" && (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Token Reset</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Masukkan Token Reset"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan Kata Sandi Baru"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-[#c80040]/20 transition-all text-gray-700"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-[#c80040] hover:bg-[#a80034] text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer border-none shadow-md shadow-red-900/10 mt-2">
                  Reset Kata Sandi
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Kata sandi Anda telah diubah. Silakan masuk kembali dengan kata sandi baru.
                </p>
                <button
                  onClick={() => onNavigate("login")}
                  className="w-full bg-[#c80040] hover:bg-[#a80034] text-white font-bold py-3.5 rounded-xl transition-all text-sm cursor-pointer border-none shadow-md shadow-red-900/10 mt-2"
                >
                  Kembali ke Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
