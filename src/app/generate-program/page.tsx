// src/app/generate-program/page.tsx

"use client";

// IMPORTS: Added 'Image' from next/image
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea"; 
import { Switch } from "@/Components/ui/switch"; 
import Image from "next/image"; // <--- NEW: Import Image for optimization
import { vapi } from "@/lib/Vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, User, Bot, ArrowLeft, Loader2, MessageSquare, Send } from "lucide-react";

// --- TYPE DEFINITIONS (FIXING BUILD ERRORS) ---
interface Meal {
  name: string;
  foods: string[];
}

interface DietPlan {
  name: string;
  dailyCalories: number;
  meals: Meal[];
}

// Interface for the messages stored in state (user or assistant)
interface ChatMessage {
    content: string;
    role: "user" | "assistant";
}

// Interface for the complex Vapi message object
interface VapiMessage {
  type: string;
  transcriptType?: "final" | "partial";
  transcript?: string;
  role?: "user" | "assistant";
  // Fallback signature to allow other Vapi fields without 'any'
  [key: string]: any; 
}

// Interface for Vapi Errors
interface VapiError extends Error {
    message: string;
    // Vapi errors can have other specific fields
    code?: string | number; 
}
// --- END TYPE DEFINITIONS ---

const demoDietPlans: DietPlan[] = [
  { name: "Plan A", dailyCalories: 2000, meals: [{ name: "Breakfast", foods: ["Eggs", "Oatmeal"] }] },
  { name: "Plan B", dailyCalories: 1800, meals: [{ name: "Smoothie", foods: ["Smoothie", "Toast"] }] },
  { name: "Plan C", dailyCalories: 2200, meals: [{ name: "Dinner", foods: ["Pancakes", "Fruits"] }] },
];

