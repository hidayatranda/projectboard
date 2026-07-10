import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Label = ({ 
  text, 
  color = "#8b5cf6", 
  onRemove = null,
  variant = "default"
}) => {
  const isLight = variant === "light";
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
        isLight 
          ? "bg-opacity-15 text-opacity-90" 
          : "text-white bg-opacity-90"
      )}
      style={{
        backgroundColor: color,
        color: isLight ? color : "white",
      }}
    >
      <span className="flex-1">{text}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export const LabelGroup = ({ labels = [] }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <Label key={label} text={label} variant="light" />
      ))}
    </div>
  );
};
