// AI Health Assistant routes

const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/aiService');
const asyncHandler = require('express-async-handler');


// ============================================================
// POST /api/ai/chat
// Chat with AI Health Assistant
// ============================================================

router.post(
    '/chat',
    asyncHandler(async (req, res) => {

        const {
            message,
            language = 'en',
            conversation_history = []
        } = req.body;

        if (!message) {
            res.status(400);
            throw new Error('Message is required');
        }

        if (message.length > 1000) {
            res.status(400);
            throw new Error(
                'Message too long (max 1000 characters)'
            );
        }

        const response = await getAIResponse(
            message,
            conversation_history,
            language
        );

        res.json(response);
    })
);


// ============================================================
// POST /api/ai/analyze-symptoms
// Analyze symptoms and provide guidance
// ============================================================

router.post(
    '/analyze-symptoms',
    asyncHandler(async (req, res) => {

        const {
            symptoms,
            duration,
            severity,
            language = 'en'
        } = req.body;

        if (!symptoms) {
            res.status(400);
            throw new Error(
                'Symptoms description is required'
            );
        }

        const fullDescription =
            `${symptoms}` +
            `${duration ? ` for ${duration}` : ''}` +
            `${severity ? `, severity: ${severity}` : ''}`;

        const response = await getAIResponse(
            fullDescription,
            [],
            language
        );

        res.json(response);
    })
);


// ============================================================
// POST /api/ai/emergency-check
// Check for emergency symptoms
// Supports English, Hindi and Kannada
// ============================================================

router.post(
    '/emergency-check',
    asyncHandler(async (req, res) => {

        const {
            message = '',
            language = 'en'
        } = req.body;

        const text = String(message).toLowerCase();


        // ========================================================
        // Emergency Keywords
        // ========================================================

        const emergencyKeywords = [

            // ----------------------------------------------------
            // ENGLISH
            // ----------------------------------------------------

            'chest pain',
            'difficulty breathing',
            'cannot breathe',
            'can not breathe',
            'not breathing',
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
            'heart attack',


            // ----------------------------------------------------
            // HINDI
            // ----------------------------------------------------

            'सीने में दर्द',
            'छाती में दर्द',
            'सीने में बहुत दर्द',
            'छाती में बहुत दर्द',

            'सांस लेने में परेशानी',
            'सांस लेने में दिक्कत',
            'सांस नहीं आ रही',
            'सांस नहीं ले पा रहा',
            'सांस नहीं ले पा रही',

            'बेहोश',
            'बेहोशी',
            'बेहोश हो गया',
            'बेहोश हो गई',

            'बहुत ज्यादा खून',
            'बहुत अधिक खून',
            'भारी रक्तस्राव',
            'खून बह रहा है',

            'स्ट्रोक',
            'दौरा',
            'मिर्गी का दौरा',

            'जहर',
            'ज़हर',
            'जहर खा लिया',
            'ज़हर खा लिया',

            'ओवरडोज',
            'दिल का दौरा',
            'हृदयाघात',

            'गंभीर दुर्घटना',
            'बहुत गंभीर दुर्घटना',


            // ----------------------------------------------------
            // KANNADA
            // ----------------------------------------------------

            'ಎದೆ ನೋವು',
            'ತೀವ್ರ ಎದೆ ನೋವು',
            'ಎದೆಯಲ್ಲಿ ನೋವು',

            'ಉಸಿರಾಟದ ತೊಂದರೆ',
            'ಉಸಿರಾಟಕ್ಕೆ ತೊಂದರೆ',
            'ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ',
            'ಉಸಿರಾಡಲು ಆಗುತ್ತಿಲ್ಲ',

            'ಪ್ರಜ್ಞಾಹೀನ',
            'ಪ್ರಜ್ಞೆ ತಪ್ಪಿದೆ',
            'ಪ್ರಜ್ಞೆ ತಪ್ಪಿದ',

            'ತೀವ್ರ ರಕ್ತಸ್ರಾವ',
            'ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ',
            'ರಕ್ತಸ್ರಾವ',

            'ಸ್ಟ್ರೋಕ್',
            'ಸೆಳೆತ',
            'ಅಪಸ್ಮಾರ',

            'ವಿಷ',
            'ವಿಷ ಸೇವನೆ',

            'ಓವರ್‌ಡೋಸ್',
            'ಹೃದಯಾಘಾತ',

            'ತೀವ್ರ ಅಪಘಾತ',
            'ಗಂಭೀರ ಅಪಘಾತ'
        ];


        // ========================================================
        // Check Emergency
        // ========================================================

        const isEmergency = emergencyKeywords.some(
            keyword =>
                text.includes(keyword.toLowerCase())
        );


        // ========================================================
        // Language-specific emergency message
        // ========================================================

        let emergencyMessage = null;


        // --------------------------------------------------------
        // HINDI
        // --------------------------------------------------------

        if (language === 'hi') {

            emergencyMessage = isEmergency
                ? 'यह एक आपातकालीन स्थिति हो सकती है। कृपया तुरंत 108/112 पर कॉल करें या नजदीकी जिला अस्पताल जाएँ।'
                : null;
        }


        // --------------------------------------------------------
        // KANNADA
        // --------------------------------------------------------

        else if (language === 'kn') {

            emergencyMessage = isEmergency
                ? 'ಇದು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿರಬಹುದು. ದಯವಿಟ್ಟು ತಕ್ಷಣ 108/112 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ.'
                : null;
        }


        // --------------------------------------------------------
        // ENGLISH
        // --------------------------------------------------------

        else {

            emergencyMessage = isEmergency
                ? 'This appears to be an emergency. Please call 108/112 immediately or go to the nearest District Hospital.'
                : null;
        }


        // ========================================================
        // Response
        // ========================================================

        res.json({

            success: true,

            data: {

                is_emergency: isEmergency,

                message: emergencyMessage,

                recommendations: isEmergency
                    ? ['DISTRICT_HOSPITAL']
                    : []
            }
        });
    })
);


module.exports = router;