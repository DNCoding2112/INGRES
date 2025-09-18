// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Bot, User, Mic, MicOff, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { chatAPI } from "@/lib/api";

// interface Message {
//   id: string;
//   content: string;
//   isUser: boolean;
//   timestamp: Date;
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       content: "Hello! I'm your INGRES AI assistant. I can help you query groundwater data, check assessment results, and provide insights about water resources. Try asking about a specific block or groundwater status!",
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input,
//       isUser: true,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     const currentInput = input;
//     setInput("");
//     setIsLoading(true);

//     try {
//       // Call the RAG API
//       const data = await chatAPI.askQuestion(currentInput);
      
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content: data.answer || "I apologize, but I couldn't process your request at the moment.",
//         isUser: false,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, aiResponse]);
//     } catch (error) {
//       console.error("Error calling RAG API:", error);
      
//       const errorResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content: "I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.",
//         isUser: false,
//         timestamp: new Date(),
//       };
      
//       setMessages(prev => [...prev, errorResponse]);
      
//       toast({
//         title: "Connection Error",
//         description: "Could not connect to the RAG API. Please check if the backend server is running.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVoiceToggle = () => {
//     setIsListening(!isListening);
//     toast({
//       title: isListening ? "Voice recording stopped" : "Voice recording started",
//       description: isListening ? "Processing your voice input..." : "Speak your question now",
//     });
//   };

