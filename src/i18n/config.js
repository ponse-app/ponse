import i18next from "i18next";

import { initReactI18next } from "react-i18next";
//import Backend from 'i18next-http-backend';

i18next
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    //.use(Backend)
    .use(initReactI18next)
    .init({
        
        // Default language
        lng: "fi",

        // If translation is missing use this
        fallbackLng: "fi",

        // Debug info in browser console
        debug: true,

        /* Guide said this is safe to turn off
           because react keeps this safe.
           Normally it might enable cross site
           scripting when false.
        */
        interpolation: {
            escapeValue: true,
        },
        resources: {
            'fi': {translation: require('../../public/locales/fi/translation.json')},
            'en': {translation: require('../../public/locales/en/translation.json')}
        },
    });

export default i18next;
