import App from "./components/App.js";
import { createRoot } from "react-dom/client";
import './styles.css';
const root = createRoot(document.getElementById("react-container"));
root.render(<App />);