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
  const [publicTab, setPublicTab] = useState("");
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName && storedName !== "undefined") {
      setUserName(storedName);
    }
  }, []);
    
  const handleSignOut = () => {
    localStorage.clear(); 
    onNavigate("login");  
  };

  const handleNavbarNavigation = (targetTab) => {
    setPublicTab(targetTab);
    onNavigate("home");
    setTimeout(() => {
      const event = new CustomEvent("changePublicTab", { detail: targetTab });
      window.dispatchEvent(event);
    }, 50);
  };

  const handleSidebarTabChange = (tabId) => {
    setIsCreatingRequest(false); 
    setActiveTab(tabId);
    setPublicTab(""); 
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Navbar 
        activeTab={publicTab} 
        setActiveTab={handleNavbarNavigation} 
        onNavigate={onNavigate} 
        onNavigateNotification={() => onNavigate("notifications")} // 🚀 HUBUNGKAN KE SINI
      />

      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar 
          active={activeTab} 
          setActive={handleSidebarTabChange} 
          onLogout={handleSignOut} 
          userName={userName} 
        />

        <main className="flex-1 p-8 overflow-y-auto min-h-0">
          <div className="max-w-4xl mx-auto">
            {activeTab === "profile" && <ProfilePage onEditProfile={() => setActiveTab("settings")} />}
            
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