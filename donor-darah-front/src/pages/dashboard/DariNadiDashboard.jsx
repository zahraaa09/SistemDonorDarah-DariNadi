import { useState, useEffect } from "react";
// Impor komponen navigasi
import Navbar from "../../components/Navbar"; 
import Sidebar from "../../components/Sidebar";

// Impor halaman internal dashboard
import ProfilePage from "./ProfilePage";
import RequestsPage from "./RequestsPage"; 
import ResponsPage from "./ResponsPage";
import HistoryPage from "./HistoryPage";
import SettingsPage from "./SettingsPage";
import CreateRequestPage from "./CreateRequestPage";

export default function DariNadiDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState("Pengguna DariNadi");

  // State bantuan untuk memantau tab publik luar jika diklik dari dalam dashboard
  const [publicTab, setPublicTab] = useState("Home");
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName && storedName !== "undefined") {
      setUserName(storedName);
    }
  }, []);
    
  // 🚀 ACTION TOMBOL SIGN OUT (Membersihkan Sesi & Redirect)
  const handleSignOut = () => {
    localStorage.clear(); // Menghapus token, user_id, dan user_name dari browser
    onNavigate("login");  // Mengarahkan langsung ke halaman login luar
  };

  // 🚀 HANDLER NAVIGASI KHUSUS NAVBAR ATAS
  const handleNavbarNavigation = (targetTab) => {
    setPublicTab(targetTab);
    onNavigate("home");
    
    // Memberikan delay mikro agar state HomePage luar sempat membaca tab yang dituju
    setTimeout(() => {
      const event = new CustomEvent("changePublicTab", { detail: targetTab });
      window.dispatchEvent(event);
    }, 50);
  };

  const handleSidebarTabChange = (tabId) => {
    setIsCreatingRequest(false); // Sembunyikan form testing jika user pindah menu sidebar
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 👑 NAVBAR ATAS: Sekarang mengenali klik tombol luar & pemicu Notifikasi */}
      <Navbar 
        activeTab={publicTab} 
        setActiveTab={handleNavbarNavigation} 
        onNavigate={onNavigate} 
        onNavigateNotification={() => onNavigate("notifications")} // 🚀 HUBUNGKAN KE SINI
      />

      {/* Konten Utama Dashboard */}
      <div className="flex flex-1 w-full">
        {/* SISI KIRI: Sidebar Panel */}
        <Sidebar 
          active={activeTab} 
          setActive={handleSidebarTabChange} 
          onLogout={handleSignOut} 
          userName={userName} 
        />

        {/* SISI KANAN: Area Konten Dinamis Sub-Page Internal */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {activeTab === "profile" && <ProfilePage />}
            
            {activeTab === "requests" && (
              isCreatingRequest ? (
                <CreateRequestPage onBack={() => setIsCreatingRequest(false)} />
              ) : (
                <RequestsPage onCreateTrigger={() => setIsCreatingRequest(true)} />
              )
            )} 
            
            {activeTab === "respons" && <ResponsPage />} 
            {activeTab === "history" && <HistoryPage />}
            {activeTab === "settings" && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}