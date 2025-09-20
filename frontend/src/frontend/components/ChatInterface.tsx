// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Send, Bot, User, Mic, MicOff, Loader2, Languages, Briefcase, Wrench, FlaskConical } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { chatAPI } from "@/lib/api";

// interface Message {
//   id: string;
//   content: string;
//   isUser: boolean;
//   timestamp: Date;
// }

// const ChatInterface = () => {
//   const [language, setLanguage] = useState("English");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [persona, setPersona] = useState("Professional Assistant");
//   const { toast } = useToast();
//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   const getInitialMessage = (lang: string): Message => {
//     if (lang === "Hindi") {
//       return {
//         id: "1",
//         content:
//           "<div>नमस्ते! मैं आपका INGRES एआई सहायक हूँ। मैं आपको भूजल डेटा क्वेरी करने, आकलन परिणाम देखने और जल संसाधनों के बारे में जानकारी देने में मदद कर सकता हूँ। किसी विशेष ब्लॉक या भूजल स्थिति के बारे में पूछकर देखिए!</div>",
//         isUser: false,
//         timestamp: new Date(),
//       };
//     } else if (lang === "Marathi") {
//       return {
//         id: "1",
//         content:
//           "<div>नमस्कार! मी तुमचा INGRES AI सहाय्यक आहे. मी तुम्हाला भूजल डेटा शोधण्यात, मूल्यांकन परिणाम तपासण्यात आणि पाण्याच्या संसाधनांबद्दल माहिती देण्यात मदत करू शकतो. एखाद्या विशिष्ट ब्लॉक किंवा भूजल स्थितीबद्दल विचारा!</div>",
//         isUser: false,
//         timestamp: new Date(),
//       };
//     }
//     return {
//       id: "1",
//       content:
//         "<div>Hello! I'm your INGRES AI assistant. I can help you query groundwater data, check assessment results, and provide insights about water resources. Try asking about a specific block or groundwater status!</div>",
//       isUser: false,
//       timestamp: new Date(),
//     };
//   };

