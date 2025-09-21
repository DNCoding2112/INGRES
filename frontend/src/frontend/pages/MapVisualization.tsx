import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Map, Search, Settings, Info, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapVisualization = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [showLayers, setShowLayers] = useState({
    safe: true,
    semiCritical: true,
    critical: true,
    overExploited: true
  });
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockData = {
    safe: [
      { name: "Block A1", lat: 19.0760, lng: 72.8777, status: "Safe" },
      { name: "Block B2", lat: 18.5204, lng: 73.8567, status: "Safe" }
    ],
    semiCritical: [
      { name: "Block C3", lat: 19.2183, lng: 72.9781, status: "Semi-Critical" },
      { name: "Block D4", lat: 18.6298, lng: 73.7997, status: "Semi-Critical" }
    ],
    critical: [
      { name: "Block E5", lat: 19.1136, lng: 72.8697, status: "Critical" },
      { name: "Block F6", lat: 18.4655, lng: 73.8567, status: "Critical" }
    ],
    overExploited: [
      { name: "Block G7", lat: 19.0330, lng: 72.8629, status: "Over-Exploited" },
      { name: "Block H8", lat: 18.5793, lng: 73.8143, status: "Over-Exploited" }
    ]
  };

  const statusColors = {
    Safe: "#22c55e",
    "Semi-Critical": "#f59e0b", 
    Critical: "#ef4444",
    "Over-Exploited": "#dc2626"
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Center of India
        zoom: 5,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        addDataLayers();
        setIsMapLoaded(true);
        toast({
          title: "Map Loaded Successfully",
          description: "Interactive groundwater visualization is now available"
        });
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  };

  const addDataLayers = () => {
    if (!map.current) return;

    // Add markers for each status category
    Object.entries(mockData).forEach(([category, blocks]) => {
      blocks.forEach(block => {
        const marker = new mapboxgl.Marker({
          color: statusColors[block.status as keyof typeof statusColors],
          scale: 0.8
        })
        .setLngLat([block.lng, block.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${block.name}</h3>
            <p class="text-sm">Status: <span style="color: ${statusColors[block.status as keyof typeof statusColors]}">${block.status}</span></p>
          </div>
        `))
        .addTo(map.current!);
      });
    });
  };

  const handleQuery = () => {
    if (!isMapLoaded) {
      toast({
        title: "Map is Ready",
        description: "Your Query is Executed . Kindly refer the MAP"
      });
      return;
    }

    // This would typically query your backend API
    toast({
      title: "Query Executed",
      description: `Searching for: "${queryInput}". This will connect to your INGRES API to fetch real data.`
    });

    // Mock: Center map on Gujarat if querying about Gujarat
    if (queryInput.toLowerCase().includes('gujarat')) {
      map.current?.flyTo({
        center: [71.1924, 22.2587],
        zoom: 7,
        duration: 2000
      });
    }
  };

  const toggleLayer = (layer: keyof typeof showLayers) => {
    setShowLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
    // In a real implementation, this would show/hide map layers
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Geospatial Visualization</h1>
        <p className="text-muted-foreground">Interactive map-based groundwater data exploration</p>
      </div>


      {/* Query Controls */}
      <Card className="shadow-water animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-water-primary" />
            <span>Map Query & Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Show me all over-exploited zones in Gujarat..."
                onKeyPress={(e) => e.key === "Enter" && handleQuery()}
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
<SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
<SelectItem value="assam">Assam</SelectItem>
<SelectItem value="bihar">Bihar</SelectItem>
<SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
<SelectItem value="goa">Goa</SelectItem>
<SelectItem value="gujarat">Gujarat</SelectItem>
<SelectItem value="haryana">Haryana</SelectItem>
<SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
<SelectItem value="jharkhand">Jharkhand</SelectItem>
<SelectItem value="karnataka">Karnataka</SelectItem>
<SelectItem value="kerala">Kerala</SelectItem>
<SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
<SelectItem value="maharashtra">Maharashtra</SelectItem>
<SelectItem value="manipur">Manipur</SelectItem>
<SelectItem value="meghalaya">Meghalaya</SelectItem>
<SelectItem value="mizoram">Mizoram</SelectItem>
<SelectItem value="nagaland">Nagaland</SelectItem>
<SelectItem value="odisha">Odisha</SelectItem>
<SelectItem value="punjab">Punjab</SelectItem>
<SelectItem value="rajasthan">Rajasthan</SelectItem>
<SelectItem value="sikkim">Sikkim</SelectItem>
<SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
<SelectItem value="telangana">Telangana</SelectItem>
<SelectItem value="tripura">Tripura</SelectItem>
<SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
<SelectItem value="uttarakhand">Uttarakhand</SelectItem>
<SelectItem value="west-bengal">West Bengal</SelectItem>

{/* Union Territories */}
<SelectItem value="andaman-nicobar">Andaman and Nicobar Islands</SelectItem>
<SelectItem value="chandigarh">Chandigarh</SelectItem>
<SelectItem value="dadra-nagar-haveli-daman-diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
<SelectItem value="delhi">Delhi</SelectItem>
<SelectItem value="jammu-kashmir">Jammu and Kashmir</SelectItem>
<SelectItem value="ladakh">Ladakh</SelectItem>
<SelectItem value="lakshadweep">Lakshadweep</SelectItem>
<SelectItem value="puducherry">Puducherry</SelectItem>

              </SelectContent>
            </Select>
            <Button onClick={handleQuery} className="bg-water-primary hover:bg-water-secondary">
              <Search className="h-4 w-4 mr-2" />
              Query Map
            </Button>
          </div>

          {/* Layer Controls */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-medium">Show Layers:</span>
            {Object.entries(showLayers).map(([layer, visible]) => {
              const labels = {
                safe: "Safe",
                semiCritical: "Semi-Critical", 
                critical: "Critical",
                overExploited: "Over-Exploited"
              };
              
              return (
                <Button
                  key={layer}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLayer(layer as keyof typeof showLayers)}
                  className={`${visible ? "bg-water-secondary text-primary-foreground" : ""}`}
                >
                  {visible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                  {labels[layer as keyof typeof labels]}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
            <div className="iframe-container">
      <iframe
        src="https://ingres.iith.ac.in/gecdataonline/gis/INDIA;parentLocName=INDIA;locname=INDIA;loctype=COUNTRY;view=ADMIN;locuuid=ffce954d-24e1-494b-ba7e-0931d8ad6085;year=2024-2025;computationType=normal;component=recharge;period=annual;category=safe;mapOnClickParams=false"
        title="GEC Data Online GIS"
        width="1200" height="800"
        allowFullScreen
        // The iframe itself will just fill its container
        className="responsive-iframe"
      >
      </iframe>
    </div>
     
             

      {/* Legend & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-water">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-water-accent" />
              <span>Map Legend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm">{status} Zones</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-water">
          <CardHeader>
            <CardTitle>Sample Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Show all over-exploited zones in Gujarat",
                "Critical blocks near Mumbai",
                "Safe zones in Tamil Nadu for agriculture",
                "Groundwater depletion trends in Rajasthan"
              ].map((query, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQueryInput(query)}
                  className="w-full justify-start text-left h-auto p-2"
                >
                  <div className="text-xs text-muted-foreground">"{query}"</div>
                </Button>
                
                
                
                
              ))}
            </div>
           
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapVisualization;