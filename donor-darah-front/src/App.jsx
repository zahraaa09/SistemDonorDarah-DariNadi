import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DariNadiDashboard from "./pages/dashboard/DariNadiDashboard";
import NotificationPage from "./pages/NotificationPage";
import DetailRequestPage from "./pages/dashboard/DetailRequestPage";
import CreateRequestPage from "./pages/dashboard/CreateRequestPage"; // 1. Import Halaman Baru
import Navbar from "./components/Navbar"; 
import api from "./services/api";

function App() {
  const [page, setPage] = useState("home");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("user_id");
    const hasValidSession = token && savedUserId && savedUserId !== "undefined" && savedUserId !== "null";

    if (hasValidSession) {
      api.get(`/users/${savedUserId}`)
        .then((res) => {
          localStorage.setItem("user_blood_type", res.data.blood_type);
          localStorage.setItem("user_name", res.data.name);
        })
        .catch((err) => console.error("Gagal sinkronisasi data user:", err));
      if (page === "login" || page === "register") {
        setPage("dashboard");
      }
    } else {
      if (["dashboard", "notifications", "detail_request", "create_request"].includes(page)) {
        setPage("login");
      }
    }
  }, [page]); 

  const handleLoginSuccess = () => { setPage("dashboard"); };
  const handleNavigate = (targetPage) => { setPage(targetPage); };
  const handleBackToPrevious = () => {
    const token = localStorage.getItem("token");
    setPage(token ? "dashboard" : "home");
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-slate-50 text-slate-800">
      <main className="min-h-screen">
        
        {page === "home" && <HomePage onNavigate={handleNavigate} />}
        {page === "login" && <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />}
        {page === "register" && <Register onNavigate={handleNavigate} />}
        {page === "dashboard" && <DariNadiDashboard onNavigate={handleNavigate} />}
        {page === "create_request" && (
          <CreateRequestPage onBack={() => setPage("dashboard")} />
        )}
        {page === "notifications" && (
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar activeTab="Home" onNavigate={handleNavigate} />
            <NotificationPage 
              onBack={handleBackToPrevious} 
              onNavigateToDetail={(id) => { setSelectedRequestId(id); setPage("detail_request"); }}
            />
          </div>
        )}
        {page === "detail_request" && (
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar activeTab="Home" onNavigate={handleNavigate} />
            <DetailRequestPage requestId={selectedRequestId} onBack={() => setPage("notifications")} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;