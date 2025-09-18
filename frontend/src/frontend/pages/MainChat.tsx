import { Card, CardContent } from "@/components/ui/card";
import ChatInterface from "../components/ChatInterface";
import { Droplets, Database, TrendingUp, MapPin } from "lucide-react";

const MainChat = () => {
  const features = [
    {
      icon: Database,
      title: "Real-time Data Access",
      description: "Query current and historical groundwater assessments instantly"
    },
    {
      icon: MapPin,
      title: "Location-based Insights", 
      description: "Get specific information for blocks, mandals, and taluks"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Understand groundwater patterns and changes over time"
    },
    {
      icon: Droplets,
      title: "Status Classification",
      description: "Learn about Safe, Semi-Critical, Critical, and Over-Exploited areas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-water-primary via-water-secondary to-water-accent text-primary-foreground py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Droplets className="h-12 w-12 animate-water-flow" />
            <h1 className="text-4xl md:text-5xl font-bold">INGRES AI Assistant</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">
            Intelligent Groundwater Resource Information System
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Ask questions about groundwater data, get instant insights, and access 
            comprehensive assessments from the Central Ground Water Board database.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-cyan-350 shadow-cyan-300 hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6 text-center">
                <feature.icon className="h-8 w-8 text-water-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Interface */}
        {/* <ChatInterface /> */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border-2 border-blue-400/30 shadow-2xl shadow-blue-500/10 overflow-hidden">
           <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 p-4 border-b border-blue-400/20">
             <h2 className="text-xl font-semibold text-white text-center">Chat with INGRES AI</h2>
           </div>
           <div className="p-6">
             <ChatInterface />
           </div>
         </div>
      </div>
    </div>
  );
};

export default MainChat;
