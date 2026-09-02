import React, { useState, useRef, useEffect } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AIAssistant = () => {
  const navigate = useNavigate();

  // Use the main application language
  const { selectedLanguage, setLanguage } = useStore();

  const language = selectedLanguage || 'en';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // --------------------------------------------------
  // TRANSLATIONS
  // --------------------------------------------------

  const translations = {
    en: {
      title: 'Swasthya AI Health Assistant',
      subtitle: 'General health guidance & facility navigation',

      welcome:
        "Hello! I'm your SwasthyaSetu AI Health Assistant. I can help you with general health information, find nearby healthcare facilities, and guide you to appropriate care. How can I help you today?",

      quickQuestions: 'Quick questions:',

      fever: 'I have fever for 3 days',
      chestPain: 'Severe chest pain',
      findPHC: 'Find nearby PHC',
      medicine: 'Check medicine availability',
      appointment: 'Book an appointment',
      headache: 'Headache and nausea',

      placeholder:
        'Type your symptoms or health question...',

      send: 'Send',

      emergencyAlert: 'EMERGENCY ALERT',

      urgency: 'Urgency Level:',

      voiceNotSupported:
        'Voice input is not supported in your browser. Please type your message.',

      connectionError:
        "I'm sorry, I'm having trouble connecting right now. Please try again or visit a healthcare facility directly.",

      warning:
        '⚠️ This assistant provides general guidance only. For emergencies, call 108/112 immediately.'
    },

    hi: {
      title: 'स्वास्थ्य AI सहायक',
      subtitle: 'सामान्य स्वास्थ्य मार्गदर्शन और स्वास्थ्य केंद्र खोज',

      welcome:
        'नमस्ते! मैं आपका स्वास्थ्यसेतु AI स्वास्थ्य सहायक हूँ। मैं सामान्य स्वास्थ्य जानकारी, आपके पास के स्वास्थ्य केंद्र खोजने और उचित स्वास्थ्य सेवा तक पहुँचने में आपकी सहायता कर सकता हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?',

      quickQuestions: 'त्वरित प्रश्न:',

      fever: 'मुझे 3 दिनों से बुखार है',
      chestPain: 'तेज सीने में दर्द',
      findPHC: 'पास का PHC खोजें',
      medicine: 'दवा की उपलब्धता जांचें',
      appointment: 'अपॉइंटमेंट बुक करें',
      headache: 'सिरदर्द और मतली',

      placeholder:
        'अपने लक्षण या स्वास्थ्य संबंधी प्रश्न लिखें...',

      send: 'भेजें',

      emergencyAlert: 'आपातकालीन चेतावनी',

      urgency: 'तत्कालता स्तर:',

      voiceNotSupported:
        'आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया अपना संदेश टाइप करें।',

      connectionError:
        'क्षमा करें, अभी कनेक्शन में समस्या हो रही है। कृपया फिर से प्रयास करें या सीधे किसी स्वास्थ्य केंद्र पर जाएँ।',

      warning:
        '⚠️ यह सहायक केवल सामान्य मार्गदर्शन प्रदान करता है। आपातकाल की स्थिति में तुरंत 108/112 पर कॉल करें।'
    },

    kn: {
      title: 'ಸ್ಪಾಸ್ಥ್ಯ AI ಆರೋಗ್ಯ ಸಹಾಯಕ',
      subtitle: 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹುಡುಕಾಟ',

      welcome:
        'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ವಾಸ್ಥ್ಯಸೇತು AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿ, ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲು ಮತ್ತು ಸೂಕ್ತ ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ಪಡೆಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',

      quickQuestions: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು:',

      fever: 'ನನಗೆ 3 ದಿನಗಳಿಂದ ಜ್ವರ ಇದೆ',
      chestPain: 'ತೀವ್ರ ಎದೆ ನೋವು',
      findPHC: 'ಹತ್ತಿರದ PHC ಹುಡುಕಿ',
      medicine: 'ಔಷಧಿಗಳ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ',
      appointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
      headache: 'ತಲೆನೋವು ಮತ್ತು ವಾಕರಿಕೆ',

      placeholder:
        'ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ಅಥವಾ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ...',

      send: 'ಕಳುಹಿಸಿ',

      emergencyAlert: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ',

      urgency: 'ತುರ್ತು ಮಟ್ಟ:',

      voiceNotSupported:
        'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ.',

      connectionError:
        'ಕ್ಷಮಿಸಿ, ಪ್ರಸ್ತುತ ಸಂಪರ್ಕದಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನೇರವಾಗಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',

      warning:
        '⚠️ ಈ ಸಹಾಯಕವು ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ. ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 108/112 ಗೆ ಕರೆ ಮಾಡಿ.'
    }
  };

  const t = translations[language] || translations.en;

  // --------------------------------------------------
  // INITIAL MESSAGE
  // --------------------------------------------------

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: t.welcome,
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          t.findPHC,
          t.fever,
          t.appointment,
          t.medicine
        ]
      }
    ]);
  }, [language]);

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------

  useEffect(() => {
    if (
      'webkitSpeechRecognition' in window ||
      'SpeechRecognition' in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript =
          event.results[0][0].transcript;

        setInput(transcript);
        handleSend(transcript);

        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSend = async (text) => {
    if (!text?.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        '/ai/chat',
        {
          message: text.trim(),
          language: language
        }
      );

      const data = response.data.data;

      const aiMessage = {
        id: Date.now() + 1,

        text:
          data?.response ||
          'No response received.',

        isUser: false,

        timestamp: new Date(),

        urgency: data?.urgency,

        recommendations:
          data?.recommended_facilities,

        isEmergency:
          data?.is_emergency,

        suggestions:
          data?.suggestions || []
      };

      setMessages((prev) => [
        ...prev,
        aiMessage
      ]);

    } catch (error) {
      console.error(
        'AI Assistant error:',
        error
      );

      const errorMessage = {
        id: Date.now() + 1,

        text: t.connectionError,

        isUser: false,

        timestamp: new Date()
      };

      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // VOICE INPUT
  // --------------------------------------------------

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      return;
    }

    try {
      recognitionRef.current.lang =
        language === 'hi'
          ? 'hi-IN'
          : language === 'kn'
          ? 'kn-IN'
          : 'en-US';

      recognitionRef.current.start();

      setIsListening(true);

    } catch (error) {
      console.error(
        'Voice recognition error:',
        error
      );

      setIsListening(false);
    }
  };

  // --------------------------------------------------
  // QUICK PROMPTS
  // --------------------------------------------------

  const quickPrompts = [
    t.fever,
    t.chestPain,
    t.findPHC,
    t.medicine,
    t.appointment,
    t.headache
  ];

  // --------------------------------------------------
  // QUICK SUGGESTION NAVIGATION
  // --------------------------------------------------

  const handleSuggestion = (suggestion) => {
    const lower =
      suggestion.toLowerCase();

    if (
      lower.includes('healthcare') ||
      lower.includes('health') ||
      lower.includes('phc') ||
      lower.includes('स्वास्थ्य') ||
      lower.includes('ಆರೋಗ್ಯ')
    ) {
      navigate('/healthcare');
      return;
    }

    if (
      lower.includes('appointment') ||
      lower.includes('अपॉइंटमेंट') ||
      lower.includes('ಅಪಾಯಿಂಟ್')
    ) {
      navigate('/book-appointment');
      return;
    }

    if (
      lower.includes('medicine') ||
      lower.includes('दवा') ||
      lower.includes('ಔಷಧ')
    ) {
      navigate('/medicine');
      return;
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-180px)] flex flex-col">

        {/* HEADER */}
        <div className="border-b border-gray-200 p-4">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-xl font-bold text-gray-800">
                🤖 {t.title}
              </h1>

              <p className="text-sm text-gray-500">
                {t.subtitle}
              </p>

            </div>

            {/* Language */}
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="en">
                English
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="kn">
                ಕನ್ನಡ
              </option>
            </select>

          </div>

        </div>


        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`flex ${
                msg.isUser
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.isUser
                    ? 'bg-primary-500 text-white'
                    : msg.isEmergency
                    ? 'bg-red-50 border-2 border-red-300 text-red-900'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >

                {/* Emergency */}
                {msg.isEmergency && (

                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">

                    🚨 {t.emergencyAlert}

                  </div>

                )}

                {/* Message */}
                <div className="whitespace-pre-wrap text-sm">
                  {msg.text}
                </div>


                {/* Urgency */}
                {msg.urgency && (

                  <div className="mt-2 text-xs opacity-80">

                    {t.urgency}{' '}

                    <span className="font-bold uppercase">
                      {msg.urgency}
                    </span>

                  </div>

                )}


                {/* Suggestions */}
                {msg.suggestions &&
                  msg.suggestions.length > 0 &&
                  !msg.isUser && (

                    <div className="mt-3 flex flex-wrap gap-2">

                      {msg.suggestions.map(
                        (suggestion, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              handleSuggestion(
                                suggestion
                              )
                            }
                            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                          >
                            {suggestion}
                          </button>

                        )
                      )}

                    </div>

                  )}


                {/* Time */}
                <div className="text-xs opacity-60 mt-1">
                  {new Date(
                    msg.timestamp
                  ).toLocaleTimeString()}
                </div>

              </div>

            </div>

          ))}


          {/* Loading */}
          {loading && (

            <div className="flex justify-start">

              <div className="bg-gray-100 rounded-2xl p-4">

                <div className="flex space-x-2">

                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: '0.1s'
                    }}
                  ></div>

                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: '0.2s'
                    }}
                  ></div>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>


        {/* QUICK PROMPTS */}
        {messages.length <= 1 && (

          <div className="px-4 pb-2">

            <p className="text-xs text-gray-500 mb-2">
              {t.quickQuestions}
            </p>

            <div className="flex flex-wrap gap-2">

              {quickPrompts.map(
                (prompt, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      handleSend(prompt)
                    }
                    className="text-xs px-3 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                  >
                    {prompt}
                  </button>

                )
              )}

            </div>

          </div>

        )}


        {/* INPUT */}
        <div className="border-t border-gray-200 p-4">

          <div className="flex space-x-2">

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder={t.placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />


            {/* Voice */}
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Voice input"
              disabled={loading}
            >
              🎤
            </button>


            {/* Send */}
            <button
              onClick={() =>
                handleSend(input)
              }
              disabled={
                loading ||
                !input.trim()
              }
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {loading
                ? '🔄'
                : t.send}
            </button>

          </div>


          {/* Warning */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t.warning}
          </p>

        </div>

      </div>

    </div>
  );
};

export default AIAssistant;