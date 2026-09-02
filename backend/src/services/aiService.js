// AI Health Assistant Service
// Supports English, Hindi and Kannada
// Demo uses local/mock responses.
// Production can use an external AI API.

const mockResponses = {
    en: {
        greetings: [
            "Hello! I'm your SwasthyaSetu AI Health Assistant. I can help you find healthcare services, provide general health information, and guide you to the right facility. How can I help you today?",
            "Namaste! Welcome to SwasthyaSetu Health Assistant. I can help you with health-related queries, nearby healthcare facilities, and appointments. What would you like to know?"
        ],

        fever: {
            response: `Based on your symptoms, you may be experiencing a fever. Here are some general suggestions:

1. Rest: Make sure you get plenty of rest.
2. Hydration: Drink plenty of fluids like water, ORS, or clear broths.
3. Medication: Paracetamol may help reduce fever when used according to the label or a healthcare professional's advice.
4. Monitoring: Keep track of your temperature.

Important: If fever exceeds 103°F (39.4°C), or if you experience difficulty breathing, chest pain, confusion, or severe weakness, seek immediate medical attention.`,

            urgency: "low",
            recommendations: ["PHC", "CHC"]
        },

        cough: {
            response: `For a cough, consider these general measures:

1. Stay hydrated and drink warm fluids.
2. Get enough rest.
3. Avoid smoke and other irritants.
4. Monitor how long the cough continues.

If the cough persists, becomes severe, or is accompanied by blood, high fever, chest pain, or difficulty breathing, consult a healthcare professional.`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        chest_pain: {
            response: `🚨 EMERGENCY ALERT

This may be a serious medical emergency.

Chest pain should not be ignored.

1. Call emergency services at 108 or 112 immediately if the pain is severe or associated with difficulty breathing, sweating, dizziness, fainting, or pain spreading to the arm, jaw, back, or shoulder.
2. Do not delay seeking medical attention.
3. Sit or rest in a safe place while waiting for help.

Please seek immediate medical attention at the nearest District Hospital or emergency facility.`,

            urgency: "critical",
            recommendations: ["DISTRICT_HOSPITAL"],
            emergency: true
        },

        headache: {
            response: `For a mild headache, consider these general measures:

1. Rest in a quiet place.
2. Stay hydrated.
3. Get adequate sleep.
4. Reduce excessive screen time and stress.
5. If you normally use an over-the-counter pain reliever, follow the label instructions.

Seek immediate medical attention if the headache is sudden and extremely severe, follows a head injury, or occurs with confusion, seizures, weakness, or a stiff neck.`,

            urgency: "medium",
            recommendations: ["PHC"]
        },

        stomach_pain: {
            response: `For mild abdominal discomfort, consider:

1. Rest and avoid heavy meals.
2. Eat light foods.
3. Stay hydrated.
4. Use ORS if you also have diarrhea.
5. Monitor the location and severity of the pain.

Seek medical care if the pain is severe, persistent, associated with high fever, blood in vomit or stool, or if you cannot pass stool or gas.`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        default: {
            response: `Thank you for sharing your symptoms. I can provide general health guidance, but I cannot diagnose medical conditions.

For now:

1. Rest and monitor your condition.
2. Stay hydrated.
3. Visit a healthcare facility if symptoms persist or worsen.
4. Consult a healthcare professional if you are concerned.

Would you like me to help you find a nearby healthcare facility?`,

            urgency: "low",
            recommendations: ["PHC"]
        }
    },

    hi: {
        greetings: [
            "नमस्ते! मैं आपका स्वास्थ्यसेतु AI स्वास्थ्य सहायक हूँ। मैं सामान्य स्वास्थ्य जानकारी, आपके पास के स्वास्थ्य केंद्र और उचित स्वास्थ्य सेवा खोजने में आपकी मदद कर सकता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
            "नमस्कार! स्वास्थ्यसेतु स्वास्थ्य सहायक में आपका स्वागत है। आप अपने स्वास्थ्य से संबंधित प्रश्न पूछ सकते हैं और पास के स्वास्थ्य केंद्र खोज सकते हैं।"
        ],

        fever: {
            response: `आपके लक्षणों के आधार पर आपको बुखार हो सकता है। कुछ सामान्य सुझाव:

1. आराम करें और पर्याप्त नींद लें।
2. पानी, ORS और अन्य तरल पदार्थ पर्याप्त मात्रा में पिएँ।
3. बुखार कम करने के लिए पैरासिटामोल का उपयोग लेबल या स्वास्थ्य विशेषज्ञ की सलाह के अनुसार करें।
4. अपने शरीर का तापमान नियमित रूप से जाँचें।

महत्वपूर्ण: यदि बुखार 103°F (39.4°C) से अधिक हो या सांस लेने में परेशानी, सीने में दर्द, भ्रम या बहुत अधिक कमजोरी हो, तो तुरंत चिकित्सा सहायता लें।`,

            urgency: "low",
            recommendations: ["PHC", "CHC"]
        },

        cough: {
            response: `खांसी के लिए कुछ सामान्य उपाय:

1. पर्याप्त पानी और गर्म तरल पदार्थ पिएँ।
2. पर्याप्त आराम करें।
3. धुएँ और अन्य जलन पैदा करने वाली चीजों से बचें।
4. खांसी कितने समय से है, इस पर ध्यान दें।

यदि खांसी लंबे समय तक रहती है या खून, तेज बुखार, सीने में दर्द या सांस लेने में परेशानी के साथ होती है, तो डॉक्टर से सलाह लें।`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        chest_pain: {
            response: `🚨 आपातकालीन चेतावनी

यह एक गंभीर चिकित्सा आपातकाल हो सकता है।

सीने में दर्द को नजरअंदाज नहीं करना चाहिए।

1. यदि दर्द बहुत तेज है या सांस लेने में परेशानी, पसीना, चक्कर, बेहोशी या दर्द हाथ, जबड़े, पीठ या कंधे तक फैल रहा है, तो तुरंत 108 या 112 पर कॉल करें।
2. चिकित्सा सहायता लेने में देरी न करें।
3. मदद आने तक सुरक्षित स्थान पर आराम करें।

कृपया तुरंत नजदीकी जिला अस्पताल या आपातकालीन सुविधा में जाएँ।`,

            urgency: "critical",
            recommendations: ["DISTRICT_HOSPITAL"],
            emergency: true
        },

        headache: {
            response: `हल्के सिरदर्द के लिए:

1. शांत जगह पर आराम करें।
2. पर्याप्त पानी पिएँ।
3. पर्याप्त नींद लें।
4. तनाव और अत्यधिक स्क्रीन टाइम कम करें।
5. यदि आप सामान्य रूप से दर्द की दवा लेते हैं, तो लेबल के निर्देशों का पालन करें।

यदि सिरदर्द अचानक बहुत तेज हो, सिर पर चोट के बाद हो या भ्रम, दौरे, कमजोरी या गर्दन में अकड़न के साथ हो, तो तुरंत चिकित्सा सहायता लें।`,

            urgency: "medium",
            recommendations: ["PHC"]
        },

        stomach_pain: {
            response: `हल्के पेट दर्द के लिए:

1. आराम करें और भारी भोजन से बचें।
2. हल्का भोजन करें।
3. पर्याप्त पानी पिएँ।
4. दस्त होने पर ORS का उपयोग करें।
5. दर्द की जगह और गंभीरता पर ध्यान दें।

यदि दर्द बहुत तेज या लगातार हो, तेज बुखार हो, उल्टी या मल में खून आए या मल/गैस पास करने में परेशानी हो, तो तुरंत चिकित्सा सहायता लें।`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        default: {
            response: `अपने लक्षण साझा करने के लिए धन्यवाद। मैं सामान्य स्वास्थ्य मार्गदर्शन दे सकता हूँ, लेकिन किसी बीमारी का निदान नहीं कर सकता।

अभी के लिए:

1. आराम करें और अपनी स्थिति पर नजर रखें।
2. पर्याप्त पानी पिएँ।
3. लक्षण बने रहने या बिगड़ने पर स्वास्थ्य केंद्र जाएँ।
4. चिंता होने पर स्वास्थ्य विशेषज्ञ से सलाह लें।

क्या आप चाहते हैं कि मैं आपके पास का स्वास्थ्य केंद्र खोजने में मदद करूँ?`,

            urgency: "low",
            recommendations: ["PHC"]
        }
    },

    kn: {
        greetings: [
            "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ವಾಸ್ಥ್ಯಸೇತು AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿ, ನಿಮ್ಮ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು ಮತ್ತು ಸೂಕ್ತ ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ಹುಡುಕಲು ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
            "ನಮಸ್ಕಾರ! ಸ್ವಾಸ್ಥ್ಯಸೇತು ಆರೋಗ್ಯ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು ಮತ್ತು ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಬಹುದು."
        ],

        fever: {
            response: `ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ ನಿಮಗೆ ಜ್ವರ ಇರಬಹುದು. ಕೆಲವು ಸಾಮಾನ್ಯ ಸಲಹೆಗಳು:

1. ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಮತ್ತು ನಿದ್ರೆ ಪಡೆಯಿರಿ.
2. ನೀರು, ORS ಮತ್ತು ಇತರ ದ್ರವಗಳನ್ನು ಸಾಕಷ್ಟು ಸೇವಿಸಿ.
3. ಜ್ವರ ಕಡಿಮೆ ಮಾಡಲು ಪ್ಯಾರಾಸಿಟಮಾಲ್ ಅನ್ನು ಲೇಬಲ್ ಅಥವಾ ಆರೋಗ್ಯ ತಜ್ಞರ ಸಲಹೆಯಂತೆ ಬಳಸಿ.
4. ನಿಮ್ಮ ದೇಹದ ತಾಪಮಾನವನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.

ಮುಖ್ಯ: ಜ್ವರವು 103°F (39.4°C) ಗಿಂತ ಹೆಚ್ಚಾದರೆ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ, ಎದೆ ನೋವು, ಗೊಂದಲ ಅಥವಾ ತೀವ್ರ ದುರ್ಬಲತೆ ಇದ್ದರೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.`,

            urgency: "low",
            recommendations: ["PHC", "CHC"]
        },

        cough: {
            response: `ಕೆಮ್ಮಿಗೆ ಕೆಲವು ಸಾಮಾನ್ಯ ಸಲಹೆಗಳು:

1. ಸಾಕಷ್ಟು ನೀರು ಮತ್ತು ಬೆಚ್ಚಗಿನ ದ್ರವಗಳನ್ನು ಸೇವಿಸಿ.
2. ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.
3. ಹೊಗೆ ಮತ್ತು ಇತರ ಕಿರಿಕಿರಿ ಉಂಟುಮಾಡುವ ವಸ್ತುಗಳಿಂದ ದೂರವಿರಿ.
4. ಕೆಮ್ಮು ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ ಎಂಬುದನ್ನು ಗಮನಿಸಿ.

ಕೆಮ್ಮು ಮುಂದುವರಿದರೆ ಅಥವಾ ರಕ್ತ, ತೀವ್ರ ಜ್ವರ, ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಯೊಂದಿಗೆ ಇದ್ದರೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        chest_pain: {
            response: `🚨 ತುರ್ತು ಎಚ್ಚರಿಕೆ

ಇದು ಗಂಭೀರ ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿರಬಹುದು.

ಎದೆ ನೋವನ್ನು ನಿರ್ಲಕ್ಷಿಸಬಾರದು.

1. ನೋವು ತೀವ್ರವಾಗಿದ್ದರೆ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ, ಬೆವರು, ತಲೆಸುತ್ತು, ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು ಅಥವಾ ನೋವು ಕೈ, ದವಡೆ, ಬೆನ್ನು ಅಥವಾ ಭುಜಕ್ಕೆ ಹರಡುತ್ತಿದ್ದರೆ ತಕ್ಷಣ 108 ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ.
2. ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯುವುದನ್ನು ವಿಳಂಬ ಮಾಡಬೇಡಿ.
3. ಸಹಾಯ ಬರುವವರೆಗೆ ಸುರಕ್ಷಿತ ಸ್ಥಳದಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.

ದಯವಿಟ್ಟು ತಕ್ಷಣ ಹತ್ತಿರದ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ ಅಥವಾ ತುರ್ತು ಚಿಕಿತ್ಸಾ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.`,

            urgency: "critical",
            recommendations: ["DISTRICT_HOSPITAL"],
            emergency: true
        },

        headache: {
            response: `ಸಾಮಾನ್ಯ ತಲೆನೋವಿಗೆ:

1. ಶಾಂತವಾದ ಸ್ಥಳದಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.
2. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.
3. ಸಾಕಷ್ಟು ನಿದ್ರೆ ಪಡೆಯಿರಿ.
4. ಒತ್ತಡ ಮತ್ತು ಹೆಚ್ಚು ಸ್ಕ್ರೀನ್ ಸಮಯವನ್ನು ಕಡಿಮೆ ಮಾಡಿ.
5. ನೀವು ಸಾಮಾನ್ಯವಾಗಿ ನೋವು ನಿವಾರಕ ಔಷಧಿ ಬಳಸುತ್ತಿದ್ದರೆ, ಅದರ ಲೇಬಲ್ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.

ತಲೆನೋವು ಹಠಾತ್ತನೆ ತುಂಬಾ ತೀವ್ರವಾಗಿದ್ದರೆ, ತಲೆಗೆ ಗಾಯವಾದ ನಂತರ ಕಾಣಿಸಿಕೊಂಡರೆ ಅಥವಾ ಗೊಂದಲ, ಸೆಳೆತ, ದುರ್ಬಲತೆ ಅಥವಾ ಕುತ್ತಿಗೆ ಗಟ್ಟಿಯಾಗುವಿಕೆಯೊಂದಿಗೆ ಇದ್ದರೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.`,

            urgency: "medium",
            recommendations: ["PHC"]
        },

        stomach_pain: {
            response: `ಸಾಮಾನ್ಯ ಹೊಟ್ಟೆ ನೋವಿಗೆ:

1. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಭಾರವಾದ ಆಹಾರವನ್ನು ತಪ್ಪಿಸಿ.
2. ಹಗುರವಾದ ಆಹಾರ ಸೇವಿಸಿ.
3. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.
4. ಅತಿಸಾರ ಇದ್ದರೆ ORS ಬಳಸಿ.
5. ನೋವಿನ ಸ್ಥಳ ಮತ್ತು ತೀವ್ರತೆಯನ್ನು ಗಮನಿಸಿ.

ನೋವು ತೀವ್ರವಾಗಿದ್ದರೆ ಅಥವಾ ಮುಂದುವರಿದರೆ, ತೀವ್ರ ಜ್ವರ, ವಾಂತಿ ಅಥವಾ ಮಲದಲ್ಲಿ ರಕ್ತ ಕಂಡುಬಂದರೆ ಅಥವಾ ಮಲ/ಗ್ಯಾಸ್ ಹೊರಹಾಕಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.`,

            urgency: "medium",
            recommendations: ["PHC", "CHC"]
        },

        default: {
            response: `ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ನಾನು ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಹುದು, ಆದರೆ ಯಾವುದೇ ಕಾಯಿಲೆಯನ್ನು ನಿರ್ಣಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.

ಈಗ:

1. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ಥಿತಿಯನ್ನು ಗಮನಿಸಿ.
2. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.
3. ಲಕ್ಷಣಗಳು ಮುಂದುವರಿದರೆ ಅಥವಾ ಹೆಚ್ಚಾದರೆ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.
4. ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಚಿಂತೆಯಿದ್ದರೆ ಆರೋಗ್ಯ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.

ನಿಮ್ಮ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಹುಡುಕಲು ನಾನು ಸಹಾಯ ಮಾಡಬೇಕೇ?`,

            urgency: "low",
            recommendations: ["PHC"]
        }
    }
};


// ============================================================
// EMERGENCY KEYWORDS
// ============================================================

const emergencyKeywords = [

    // English
    'chest pain',
    'severe chest pain',
    'heart pain',
    'heart attack',
    'difficulty breathing',
    'breathing difficulty',
    'cannot breathe',
    "can't breathe",
    'not breathing',
    'shortness of breath',
    'unconscious',
    'unconsciousness',
    'unresponsive',
    'severe bleeding',
    'heavy bleeding',
    'stroke',
    'stroke symptoms',
    'seizure',
    'poison',
    'poisoning',
    'overdose',
    'severe accident',

    // Hindi
    'सीने में दर्द',
    'सीने में बहुत दर्द',
    'छाती में दर्द',
    'छाती में बहुत दर्द',
    'दिल में दर्द',
    'दिल का दौरा',
    'हृदयाघात',
    'सांस लेने में परेशानी',
    'सांस लेने में दिक्कत',
    'सांस नहीं आ रही',
    'सांस नहीं ले पा रहा',
    'सांस नहीं ले पा रही',
    'बेहोश',
    'बेहोशी',
    'बहुत ज्यादा खून',
    'बहुत अधिक खून',
    'भारी रक्तस्राव',
    'खून बहुत बह रहा है',
    'स्ट्रोक',
    'दौरा',
    'मिर्गी का दौरा',
    'जहर',
    'ज़हर',
    'जहर खा लिया',
    'ज़हर खा लिया',
    'ओवरडोज',
    'गंभीर दुर्घटना',

    // Kannada
    'ಎದೆ ನೋವು',
    'ತೀವ್ರ ಎದೆ ನೋವು',
    'ಎದೆಯಲ್ಲಿ ನೋವು',
    'ಹೃದಯ ನೋವು',
    'ಹೃದಯಾಘಾತ',
    'ಉಸಿರಾಟದ ತೊಂದರೆ',
    'ಉಸಿರಾಟಕ್ಕೆ ತೊಂದರೆ',
    'ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ',
    'ಉಸಿರಾಡಲು ಆಗುತ್ತಿಲ್ಲ',
    'ಪ್ರಜ್ಞಾಹೀನ',
    'ಪ್ರಜ್ಞೆ ತಪ್ಪಿದೆ',
    'ತೀವ್ರ ರಕ್ತಸ್ರಾವ',
    'ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ',
    'ಸ್ಟ್ರೋಕ್',
    'ಸೆಳೆತ',
    'ಅಪಸ್ಮಾರ',
    'ವಿಷ',
    'ವಿಷ ಸೇವನೆ',
    'ಓವರ್‌ಡೋಸ್',
    'ತೀವ್ರ ಅಪಘಾತ',
    'ಗಂಭೀರ ಅಪಘಾತ'
];


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(text) {
    return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}


// ============================================================
// CHECK EMERGENCY
// ============================================================

function isEmergencyMessage(userMessage) {

    const message = normalizeText(userMessage);

    return emergencyKeywords.some(keyword =>
        message.includes(normalizeText(keyword))
    );
}


// ============================================================
// ANALYZE SYMPTOMS
// ============================================================

function analyzeSymptoms(userMessage) {

    const message = normalizeText(userMessage);

    // IMPORTANT:
    // Emergency must always be checked FIRST.
    if (isEmergencyMessage(message)) {
        return {
            type: 'chest_pain',
            emergency: true
        };
    }

    // Fever
    if (
        message.includes('fever') ||
        message.includes('high temperature') ||
        message.includes('pyrexia') ||
        message.includes('बुखार') ||
        message.includes('ज्वर') ||
        message.includes('ಜ್ವರ')
    ) {
        return {
            type: 'fever',
            emergency: false
        };
    }

    // Cough / Cold
    if (
        message.includes('cough') ||
        message.includes('cold') ||
        message.includes('खांसी') ||
        message.includes('खाँसी') ||
        message.includes('जुकाम') ||
        message.includes('ಕೆಮ್ಮು') ||
        message.includes('ಶೀತ')
    ) {
        return {
            type: 'cough',
            emergency: false
        };
    }

    // Chest pain
    if (
        message.includes('chest pain') ||
        message.includes('heart pain') ||
        message.includes('सीने में दर्द') ||
        message.includes('छाती में दर्द') ||
        message.includes('ಎದೆ ನೋವು') ||
        message.includes('ಎದೆಯಲ್ಲಿ ನೋವು')
    ) {
        return {
            type: 'chest_pain',
            emergency: true
        };
    }

    // Headache
    if (
        message.includes('headache') ||
        message.includes('head pain') ||
        message.includes('migraine') ||
        message.includes('सिरदर्द') ||
        message.includes('सिर दर्द') ||
        message.includes('ತಲೆನೋವು') ||
        message.includes('ತಲೆ ನೋವು')
    ) {
        return {
            type: 'headache',
            emergency: false
        };
    }

    // Stomach pain
    if (
        message.includes('stomach') ||
        message.includes('abdominal') ||
        message.includes('belly pain') ||
        message.includes('पेट दर्द') ||
        message.includes('पेट में दर्द') ||
        message.includes('ಹೊಟ್ಟೆ ನೋವು') ||
        message.includes('ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು')
    ) {
        return {
            type: 'stomach_pain',
            emergency: false
        };
    }

    // Greetings
    if (
        message.includes('hello') ||
        message === 'hi' ||
        message.startsWith('hi ') ||
        message.includes('hey') ||
        message.includes('namaste') ||
        message.includes('नमस्ते') ||
        message.includes('नमस्कार') ||
        message.includes('मदद') ||
        message.includes('help') ||
        message.includes('ನಮಸ್ಕಾರ') ||
        message.includes('ಸಹಾಯ')
    ) {
        return {
            type: 'greeting',
            emergency: false
        };
    }

    return {
        type: 'default',
        emergency: false
    };
}


// ============================================================
// GET LANGUAGE DATA
// ============================================================

function getLanguageData(language) {

    if (['en', 'hi', 'kn'].includes(language)) {
        return mockResponses[language];
    }

    return mockResponses.en;
}


// ============================================================
// GENERATE RESPONSE
// ============================================================

function generateResponse(
    userMessage,
    language = 'en'
) {

    // Normalize language
    if (!['en', 'hi', 'kn'].includes(language)) {
        language = 'en';
    }

    const analysis = analyzeSymptoms(userMessage);

    const languageData = getLanguageData(language);

    let responseData;

    // Emergency
    if (
        analysis.emergency ||
        analysis.type === 'chest_pain'
    ) {

        responseData = languageData.chest_pain;

    } else if (analysis.type === 'fever') {

        responseData = languageData.fever;

    } else if (analysis.type === 'cough') {

        responseData = languageData.cough;

    } else if (analysis.type === 'headache') {

        responseData = languageData.headache;

    } else if (analysis.type === 'stomach_pain') {

        responseData = languageData.stomach_pain;

    } else if (analysis.type === 'greeting') {

        const greetings = languageData.greetings;

        responseData = {
            response:
                greetings[
                    Math.floor(
                        Math.random() * greetings.length
                    )
                ],

            urgency: 'low',

            recommendations: [],

            emergency: false
        };

    } else {

        responseData = languageData.default;

    }

    return {
        success: true,

        data: {
            response: responseData.response,

            urgency: responseData.urgency,

            recommended_facilities:
                responseData.recommendations || [],

            is_emergency:
                Boolean(
                    analysis.emergency ||
                    responseData.emergency
                ),

            suggestions: [
                language === 'hi'
                    ? 'पास का स्वास्थ्य केंद्र खोजें'
                    : language === 'kn'
                    ? 'ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹುಡುಕಿ'
                    : 'Find Nearby Healthcare',

                language === 'hi'
                    ? 'अपॉइंटमेंट बुक करें'
                    : language === 'kn'
                    ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ'
                    : 'Book Appointment',

                language === 'hi'
                    ? 'दवा की उपलब्धता जांचें'
                    : language === 'kn'
                    ? 'ಔಷಧಿಗಳ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ'
                    : 'Check Medicine Availability',

                language === 'hi'
                    ? 'आपातकालीन सेवाएँ'
                    : language === 'kn'
                    ? 'ತುರ್ತು ಸೇವೆಗಳು'
                    : 'Emergency Services'
            ]
        }
    };
}


// ============================================================
// REAL AI INTEGRATION
// ============================================================

async function getAIResponse(
    userMessage,
    conversationHistory = [],
    language = 'en'
) {

    // Normalize language
    if (!['en', 'hi', 'kn'].includes(language)) {
        language = 'en';
    }

    // --------------------------------------------------------
    // ALWAYS CHECK EMERGENCY FIRST
    // --------------------------------------------------------
    //
    // This is important because if a real AI API is enabled,
    // we still want emergency detection to work for English,
    // Hindi and Kannada.
    //

    const emergencyDetected =
        isEmergencyMessage(userMessage);

    if (emergencyDetected) {

        const emergencyResponse =
            generateResponse(
                userMessage,
                language
            );

        return emergencyResponse;
    }


    // --------------------------------------------------------
    // REAL AI API
    // --------------------------------------------------------

    if (
        process.env.AI_API_KEY &&
        process.env.AI_API_KEY !==
            'your_openai_api_key_here'
    ) {

        try {

            const languageName =
                language === 'hi'
                    ? 'Hindi'
                    : language === 'kn'
                    ? 'Kannada'
                    : 'English';

            const response = await fetch(
                process.env.AI_API_URL,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${process.env.AI_API_KEY}`
                    },

                    body: JSON.stringify({

                        model:
                            process.env.AI_MODEL ||
                            'gpt-4o-mini',

                        messages: [

                            {
                                role: 'system',

                                content: `You are SwasthyaSetu Health Assistant, a helpful AI assistant for a rural healthcare platform in India.

IMPORTANT LANGUAGE RULE:

The user selected ${languageName}.

You MUST respond entirely in ${languageName}.

Do not switch to English unless the user explicitly asks for English.

IMPORTANT SAFETY RULES:

- Provide only general health guidance.
- Do NOT provide a definitive diagnosis.
- Recommend healthcare professionals for serious symptoms.
- Identify possible emergency situations.
- For emergencies advise calling 108 or 112 immediately.
- Suggest PHC, CHC or District Hospital when appropriate.
- Be empathetic and easy to understand.
- Use simple language suitable for users with limited digital literacy.
- Never replace professional medical care.`
                            },

                            ...(
                                Array.isArray(
                                    conversationHistory
                                )
                                    ? conversationHistory
                                          .slice(-10)
                                          .map(
                                              msg => ({
                                                  role:
                                                      msg.isUser
                                                          ? 'user'
                                                          : 'assistant',

                                                  content:
                                                      msg.text ||
                                                      ''
                                              })
                                          )
                                    : []
                            ),

                            {
                                role: 'user',

                                content:
                                    userMessage
                            }
                        ],

                        max_tokens: 500,

                        temperature: 0.7
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    `AI API returned ${response.status}`
                );
            }

            const data =
                await response.json();

            const aiText =
                data?.choices?.[0]?.message?.content;

            // If API returned no usable response,
            // use local multilingual response.
            if (!aiText) {

                return generateResponse(
                    userMessage,
                    language
                );
            }

            return {
                success: true,

                data: {
                    response: aiText,

                    urgency: 'assessed',

                    recommended_facilities: [],

                    is_emergency: false,

                    suggestions:
                        generateResponse(
                            userMessage,
                            language
                        ).data.suggestions
                }
            };

        } catch (error) {

            console.error(
                'AI API Error:',
                error
            );

            // Fallback to multilingual mock AI
            return generateResponse(
                userMessage,
                language
            );
        }
    }


    // --------------------------------------------------------
    // DEMO MODE
    // --------------------------------------------------------

    return generateResponse(
        userMessage,
        language
    );
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getAIResponse,
    analyzeSymptoms,
    generateResponse,
    isEmergencyMessage
};