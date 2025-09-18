import { NavLink } from "react-router-dom";
import { MessageSquare, Lightbulb, TrendingUp, Droplets, Map, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navItems = [
    {
      to: "/",
      icon: MessageSquare,
      label: "Chat Assistant",
      description: "Query groundwater data"
    },
    {
      to: "/recommendations",
      icon: Lightbulb,
      label: "Recommendations",
      description: "Prescriptive advice"
    },
    {
      to: "/analytics",
      icon: TrendingUp,
      label: "Predictive Analytics",
      description: "Future forecasting"
    },
    {
      to: "/map",
      icon: Map,
      label: "Map Visualization",
      description: "Geospatial data view"
    },
    {
      to: "/alerts",
      icon: Bell,
      label: "Alerts & Subscriptions", 
      description: "Proactive notifications"
    }
  ];

  return (
    <nav className="bg-blue-950 border-b border-border shadow-water">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Droplets className="h-8 w-8 text-water-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-water-accent rounded-full animate-ripple"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white text-foreground">INGRES AI</h1>
              <p className="text-xs text-muted-foreground">Groundwater Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-water-primary text-primary-foreground shadow-water"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <div className="hidden xl:block">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <select 
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  window.location.href = e.target.value;
                }
              }}
            >
              <option value="">Navigate...</option>
              {navItems.map((item) => (
                <option key={item.to} value={item.to}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;