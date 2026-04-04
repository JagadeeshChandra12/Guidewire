import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User as UserIcon, MapPin, Briefcase, IndianRupee, ShieldCheck, 
  ChevronRight, Calendar, ExternalLink, BadgeCheck 
} from "lucide-react";
import { getUser, getPolicy, getClaims } from "@/lib/store";
import AppNav from "@/components/AppNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const policy = getPolicy();
  const claims = getClaims();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user || !policy) return null;

  const personaLabel = {
    food: "Food Delivery Partner",
    ecommerce: "E-commerce Logistics",
    grocery: "Instant Grocery Partner",
    logistics: "Bulk Logistics Delivery"
  }[user.persona];

  const platformLabel = {
    food: "Zomato / Swiggy",
    ecommerce: "Amazon / Flipkart",
    grocery: "Zepto / Blinkit",
    logistics: "Delhivery / Ecom Express"
  }[user.persona];

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <AppNav />
      <main className="container mx-auto p-4 md:p-6 space-y-8 max-w-4xl pb-24">
        
        {/* PROFILE HEADER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-8 bg-card border-border border-l-4 border-l-primary flex flex-col md:flex-row gap-8 items-center md:items-start glass">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center border-4 border-card/50 shadow-2xl overflow-hidden relative group shrink-0">
               <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <UserIcon className="h-12 w-12 text-primary-foreground relative z-10" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
               <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl font-heading font-black tracking-tight italic uppercase">{user.name} <span className="text-primary italic">AI-Verified</span></h1>
                  <Badge className="bg-success/10 text-success border-success/20 px-3 h-6 rounded-full font-black text-[10px] flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> SECURE NODE
                  </Badge>
               </div>
               <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {user.city}, India
               </p>
               <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground border-border px-3 py-1">
                    Joined {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground border-border px-3 py-1">
                    Parametric ID: #GIG-{user.name.slice(0, 3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                  </Badge>
               </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border flex flex-col justify-center items-center text-center space-y-4 glass relative overflow-hidden">
             <div className="absolute -top-4 -right-4 h-16 w-16 bg-primary/20 blur-3xl rounded-full" />
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Insurance Rating</p>
             <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center animate-spin-slow">
                <span className="text-2xl font-heading font-black text-primary -rotate-[360deg] animate-none">9.2</span>
             </div>
             <p className="text-xs font-bold text-success">Elite Coverage Level</p>
          </Card>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="p-8 bg-card border-border space-y-6 glass">
              <h2 className="text-lg font-heading font-bold flex items-center gap-2 border-b border-border pb-4">
                 <Briefcase className="h-5 w-5 text-primary" /> Employment Profile
              </h2>
              <div className="space-y-6">
                 <DetailItem label="Primary Segment" value={personaLabel} />
                 <DetailItem label="Working Platform" value={platformLabel} />
                 <DetailItem label="Avg. Weekly Earnings" value={`₹${user.weeklyIncome}`} />
                 <DetailItem label="Location Zone" value={`${user.city} Central / Tier-1`} />
              </div>
           </Card>

           <Card className="p-8 bg-card border-border space-y-6 glass">
              <h2 className="text-lg font-heading font-bold flex items-center gap-2 border-b border-border pb-4">
                 <ShieldCheck className="h-5 w-5 text-primary" /> Coverage Summary
              </h2>
              <div className="space-y-6">
                 <DetailItem label="Active Policy" value={policy.active ? "Protected" : "Inactive"} highlight={policy.active} />
                 <DetailItem label="Weekly Premium" value={`₹${policy.premium}/wk`} />
                 <DetailItem label="Total Settlements" value={`₹${claims.reduce((s, c) => s + c.payout, 0)}`} />
                 <DetailItem label="Fraud Trust Index" value="98.5% (Secure)" />
              </div>
           </Card>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
           <Button asChild size="lg" className="flex-1 gap-2 h-14 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/10">
              <Link to="/dashboard">Go to Dashboard <ChevronRight className="h-5 w-5" /></Link>
           </Button>
           <Button asChild variant="outline" size="lg" className="flex-1 gap-2 h-14 text-lg font-black uppercase tracking-widest border-2">
              <Link to="/policy">Manage Policy <ExternalLink className="h-5 w-5" /></Link>
           </Button>
        </div>

      </main>
    </div>
  );
}

function DetailItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center group">
       <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
       <span className={`text-sm font-bold ${highlight ? 'text-success' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
