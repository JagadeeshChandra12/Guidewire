import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, LayoutDashboard, FileText, AlertTriangle, LogOut, User } from "lucide-react";
import { clearAll, getUser } from "@/lib/store";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/policy", label: "Policy", icon: FileText },
  { to: "/claims", label: "Claims", icon: AlertTriangle },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAll();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-heading font-black text-xl italic uppercase tracking-tighter">
          <Shield className="h-5 w-5 text-primary" />
          <span>WorkSure <span className="text-primary">AI</span></span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
