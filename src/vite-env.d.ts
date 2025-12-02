/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AI_OUTLINE_API_URL: string;
  readonly VITE_NODE_AI_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

