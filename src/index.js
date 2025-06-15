import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import cookies from "js-cookie";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { SnackbarProvider } from 'notistack';
import { Suspense } from 'react';

// تهيئة i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["ar", "en"],
    fallbackLng: "en", // ← اللغة الافتراضية العربية
    detection: {
      order: ["cookie"], // ← الكشف فقط من الكوكي
      caches: ["cookie"], // ← حفظ اللغة في الكوكي
    },
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
  });

// تحقق إن لم يتم تحديد اللغة من الكوكيز → حدد العربية
const currentLang = cookies.get("i18next");
if (!currentLang) {
  i18n.changeLanguage("ar");
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
}

// ضبط اللغة والاتجاه عند التغيير
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// إعداد cache لـ RTL أو LTR
const cacheRtl = createCache({
  key: cookies.get("i18next") === "ar" ? "muirtl" : "muiltr",
  stylisPlugins: [prefixer, rtlPlugin],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CacheProvider value={cacheRtl}>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<h1></h1>}>
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
          </Suspense>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CacheProvider>
);
