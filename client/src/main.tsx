import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
import { Providers } from "@/app/providers";
import "./app/styles/global.scss";
import "./app/styles/theme.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>,
);
