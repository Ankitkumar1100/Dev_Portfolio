import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceAgent.css';

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// TypeScript interfaces
interface Message {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface VoiceAgentProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  agencyName?: string;
  initialMessage?: string;
  showToggle?: boolean;
  theme?: 'light' | 'dark';
}

interface AgencyData {
  services: {
    webDevelopment: string;
    mobileApps: string;
    systemIntegration: string;
    ecommerce: string;
  };
  process: string;
  technologies: string;
  contact: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ 
  position = 'bottom-right',
  primaryColor = '#218096',
  agencyName = 'AI Assistant',
  initialMessage = "Hi! I'm your AI assistant. I can help you learn about our web development and app development services. You can speak to me directly or type your questions.",
  showToggle = true,
  theme = 'light'
}) => {
  // State management with proper TypeScript types
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Ready to listen');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: initialMessage,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [hasVoiceSupport, setHasVoiceSupport] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string>('');

  // Refs with proper types
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Agency knowledge base with proper typing
  const agencyData: AgencyData = {
    services: {
      webDevelopment: "We specialize in comprehensive full-stack web application development using cutting-edge technologies like React, Vue.js, Angular, Node.js, Python Django, and PHP Laravel. Our services include custom web applications, Progressive Web Apps (PWAs), responsive websites, e-commerce platforms, API development, database design, and cloud integration with AWS, Google Cloud, and Azure.",
      mobileApps: "We develop native and cross-platform mobile applications for iOS and Android using React Native, Flutter, Swift, and Kotlin. Our mobile development services include app design, development, testing, app store deployment, and ongoing maintenance.",
      systemIntegration: "We provide comprehensive system integration services including API development, third-party service integrations, legacy system modernization, microservices architecture design, database integration, and cloud migration services.",
      ecommerce: "We build complete e-commerce solutions using platforms like Shopify, WooCommerce, Magento, and custom solutions. Our services include online store development, payment gateway integration, inventory management systems, and customer portal development."
    },
    process: "Our development process follows agile methodologies and includes initial consultation, project planning and scope definition, UI/UX design and prototyping, development with regular client updates, comprehensive testing and quality assurance, deployment to production, and ongoing support and maintenance.",
    technologies: "We work with modern technologies including React, Vue.js, Angular, Node.js, Python, PHP, TypeScript, JavaScript, AWS, Google Cloud, Azure, MongoDB, PostgreSQL, MySQL, Docker, Kubernetes, and various other cutting-edge development tools and frameworks.",
    contact: "Contact us for a free consultation to discuss your project requirements. We provide custom quotes based on your specific needs and offer flexible engagement models including fixed-price projects, hourly rates, and retainer agreements."
  };

  // Initialize voice services - FIXED VERSION
  useEffect(() => {
    const initVoiceServices = (): void => {
      // Enhanced browser compatibility check
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;
      
      if (SpeechRecognition) {
        console.log('Speech Recognition supported');
        setHasVoiceSupport(true);
        
        // Clean up any existing recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.log('Previous recognition cleaned up');
          }
        }
        
        const recognition = new SpeechRecognition() as SpeechRecognition;
        
        // Configure recognition with better settings
        recognition.continuous = false; // Changed to false for better reliability
        recognition.interimResults = false; // Changed to false to avoid partial results
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        recognition.onstart = (): void => {
          console.log('Speech recognition started');
          setIsListening(true);
          setVoiceStatus('Listening...');
          setVoiceError('');
        };
        
        recognition.onresult = (event: SpeechRecognitionEvent): void => {
          console.log('Speech recognition result received');
          let finalTranscript = '';
          
          // Get the final result
          if (event.results.length > 0) {
            const result = event.results[event.results.length - 1];
            if (result && result[0]) {
              finalTranscript = result[0].transcript.trim();
              console.log('Transcript:', finalTranscript);
            }
          }
          
          if (finalTranscript) {
            handleUserMessage(finalTranscript);
          }
        };
        
        recognition.onerror = (event: any): void => {
          console.error('Speech recognition error details:', event.error, event);
          setIsListening(false);
          setVoiceStatus('Ready to listen');
          
          // More specific error handling
          switch (event.error) {
            case 'not-allowed':
            case 'permission-denied':
              setVoiceError('Microphone access denied. Please enable microphone permissions and try again.');
              setPermissionGranted(false);
              break;
            case 'no-speech':
              setVoiceError('No speech detected. Please speak clearly and try again.');
              break;
            case 'audio-capture':
              setVoiceError('No microphone found. Please check your microphone connection.');
              break;
            case 'network':
              setVoiceError('Network error. Please check your internet connection.');
              break;
            case 'aborted':
              setVoiceError('Speech recognition was stopped.');
              break;
            case 'language-not-supported':
              setVoiceError('Language not supported. Please try again.');
              break;
            default:
              setVoiceError(`Speech recognition error: ${event.error}. Please try typing your message.`);
          }
        };
        
        recognition.onend = (): void => {
          console.log('Speech recognition ended');
          setIsListening(false);
          setVoiceStatus('Ready to listen');
        };
        
        recognitionRef.current = recognition;
      } else {
        console.log('Speech Recognition not supported');
        setHasVoiceSupport(false);
      }
      
      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;
    };
    
    // Delay initialization to ensure proper browser setup
    const timer = setTimeout(initVoiceServices, 100);
    
    return (): void => {
      clearTimeout(timer);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition cleanup completed');
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Request microphone permission - FIXED VERSION
  const requestMicrophonePermission = useCallback(async (): Promise<void> => {
    try {
      console.log('Requesting microphone permission...');
      
      // Request permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Microphone permission granted');
      setPermissionGranted(true);
      setVoiceError('');
      
      // Stop the stream since we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      setPermissionGranted(false);
      
      if (error.name === 'NotAllowedError') {
        setVoiceError('Microphone access denied. Please click the microphone icon in your browser\'s address bar and allow access.');
      } else if (error.name === 'NotFoundError') {
        setVoiceError('No microphone found. Please connect a microphone and try again.');
      } else {
        setVoiceError('Unable to access microphone. Please check your browser settings and try again.');
      }
    }
  }, []);

  // Handle user message (from voice or text)
  const handleUserMessage = (message: string): void => {
    const userMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response
    setTimeout(() => {
      const response = generateResponse(message);
      const agentMessage: Message = {
        id: messages.length + 2,
        content: response,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Speak the response
      if (synthRef.current && !synthRef.current.speaking) {
        speakText(response);
      }
    }, 1000);
    
    setInputValue('');
  };

  // Generate AI response based on user input
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('web') || input.includes('website') || input.includes('development')) {
      return agencyData.services.webDevelopment;
    } else if (input.includes('mobile') || input.includes('app')) {
      return agencyData.services.mobileApps;
    } else if (input.includes('integration') || input.includes('api')) {
      return agencyData.services.systemIntegration;
    } else if (input.includes('ecommerce') || input.includes('shop') || input.includes('store')) {
      return agencyData.services.ecommerce;
    } else if (input.includes('process') || input.includes('how')) {
      return agencyData.process;
    } else if (input.includes('technology') || input.includes('tech') || input.includes('stack')) {
      return agencyData.technologies;
    } else if (input.includes('contact') || input.includes('quote') || input.includes('price')) {
      return agencyData.contact;
    } else if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm here to help you learn about our development services. What would you like to know about web development, mobile apps, or system integration?";
    } else {
      return "I'd be happy to help you with information about our web development, mobile app development, and system integration services. What specific aspect would you like to know more about?";
    }
  };

  // Speak text using speech synthesis
  const speakText = (text: string): void => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = (): void => setIsSpeaking(true);
      utterance.onend = (): void => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  // Start voice recognition - FIXED VERSION
  const startListening = (): void => {
    console.log('Start listening called, permission granted:', permissionGranted);
    
    if (!hasVoiceSupport) {
      setVoiceError('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (!permissionGranted) {
      console.log('Permission not granted, requesting...');
      requestMicrophonePermission();
      return;
    }
    
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition not initialized. Please refresh the page.');
      return;
    }
    
    if (isListening) {
      console.log('Already listening, ignoring start request');
      return;
    }
    
    try {
      console.log('Starting speech recognition...');
      setVoiceError('');
      setVoiceStatus('Starting...');
      
      // Ensure recognition is stopped before starting
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore error if not running
      }
      
      // Small delay to ensure clean start
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error: any) {
            console.error('Error starting recognition:', error);
            setVoiceError('Failed to start voice recognition. Please try again.');
            setIsListening(false);
            setVoiceStatus('Ready to listen');
          }
        }
      }, 50);
      
    } catch (error: any) {
      console.error('Start listening error:', error);
      setVoiceError('Unable to start voice recognition. Please try again.');
      setIsListening(false);
      setVoiceStatus('Ready to listen');
    }
  };

  // Stop voice recognition
  const stopListening = (): void => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Handle text input
  const handleTextSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue.trim());
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`voice-agent voice-agent--${position} voice-agent--${theme}`}>
      {/* Toggle Button */}
      {showToggle && (
        <button
          className={`voice-agent__toggle ${isOpen ? 'voice-agent__toggle--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: primaryColor }}
        >
          {isOpen ? '✕' : '💬'}
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="voice-agent__widget">
          {/* Header */}
          <div className="voice-agent__header" style={{ backgroundColor: primaryColor }}>
            <div className="voice-agent__header-content">
              <div className="voice-agent__avatar">🤖</div>
              <div className="voice-agent__info">
                <div className="voice-agent__name">{agencyName}</div>
                <div className="voice-agent__status">
                  {isSpeaking ? 'Speaking...' : voiceStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="voice-agent__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`voice-agent__message voice-agent__message--${message.sender}`}
              >
                <div className="voice-agent__message-content">
                  {message.content}
                </div>
                <div className="voice-agent__message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Status */}
          {hasVoiceSupport && (
            <div className="voice-agent__voice-status">
              {voiceError ? (
                <div className="voice-agent__error">⚠️ {voiceError}</div>
              ) : (
                <div className="voice-agent__status-text">
                  {isListening && (
                    <div className="voice-agent__listening-indicator">
                      🎤 Listening...
                    </div>
                  )}
                </div>
              )}
              
              {!permissionGranted && (
                <button
                  className="voice-agent__permission-btn"
                  onClick={requestMicrophonePermission}
                >
                  Enable Microphone
                </button>
              )}
            </div>
          )}

          {/* Input */}
          <form className="voice-agent__input-form" onSubmit={handleTextSubmit}>
            <div className="voice-agent__input-container">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message or click the microphone..."
                className="voice-agent__input"
              />
              
              {hasVoiceSupport && (
                <button
                  type="button"
                  className={`voice-agent__voice-btn ${isListening ? 'voice-agent__voice-btn--listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!permissionGranted && !isListening}
                >
                  🎤
                </button>
              )}
              
              <button
                type="submit"
                className="voice-agent__send-btn"
                disabled={!inputValue.trim()}
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
