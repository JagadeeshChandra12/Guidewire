import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Truck, Utensils, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { saveUser, calculateRisk, savePolicy, getUser, User } from "@/lib/store";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [income, setIncome] = useState("");
  const [persona, setPersona] = useState<User["persona"]>("food");

  useEffect(() => {
    if (getUser()) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weeklyIncome = Number(income);
    if (!name.trim() || !city.trim() || !weeklyIncome || !persona) return;

    saveUser({ 
      name: name.trim(), 
      city: city.trim(), 
      weeklyIncome, 
      persona 
    });

    const risk = calculateRisk(city, persona);
    savePolicy({
      active: false,
      premium: risk.premium,
      coverage: risk.coverage,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      aqi: risk.aqi,
      riskProbability: risk.riskProbability,
      incomeLossForecast: risk.incomeLossForecast,
      trustScore: risk.trustScore,
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0c10] bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent)]">
      <Card className="w-full max-w-md p-8 bg-card/40 border-border glass rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-4 rounded-2xl bg-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="h-10 w-10 text-primary relative z-10" />
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tighter italic uppercase">WORKSURE <span className="text-primary">AI</span></h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80 mb-1">
            Predict. Protect. Prosper.
          </p>
          <p className="text-[11px] text-muted-foreground text-center font-medium leading-relaxed opacity-70 max-w-[280px]">
            WorkSure AI goes beyond insurance by predicting income risk and enabling smarter financial decisions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest opacity-60">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" className="bg-secondary/50 border-border h-12" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[10px] uppercase font-black tracking-widest opacity-60">Base City</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" className="bg-secondary/50 border-border h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income" className="text-[10px] uppercase font-black tracking-widest opacity-60">Weekly Income (₹)</Label>
              <Input id="income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="3500" className="bg-secondary/50 border-border h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest opacity-60">Delivery Segment (Persona)</Label>
            <Select value={persona} onValueChange={(v: any) => setPersona(v)}>
              <SelectTrigger className="bg-secondary/50 border-border h-12">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="food"><div className="flex items-center gap-2"><Utensils className="h-4 w-4" /> Food (Zomato/Swiggy)</div></SelectItem>
                <SelectItem value="ecommerce"><div className="flex items-center gap-2"><Package className="h-4 w-4" /> E-commerce (Amazon)</div></SelectItem>
                <SelectItem value="grocery"><div className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Grocery (Zepto/Blinkit)</div></SelectItem>
                <SelectItem value="logistics"><div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Logistics/Bulk</div></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-2 h-14 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">
            Register & Analyze Risk
          </Button>
        </form>
      </Card>
    </div>
  );
}
