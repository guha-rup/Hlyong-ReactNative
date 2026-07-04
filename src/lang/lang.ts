import { createApp } from 'vue';
import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import en from './i18n/eng.json';
import chi from './i18n/chi.json';

const app = createApp({});

const DEFAULT_LANG: string = 'eng';

const locales: Record<string, LocaleMessages<VueMessageType>> = {
  en,
  chi
};

const i18n = createI18n({
  locale: DEFAULT_LANG,
  messages: locales
});

app.use(i18n);

export default i18n;
