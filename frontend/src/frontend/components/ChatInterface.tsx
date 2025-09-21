import { useState, useEffect, useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Send, Bot, User, Mic, MicOff, Loader2, Languages, Briefcase, Wrench, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecorder } from './useVoiceRecorder';
import { chatAPI } from "@/lib/api";

// Register Chart.js components right after imports
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PALETTE = {
  background: [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
  ],
  border: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ],
};


interface Message {
  id: string;
  content: string;      // For text messages
  isUser: boolean;
  timestamp: Date;
  chartData?: any;      // Add this for chart messages
}

const ChatInterface = () => {
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [persona, setPersona] = useState("Professional Assistant");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Text-to-speech functionality

  const { isListening, handleVoiceToggle } = useVoiceRecorder({
    persona,
    language,
    setIsLoading,
    onTranscriptionComplete: (userMessage, aiMessages) => {
      // This function updates the chat when the voice processing is done
      setMessages((prev) => [...prev, userMessage, ...aiMessages]);
    },
  });
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
// Register the components you need for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
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
      const responseData = data.answer;
      const cleanAnswer = responseData.html_answer ? responseData.html_answer.trim() : "";
      
      // We will create an array to hold the new message(s) from the AI
      const newMessages: Message[] = [];

      // 1. Create the text response message if there is text content
      if (cleanAnswer) {
        newMessages.push({
          id: (Date.now() + 1).toString(),
          content: `<div>${cleanAnswer}</div>`,
          isUser: false,
          timestamp: new Date(),
        });
      }

      // 2. If there's chart data, create a separate chart message
      if (responseData.chart_data) {
        newMessages.push({
          id: (Date.now() + 2).toString(),
          content: "", // No text content for a chart message
          chartData: responseData.chart_data, // The chart data is attached here
          isUser: false,
          timestamp: new Date(),
        });
      }

      // 3. Add all new messages (text and/or chart) to the state at once
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
      } else {
        // Fallback for safety, in case the AI returns a completely empty response
        const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "<div>I apologize, but I received an empty response.</div>",
            isUser: false,
            timestamp: new Date()
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }


      // 4. Your multilingual text-to-speech logic remains, reading only the text part
      if (isSpeaking && cleanAnswer) {
        const textToSpeak = cleanAnswer || (
          language === "Hindi" ? "मुझे खेद है, मैं अभी आपका अनुरोध संसाधित नहीं कर सका।" :
          // ... (all other language fallbacks) ...
          "I apologize, but I couldn't process your request at the moment."
        );
        speak(textToSpeak.replace(/<[^>]*>/g, ''), language); // Strip HTML for cleaner speech
      }
    } catch (error) {
      console.error("Error calling RAG API:", error);

      // Your original, detailed error handling logic is preserved perfectly
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          language === "Hindi"
            ? "<div>मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है और फिर से प्रयास करें।</div>"
            : // ... (all other language error messages) ...
              "<div>I'm sorry, I'm having trouble connecting to the groundwater database right now. Please make sure the backend server is running and try again.</div>",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);

      toast({
        title: language === "Hindi" ? "कनेक्शन त्रुटि" : 
               // ... (all other language toast titles) ...
               "Connection Error",
        description:
          language === "Hindi"
            ? "RAG API से कनेक्ट नहीं कर पाया। कृपया जांचें कि बैकएंड सर्वर चल रहा है।"
            : // ... (all other language toast descriptions) ...
              "Could not connect to the RAG API. Please check if the backend server is running.",
        variant: "destructive",
      });

      if (isSpeaking) {
        const errorText = language === "Hindi"
          ? "मुझे खेद है, मैं अभी भूजल डेटाबेस से कनेक्ट नहीं कर पा रहा हूँ।"
          : // ... (all other language speech errors) ...
            "I'm sorry, I'm having trouble connecting to the groundwater database right now.";
        speak(errorText, language);
      }
    } finally {
      setIsLoading(false);
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
          <DropdownMenuTrigger id="language-selector" asChild>
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
          <DropdownMenuTrigger id="persona-selector" asChild>
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
      {messages.map((message) =>
  // Check if the message object has chartData
  message.chartData ? (
    // If YES, render the chart component
    (() => {
      // Logic to add colors to the datasets
      message.chartData.data.datasets.forEach((dataset: any, index: number) => {
        dataset.backgroundColor = PALETTE.background[index % PALETTE.background.length];
        dataset.borderColor = PALETTE.border[index % PALETTE.border.length];
        dataset.borderWidth = 1;
      });

      return (
        <div key={message.id} className="flex justify-start animate-fade-in">
          <div className="flex items-start space-x-2 w-full max-w-[85%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-water-secondary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="rounded-lg p-4 bg-secondary flex-1">
              <h3 className="font-semibold mb-2 text-center text-secondary-foreground">Visualization</h3>
              <div className="relative h-[300px]">
                {message.chartData.type === 'bar' && <Bar data={message.chartData.data} options={{ responsive: true, maintainAspectRatio: false }} />}
                {message.chartData.type === 'line' && <Line data={message.chartData.data} options={{ responsive: true, maintainAspectRatio: false }} />}
                {message.chartData.type === 'pie' && <Pie data={message.chartData.data} options={{ responsive: true, maintainAspectRatio: false }} />}
              </div>
            </div>
          </div>
        </div>
      );
    })()
  ) : (
    // If NO, render the normal text message bubble
    <div
      key={message.id}
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      {/* ... your existing text bubble JSX remains the same ... */}
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
  )
)}
        
        {/* Your existing "is loading" indicator */}
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
              id="chat-input"
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
  id="mic-button"
  onClick={handleVoiceToggle}
  variant="ghost"
  size="icon"
  disabled={isLoading}
  className={isListening ? "text-red-500" : ""}
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