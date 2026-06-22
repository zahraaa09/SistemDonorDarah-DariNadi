import React, { useState, useEffect } from "react";
import api from "../services/api";

const ProfileIcon = ({ active }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#6b7280"} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const RequestIcon = ({ active }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#6b7280"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
const ResponseIcon = ({ active }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#6b7280"} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
const HistoryIcon = ({ active }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#6b7280"} strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
const SettingsIcon = ({ active }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#6b7280"} strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
const SignOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

function Toggle({ on, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? "bg-[#c80040]" : "bg-gray-300"}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function Sidebar({ active, setActive, onLogout }) {
  const [profile, setProfile] = useState({ name: "Loading...", blood_type: "-", is_available: false });
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      api.get(`/master/users/${userId}`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error("Gagal memuat info sidebar:", err));
    }
  }, [userId]);

  const handleToggleAvailable = async () => {
    try {
      const nextState = !profile.is_available;
      await api.patch(`/users/${userId}/status?is_available=${nextState}`);
      setProfile({ ...profile, is_available: nextState });
    } catch (err) {
      console.error("Gagal memperbarui status ketersediaan:", err);
    }
  };

  const navItems = [
    { id: "profile", icon: ProfileIcon, label: "Profile" },
    { id: "requests", icon: RequestIcon, label: "Requests" },
    { id: "respons", icon: ResponseIcon, label: "Respons" },
    { id: "history", icon: HistoryIcon, label: "History" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col h-[calc(100vh-48px)] sticky top-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 bg-white border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                  <circle cx="40" cy="40" r="40" fill="#d1d5db" /><circle cx="40" cy="30" r="14" fill="#9ca3af" /><path d="M10 75c0-16.569 13.431-26 30-26s30 9.431 30 26" fill="#9ca3af" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{profile.blood_type}</span>
            </div>
            <div className="font-bold text-gray-900 text-base">{profile.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">Pendonor Terverifikasi</div>
          </div>
        </div>

        <div className="p-4 bg-white border-b border-gray-200">
          <div className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Status</div>
          <div className="flex items-center justify-between border-2 border-[#c80040] rounded-lg px-3 py-2.5">
            <span className={`font-extrabold text-sm tracking-wide ${profile.is_available ? "text-emerald-700" : "text-gray-500"}`}>
              {profile.is_available ? "AVAILABLE" : "OFFLINE"}
            </span>
            <Toggle on={profile.is_available} onToggle={handleToggleAvailable} />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                active === item.id ? "bg-[#c80040] text-white" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <item.icon active={active === item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors w-full bg-transparent border-none cursor-pointer">
          <SignOutIcon /> Sign Out
        </button>
      </div>
    </aside>
  );
}