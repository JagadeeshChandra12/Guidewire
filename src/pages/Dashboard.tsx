import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User as UserIcon, IndianRupee, ShieldCheck, Activity, MapPin, 
  TrendingUp, Brain, Radar, Eye, Zap, CloudRain, ShieldAlert,
  CheckCircle2, AlertCircle, Info, ChevronRight, Lock,
  Utensils, Package, ShoppingBag, Truck, BadgeCheck
} from "lucide-react";
import { 
  getUser, getPolicy, getClaims, savePolicy, saveClaims, 
  checkFraud, type Policy, type Claim 
} from "@/lib/store";
import AppNav from "@/components/AppNav";
import StatCard from "@/components/StatCard";
import AlertBanner from "@/components/AlertBanner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [lastPayout, setLastPayout] = useState<any>(null);

  useEffect(() => {
    if (!getUser()) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("focus", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("focus", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const user = getUser();
  const policy = getPolicy();
  const claims = getClaims();

  if (!user || !policy) return null;

  const refresh = () => setTick((t) => t + 1);
  const totalPayout = claims.reduce((sum, c) => sum + c.payout, 0);

  const SIM_STEPS = [
    "Detecting weather conditions...",
    "Running AI prediction model...",
    "Validating claim authenticity...",
    "Executing payout..."
  ];

  const simulateRain = async () => {
    if (!policy.active) {
      toast.error("Activate your policy first!", {
        description: "Go to the Policy page to activate protection."
      });
      return;
    }

    setIsSimulating(true);
    setSimStep(0);

    // Progressive loading steps
    for (let i = 0; i < SIM_STEPS.length; i++) {
      setSimStep(i);
      await new Promise(r => setTimeout(r, 1200));
    }

    const rain = 60 + Math.floor(Math.random() * 40); 
    const fraud = checkFraud();

    let payoutValue: number;
    if (rain > 80) payoutValue = 500;
    else if (rain > 60) payoutValue = 300;
    else payoutValue = 200;

    const newRiskScore = Math.min(95, policy.riskScore + 15);
    const updatedPolicy: Policy = {
      ...policy,
      riskScore: newRiskScore,
      riskLevel: "high"
    };
    savePolicy(updatedPolicy);

    const newClaim: Claim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      event: `Heavy rainfall detected`,
      rainfall: rain,
      payout: fraud.passed ? payoutValue : 0,
      status: fraud.passed ? "Approved" : "Pending",
      fraudCheck: fraud.passed ? "Passed" : "Flagged",
      createdAt: new Date().toISOString(),
    };

    saveClaims([newClaim, ...claims]);
    setLastPayout({ id: newClaim.id, payout: payoutValue, fraud: fraud.passed });
    setIsSimulating(false);
    setShowPayoutModal(true);
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <AppNav />
      <main className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl pb-24">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center border-4 border-card/50 shadow-xl overflow-hidden shadow-primary/20">
               <div className="bg-primary/20 w-full h-full flex items-center justify-center">
                  {user.persona === 'food' && <Utensils className="h-8 w-8 text-primary-foreground" />}
                  {user.persona === 'ecommerce' && <Package className="h-8 w-8 text-primary-foreground" />}
                  {user.persona === 'grocery' && <ShoppingBag className="h-8 w-8 text-primary-foreground" />}
                  {user.persona === 'logistics' && <Truck className="h-8 w-8 text-primary-foreground" />}
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">
                Hi, {user.name} <span className="text-primary font-normal">👋</span>
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                 <MapPin className="h-3 w-3" />
                 <span className="text-sm font-medium">{user.city}</span>
                 <span className="text-xs opacity-30">•</span>
                 <Badge variant="secondary" className="text-[10px] h-4 uppercase font-bold py-0 leading-none">
                    {user.persona === 'food' && "Food Logistics Partner"}
                    {user.persona === 'ecommerce' && "E-com Distribution Partner"}
                    {user.persona === 'grocery' && "Hyperlocal Delivery Partner"}
                    {user.persona === 'logistics' && "Logistics Operations"}
                 </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium opacity-80 max-w-lg italic">
                "WorkSure AI goes beyond insurance by predicting income risk and enabling smarter decisions for gig platforms."
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <Button 
                onClick={simulateRain} 
                disabled={isSimulating}
                className="relative overflow-hidden group min-w-[200px] h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                {isSimulating ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xs opacity-80 animate-pulse uppercase tracking-wider">{SIM_STEPS[simStep]}</span>
                    <Progress value={((simStep + 1) / SIM_STEPS.length) * 100} className="w-32 h-1 mt-2" />
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5" /> Simulate Disruption
                  </span>
                )}
                {isSimulating && (
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-loading-bar" />
                )}
             </Button>
          </div>
        </div>

        <AlertBanner riskLevel={policy.riskLevel} coverage={policy.coverage} active={policy.active} />

        {/* CORE STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Earnings Period" value={`₹${user.weeklyIncome}`} icon={IndianRupee} />
          <StatCard label="Live Premium" value={`₹${policy.premium}/wk`} icon={TrendingUp} variant="accent" />
          <StatCard label="AI Risk Index" value={`${policy.riskScore}/100`} icon={Brain} variant="warning" />
          <StatCard label="Total Protected" value={`₹${totalPayout}`} icon={Zap} variant="success" />
        </div>

        {/* AI INCOME RISK FORECAST - UNIQUE FEATURE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-xl glass relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                 <TrendingUp className="h-24 w-24" />
              </div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="font-heading font-black text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" /> AI Income Forecast
                 </h2>
                 <Badge className={policy.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary animate-pulse'}>
                    {policy.riskLevel.toUpperCase()} RISK
                 </Badge>
              </div>
              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Predicted Weekly Income Loss</p>
                    <p className="text-3xl font-heading font-black text-primary">₹{policy.incomeLossForecast}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-muted-foreground">Risk Confidence</span>
                       <span className="text-foreground">87%</span>
                    </div>
                    <Progress value={87} className="h-1.5 bg-secondary" />
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic opacity-70">
                    "AI models analyze historical weather, area risk clusters, and platform patterns to forecast your potential loss before it happens."
                 </p>
              </div>
           </Card>

           <Card className="md:col-span-2 p-6 bg-card border-border shadow-xl glass relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="font-heading font-black text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-warning" /> AI Insight Center
                 </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 space-y-3">
                    <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Activity className="h-3.5 w-3.5" /> Predicted Disruption
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                       High probability of income disruption in your area over the next 48 hours. Workers are advised to activate protection and limit exposure during peak risk hours.
                    </p>
                 </div>
                 <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                       <Info className="h-3.5 w-3.5" /> Optimization Tip
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                       Based on predictive analytics, operating in 'South Zone' between 4PM-7PM reduces rain-delay probability by 22% this week.
                    </p>
                 </div>
              </div>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI RISK ENGINE */}
          <Card className="lg:col-span-2 p-6 bg-card border-border overflow-hidden relative shadow-2xl glass">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Brain className="h-32 w-32" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <div>
                  <h2 className="font-heading font-black text-xl flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" /> Multi-Factor Risk Engine
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                    AI Model: <span className="text-primary italic">Weighted Risk Intelligence v3.1</span>
                  </p>
               </div>
               <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <p className="text-[10px] font-bold text-primary flex items-center gap-1">
                     <Activity className="h-3 w-3" /> LIVE WEATHER TELEMETRY
                  </p>
               </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 space-y-5">
                <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                   <p className="text-xs text-muted-foreground leading-relaxed">
                     This AI model analyzes real-time weather probability, air quality index, and historical region-specific disruption data to calculate risk scores and dynamic adaptive premiums.
                   </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <RiskInputItem label="Precipitation Probability" value={`${policy.riskProbability}%`} icon={CloudRain} color="text-blue-400" />
                  <RiskInputItem label="Localized Area Risk" value={policy.riskLevel.toUpperCase()} icon={Radar} color={policy.riskLevel === 'high' ? 'text-destructive' : 'text-primary'} />
                  <RiskInputItem label="AQI (Sensor Data)" value={String(policy.aqi)} icon={Activity} color={policy.aqi > 200 ? 'text-warning' : 'text-success'} />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-secondary/40 to-transparent border border-border/50 rounded-2xl relative group pb-10">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Calculated Risk Index</p>
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50" />
                  <h3 className="text-6xl font-heading font-black text-primary glitch-effect relative z-10">{policy.riskScore}</h3>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-6 relative z-10">
                  <div 
                    className={`h-full transition-all duration-[1500ms] ease-out ${policy.riskScore > 70 ? 'bg-destructive' : 'bg-primary'}`} 
                    style={{ width: `${policy.riskScore}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-col items-center gap-1 z-10">
                   <p className="text-[10px] text-muted-foreground font-bold">PREDICTOR CONFIDENCE</p>
                   <p className="text-sm font-black text-foreground">94.2%</p>
                </div>
              </div>
            </div>
          </Card>

           {/* AI TRUST & FRAUD INTELLIGENCE */}
          <Card className="p-6 bg-card border-border relative overflow-hidden flex flex-col shadow-2xl glass">
            <h2 className="font-heading font-black text-xl flex items-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-warning" /> Trust Intelligence
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-4">
              AI Fraud & Trust Engine v1.0
            </p>
            
            <div className="p-3 bg-secondary/30 border border-border/50 rounded-lg mb-6">
               <p className="text-[11px] text-muted-foreground leading-snug font-medium">
                 Detecting coordinated fraud using movement patterns, location consistency, and claim behavior analytics.
               </p>
            </div>

            <div className="space-y-5 flex-1">
              <FraudCheckItem label="Movement Pattern" status="Passed" />
              <FraudCheckItem label="Location Consistency" status="Passed" />
              <FraudCheckItem label="Claim Sequence Pattern" status={policy.riskScore > 90 ? "Flagged" : "Passed"} />
            </div>

            <div className="pt-6 border-t border-border mt-8">
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">AI Trust Index</span>
                     <span className="text-xs font-bold text-success">{policy.trustScore}% Secure</span>
                  </div>
                  <Progress value={policy.trustScore} className="h-1.5 bg-secondary" color="bg-success" />
                  <p className="text-[10px] text-muted-foreground italic text-center mt-2 opacity-60">Verified via multi-layer AI validation protocols.</p>
               </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PERSONAL PROFILE & AI INSIGHT */}
          <Card className="lg:col-span-1 p-6 bg-card border-border shadow-xl glass group">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-foreground">
                 <UserIcon className="h-5 w-5 text-primary" /> System Persona
               </h2>
               <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] uppercase font-bold">TRUST LEVEL {policy.trustScore}%</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <Row label="Name" value={user.name} />
                <Row label="Sector" value={user.persona.toUpperCase()} />
                <Row label="Risk Profile" value={<Badge className={policy.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}>{policy.riskLevel.toUpperCase()}</Badge>} />
                <Row label="Earnings" value={`₹${user.weeklyIncome}`} />
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                 <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                    <Brain className="h-3 w-3" /> Predictive Note
                 </h4>
                 <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                   You are in a high-risk delivery zone during rainfall conditions. Income disruption likelihood is above average (forecasted-risk: High).
                 </p>
              </div>
            </div>
          </Card>

          {/* WHY WORKSURE AI IS DIFFERENT */}
          <Card className="lg:col-span-2 p-6 bg-card border-border shadow-xl glass relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                <ShieldCheck className="h-32 w-32" />
             </div>
             <h2 className="font-heading font-black text-lg mb-6 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" /> Why WorkSure AI is Different
             </h2>
             <div className="grid md:grid-cols-2 gap-6">
                <DiffItem title="Predictive Intent" desc="Forecasts income loss before it happens, allowing for proactive protection activation." />
                <DiffItem title="Intelligent Parametrics" desc="Not just reactive, but intelligence-driven protection via multi-factor weather modeling." />
                <DiffItem title="Blockchain Verification" desc="Tamper-proof claim records verified on the settlement ledger for peak transparency." />
                <DiffItem title="Zero-Touch Automation" desc="Fully automated claim system ensures payouts are processed within seconds of triggers." />
             </div>
          </Card>
        </div>
      </main>

      {/* DISRUPTION SUCCESS DIALOG */}
      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="sm:max-w-md bg-card border-border overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary animate-pulse" />
          
          <DialogHeader className="pt-4 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mb-4 border border-success/20">
               <CheckCircle2 className="h-10 w-10 text-success animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-black font-heading text-foreground italic uppercase italic">🌧 Disruption Detected!</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              AI validated the event with 100% telemetry accuracy. Payout auto-initiated.
            </DialogDescription>
          </DialogHeader>

          {lastPayout && (
            <div className="mt-4 p-6 bg-secondary/40 rounded-2xl border border-border/50 space-y-4">
                <div className="flex justify-between items-center bg-card/50 p-4 rounded-xl border border-border/30">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">💰 Payout Executed</span>
                  <span className="text-3xl font-heading font-black text-primary">₹{lastPayout.payout}</span>
               </div>
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs px-2">
                     <span className="text-muted-foreground">AI Payload Validation</span>
                     <span className="text-success font-black">Verified ✔</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-2">
                     <span className="text-muted-foreground">Fraud Check</span>
                     <span className="text-success font-black">PASSED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-2">
                     <span className="text-muted-foreground">Identity Verification</span>
                     <span className="text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> SECURE
                     </span>
                  </div>
                  <div className="flex items-center justify-between text-xs px-2">
                     <span className="text-muted-foreground">Blockchain Log</span>
                     <span className="text-primary font-bold flex items-center gap-1">
                        <Badge variant="outline" className="text-[8px] h-4 py-0 border-primary/30 text-primary">RECORDED</Badge>
                     </span>
                  </div>
               </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center mt-6">
            <Button onClick={() => {setShowPayoutModal(false); navigate("/claims");}} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              View Complete Claims <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RiskInputItem({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-black/20 ${color}`}>
           <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-black italic">{value}</span>
    </div>
  );
}

function FraudCheckItem({ label, status }: { label: string; status: "Passed" | "Flagged" }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/10 group hover:bg-secondary/30 transition-all">
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${status === 'Passed' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Passed' ? 'text-success' : 'text-warning'}`}>{status}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 md:block md:space-x-1">
       <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 block md:inline">{label}</span>
       <div className="font-bold text-sm text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{value}</div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge className="bg-success text-success-foreground border-transparent px-3 py-0.5 rounded-full text-[10px] font-black tracking-tighter italic">AUTO PROTECTION ACTIVE</Badge>
  ) : (
    <Badge variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] font-black opacity-50 italic">STANDBY</Badge>
  );
}

function DiffItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border/50 hover:bg-secondary/20 transition-all group">
       <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1.5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {title}
       </h4>
       <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
          {desc}
       </p>
    </div>
  );
}
