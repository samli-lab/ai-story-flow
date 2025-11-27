import { createRoot } from "react-dom/client";
import { LocaleProvider } from "@douyinfe/semi-ui";
import zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <LocaleProvider locale={zh_CN}>
    <App />
  </LocaleProvider>
);

