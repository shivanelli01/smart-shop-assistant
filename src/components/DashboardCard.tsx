import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconBgColor?: string;
}

export const DashboardCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor = "bg-primary",
}: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                changeType === "positive" && "text-accent",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          </div>
          <div className={cn("rounded-lg p-3", iconBgColor)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
