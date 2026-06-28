import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { 
  Home, PlusCircle, Brain, Trophy, Archive, LogOut, User, Menu, Calendar, Settings 
} from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🎨 READ SAVED PROGRESSION THEME DOCK FROM LOCALSTORAGE
  const savedTheme = localStorage.getItem('clutch_theme') || 'amber';

  // 🎛️ CORE THEME UTILITY STYLE RESOLVER FOR SIDEBAR ACTIVE NAVIGATIONS
  let accentColor = "#f59e0b"; // default amber
  let activeBg = "rgba(245, 158, 11, 0.1)";
  let sidebarBg = "#090e1a";
  let borderStyleColor = "#1e293b";
  let textPrimaryColor = "#fff";

  if (savedTheme === 'pink' || savedTheme === 'rose') {
    accentColor = "#ec4899";
    activeBg = "rgba(236, 72, 153, 0.1)";
    sidebarBg = "#0f0913";
    borderStyleColor = "rgba(236, 72, 153, 0.15)";
  } else if (savedTheme === 'blue') {
    accentColor = "#3b82f6";
    activeBg = "rgba(59, 130, 246, 0.1)";
    borderStyleColor = "rgba(59, 130, 246, 0.15)";
  } else if (savedTheme === 'emerald') {
    accentColor = "#10b881";
    activeBg = "rgba(16, 185, 129, 0.1)";
    borderStyleColor = "rgba(16, 185, 129, 0.15)";
  } else if (savedTheme === 'purple') {
    accentColor = "#a855f7";
    activeBg = "rgba(168, 85, 247, 0.1)";
    borderStyleColor = "rgba(168, 85, 247, 0.15)";
  } else if (savedTheme === 'light') {
    accentColor = "#0f172a";
    activeBg = "#e2e8f0";
    sidebarBg = "#ffffff";
    borderStyleColor = "#cbd5e1";
    textPrimaryColor = "#0f172a";
  }

  // UPDATED NAVIGATION LINK MAP ARRAY WITH CALENDAR AND SETTINGS NODES
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "New Mission", path: "/add-task", icon: <PlusCircle size={20} /> },
    { name: "AI Strategy Coach", path: "/ai-coach", icon: <Brain size={20} /> },
    { name: "Strategy Calendar", path: "/calendar", icon: <Calendar size={20} /> },
    { name: "Matrix Settings", path: "/settings", icon: <Settings size={20} /> },
    { name: "History", path: "/history", icon: <Archive size={20} /> }, 
    { name: "View Ranks", path: "/rewards", icon: <Trophy size={20} /> },
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isHovered ? "260px" : "68px",
        background: sidebarBg,
        color: textPrimaryColor,
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease",
        height: "100vh",
        borderRight: `1px solid ${borderStyleColor}`,
        zIndex: 100,
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}
    >
      {/* Upper Brand / Menu Icon Toggle Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "35px", paddingLeft: "6px" }}>
        <Menu size={22} style={{ color: accentColor }} className="animate-pulse" />
        {isHovered && <span style={{ fontWeight: 900, letterSpacing: "2px", color: textPrimaryColor }}>COMMAND PANEL</span>}
      </div>

      {/* User Information Profile segment */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "12px", 
        marginBottom: "25px", 
        borderBottom: `1px solid ${savedTheme === 'light' ? '#e2e8f0' : '#141b2b'}`, 
        paddingBottom: "20px",
        paddingLeft: "2px"
      }}>
        {user?.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", minWidth: "36px", objectCover: "cover" }} />
        ) : (
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: savedTheme === 'light' ? '#e2e8f0' : '#1e293b', display: "flex", alignItems: "center", justifyContent: "center", minWidth: "36px" }}><User size={16} style={{ color: savedTheme === 'light' ? '#64748b' : '#94a3b8' }}/></div>
        )}
        {isHovered && (
          <div style={{ overflow: "hidden" }}>
            <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "bold", textTransform: "capitalize", color: textPrimaryColor }}>{user?.user_metadata?.full_name || "Operator"}</h4>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", textOverflow: "ellipsis", overflow: "hidden" }}>{user?.email}</p>
          </div>
        )}
      </div>

      {/* Primary Context Navigation Stack */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.name}
              onClick={() => navigate(item.path)} 
              className="hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200"
              style={{
                ...btnStyle,
                background: isActive ? activeBg : "transparent",
                color: isActive ? accentColor : (savedTheme === 'light' ? "#475569" : "#94a3b8"),
                fontWeight: isActive ? "800" : "600",
              }}
            >
              <div style={{ color: isActive ? accentColor : "#64748b", minWidth: "24px", display: "flex", alignItems: "center" }}>{item.icon}</div>
              {isHovered && <span style={{ marginLeft: "10px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Exit Sign Out Trigger */}
      <button 
        onClick={handleSignOut} 
        style={{ 
          ...btnStyle, 
          color: "#ef4444", 
          marginTop: "auto",
          background: "transparent"
        }}
        className="hover:bg-red-500/5 transition-colors"
      >
        <div style={{ color: "#ef4444", minWidth: "24px", display: "flex", alignItems: "center" }}><LogOut size={20} /></div>
        {isHovered && <span style={{ marginLeft: "10px", fontSize: "13px", fontWeight: "black", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sign Out</span>}
      </button>
    </div>
  );
}

const btnStyle = {
  border: "none",
  textAlign: "left",
  padding: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  borderRadius: "12px",
  width: "100%",
};