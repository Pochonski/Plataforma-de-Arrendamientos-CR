/// <reference types="vite/client" />

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

console.log(
  '%c🏡 Plataforma Arrendamientos CR',
  'color:#2563eb;font-size:22px;font-weight:bold;font-family:monospace;letter-spacing:1px'
);
console.log(
  '%c  Arquitectura de microservicios — cada uno tan independiente como tico en fila del banco.',
  'color:#6b7280;font-size:12px;font-style:italic'
);
console.log(
  '%c  ¿Se cayó un micro? El resto sigue. Ese era el punto. 🤙\n' +
  '  Si ves errores aquí abajo, probablemente el profe apagó algo. Normal.',
  'color:#10b981;font-size:12px;font-weight:600'
);

createRoot(document.getElementById("root")!).render(<App />);
