import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, BarChart3 } from "lucide-react";

const Analytics = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [showPredictions, setShowPredictions] = useState(false);

  const historicalData = {
    "2019": { level: 85, extraction: 120, status: "Safe" },
    "2020": { level: 82, extraction: 125, status: "Safe" },
    "2021": { level: 78, extraction: 130, status: "Semi-Critical" },
    "2022": { level: 74, extraction: 135, status: "Semi-Critical" },
    "2023": { level: 70, extraction: 140, status: "Critical" }
  };

  const predictions = {
    "2024": { level: 66, extraction: 145, status: "Critical", confidence: 85 },
    "2025": { level: 62, extraction: 150, status: "Over-Exploited", confidence: 78 },
    "2026": { level: 58, extraction: 155, status: "Over-Exploited", confidence: 72 },
    "2027": { level: 54, extraction: 160, status: "Over-Exploited", confidence: 65 },
    "2028": { level: 50, extraction: 165, status: "Over-Exploited", confidence: 58 }
  };

  const handleGeneratePrediction = () => {
    setShowPredictions(true);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-water-danger" />;
    }
    return <TrendingUp className="h-4 w-4 text-water-safe" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Safe: "bg-water-safe",
      "Semi-Critical": "bg-water-warning",
      Critical: "bg-water-critical",
      "Over-Exploited": "bg-water-danger"
    };
    return colors[status as keyof typeof colors] || "bg-secondary";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Predictive Analytics & Forecasting</h1>
        <p className="text-muted-foreground">Analyze trends and forecast future groundwater scenarios</p>
      </div>

      {/* Controls */}
      <Card className="shadow-water animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-water-primary" />
            <span>Analysis Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region for analysis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra-pune">Pune District, Maharashtra</SelectItem>
                  <SelectItem value="tamil-nadu-chennai">Chennai District, Tamil Nadu</SelectItem>
                  <SelectItem value="karnataka-bangalore">Bangalore District, Karnataka</SelectItem>
                  <SelectItem value="gujarat-ahmedabad">Ahmedabad District, Gujarat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">Forecast Period</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-years">Next 5 Years</SelectItem>
                  <SelectItem value="10-years">Next 10 Years</SelectItem>
                  <SelectItem value="15-years">Next 15 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGeneratePrediction}
              className="bg-water-primary hover:bg-water-secondary"
              disabled={!selectedRegion || !selectedTimeframe}
            >
              Generate Forecast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card className="shadow-water animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-water-secondary" />
            <span>Historical Trends (2019-2023)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(historicalData).map(([year, data]) => (
              <Card key={year} className="bg-secondary">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{year}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Water Level:</span>
                        <span className="flex items-center space-x-1">
                          <span>{data.level}m</span>
                          {year !== "2019" && getTrendIcon(data.level, historicalData[String(parseInt(year) - 1) as keyof typeof historicalData]?.level)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Extraction:</span>
                        <span>{data.extraction}%</span>
                      </div>
                      <Badge className={`${getStatusColor(data.status)} text-white text-xs`}>
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      {showPredictions && (
        <Card className="shadow-water animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-water-accent" />
              <span>Future Predictions (2024-2028)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Prediction Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(predictions).map(([year, data]) => (
                  <Card key={year} className="bg-gradient-to-br from-water-secondary/20 to-water-accent/20 border-2 border-water-accent/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2 text-water-primary">{year}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Water Level:</span>
                            <span className="flex items-center space-x-1">
                              <span>{data.level}m</span>
                              <TrendingDown className="h-3 w-3 text-water-danger" />
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Extraction:</span>
                            <span>{data.extraction}%</span>
                          </div>
                          <Badge className={`${getStatusColor(data.status)} text-white text-xs`}>
                            {data.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Confidence: {data.confidence}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Insights */}
              <div className="bg-gradient-to-r from-water-warning/20 to-water-danger/20 p-6 rounded-lg border border-water-warning/30">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-water-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Key Forecast Insights</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Groundwater levels are predicted to decline by 35% over the next 5 years</li>
                      <li>• The region will likely transition to "Over-Exploited" status by 2025</li>
                      <li>• Immediate intervention required to prevent critical water scarcity</li>
                      <li>• Recommended: Implement emergency conservation measures within 2 years</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Methodology */}
      <Card className="shadow-water">
        <CardHeader>
          <CardTitle>Forecasting Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Data Sources</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• INGRES historical database</li>
                <li>• Rainfall patterns (10+ years)</li>
                <li>• Extraction rates by sector</li>
                <li>• Geological formations</li>
              </ul>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI Models Used</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Time series analysis</li>
                <li>• Machine learning regression</li>
                <li>• Climate correlation models</li>
                <li>• Statistical forecasting</li>
              </ul>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Accuracy Metrics</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 85% accuracy for 2-year forecasts</li>
                <li>• 70% accuracy for 5-year forecasts</li>
                <li>• Confidence intervals provided</li>
                <li>• Regular model validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;