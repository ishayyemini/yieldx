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
          signIn: {
            header: 'Sign In',
            submit: 'Sign In',
            ERR_USER_DOESNT_EXIST: "User doesn't exist",
            ERR_NETWORK: 'Network error',
          },
          dashboard: {
            Name: 'Name',
            Type: 'Type',
            AmountTotal: 'Total Eggs',
            AmountToday: 'Today Eggs',
            Temp: 'Temp',
            Humidity: 'Humidity',
            Baro: 'Pressure',
            CO2: 'CO2',
          },
          warehouseView: {
            empty: 'Warehouse not found',
            House: 'House',
            EggStorage: 'Egg Storage',
            'Loading Ramp': 'Loading Ramp',
            Garbage: 'Garbage',
            Unknown: 'Unknown',
            AmountTotal: 'Total Eggs',
            AmountToday: 'Today Eggs',
            Trolleys: 'Trolleys',
            sensors: {
              title: 'Sensors History',
              0: 'Temperature',
              2: 'Humidity',
              3: 'Pressure',
              8: 'CO2',
            },
            eggs: {
              chart: 'Daily Eggs',
              title: 'Daily Eggs History',
            },
          },
          labelTrolleys: {
            all: 'All',
            label: 'Text to display on trolley',
            flock: { label: 'Flock', placeholder: 'Choose flock' },
            sourceWH: {
              label: 'Source warehouses',
              placeholder: 'Choose warehouses',
            },
            destWH: {
              label: 'Destination warehouses',
              placeholder: 'Choose warehouses',
            },
            rolling: 'Rolling days (older than)',

            filterDate: 'Filter by date?',
            date: 'Date',
            success: 'Successfully labelled trolleys: ({{trolleys}} total)',
            successButton: 'Done',
            errors: {
              label1: {
                required: 'First line of label is a required field',
                max: 'First line of label must be at most 39 characters',
              },
              label2: {
                max: 'Second line of label must be at most 39 characters',
              },
              flock: {
                required: 'Flock is a required field',
              },
              sourceWH: {
                min: 'At least one source warehouse must be selected',
              },
              destWH: {
                min: 'At least one destination warehouse must be selected',
              },
            },
          },
        },
      },
    },
  })
  .then()
