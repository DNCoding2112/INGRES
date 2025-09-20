// File: Analytics.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, BarChart3, Loader2 } from "lucide-react";

// --- Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000'; // Port 8000 for your FastAPI server

const Analytics = () => {
  // --- State Management ---
  const [locations, setLocations] = useState({}); // To store { "State": ["District1", "District2"] }
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("10-years"); // Default to 10 years

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState([]); // To store API results

  // --- Data Fetching ---

  // 1. Fetch all available locations when the component first loads
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_locations`);
        if (!response.ok) throw new Error('Failed to fetch locations from the server.');
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError("Could not connect to the backend. Please ensure the Python server is running.");
        console.error(err);
      }
    };
    fetchLocations();
  }, []); // Empty dependency array means this runs only once on mount

  // 2. Handle the "Generate Forecast" button click
  const handleGeneratePrediction = async () => {
    if (!selectedState || !selectedDistrict) return;

    setIsLoading(true);
    setError(null);
    setPredictionData([]);

    try {
      const response = await fetch(`${API_BASE_URL}/get_predictions?state=${selectedState}&district=${selectedDistrict}`);
      if (!response.ok) throw new Error('Failed to fetch predictions.');
      const data = await response.json();
      
      const yearsToShow = parseInt(selectedTimeframe.split('-')[0]);
      setPredictionData(data.slice(0, yearsToShow));

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Helper Functions ---
  const formatParameterName = (name) => {
    return name.replace(/_/g, ' ').replace(/\(ham\)/g, '(HAM)');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Predictive Analytics & Forecasting</h1>
        <p className="text-muted-foreground">Analyze trends and forecast future groundwater scenarios using AI.</p>
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
          <div className="flex flex-wrap gap-4 items-end">
            {/* State Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">State</label>
              <Select value={selectedState} onValueChange={(value) => { setSelectedState(value); setSelectedDistrict(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(locations).sort().map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* District Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState && locations[selectedState]?.sort().map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Timeframe Dropdown */}
            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">Forecast Period</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-years">Next 5 Years</SelectItem>
                  <SelectItem value="10-years">Next 10 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGeneratePrediction}
              className="bg-water-primary hover:bg-water-secondary"
              disabled={!selectedState || !selectedDistrict || isLoading}
            >
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Forecast'}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>

      {/* Predictions Section */}
      {predictionData.length > 0 && (
        <Card className="shadow-water animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-water-accent" />
              <span>
                Future Predictions for {selectedDistrict}, {selectedState}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {predictionData.map((yearlyData) => (
                <Card key={yearlyData.Year} className="bg-gradient-to-br from-secondary/50 to-secondary/80 border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-center text-lg text-water-primary">{yearlyData.Year}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {Object.entries(yearlyData)
                      .filter(([key]) => key !== 'Year')
                      .map(([parameter, value]) => (
                        <div key={parameter} className="flex items-center justify-between text-sm border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">{formatParameterName(parameter)}:</span>
                          <span className="font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;