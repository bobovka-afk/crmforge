import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'

const saved = localStorage.getItem('crmforge-locale')

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: saved ?? 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
})

export default i18n

export function setLocale(locale: 'ru' | 'en') {
  localStorage.setItem('crmforge-locale', locale)
  void i18n.changeLanguage(locale)
}
