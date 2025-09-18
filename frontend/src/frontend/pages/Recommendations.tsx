import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Droplets, Wheat, Shield } from "lucide-react";

const Recommendations = () => {
  const [selectedBlock, setSelectedBlock] = useState("");
  const [blockStatus, setBlockStatus] = useState("");

  const statusColors = {
    Safe: "bg-water-safe",
    "Semi-Critical": "bg-water-warning",
    Critical: "bg-water-critical", 
    "Over-Exploited": "bg-water-danger"
  };

  const recommendations = {
    "Safe": {
      crops: ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize"],
      conservation: [
        "Rainwater harvesting systems",
        "Efficient irrigation methods (drip/sprinkler)",
        "Crop rotation practices",
        "Water-efficient crop varieties"
      ],
      management: [
        "Continue sustainable extraction",
        "Monitor groundwater levels regularly",
        "Promote water conservation awareness"
      ]
    },
    "Semi-Critical": {
      crops: ["Wheat", "Pulses", "Millets", "Cotton", "Oilseeds"],
      conservation: [
        "Mandatory rainwater harvesting",
        "Micro-irrigation systems",
        "Groundwater recharge structures",
        "Drought-resistant crop varieties"
      ],
      management: [
        "Regulate new tube wells",
        "Implement water budgeting",
        "Promote conjunctive water use"
      ]
    },
    "Critical": {
      crops: ["Millets", "Pulses", "Drought-tolerant varieties", "Horticulture"],
      conservation: [
        "Check dams and percolation tanks",
        "Strict water use efficiency measures",
        "Community-based water management",
        "Watershed development"
      ],
      management: [
        "Ban on new groundwater structures",
        "Mandatory water permits",
        "Artificial recharge programs"
      ]
    },
    "Over-Exploited": {
      crops: ["Rainfed crops only", "Millets", "Dry land horticulture"],
      conservation: [
        "Emergency artificial recharge",
        "Complete shift to surface water",
        "Strict groundwater regulation",
        "Water import from surplus areas"
      ],
      management: [
        "Total ban on groundwater extraction",
        "Mandatory aquifer mapping",
        "Emergency water supply measures"
      ]
    }
  };

  const handleSearch = () => {
    // Simulate block search and status determination
    if (selectedBlock) {
      const statuses = ["Safe", "Semi-Critical", "Critical", "Over-Exploited"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setBlockStatus(randomStatus);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Prescriptive Recommendations</h1>
        <p className="text-muted-foreground">Get actionable advice based on groundwater assessment data</p>
      </div>

      {/* Search Section */}
      <Card className="shadow-water animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-water-primary" />
            <span>Find Your Block Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter block/mandal/taluk name..."
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="bg-water-primary hover:bg-water-secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {blockStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Status Card */}
          <Card className="shadow-water">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-water-primary" />
                  <span>Block Status</span>
                </div>
                <Badge className={`${statusColors[blockStatus as keyof typeof statusColors]} text-white`}>
                  {blockStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Block: <span className="font-medium text-foreground">{selectedBlock}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-water-primary" />
                  <span className="text-sm">Groundwater Status: {blockStatus}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Crops */}
          <Card className="shadow-water">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wheat className="h-5 w-5 text-water-safe" />
                <span>Recommended Crops</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations[blockStatus as keyof typeof recommendations]?.crops.map((crop, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {crop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Water Conservation */}
          <Card className="shadow-water">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-water-accent" />
                <span>Conservation Techniques</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations[blockStatus as keyof typeof recommendations]?.conservation.map((technique, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <div className="w-2 h-2 bg-water-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span>{technique}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Management Guidelines */}
      {blockStatus && (
        <Card className="shadow-water animate-fade-in">
          <CardHeader>
            <CardTitle>Management Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations[blockStatus as keyof typeof recommendations]?.management.map((guideline, index) => (
                <div key={index} className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm">{guideline}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Recommendations;