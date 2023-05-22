import { createRoot } from "react-dom/client";

import Main from "./views/Main";

const App = () => {
  return (
    <Main />
  )
}

const rootElement: HTMLElement = document.querySelector("#main");
const root = createRoot(rootElement);

root.render(
  <App />
);