import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "accent";
}

const variantStyles = {
  default: "text-foreground",
  success: "text-primary",
  warning: "text-warning",
  accent: "text-accent",
};

const iconBg = {
  default: "bg-secondary",
  success: "bg-primary/10",
  warning: "bg-warning/10",
  accent: "bg-accent/10",
};

export default function StatCard({ label, value, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <Card className="p-5 bg-card border-border card-shine shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${variantStyles[variant]}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconBg[variant]}`}>
          <Icon className={`h-5 w-5 ${variantStyles[variant]}`} />
        </div>
      </div>
    </Card>
  );
}