//   useEffect(() => {
//     // Add initial message for new language without clearing chat
//     setMessages((prev) => [...prev, getInitialMessage(language)]);
//   }, [language]);

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (scrollAreaRef.current) {
//       const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
//       if (scrollContainer) {
//         scrollContainer.scrollTop = scrollContainer.scrollHeight;
//       }
//     }
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: `<div>${input}</div>`,
//       isUser: true,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = input;
//     setInput("");
//     setIsLoading(true);

//     try {
//       // send query, persona, and language
//       const data = await chatAPI.askQuestion(currentInput, persona, language);

//       const cleanAnswer = data.answer? data.answer.replace(/^```html|```$/g, "").trim(): "";
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content:
//           `<div>${cleanAnswer}</div>` ||
//           (language === "Hindi"
//             ? "<div>मुझे खेद है, मैं अभी आपका अनुरोध संसाधित नहीं कर सका।</div>"
//             : language === "Marathi"
//             ? "<div>मला खेद आहे, मी सध्या तुमची विनंती प्रक्रिया करू शकत नाही.</div>"
//             : "<div>I apologize, but I couldn't process your request at the moment.</div>"),
//         isUser: false,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiResponse]);
//     } catch (error) {
//       console.error("Error calling RAG API:", error);

//       const errorResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content:
//           language === "Hindi"
//             ? "<div>मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है और फिर से प्रयास करें।</div>"
//             : language === "Marathi"
//             ? "<div>मला खेद आहे, मी सध्या भूजल डेटाबेसशी कनेक्ट होऊ शकत नाही. कृपया बॅकएंड सर्व्हर चालू आहे याची खात्री करा आणि पुन्हा प्रयत्न करा.</div>"
//             : "<div>I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.</div>",
//         isUser: false,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, errorResponse]);

//       toast({
//         title: language === "Hindi" ? "कनेक्शन त्रुटि" : language === "Marathi" ? "कनेक्शन त्रुटी" : "Connection Error",
//         description:
//           language === "Hindi"
//             ? "RAG API से कनेक्ट नहीं कर पाया। कृपया जांचें कि बैकएंड सर्वर चल रहा है।"
//             : language === "Marathi"
//             ? "RAG API शी कनेक्ट होऊ शकलो नाही. कृपया बॅकएंड सर्व्हर चालू आहे याची खात्री करा."
//             : "Could not connect to the RAG API. Please check if the backend server is running.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVoiceToggle = () => {
//     setIsListening(!isListening);
//     toast({
//       title: isListening
//         ? language === "Hindi"
//           ? "वॉइस रिकॉर्डिंग बंद हो गई"
//           : language === "Marathi"
//           ? "व्हॉईस रेकॉर्डिंग थांबली"
//           : "Voice recording stopped"
//         : language === "Hindi"
//         ? "वॉइस रिकॉर्डिंग शुरू हो गई"
//         : language === "Marathi"
//         ? "व्हॉईस रेकॉर्डिंग सुरू झाली"
//         : "Voice recording started",
//       description: isListening
//         ? language === "Hindi"
//           ? "आपकी आवाज़ इनपुट प्रोसेस हो रही है..."
//           : language === "Marathi"
//           ? "तुमचे आवाज इनपुट प्रक्रिया होत आहे..."
//           : "Processing your voice input..."
//         : language === "Hindi"
//         ? "अब अपना प्रश्न बोलें"
//         : language === "Marathi"
//         ? "आता तुमचा प्रश्न बोला"
//         : "Speak your question now",
//     });
//   };

//   const suggestedQueriesEnglish = [
//     "What is the groundwater status of Maharashtra?",
//     "Show me critical blocks in Tamil Nadu",
//     "Groundwater trend analysis for the last 5 years",
//     "Safe extraction limits for my area",
//   ];

//   const suggestedQueriesHindi = [
//     "महाराष्ट्र में भूजल की स्थिति क्या है?",
//     "तमिलनाडु में गंभीर ब्लॉक्स दिखाइए",
//     "पिछले 5 वर्षों का भूजल रुझान विश्लेषण",
//     "मेरे क्षेत्र के सुरक्षित दोहन सीमा बताइए",
//   ];

//   const suggestedQueriesMarathi = [
//     "महाराष्ट्रातील भूजलाची स्थिती काय आहे?",
//     "तमिळनाडूमधील गंभीर ब्लॉक्स दाखवा",
//     "गेल्या 5 वर्षांचा भूजल ट्रेंड विश्लेषण",
//     "माझ्या क्षेत्रातील सुरक्षित काढण्याची मर्यादा सांगा",
//   ];

//   const suggestedQueries =
//     language === "Hindi"
//       ? suggestedQueriesHindi
//       : language === "Marathi"
//       ? suggestedQueriesMarathi
//       : suggestedQueriesEnglish;

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="sm" className="flex items-center gap-2">
//               <Languages className="h-4 w-4" />
//               {language}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={() => setLanguage("English")}>
//               English
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setLanguage("Hindi")}>
//               हिंदी
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setLanguage("Marathi")}>
//               मराठी
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="sm" className="flex items-center gap-2">
//               {persona === "Professional Assistant" && <Briefcase className="h-4 w-4" />}
//               {persona === "Field Technician" && <Wrench className="h-4 w-4" />}
//               {persona === "Research Analyst" && <FlaskConical className="h-4 w-4" />}
//               {persona}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={() => setPersona("Professional Assistant")}>
//               <Briefcase className="h-4 w-4 mr-2" /> Professional Assistant
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setPersona("Field Technician")}>
//               <Wrench className="h-4 w-4 mr-2" /> Field Technician
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setPersona("Research Analyst")}>
//               <FlaskConical className="h-4 w-4 mr-2" /> Research Analyst
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <Card className="flex-1 mb-4 shadow-water">
//         <CardContent className="p-0">
//           <ScrollArea className="h-[40vh] p-4" ref={scrollAreaRef}>
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
//                 >
//                   <div
//                     className={`flex items-start space-x-2 max-w-[80%] ${
//                       message.isUser ? "flex-row-reverse space-x-reverse" : ""
//                     }`}
//                   >
//                     <div
//                       className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                         message.isUser ? "bg-water-primary" : "bg-water-secondary"
//                       }`}
//                     >
//                       {message.isUser ? (
//                         <User className="h-4 w-4 text-primary-foreground" />
//                       ) : (
//                         <Bot className="h-4 w-4 text-primary-foreground" />
//                       )}
//                     </div>
//                     <div
//                       className={`rounded-lg px-4 py-2 ${
//                         message.isUser
//                           ? "bg-water-primary text-primary-foreground"
//                           : "bg-secondary text-secondary-foreground"
//                       }`}
//                     >
//                       <div dangerouslySetInnerHTML={{ __html: message.content }} />
//                       <p className="text-xs opacity-75 mt-1">
//                         {message.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {isLoading && (
//                 <div className="flex justify-start animate-fade-in">
//                   <div className="flex items-center space-x-2 max-w-[80%]">
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-water-secondary">
//                       <Bot className="h-4 w-4 text-primary-foreground" />
//                     </div>
//                     <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
//                       <div className="flex items-center space-x-1">
//                         <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
//                         <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
//                         <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
//                       </div>
//                       <p className="text-sm mt-1 animate-pulse">
//                         {language === "Hindi"
//                           ? `${persona} सोच रहा है...`
//                           : language === "Marathi"
//                           ? `${persona} विचार करत आहे...`
//                           : `${persona} is thinking...`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       <div className="mb-4">
//         <p className="text-sm text-muted-foreground mb-2">
//           {language === "Hindi" ? "सुझाए गए प्रश्न:" : language === "Marathi" ? "सुचवलेले प्रश्न:" : "Suggested queries:"}
//         </p>
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

//       <Card className="shadow-water">
//         <CardContent className="p-4">
//           <div className="flex space-x-2">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder={
//                 language === "Hindi"
//                   ? "भूजल डेटा, ब्लॉक स्थिति, रुझान आदि के बारे में पूछें..."
//                   : language === "Marathi"
//                   ? "भूजल डेटा, ब्लॉक स्थिती, ट्रेंड इत्यादींबद्दल विचारा..."
//                   : "Ask about groundwater data, block status, trends..."
//               }
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
//               {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ChatInterface;

