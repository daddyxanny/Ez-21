import { IdCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSlotProps {
  value?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function CardSlot({ value, selected, onClick, className, style }: CardSlotProps) {
  return (
    <div
      className={cn(
        "card-slot rounded-xl w-18 h-28 flex items-center justify-center cursor-pointer transition-all duration-500",
        "relative overflow-hidden",
        "hover:scale-110 hover:rotate-1",
        selected ? "card-selected" : "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-2 border-dashed border-white/30 hover:border-white/50",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {value ? (
        <span className="text-2xl font-bold text-white relative z-10 animate-fade-in">{value}</span>
      ) : (
        <Plus className="text-3xl text-gray-400 hover:text-white transition-colors duration-300" />
      )}
    </div>
  );
}
