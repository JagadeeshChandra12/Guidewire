import { AlertTriangle, Info, Zap, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Policy, getUser } from "@/lib/store";
import { Link } from "react-router-dom";

interface AlertBannerProps {
  riskLevel: Policy["riskLevel"];
  coverage: number;
  active: boolean;
}

export default function AlertBanner({ riskLevel, coverage, active }: AlertBannerProps) {
  const user = getUser();
  const city = user?.city || "your area";

  if (active) {
    return (
      <Alert className="bg-success/5 border-success/20 text-success flex items-center gap-4 py-4 rounded-xl glass shadow-lg shadow-success/5">
        <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <AlertTitle className="font-heading font-black text-sm uppercase tracking-widest">Protection Active</AlertTitle>
          <AlertDescription className="text-xs font-medium opacity-80 mt-1">
            Real-time AI Monitoring enabled for <span className="underline decoration-success/30 underline-offset-4">{city}</span>. Covered up to ₹{coverage}.
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  const isHigh = riskLevel === "high";
  const estimatedLoss = isHigh ? 500 : riskLevel === "medium" ? 300 : 150;

  return (
    <Alert variant={isHigh ? "destructive" : "default"} className={`${isHigh ? 'bg-destructive/5 animate-pulse-slow border-destructive/30' : 'bg-warning/5 border-warning/30 text-warning'} flex items-center gap-4 py-4 rounded-xl glass shadow-lg`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isHigh ? 'bg-destructive/20' : 'bg-warning/20'}`}>
        {isHigh ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <Info className="h-5 w-5 text-warning" />}
      </div>
      <div className="flex-1">
        <AlertTitle className="font-heading font-black text-sm uppercase tracking-widest">
          {isHigh ? `Severe Risk in ${city}` : `Weather Advisory: ${city}`}
        </AlertTitle>
        <AlertDescription className="text-xs font-medium opacity-90 mt-1">
          {isHigh 
            ? `Heavy rain expected. AI predicts ₹${estimatedLoss} income loss. AI recommends activating protection.` 
            : `Moderate rain likely. AI estimated loss: ₹${estimatedLoss}. Recommending policy activation.`}
        </AlertDescription>
      </div>
      <Link to="/policy" className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${isHigh ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground'}`}>
        <Zap className="h-3 w-3" /> Fix Now
      </Link>
    </Alert>
  );
}
