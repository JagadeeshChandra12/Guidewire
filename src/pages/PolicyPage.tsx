import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, CloudRain } from "lucide-react";
import { getUser, getPolicy, savePolicy, calculateRisk, getClaims, saveClaims, checkFraud, type Claim } from "@/lib/store";
import AppNav from "@/components/AppNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PolicyPage() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!getUser()) navigate("/");
  }, [navigate]);

  const user = getUser();
  const policy = getPolicy();
  if (!user || !policy) return null;

  const activatePolicy = () => {
    savePolicy({ ...policy, active: true, activatedAt: new Date().toISOString() });
    toast.success("Policy activated! You're now covered.", { 
      description: "Auto-trigger is now ENABLED for weather disruptions." 
    });
    refresh();
  };

  const simulateRain = async () => {
    if (!policy.active) {
      toast.error("Activate your policy first!");
      return;
    }

    setIsSimulating(true);
    toast.info("Connecting to weather network...");

    await new Promise(r => setTimeout(r, 2000));

    const rain = 60 + Math.floor(Math.random() * 40); 
    const fraud = checkFraud();

    let payout: number;
    if (rain > 80) payout = 500;
    else if (rain > 60) payout = 300;
    else payout = 200;

    const newClaim: Claim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      event: `Heavy rainfall: ${rain}mm`,
      rainfall: rain,
      payout: fraud.passed ? payout : 0,
      status: fraud.passed ? "Approved" : "Pending",
      fraudCheck: fraud.passed ? "Passed" : "Flagged",
      createdAt: new Date().toISOString(),
    };

    const claims = getClaims();
    saveClaims([newClaim, ...claims]);

    // Update risk after event to show dynamic nature
    savePolicy({
      ...policy,
      riskScore: Math.min(98, policy.riskScore + 10),
      riskProbability: Math.min(99, policy.riskProbability + 15),
      riskLevel: "high"
    });

    setIsSimulating(false);
    toast.success(`Claim auto-generated! Payout: ₹${payout}`, {
      description: fraud.passed ? "Fraud check: Passed ✓" : `⚠️ Flagged: ${fraud.reason}`,
    });
    refresh();
  };

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl">
        <h1 className="text-2xl font-heading font-bold">Policy Management</h1>

        <Card className="p-8 bg-card border-border space-y-6 shadow-2xl glass card-shine relative overflow-hidden">
          {policy.active && (
            <div className="absolute top-0 right-0">
               <div className="bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-bl-xl border-l border-b border-primary/30 uppercase tracking-[0.2em] animate-pulse">
                  AI Auto-Trigger Enabled
               </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl transition-all duration-500 ${policy.active ? 'bg-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-secondary'}`}>
              <ShieldCheck className={`h-8 w-8 ${policy.active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tighter italic">
                GigShield <span className="text-primary underline decoration-primary/30 underline-offset-4">Weather</span> Protection
              </h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-70">Parametric Oracle-Driven Smart Policy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-border/50">
            <InfoBlock label="Weekly Premium" value={`₹${policy.premium}`} />
            <InfoBlock label="Max Limit" value={`₹${policy.coverage}`} />
            <InfoBlock label="Dynamic Risk" value={`${policy.riskScore}%`} highlight={policy.riskScore > 70} />
            <InfoBlock 
              label="Coverage Status" 
              value={policy.active ? "SECURED" : "STANDBY"} 
              variant={policy.active ? 'success' : 'muted'} 
            />
          </div>

          {/* PARAMETRIC THRESHOLD INDICATOR */}
          <div className="pt-6 space-y-3">
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parametric Threshold</p>
                   <p className="text-sm font-bold text-foreground">Rain Displacement Index</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-primary italic">Target: &gt; 60mm</p>
                </div>
             </div>
             <div className="h-4 bg-secondary/50 rounded-full border border-border/50 p-1 overflow-hidden relative">
                <div className="absolute left-[60%] top-0 bottom-0 w-0.5 bg-primary/50 z-10" />
                <div 
                   className={`h-full rounded-full transition-all duration-[2000ms] ${policy.riskScore > 60 ? 'bg-primary' : 'bg-primary/20'}`} 
                   style={{ width: `${Math.min(100, (policy.riskScore / 100) * 100)}%` }} 
                />
             </div>
             <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter opacity-50">
                <span>0mm</span>
                <span>Threshold Trigger (60mm)</span>
                <span>100mm Max Disruption</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {!policy.active && (
              <Button onClick={activatePolicy} size="lg" className="gap-2 h-14 px-10 text-lg bg-primary hover:bg-primary/90 font-black shadow-[0_0_30px_rgba(34,197,94,0.3)] rounded-xl">
                <Zap className="h-5 w-5" /> Activate Protection
              </Button>
            )}
            <Button 
              onClick={simulateRain} 
              disabled={isSimulating || !policy.active}
              variant="outline"
              size="lg" 
              className={`gap-2 h-14 px-8 text-lg rounded-xl border-2 ${policy.active ? 'border-primary/20 hover:bg-primary/5' : 'opacity-50 cursor-not-allowed'}`}
            >
              {isSimulating ? (
                 <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Connecting...
                 </div>
              ) : (
                 <><CloudRain className="h-5 w-5" /> Simulate Trigger Event</>
              )}
            </Button>
          </div>

          {policy.active && policy.activatedAt && (
            <div className="pt-4 flex items-center justify-between border-t border-border/30">
               <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                 Contract Hash: <span className="font-mono text-primary/70">{crypto.randomUUID().slice(0, 16)}</span>
               </p>
               <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                 Active since {new Date(policy.activatedAt).toLocaleDateString()}
               </p>
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border border-l-4 border-l-primary">
            <h2 className="font-heading font-semibold mb-4 text-primary uppercase text-xs tracking-widest">Smart Contract Logic</h2>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary shrink-0">1</div>
                <span>AI Risk Score updates every 15 minutes based on local weather stations and AQI sensors.</span>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary shrink-0">2</div>
                <span>When rainfall &gt; 60mm is detected in your GPS cluster, parametric triggers activate.</span>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary shrink-0">3</div>
                <span>AI Fraud Engine validates delivery app logs and GPS movement patterns in real-time.</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6 bg-card border-border flex flex-col justify-center items-center text-center space-y-3">
             <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
             </div>
             <p className="text-sm font-medium">Instant Settlements</p>
             <p className="text-xs text-muted-foreground">Parametric insurance skips the manual filing process. Verification to payout delay is typically less than 2 minutes.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}

function InfoBlock({ label, value, highlight, variant }: { label: string; value: string; highlight?: boolean; variant?: 'success' | 'muted' }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-heading font-black tracking-tight ${highlight ? "text-destructive" : variant === 'success' ? 'text-success' : ''}`}>
        {value}
      </p>
    </div>
  );
}
