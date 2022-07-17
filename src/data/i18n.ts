import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true, // TODO remove for production
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          compactWH: {
            whName: 'Name',
            eggsTotal: 'Total eggs',
            eggsToday: 'Eggs added today',
            trolleyCount: 'Trolleys',
            temp: 'Temperature',
            humidity: 'Humidity',
            pressure: 'Pressure',
            voc: 'VOC',
          },
        },
      },
    },
  })
  .then()
