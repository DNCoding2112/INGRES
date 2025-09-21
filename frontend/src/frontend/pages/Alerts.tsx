import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Phone, Plus, Trash2, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  location: string;
  state: string;
  district: string;
  block: string;
  currentStatus: string;
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  alerts: {
    statusChange: boolean;
    newData: boolean;
    criticalLevels: boolean;
    monthlyReport: boolean;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
}

const Alerts = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubscription, setNewSubscription] = useState<Partial<Subscription>>({
    notifications: { email: true, sms: false, whatsapp: false },
    alerts: { statusChange: true, newData: true, criticalLevels: true, monthlyReport: false },
    contactInfo: { email: "", phone: "" }
  });
  const { toast } = useToast();

  const handleAddSubscription = () => {
    if (!newSubscription.location || !newSubscription.contactInfo?.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in location and email address",
        variant: "destructive"
      });
      return;
    }

    // Note: This would typically require backend integration
    

    const subscription: Subscription = {
      id: Date.now().toString(),
      location: newSubscription.location!,
      state: newSubscription.state || "",
      district: newSubscription.district || "",
      block: newSubscription.block || "",
      currentStatus: "Semi-Critical", // Mock status
      notifications: newSubscription.notifications!,
      alerts: newSubscription.alerts!,
      contactInfo: newSubscription.contactInfo!
    };

    setSubscriptions([...subscriptions, subscription]);
    setNewSubscription({
      notifications: { email: true, sms: false, whatsapp: false },
      alerts: { statusChange: true, newData: true, criticalLevels: true, monthlyReport: false },
      contactInfo: { email: "", phone: "" }
    });
    setIsAddingNew(false);

    toast({
      title: "Subscription Added",
      description: "You'll receive notifications about groundwater status changes for this location"
    });
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast({
      title: "Subscription Removed",
      description: "You will no longer receive alerts for this location"
    });
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Proactive Alerts & Subscriptions</h1>
        <p className="text-muted-foreground">Stay informed about groundwater changes in your area</p>
      </div>

     
      {/* Add New Subscription */}
      <Card className="bg-gradient-to-br from-slate-800 to-blue-900 shadow-water animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-water-primary" />
              <span className="text-white">Add Location Subscription</span>
            </div>
            {!isAddingNew && (
              <Button 
                onClick={() => setIsAddingNew(true)}
                className="bg-water-primary hover:bg-water-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Subscribe to Location
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        {isAddingNew && (
          <CardContent className="space-y-6">
            {/* Location Selection */}
            <div>
              <h4 className="font-medium mb-3 text-white">Location Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select 
                  value={newSubscription.state} 
                  onValueChange={(value) => setNewSubscription({...newSubscription, state: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="District"
                  value={newSubscription.district || ""}
                  onChange={(e) => setNewSubscription({...newSubscription, district: e.target.value})}
                />
                
                <Input
                  placeholder="Block/Mandal/Taluk"
                  value={newSubscription.block || ""}
                  onChange={(e) => setNewSubscription({...newSubscription, block: e.target.value, location: e.target.value})}
                />
                
                <Input
                  placeholder="Location Name"
                  value={newSubscription.location || ""}
                  onChange={(e) => setNewSubscription({...newSubscription, location: e.target.value})}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-medium mb-3 text-white">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newSubscription.contactInfo?.email || ""}
                  onChange={(e) => setNewSubscription({
                    ...newSubscription, 
                    contactInfo: {...newSubscription.contactInfo, email: e.target.value}
                  })}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number (+91xxxxxxxxxx)"
                  value={newSubscription.contactInfo?.phone || ""}
                  onChange={(e) => setNewSubscription({
                    ...newSubscription, 
                    contactInfo: {...newSubscription.contactInfo, phone: e.target.value}
                  })}
                />
              </div>
            </div>

            {/* Notification Methods */}
            <div>
              <h4 className="font-medium mb-3 text-white">Notification Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-water-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Email</span>
                      <Switch
                        checked={newSubscription.notifications?.email}
                        onCheckedChange={(checked) => setNewSubscription({
                          ...newSubscription,
                          notifications: {...newSubscription.notifications!, email: checked}
                        })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Instant email notifications</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-water-secondary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">SMS</span>
                      <Switch
                        checked={newSubscription.notifications?.sms}
                        onCheckedChange={(checked) => setNewSubscription({
                          ...newSubscription,
                          notifications: {...newSubscription.notifications!, sms: checked}
                        })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Text message alerts</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-water-accent" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">WhatsApp</span>
                      <Switch
                        checked={newSubscription.notifications?.whatsapp}
                        onCheckedChange={(checked) => setNewSubscription({
                          ...newSubscription,
                          notifications: {...newSubscription.notifications!, whatsapp: checked}
                        })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">WhatsApp messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Types */}
            <div>
              <h4 className="font-medium mb-3 text-white">Alert Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'statusChange', label: 'Status Changes', desc: 'When groundwater status category changes' },
                  { key: 'newData', label: 'New Assessment Data', desc: 'When new INGRES data is published' },
                  { key: 'criticalLevels', label: 'Critical Level Warnings', desc: 'When levels reach critical thresholds' },
                  { key: 'monthlyReport', label: 'Monthly Reports', desc: 'Comprehensive monthly summaries' }
                ].map((alert) => (
                  <div key={alert.key} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                    <Switch
                      checked={newSubscription.alerts?.[alert.key as keyof typeof newSubscription.alerts]}
                      onCheckedChange={(checked) => setNewSubscription({
                        ...newSubscription,
                        alerts: {...newSubscription.alerts!, [alert.key]: checked}
                      })}
                    />
                    <div>
                      <div className="font-medium text-sm">{alert.label}</div>
                      <p className="text-xs text-muted-foreground">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button onClick={handleAddSubscription} className="bg-water-primary hover:bg-water-secondary">
                Subscribe
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Subscriptions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Active Subscriptions</h2>
        
        {subscriptions.length === 0 ? (
          <Card className="shadow-water">
            <CardContent className="p-8 text-center">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active subscriptions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add a location above to start receiving alerts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="shadow-water">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-water-primary" />
                      <span>{subscription.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(subscription.currentStatus)} text-white`}>
                        {subscription.currentStatus}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubscription(subscription.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p>State: {subscription.state || "Not specified"}</p>
                      <p>District: {subscription.district || "Not specified"}</p>
                      <p>Block: {subscription.block || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Notifications via:</p>
                      <div className="flex space-x-2">
                        {subscription.notifications.email && (
                          <Badge variant="secondary"><Mail className="h-3 w-3 mr-1" />Email</Badge>
                        )}
                        {subscription.notifications.sms && (
                          <Badge variant="secondary"><Phone className="h-3 w-3 mr-1" />SMS</Badge>
                        )}
                        {subscription.notifications.whatsapp && (
                          <Badge variant="secondary"><MessageSquare className="h-3 w-3 mr-1" />WhatsApp</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Alert Types:</p>
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(subscription.alerts).filter(([_, enabled]) => enabled).map(([key]) => (
                          key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                        )).join(', ')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;