import { createRoot } from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react';

import Main from "./views/Main";

const App = () => {
  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  )
}

const rootElement: HTMLElement = document.querySelector("#main");
const root = createRoot(rootElement);

root.render(
  <App />
);