//   const suggestedQueries = [
//     "What is the groundwater status of Maharashtra?",
//     "Show me critical blocks in Tamil Nadu",
//     "Groundwater trend analysis for the last 5 years",
//     "Safe extraction limits for my area"
//   ];

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
//       {/* Chat Messages */}
//       <Card className="flex-1 mb-4 shadow-water">
//         <CardContent className="p-0">
//           <ScrollArea className="h-[60vh] p-4">
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
//                 >
//                   <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
//                     <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                       message.isUser ? "bg-water-primary" : "bg-water-secondary"
//                     }`}>
//                       {message.isUser ? (
//                         <User className="h-4 w-4 text-primary-foreground" />
//                       ) : (
//                         <Bot className="h-4 w-4 text-primary-foreground" />
//                       )}
//                     </div>
//                     <div className={`rounded-lg px-4 py-2 ${
//                       message.isUser 
//                         ? "bg-water-primary text-primary-foreground" 
//                         : "bg-secondary text-secondary-foreground"
//                     }`}>
//                       <p className="text-sm">{message.content}</p>
//                       <p className="text-xs opacity-75 mt-1">
//                         {message.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       {/* Suggested Queries */}
//       <div className="mb-4">
//         <p className="text-sm text-muted-foreground mb-2">Suggested queries:</p>
//         <div className="flex flex-wrap gap-2">
//           {suggestedQueries.map((query, index) => (
//             <Button
//               key={index}
//               variant="outline"
//               size="sm"
//               onClick={() => setInput(query)}
//               className="text-xs hover:bg-water-secondary hover:text-primary-foreground transition-colors"
//             >
//               {query}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area */}
//       <Card className="shadow-water">
//         <CardContent className="p-4">
//           <div className="flex space-x-2">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask about groundwater data, block status, trends..."
//               onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//               className="flex-1"
//             />
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={handleVoiceToggle}
//               className={`${isListening ? "bg-water-danger text-primary-foreground" : ""}`}
//             >
//               {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
//             </Button>
//             <Button 
//               onClick={handleSendMessage} 
//               disabled={isLoading}
//               className="bg-water-primary hover:bg-water-secondary"
//             >
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ChatInterface;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Send, Bot, User, Mic, MicOff, Loader2, Languages, Briefcase, Wrench, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chatAPI } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState("Professional Assistant");
  const { toast } = useToast();

  // Helper function to get initial message based on language
  const getInitialMessage = (lang: string): Message => {
    if (lang === "Hindi") {
      return {
        id: "1",
        content:
          "नमस्ते! मैं आपका INGRES एआई सहायक हूँ। मैं आपको भूजल डेटा क्वेरी करने, आकलन परिणाम देखने और जल संसाधनों के बारे में जानकारी देने में मदद कर सकता हूँ। किसी विशेष ब्लॉक या भूजल स्थिति के बारे में पूछकर देखिए!",
        isUser: false,
        timestamp: new Date(),
      };
    }
    return {
      id: "1",
      content:
        "Hello! I'm your INGRES AI assistant. I can help you query groundwater data, check assessment results, and provide insights about water resources. Try asking about a specific block or groundwater status!",
      isUser: false,
      timestamp: new Date(),
    };
  };

  // Set initial message whenever language changes
  useEffect(() => {
    setMessages([getInitialMessage(language)]);
  }, [language]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const data = await chatAPI.askQuestion(currentInput);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.answer ||
          (language === "Hindi"
            ? "मुझे खेद है, मैं अभी आपका अनुरोध संसाधित नहीं कर सका।"
            : "I apologize, but I couldn't process your request at the moment."),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling RAG API:", error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          language === "Hindi"
            ? "मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है और फिर से प्रयास करें।"
            : "I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);

      toast({
        title: language === "Hindi" ? "कनेक्शन त्रुटि" : "Connection Error",
        description:
          language === "Hindi"
            ? "RAG API से कनेक्ट नहीं कर पाया। कृपया जांचें कि बैकएंड सर्वर चल रहा है।"
            : "Could not connect to the RAG API. Please check if the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    toast({
      title: isListening
        ? language === "Hindi"
          ? "वॉइस रिकॉर्डिंग बंद हो गई"
          : "Voice recording stopped"
        : language === "Hindi"
        ? "वॉइस रिकॉर्डिंग शुरू हो गई"
        : "Voice recording started",
      description: isListening
        ? language === "Hindi"
          ? "आपकी आवाज़ इनपुट प्रोसेस हो रही है..."
          : "Processing your voice input..."
        : language === "Hindi"
        ? "अब अपना प्रश्न बोलें"
        : "Speak your question now",
    });
  };

  const suggestedQueriesEnglish = [
    "What is the groundwater status of Maharashtra?",
    "Show me critical blocks in Tamil Nadu",
    "Groundwater trend analysis for the last 5 years",
    "Safe extraction limits for my area",
  ];

  const suggestedQueriesHindi = [
    "महाराष्ट्र में भूजल की स्थिति क्या है?",
    "तमिलनाडु में गंभीर ब्लॉक्स दिखाइए",
    "पिछले 5 वर्षों का भूजल रुझान विश्लेषण",
    "मेरे क्षेत्र के सुरक्षित दोहन सीमा बताइए",
  ];

  const suggestedQueries =
    language === "Hindi" ? suggestedQueriesHindi : suggestedQueriesEnglish;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {language}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("English")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Hindi")}>
              हिंदी
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Marathi")}>
              मराठी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Persona Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {persona === "Professional Assistant" && <Briefcase className="h-4 w-4" />}
              {persona === "Field Technician" && <Wrench className="h-4 w-4" />}
              {persona === "Research Analyst" && <FlaskConical className="h-4 w-4" />}
              {persona}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPersona("Professional Assistant")}>
              <Briefcase className="h-4 w-4 mr-2" /> Professional Assistant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPersona("Field Technician")}>
              <Wrench className="h-4 w-4 mr-2" /> Field Technician
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPersona("Research Analyst")}>
              <FlaskConical className="h-4 w-4 mr-2" /> Research Analyst
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 mb-4 shadow-water">
        <CardContent className="p-0">
          <ScrollArea className="h-[40vh] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isUser ? "bg-water-primary" : "bg-water-secondary"
                      }`}
                    >
                      {message.isUser ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isUser
                          ? "bg-water-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Suggested Queries */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Suggested queries:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInput(query)}
              className="text-xs hover:bg-water-secondary hover:text-primary-foreground transition-colors"
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <Card className="shadow-water">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "Hindi"
                  ? "भूजल डेटा, ब्लॉक स्थिति, रुझान आदि के बारे में पूछें..."
                  : "Ask about groundwater data, block status, trends..."
              }
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceToggle}
              className={`${isListening ? "bg-water-danger text-primary-foreground" : ""}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-water-primary hover:bg-water-secondary"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