const mockResponses = [
  "That's great! Tell me more about your fitness goals.",
  "Understood. What’s your preferred diet type?",
  "Awesome! Let's finalize your plan.",
  "Your personalized program is ready!",
];

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // FIXED: State initialized with ChatMessage[]
  const [messages, setMessages] = useState<ChatMessage[]>([]); 
  
  const [callEnded, setCallEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTextMode, setIsTextMode] = useState(false); 
  const [textInput, setTextInput] = useState(""); 
  const [isTyping, setIsTyping] = useState(false); 

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  const [selectedDietPlan, setSelectedDietPlan] = useState<DietPlan | null>(null);

  // Ignore known "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    console.error = function (msg, ...args) {
      if (msg && msg.includes("Meeting has ended")) return;
      return originalError.call(console, msg, ...args);
    };
    return () => { console.error = originalError; };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Redirect to profile after conversation ends
  useEffect(() => {
    if (callEnded && selectedDietPlan) {
      setTimeout(() => {
        router.push("/Profile");
      }, 1500);
    }
  }, [callEnded, selectedDietPlan, router]);

  // Handle text mode conversation end (after a few messages)
  useEffect(() => {
    if (isTextMode && messages.length >= 5 && !callEnded) { 
      setCallEnded(true);
      const randomIndex = Math.floor(Math.random() * demoDietPlans.length);
      setSelectedDietPlan(demoDietPlans[randomIndex]);
    }
  }, [messages, isTextMode, callEnded]);

  useEffect(() => {
    if (!isTextMode) {
      const handleCallStart = () => { 
        setConnecting(false); 
        setCallActive(true); 
        setCallEnded(false); 
        setError(null); 
      };
      const handleCallEnd = () => { 
        setCallActive(false); 
        setConnecting(false); 
        setIsSpeaking(false); 
        setCallEnded(true);
        const randomIndex = Math.floor(Math.random() * demoDietPlans.length);
        setSelectedDietPlan(demoDietPlans[randomIndex]);
      };
      const handleSpeechStart = () => setIsSpeaking(true);
      const handleSpeechEnd = () => setIsSpeaking(false);
      
      // FIXED: Used VapiMessage type
      const handleMessage = (message: VapiMessage) => { 
        if (message.type === "transcript" && message.transcriptType === "final") {
          const newMessage: ChatMessage = { 
              content: message.transcript || "", 
              role: (message.role as "user" | "assistant") || "assistant" 
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      };
      
      // FIXED: Used VapiError type
      const handleError = (error: VapiError) => { 
        console.log("Vapi Error:", error); 
        setConnecting(false); 
        setCallActive(false); 
        
        // Custom check for the NotAllowedError
        if (error.name === "NotAllowedError") {
             setError("Microphone access denied. Please allow microphone permissions and try again.");
        } else {
             setError("Failed to connect. Please try again."); 
        }
      };

      vapi.on("call-start", handleCallStart)
        .on("call-end", handleCallEnd)
        .on("speech-start", handleSpeechStart)
        .on("speech-end", handleSpeechEnd)
        .on("message", handleMessage)
        .on("error", handleError);

      return () => {
        vapi.off("call-start", handleCallStart)
          .off("call-end", handleCallEnd)
          .off("speech-start", handleSpeechStart)
          .off("speech-end", handleSpeechEnd)
          .off("message", handleMessage)
          .off("error", handleError);
      };
    }
  }, [isTextMode]);

  const toggleCall = async () => {
    if (isTextMode) return; 
    
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        setError(null);

        // Pre-check for microphone (Optional but good UX)
        if (!await navigator.mediaDevices.getUserMedia({ audio: true })) {
            throw new Error("Microphone permission required.");
        }
        
        const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
        // The type of 'error' here is unknown, so handle it generally
        if (error instanceof Error && error.name === "NotAllowedError") {
             setError("Microphone access denied. Please allow microphone permissions and try again.");
        } else {
             setError("Unable to start call. Check your connection.");
        }
      }
    }
  };

  // Handle sending text messages
  const sendTextMessage = async () => {
    if (!textInput.trim()) return;
    
    const userMessage: ChatMessage = { content: textInput, role: "user" }; 
    setMessages((prev) => [...prev, userMessage]);
    setTextInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages((prev) => [...prev, { content: aiResponse, role: "assistant" }]);
      setIsTyping(false);
    }, 1500); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/20 text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">CodeFlex AI Assistant</h1>
        <div className="w-10" /> 
      </header>

      <div className="container mx-auto px-6 py-8 flex-1 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Generate Your <span className="uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Engage in a conversation with CodeFlex AI to create a personalized plan.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-card/90 backdrop-blur-sm border rounded-lg shadow-sm">
          <span className="text-sm font-medium">Voice Mode</span>
          <Switch
            checked={isTextMode}
            onCheckedChange={setIsTextMode}
            aria-label="Toggle between voice and text mode"
          />
          <span className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Text Mode
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center font-medium">
            {error}
          </div>
        )}

        {/* AI & User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* AI CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border shadow-lg p-8 relative transition-all hover:shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 relative mb-6">
                <div className={`absolute inset-0 bg-primary/20 rounded-full blur-xl transition-opacity ${isTextMode ? "opacity-0" : isSpeaking ? "opacity-100 animate-pulse" : "opacity-0"}`} />
                {/* Image FIX: Replaced <img> with <Image /> */}
                <Image 
                    src="/1.jpg" 
                    alt="AI Assistant" 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className="rounded-full border-4 border-primary/20" 
                    sizes="(max-width: 768px) 100vw, 36vw"
                />
                <div className="absolute bottom-2 right-2 bg-primary rounded-full p-2">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">CodeFlex AI</h2>
              <p className="text-sm text-muted-foreground mt-2">Your AI Fitness & Diet Coach</p>
              <div className={`mt-6 flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border transition-colors ${isTextMode ? "" : isSpeaking ? "border-primary bg-primary/10" : ""}`}>
                {isTextMode ? (
                  <MessageSquare className="w-4 h-4 text-primary" />
                ) : isSpeaking ? (
                  <Mic className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <MicOff className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isTextMode ? "Text Chat Active" : isSpeaking ? "Speaking..." : callActive ? "Listening..." : callEnded ? "Processing plan..." : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border shadow-lg p-8 relative transition-all hover:shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 relative mb-6">
                {/* Image FIX: Replaced <img> with <Image /> */}
                <Image 
                    src={user?.imageUrl || "/5.jpg"} 
                    alt="User profile picture" 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className="rounded-full border-4 border-muted" 
                    sizes="(max-width: 768px) 100vw, 36vw"
                />
                <div className="absolute bottom-2 right-2 bg-muted rounded-full p-2">
                  <User className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Guest"}</h2>
              <p className="text-sm text-muted-foreground mt-2">User ID: {user?.id || "N/A"}</p>
              <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Ready to Connect</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Messages */}
        <div className="w-full bg-card/90 backdrop-blur-sm border rounded-xl p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Conversation</h3>
          <div
            ref={messageContainerRef}
            className="h-64 overflow-y-auto space-y-4"
            aria-label="Conversation messages"
          >
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {msg.role === "assistant" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-muted-foreground mb-1">
                      {msg.role === "assistant" ? "CodeFlex AI" : "You"}:
                    </div>
                    <p className="text-foreground leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {isTextMode ? "Start chatting to begin!" : "No messages yet. Start a call to begin the conversation."}
              </p>
            )}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">CodeFlex AI is typing...</div>
              </div>
            )}
          </div>
        </div>

        {/* Text Input (Only in Text Mode) */}
        {isTextMode && (
          <div className="w-full mb-6 flex gap-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendTextMessage();
                }
              }}
            />
            <Button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || isTyping}
              className="px-6 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Call Button (Only in Voice Mode) */}
        {!isTextMode && (
          <div className="w-full flex justify-center">
            <Button
              onClick={toggleCall}
              disabled={connecting || callEnded}
              className={`w-48 h-14 text-lg rounded-full transition-all duration-300 ${
                callActive
                  ? "bg-destructive hover:bg-destructive/90"
                  : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
              } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={callActive ? "End Call" : connecting ? "Connecting" : callEnded ? "View Profile" : "Start Call"}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : callActive ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  End Call
                </>
              ) : callEnded ? (
                "View Profile"
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Call
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 bg-card/80 backdrop-blur-sm border-t text-center text-sm text-muted-foreground">
        Powered by CodeFlex AI | © 2023 All Rights Reserved
      </footer>
    </div>
  );
};

export default GenerateProgramPage;