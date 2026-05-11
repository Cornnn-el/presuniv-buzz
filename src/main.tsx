import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AnnouncementProvider } from "@/context/AnnouncementContext";

createRoot(document.getElementById("root")!).render(
    <AnnouncementProvider>
        <App />
    </AnnouncementProvider>
);