import { useState, useEffect, useRef } from "react";
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [persona, setPersona] = useState("Professional Assistant");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Text-to-speech functionality
  const speak = (text: string, lang: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Map language to appropriate voice (simplified, adjust based on available voices)
    utterance.lang = lang === "Hindi" ? "hi-IN" :
                    lang === "Marathi" ? "mr-IN" :
                    lang === "Tamil" ? "ta-IN" :
                    lang === "Telugu" ? "te-IN" :
                    lang === "Kannada" ? "kn-IN" :
                    lang === "Bengali" ? "bn-IN" :
                    lang === "Gujarati" ? "gu-IN" :
                    lang === "Punjabi" ? "pa-IN" : "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };
  };

  const getInitialMessage = (lang: string): Message => {
    const messages: { [key: string]: string } = {
      Hindi: "<div>नमस्ते! मैं आपका INGRES एआई सहायक हूँ। मैं आपको भूजल डेटा क्वेरी करने, आकलन परिणाम देखने और जल संसाधनों के बारे में जानकारी देने में मदद कर सकता हूँ। किसी विशेष ब्लॉक या भूजल स्थिति के बारे में पूछकर देखिए!</div>",
      Marathi: "<div>नमस्कार! मी तुमचा INGRES AI सहाय्यक आहे. मी तुम्हाला भूजल डेटा शोधण्यात, मूल्यांकन परिणाम तपासण्यात आणि पाण्याच्या संसाधनांबद्दल माहिती देण्यात मदत करू शकतो. एखाद्या विशिष्ट ब्लॉक किंवा भूजल स्थितीबद्दल विचारा!</div>",
      Tamil: "<div>வணக்கம்! நான் உங்கள் INGRES AI உதவியாளர். நிலத்தடி நீர் தரவு, மதிப்பீட்டு முடிவுகளைப் பார்க்க மற்றும் நீர் வளங்கள் பற்றிய தகவல்களை வழங்க உதவ முடியும். ஒரு குறிப்பிட்ட பிளாக் அல்லது நிலத்தடி நீர் நிலைமை பற்றி கேளுங்கள்!</div>",
      Telugu: "<div>హాయ్! నేను మీ INGRES AI సహాయకుడిని. నీటి వనరుల గురించి సమాచారం అందించడం, మూల్యాంకన ఫలితాలను తనిఖీ చేయడం మరియు భూగర్భ జల డేటాను క్వెరీ చేయడంలో నీవు సహాయం చేయగలను. ఒక నిర్దిష్ట బ్లాక్ లేదా భూగర్భ జల స్థితి గురించి అడగండి!</div>",
      Kannada: "<div>ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ INGRES AI ಸಹಾಯಕ. ಭೂಗರ್ಭ ಜಲ ಡೇಟಾವನ್ನು ಕ್ವೆರಿ ಮಾಡಲು, ಮೌಲ್ಯಮಾಪನ ಫಲಿತಾಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ನೀರಿನ ಸಂಪನ್ಮೂಲಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು. ಒಂದು ನಿರ್ದಿಷ್ಟ ಬ್ಲಾಕ್ ಅಥವಾ ಭೂಗರ್ಭ ಜಲ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಕೇಳಿ!</div>",
      Bengali: "<div>নমস্কার! আমি আপনার INGRES AI সহকারী। আমি আপনাকে ভূগর্ভস্থ জলের তথ্য অনুসন্ধান করতে, মূল্যায়ন ফলাফল পরীক্ষা করতে এবং জল সম্পদ সম্পর্কে তথ্য সরবরাহ করতে সহায়তা করতে পারি। একটি নির্দিষ্ট ব্লক বা ভূগর্ভস্থ জলের অবস্থা সম্পর্কে জিজ্ঞাসা করুন!</div>",
      Gujarati: "<div>નમસ્કાર! હું તમારો INGRES AI સહાયક છું. હું તમને ભૂગર્ભજળ ડેટા ક્વેરી કરવામાં, મૂલ્યાંકન પરિણામો તપાસવામાં અને પાણીના સંસાધનો વિશે માહિતી આપવામાં મદદ કરી શકું છું. કોઈ ચોક્કસ બ્લોક અથવા ભૂગર્ભજળની સ્થિતિ વિશે પૂછો!</div>",
      Punjabi: "<div>ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ INGRES AI ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਭੂ-ਜਲ ਡੇਟਾ ਦੀ ਜਾਂਚ ਕਰਨ, ਮੁਲਾਂਕਣ ਨਤੀਜੇ ਵੇਖਣ ਅਤੇ ਪਾਣੀ ਦੇ ਸਰੋਤਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਸੇ ਖਾਸ ਬਲਾਕ ਜਾਂ ਭੂ-ਜਲ ਸਥਿਤੀ ਬਾਰੇ ਪੁੱਛੋ!</div>",
      English: "<div>Hello! I'm your INGRES AI assistant. I can help you query groundwater data, check assessment results, and provide insights about water resources. Try asking about a specific block or groundwater status!</div>",
    };

    return {
      id: "1",
      content: messages[lang] || messages.English,
      isUser: false,
      timestamp: new Date(),
    };
  };

  useEffect(() => {
    setMessages((prev) => [...prev, getInitialMessage(language)]);
  }, [language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `<div>${input}</div>`,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const data = await chatAPI.askQuestion(currentInput, persona, language);
      const cleanAnswer = data.answer ? data.answer.replace(/^```html|```$/g, "").trim() : "";
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          `<div>${cleanAnswer}</div>` ||
          (language === "Hindi"
            ? "<div>मुझे खेद है, मैं अभी आपका अनुरोध संसाधित नहीं कर सका।</div>"
            : language === "Marathi"
            ? "<div>मला खेद आहे, मी सध्या तुमची विनंती प्रक्रिया करू शकत नाही.</div>"
            : language === "Tamil"
            ? "<div>மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயலாக்க முடியவில்லை.</div>"
            : language === "Telugu"
            ? "<div>క్షమించండి, నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను.</div>"
            : language === "Kannada"
            ? "<div>ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.</div>"
            : language === "Bengali"
            ? "<div>দুঃখিত, আমি এই মুহূর্তে আপনার অনুরোধ প্রক্রিয়া করতে পারিনি।</div>"
            : language === "Gujarati"
            ? "<div>માફ કરશો, હું હમણાં તમારી વિનંતી પર પ્રક્રિયા કરી શક્યો નથી.</div>"
            : language === "Punjabi"
            ? "<div>ਮੁਆਫੀ ਮੰਗਦਾ ਹਾਂ, ਮੈਂ ਇਸ ਸਮੇਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਨਹੀਂ ਕਰ ਸਕਿਆ।</div>"
            : "<div>I apologize, but I couldn't process your request at the moment.</div>"),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Speak the AI response if text-to-speech is enabled
      if (isSpeaking) {
        const textToSpeak = cleanAnswer || (
          language === "Hindi" ? "मुझे खेद है, मैं अभी आपका अनुरोध संसाधित नहीं कर सका।" :
          language === "Marathi" ? "मला खेद आहे, मी सध्या तुमची विनंती प्रक्रिया करू शकत नाही." :
          language === "Tamil" ? "மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயலாக்க முடியவில்லை." :
          language === "Telugu" ? "క్షమించండి, నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను." :
          language === "Kannada" ? "ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." :
          language === "Bengali" ? "দুঃখিত, আমি এই মুহূর্তে আপনার অনুরোধ প্রক্রিয়া করতে পারিনি।" :
          language === "Gujarati" ? "માફ કરશો, હું હમણાં તમારી વિનંતી પર પ્રક્રિયા કરી શક્યો નથી." :
          language === "Punjabi" ? "ਮੁਆਫੀ ਮੰਗਦਾ ਹਾਂ, ਮੈਂ ਇਸ ਸਮੇਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਨਹੀਂ ਕਰ ਸਕਿਆ।" :
          "I apologize, but I couldn't process your request at the moment."
        );
        speak(textToSpeak, language);
      }
    } catch (error) {
      console.error("Error calling RAG API:", error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          language === "Hindi"
            ? "<div>मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है और फिर से प्रयास करें।</div>"
            : language === "Marathi"
            ? "<div>मला खेद आहे, मी सध्या भूजल डेटाबेसशी कनेक्ट होऊ शकत नाही. कृपया बॅकएंड सर्व्हर चालू आहे याची खात्री करा आणि पुन्हा प्रयत्न करा.</div>"
            : language === "Tamil"
            ? "<div>மன்னிக்கவும், நான் இப்போது நிலத்தடி நீர் தரவுத்தளத்துடன் இணைக்க முடியவில்லை. பின்புல சர்வர் இயங்குகிறதா என்பதை உறுதி செய்து மீண்டும் முயற்சிக்கவும்.</div>"
            : language === "Telugu"
            ? "<div>క్షమించండి, నేను ప్రస్తుతం భూగర్భ జల డేటాబేస్‌తో కనెక్ట్ కాలేకపోతున్నాను. బ్యాకెండ్ సర్వర్ రన్ అవుతోందని నిర్ధారించుకోండి మరియు మళ్లీ ప్రయత్నించండి.</div>"
            : language === "Kannada"
            ? "<div>ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ಭೂಗರ್ಭ ಜಲ ಡೇಟಾಬೇಸ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಂಡು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</div>"
            : language === "Bengali"
            ? "<div>দুঃখিত, আমি এই মুহূর্তে ভূগর্ভস্থ জলের ডাটাবেসের সাথে সংযোগ করতে পারছি না। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে এবং আবার চেষ্টা করুন।</div>"
            : language === "Gujarati"
            ? "<div>માફ કરશો, હું હવે ભૂગર્ભજળ ડેટાબેઝ સાથે જોડાઈ શકતો નથી. કૃપા કરીને ખાતરી કરો કે બેકએન્ડ સર્વર ચાલુ છે અને ફરીથી પ્રયાસ કરો.</div>"
            : language === "Punjabi"
            ? "<div>ਮੁਆਫੀ ਮੰਗਦਾ ਹਾਂ, ਮੈਂ ਇਸ ਸਮੇਂ ਭੂ-ਜਲ ਡੇਟਾਬੇਸ ਨਾਲ ਜੁੜ ਨਹੀਂ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਬੈਕਐਂਡ ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ ਅਤੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</div>"
            : "<div>I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.</div>",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);

      toast({
        title: language === "Hindi" ? "कनेक्शन त्रुटि" : 
               language === "Marathi" ? "कनेक्शन त्रुटी" : 
               language === "Tamil" ? "இணைப்பு பிழை" : 
               language === "Telugu" ? "కనెక్షన్ ఎర్రర్" : 
               language === "Kannada" ? "ಸಂಪರ್ಕ ದೋಷ" : 
               language === "Bengali" ? "সংযোগ ত্রুটি" : 
               language === "Gujarati" ? "કનેક્શન ભૂલ" : 
               language === "Punjabi" ? "ਕਨੈਕਸ਼ਨ ਗਲਤੀ" : 
               "Connection Error",
        description:
          language === "Hindi"
            ? "RAG API से कनेक्ट नहीं कर पाया। कृपया जांचें कि बैकएंड सर्वर चल रहा है।"
            : language === "Marathi"
            ? "RAG API शी कनेक्ट होऊ शकलो नाही. कृपया बॅकएंड सर्व्हर चालू आहे याची खात्री करा."
            : language === "Tamil"
            ? "RAG API உடன் இணைக்க முடியவில்லை. பின்புல சர்வர் இயங்குகிறதா என்பதை சரிபார்க்கவும்."
            : language === "Telugu"
            ? "RAG APIతో కనెక్ట్ చేయలేకపోయాను. బ్యాకెండ్ సర్వర్ రన్ అవుతోందని నిర్ధారించుకోండి."
            : language === "Kannada"
            ? "RAG API ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ."
            : language === "Bengali"
            ? "RAG API এর সাথে সংযোগ করতে পারিনি। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে।"
            : language === "Gujarati"
            ? "RAG API સાથે જોડાઈ શક્યો નથી. કૃપા કરીને ખાતરી કરો કે બેકએન્ડ સર્વર ચાલુ છે."
            : language === "Punjabi"
            ? "RAG API ਨਾਲ ਜੁੜ ਨਹੀਂ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਬੈਕਐਂਡ ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ।"
            : "Could not connect to the RAG API. Please check if the backend server is running.",
        variant: "destructive",
      });

      // Speak error message if text-to-speech is enabled
      if (isSpeaking) {
        const errorText = language === "Hindi"
          ? "मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है और फिर से प्रयास करें।"
          : language === "Marathi"
          ? "मला खेद आहे, मी सध्या भूजल डेटाबेसशी कनेक्ट होऊ शकत नाही. कृपया बॅकएंड सर्व्हर चालू आहे याची खात्री करा आणि पुन्हा प्रयत्न करा."
          : language === "Tamil"
          ? "மன்னிக்கவும், நான் இப்போது நிலத்தடி நீர் தரவுத்தளத்துடன் இணைக்க முடியவில்லை. பின்புல சர்வர் இயங்குகிறதா என்பதை உறுதி செய்து மீண்டும் முயற்சிக்கவும்."
          : language === "Telugu"
          ? "క్షమించండి, నేను ప్రస్తుతం భూగర్భ జల డేటాబేస్‌తో కనెక్ట్ కాలేకపోతున్నాను. బ్యాకెండ్ సర్వర్ రన్ అవుతోందని నిర్ధారించుకోండి మరియు మళ్లీ ప్రయత్నించండి."
          : language === "Kannada"
          ? "ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ಭೂಗರ್ಭ ಜಲ ಡೇಟಾಬೇಸ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಂಡು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
          : language === "Bengali"
          ? "দুঃখিত, আমি এই মুহূর্তে ভূগর্ভস্থ জলের ডাটাবেসের সাথে সংযোগ করতে পারছি না। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে এবং আবার চেষ্টা করুন।"
          : language === "Gujarati"
          ? "માફ કરશો, હું હવે ભૂગર્ભજળ ડેટાબેઝ સાથે જોડાઈ શકતો નથી. કૃપા કરીને ખાતરી કરો કે બેકએન્ડ સર્વર ચાલુ છે અને ફરીથી પ્રયાસ કરો."
          : language === "Punjabi"
          ? "ਮੁਆਫੀ ਮੰਗਦਾ ਹਾਂ, ਮੈਂ ਇਸ ਸਮੇਂ ਭੂ-ਜਲ ਡੇਟਾਬੇਸ ਨਾਲ ਜੁੜ ਨਹੀਂ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਬੈਕਐਂਡ ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ ਅਤੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
          : "I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.";
        speak(errorText, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: language === "Hindi" ? "वॉइस रिकॉर्डिंग बंद हो गई" :
               language === "Marathi" ? "व्हॉईस रेकॉर्डिंग थांबली" :
               language === "Tamil" ? "குரல் பதிவு நிறுத்தப்பட்டது" :
               language === "Telugu" ? "వాయిస్ రికార్డింగ్ ఆపివేయబడింది" :
               language === "Kannada" ? "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ" :
               language === "Bengali" ? "ভয়েস রেকর্ডিং বন্ধ হয়েছে" :
               language === "Gujarati" ? "વૉઇસ રેકોર્ડિંગ બંધ થઈ ગયું" :
               language === "Punjabi" ? "ਵੌਇਸ ਰਿਕਾਰਡਿੰਗ ਬੰਦ ਹੋ ਗਈ" :
               "Voice recording stopped",
        description: language === "Hindi" ? "आपकी आवाज़ इनपुट प्रोसेस हो रही है..." :
                     language === "Marathi" ? "तुमचे आवाज इनपुट प्रक्रिया होत आहे..." :
                     language === "Tamil" ? "உங்கள் குரல் உள்ளீடு செயலாக்கப்படுகிறது..." :
                     language === "Telugu" ? "మీ వాయిస్ ఇన్‌పుట్ ప్రాసెస్ చేయబడుతోంది..." :
                     language === "Kannada" ? "ನಿಮ್ಮ ಧ್ವನಿ ಒಳಹರಿವನ್ನು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ..." :
                     language === "Bengali" ? "আপনার ভয়েস ইনপুট প্রক্রিয়া করা হচ্ছে..." :
                     language === "Gujarati" ? "તમારો વૉઇસ ઇનપુટ પ્રોસેસ થઈ રહ્યો છે..." :
                     language === "Punjabi" ? "ਤੁਹਾਡੀ ਵੌਇਸ ਇਨਪੁਟ ਪ੍ਰੋਸੈਸ ਹੋ ਰਹੀ ਹੈ..." :
                     "Processing your voice input...",
      });
    } else {
      setIsListening(true);
      toast({
        title: language === "Hindi" ? "वॉइस रिकॉर्डिंग शुरू हो गई" :
               language === "Marathi" ? "व्हॉईस रेकॉर्डिंग सुरू झाली" :
               language === "Tamil" ? "குரல் பதிவு தொடங்கியது" :
               language === "Telugu" ? "వాయిస్ రికార్డింగ్ ప్రారంభమైంది" :
               language === "Kannada" ? "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭವಾಯಿತು" :
               language === "Bengali" ? "ভয়েস রেকর্ডিং শুরু হয়েছে" :
               language === "Gujarati" ? "વૉઇસ રેકોર્ડિંગ શરૂ થયું" :
               language === "Punjabi" ? "ਵੌਇਸ ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਹੋ ਗਈ" :
               "Voice recording started",
        description: language === "Hindi" ? "अब अपना प्रश्न बोलें" :
                     language === "Marathi" ? "आता तुमचा प्रश्न बोला" :
                     language === "Tamil" ? "இப்போது உங்கள் கேள்வியைப் பேசுங்கள்" :
                     language === "Telugu" ? "ఇప్పుడు మీ ప్రశ్నను మాట్లాడండి" :
                     language === "Kannada" ? "ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ" :
                     language === "Bengali" ? "এখন আপনার প্রশ্ন বলুন" :
                     language === "Gujarati" ? "હવે તમારો પ્રશ્ન બોલો" :
                     language === "Punjabi" ? "ਹੁਣ ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ" :
                     "Speak your question now",
      });
    }
  };

  const handleTextToSpeechToggle = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      toast({
        title: language === "Hindi" ? "टेक्स्ट-टू-स्पीच बंद हो गया" :
               language === "Marathi" ? "टेक्स्ट-टू-स्पीच बंद झाले" :
               language === "Tamil" ? "உரை-பேச்சு நிறுத்தப்பட்டது" :
               language === "Telugu" ? "టెక్స్ట్-టు-స్పీచ్ ఆపివేయబడింది" :
               language === "Kannada" ? "ಪಠ್ಯ-ಭಾಷಣ ನಿಲ್ಲಿಸಲಾಗಿದೆ" :
               language === "Bengali" ? "টেক্সট-টু-স্পীচ বন্ধ হয়েছে" :
               language === "Gujarati" ? "ટેક્સ્ટ-ટૂ-સ્પીચ બંધ થયું" :
               language === "Punjabi" ? "ਟੈਕਸਟ-ਟੂ-ਸਪੀਚ ਬੰਦ ਹੋ ਗਿਆ" :
               "Text-to-speech stopped",
        description: language === "Hindi" ? "एआई प्रतिक्रियाएँ अब पढ़ी नहीं जाएंगी।" :
                     language === "Marathi" ? "AI प्रतिसाद आता वाचले जाणार नाहीत." :
                     language === "Tamil" ? "AI பதில்கள் இப்போது படிக்கப்படாது." :
                     language === "Telugu" ? "AI స్పందనలు ఇప్పుడు చదవబడవు." :
                     language === "Kannada" ? "AI ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಈಗ ಓದಲಾಗುವುದಿಲ್ಲ." :
                     language === "Bengali" ? "AI প্রতিক্রিয়াগুলি এখন পড়া হবে না।" :
                     language === "Gujarati" ? "AI પ્રતિસાદો હવે વાંચવામાં આવશે નહીં." :
                     language === "Punjabi" ? "AI ਜਵਾਬ ਹੁਣ ਪੜ੍ਹੇ ਨਹੀਂ ਜਾਣਗੇ।" :
                     "AI responses will no longer be read aloud.",
      });
    } else {
      toast({
        title: language === "Hindi" ? "टेक्स्ट-टू-स्पीच शुरू हो गया" :
               language === "Marathi" ? "टेक्स्ट-टू-स्पीच सुरू झाले" :
               language === "Tamil" ? "உரை-பேச்சு தொடங்கியது" :
               language === "Telugu" ? "టెక్స్ట్-టు-స్పీచ్ ప్రారంభమైంది" :
               language === "Kannada" ? "ಪಠ್ಯ-ಭಾಷಣ ಪ್ರಾರಂಭವಾಯಿತು" :
               language === "Bengali" ? "টেক্সট-টু-স্পীচ শুরু হয়েছে" :
               language === "Gujarati" ? "ટેક્સ્ટ-ટૂ-સ્પીચ શરૂ થયું" :
               language === "Punjabi" ? "ਟੈਕਸਟ-ਟੂ-ਸਪੀਚ ਸ਼ੁਰੂ ਹੋ ਗਿਆ" :
               "Text-to-speech started",
        description: language === "Hindi" ? "एआई प्रतिक्रियाएँ अब ज़ोर से पढ़ी जाएंगी।" :
                     language === "Marathi" ? "AI प्रतिसाद आता मोठ्याने वाचले जाणार आहेत." :
                     language === "Tamil" ? "AI பதில்கள் இப்போது உரத்து படிக்கப்படும்." :
                     language === "Telugu" ? "AI స్పందనలు ఇప్పుడు బిగ్గరగా చదవబడతాయి." :
                     language === "Kannada" ? "AI ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಈಗ ಜೋರಾಗಿ ಓದಲಾಗುತ್ತದೆ." :
                     language === "Bengali" ? "AI প্রতিক্রিয়াগুলি এখন জোরে পড়া হবে।" :
                     language === "Gujarati" ? "AI પ્રતિસાદો હવે મોટેથી વાંચવામાં આવશે." :
                     language === "Punjabi" ? "AI ਜਵਾਬ ਹੁਣ ਉੱਚੀ ਪੜ੍ਹੇ ਜਾਣਗੇ।" :
                     "AI responses will now be read aloud.",
      });
    }
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

  const suggestedQueriesMarathi = [
    "महाराष्ट्रातील भूजलाची स्थिती काय आहे?",
    "तमिळनाडूमधील गंभीर ब्लॉक्स दाखवा",
    "गेल्या 5 वर्षांचा भूजल ट्रेंड विश्लेषण",
    "माझ्या क्षेत्रातील सुरक्षित काढण्याची मर्यादा सांगा",
  ];

  const suggestedQueriesTamil = [
    "மகாராஷ்டிராவில் நிலத்தடி நீரின் நிலை என்ன?",
    "தமிழ்நாட்டில் முக்கியமான பிளாக்குகளைக் காட்டு",
    "கடந்த 5 ஆண்டுகளின் நிலத்தடி நீர் போக்கு பகுப்பாய்வு",
    "எனது பகுதிக்கு பாதுகாப்பான பிரித்தெடுப்பு வரம்புகள்",
  ];

  const suggestedQueriesTelugu = [
    "మహారాష్ట్రలో భూగర్భ జల స్థితి ఏమిటి?",
    "తమిళనాడులో కీలకమైన బ్లాక్‌లను చూపించు",
    "గత 5 సంవత్సరాల భూగర్భ జల ధోరణి విశ్లేషణ",
    "నా ప్రాంతానికి సురక్షితమైన వెలికితీత పరిమితులు",
  ];

  const suggestedQueriesKannada = [
    "ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ಭೂಗರ್ಭ ಜಲದ ಸ್ಥಿತಿ ಏನು?",
    "ತಮಿಳುನಾಡಿನಲ್ಲಿ ನಿರ್ಣಾಯಕ ಬ್ಲಾಕ್‌ಗಳನ್ನು ತೋರಿಸಿ",
    "ಕಳೆದ 5 ವರ್ಷಗಳ ಭೂಗರ್ಭ ಜಲ ಪ್ರವೃತ್ತಿ ವಿಶ್ಲೇಷಣೆ",
    "ನನ್ನ ಪ್ರದೇಶಕ್ಕೆ ಸುರಕ್ಷಿತ ತೆಗೆಯುವಿಕೆಯ ಮಿತಿಗಳು",
  ];

  const suggestedQueriesBengali = [
    "মহারাষ্ট্রে ভূগর্ভস্থ জলের অবস্থা কী?",
    "তামিলনাড়ুতে গুরুত্বপূর্ণ ব্লকগুলি দেখান",
    "গত 5 বছরের ভূগর্ভস্থ জলের প্রবণতা বিশ্লেষণ",
    "আমার এলাকার জন্য নিরাপদ নিষ্কাশন সীমা",
  ];

  const suggestedQueriesGujarati = [
    "મહારાષ્ટ્રમાં ભૂગર્ભજળની સ્થિતિ શું છે?",
    "તમિલનાડુમાં ગંભીર બ્લોક્સ બતાવો",
    "છેલ્લા 5 વર્ષનું ભૂગર્ભજળ વલણ વિશ્લેષણ",
    "મારા વિસ્તાર માટે સલામત નિષ્કર્ષણ મર્યાદા",
  ];

  const suggestedQueriesPunjabi = [
    "ਮਹਾਰਾਸ਼ਟਰ ਵਿੱਚ ਭੂ-ਜਲ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?",
    "ਤਮਿਲਨਾਡੂ ਵਿੱਚ ਨਾਜ਼ੁਕ ਬਲਾਕ ਦਿਖਾਓ",
    "ਪਿਛਲੇ 5 ਸਾਲਾਂ ਦਾ ਭੂ-ਜਲ ਰੁਝਾਨ ਵਿਸ਼ਲੇਸ਼ਣ",
    "ਮੇਰੇ ਖੇਤਰ ਲਈ ਸੁਰੱਖਿਅਤ ਨਿਕਾਸੀ ਸੀਮਾ",
  ];

  const suggestedQueries = language === "Hindi" ? suggestedQueriesHindi :
                          language === "Marathi" ? suggestedQueriesMarathi :
                          language === "Tamil" ? suggestedQueriesTamil :
                          language === "Telugu" ? suggestedQueriesTelugu :
                          language === "Kannada" ? suggestedQueriesKannada :
                          language === "Bengali" ? suggestedQueriesBengali :
                          language === "Gujarati" ? suggestedQueriesGujarati :
                          language === "Punjabi" ? suggestedQueriesPunjabi :
                          suggestedQueriesEnglish;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {language}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("English")}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Hindi")}>हिंदी</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Marathi")}>मराठी</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Tamil")}>தமிழ்</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Telugu")}>తెలుగు</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Kannada")}>ಕನ್ನಡ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Bengali")}>বাংলা</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Gujarati")}>ગુજરાતી</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Punjabi")}>ਪੰਜਾਬੀ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

      <Card className="flex-1 mb-4 shadow-water">
        <CardContent className="p-0">
          <ScrollArea className="h-[40vh] p-4" ref={scrollAreaRef}>
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
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-center space-x-2 max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-water-secondary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <p className="text-sm mt-1 animate-pulse">
                        {language === "Hindi" ? `${persona} सोच रहा है...` :
                         language === "Marathi" ? `${persona} विचार करत आहे...` :
                         language === "Tamil" ? `${persona} சிந்திக்கிறது...` :
                         language === "Telugu" ? `${persona} ఆలోచిస్తోంది...` :
                         language === "Kannada" ? `${persona} ಯೋಚಿಸುತ್ತಿದೆ...` :
                         language === "Bengali" ? `${persona} ভাবছে...` :
                         language === "Gujarati" ? `${persona} વિચારી રહ્યું છે...` :
                         language === "Punjabi" ? `${persona} ਸੋਚ ਰਿਹਾ ਹੈ...` :
                         `${persona} is thinking...`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          {language === "Hindi" ? "सुझाए गए प्रश्न:" :
           language === "Marathi" ? "सुचवलेले प्रश्न:" :
           language === "Tamil" ? "பரிந்துரைக்கப்பட்ட கேள்விகள்:" :
           language === "Telugu" ? "సూచించిన ప్రశ్నలు:" :
           language === "Kannada" ? "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು:" :
           language === "Bengali" ? "প্রস্তাবিত প্রশ্ন:" :
           language === "Gujarati" ? "સૂચવેલા પ્રશ્નો:" :
           language === "Punjabi" ? "ਸੁਝਾਏ ਗਏ ਸਵਾਲ:" :
           "Suggested queries:"}
        </p>
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

      <Card className="shadow-water">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "Hindi" ? "भूजल डेटा, ब्लॉक स्थिति, रुझान आदि के बारे में पूछें..." :
                language === "Marathi" ? "भूजल डेटा, ब्लॉक स्थिती, ट्रेंड इत्यादींबद्दल विचारा..." :
                language === "Tamil" ? "நிலத்தடி நீர் தரவு, பிளாக் நிலை, போக்குகள் பற்றி கேளுங்கள்..." :
                language === "Telugu" ? "భూగర్భ జల డేటా, బ్లాక్ స్థితి, ధోరణుల గురించి అడగండి..." :
                language === "Kannada" ? "ಭೂಗರ್ಭ ಜಲ ಡೇಟಾ, ಬ್ಲಾಕ್ ಸ್ಥಿತಿ, ಪ್ರವೃತ್ತಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ..." :
                language === "Bengali" ? "ভূগর্ভস্থ জলের তথ্য, ব্লকের অবস্থা, প্রবণতা ইত্যাদি সম্পর্কে জিজ্ঞাসা করুন..." :
                language === "Gujarati" ? "ભૂગર્ભજળ ડેટા, બ્લોક સ્થિતિ, વલણો વિશે પૂછો..." :
                language === "Punjabi" ? "ਭੂ-ਜਲ ਡੇਟਾ, ਬਲਾਕ ਸਥਿਤੀ, ਰੁਝਾਨਾਂ ਬਾਰੇ ਪੁੱਛੋ..." :
                "Ask about groundwater data, block status, trends..."
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
              variant="outline"
              size="icon"
              onClick={handleTextToSpeechToggle}
              className={`${isSpeaking ? "bg-water-success text-primary-foreground" : ""}`}
            >
              {isSpeaking ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  <path d="M16 9.5c1.5 0 2.5 1.5 2.5 2.5s-1 2.5-2.5 2.5" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  <path d="M16 8c1.5 0 2.5 1.5 2.5 2.5s-1 2.5-2.5 2.5" />
                  <path d="M16 6c3 0 5 2.5 5 5s-2 5-5 5" />
                </svg>
              )}
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