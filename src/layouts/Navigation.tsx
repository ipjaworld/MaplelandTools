import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, History, Info, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ className, onItemClick }) => {
  const location = useLocation();

  const navigationItems = [
    { path: "/calculator", label: "계산기", icon: Calculator },
    { path: "/hunting-grounds", label: "사냥터", icon: MapPin },
    { path: "/history", label: "히스토리", icon: History },
    { path: "/about", label: "정보", icon: Info },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <nav className={cn("flex space-x-1", className)}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = isCurrentPath(item.path);

        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "justify-start w-full transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105"
            )}
            onClick={onItemClick}
          >
            <Link to={item.path} className="flex items-center space-x-2 w-full">
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
