/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_MIXPANEL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
