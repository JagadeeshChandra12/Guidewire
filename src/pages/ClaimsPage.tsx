import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { History, CloudRain, CheckCircle2, ChevronRight } from "lucide-react";
import { getUser, getClaims } from "@/lib/store";
import AppNav from "@/components/AppNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClaimsPage() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);

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

  const claims = getClaims();

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <AppNav />
      <main className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
                 <History className="h-8 w-8 text-primary" /> Settlement Ledger
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Audit log of all parametric insurance triggers and settlements.</p>
           </div>
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1 h-8 rounded-full font-bold uppercase tracking-widest text-[10px]">
             {claims.length} Records Found
           </Badge>
        </div>

        {claims.length === 0 ? (
          <Card className="p-16 bg-card/40 border-border text-center flex flex-col items-center gap-6 glass rounded-2xl">
            <div className="p-6 rounded-full bg-secondary/30 relative">
               <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
               <History className="h-12 w-12 text-muted-foreground relative z-10" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="font-heading font-black text-xl">Ledger is Empty</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Once a disruption event crosses the parametric threshold, the smart contract will automatically record the settlement here.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2 border-border/50 hover:bg-primary/5">
              <Link to="/dashboard">Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {claims.map((claim) => (
              <Card key={claim.id} className="group p-6 bg-card border-border hover:border-primary/50 transition-all duration-500 glass relative overflow-hidden flex flex-col md:flex-row gap-6">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                        <CloudRain className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono text-muted-foreground tracking-tighter opacity-70 uppercase">Ref: {claim.id}</span>
                           <Badge variant="outline" className="text-[8px] h-4 py-0 border-primary/30 text-primary uppercase font-black bg-primary/5">Blockchain Verified</Badge>
                        </div>
                        <h3 className="font-heading font-black text-lg tracking-tight group-hover:text-primary transition-colors">{claim.event}</h3>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border/30">
                    <ClaimDetail label="Node Cluster" value="Global Weather Network" />
                    <ClaimDetail label="Threshold" value="> 60mm Disruption" />
                    <ClaimDetail label="Detected" value={<span className="font-bold text-foreground">{claim.rainfall}mm</span>} />
                    <ClaimDetail label="Fraud Risk" value={
                       <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`h-3 w-3 ${claim.fraudCheck === 'Passed' ? 'text-success' : 'text-warning'}`} />
                          <span className={`text-[10px] uppercase font-black tracking-widest ${claim.fraudCheck === 'Passed' ? 'text-success' : 'text-warning'}`}>
                             {claim.fraudCheck}
                          </span>
                       </div>
                    } />
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center min-w-[140px] md:border-l border-border/50 md:pl-6 bg-secondary/20 md:bg-transparent -mx-6 -mb-6 p-6 md:p-0 md:m-0">
                  <div className="text-right mb-4">
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Settlement</p>
                    <p className="text-3xl font-heading font-black text-foreground group-hover:text-primary transition-colors italic">₹{claim.payout}</p>
                  </div>
                  {claim.status === "Approved" ? (
                    <Badge className="bg-success text-success-foreground border-transparent px-4 py-1 h-7 rounded-full font-black text-[10px] w-full md:w-auto flex justify-center">
                      SETTLED
                    </Badge>
                  ) : (
                    <Badge className="bg-warning text-warning-foreground border-transparent px-4 py-1 h-7 rounded-full font-black text-[10px] w-full md:w-auto flex justify-center">
                      PENDING
                    </Badge>
                  )}
                  <p className="text-[9px] text-muted-foreground mt-3 uppercase tracking-tighter opacity-50 font-bold">
                    {new Date(claim.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(claim.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ClaimDetail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">{label}</p>
      <div className="text-xs font-bold text-muted-foreground/90">{value}</div>
    </div>
  );
}
