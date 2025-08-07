import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: #171717;
    background: #fff;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    color: inherit;
  }

  [aria-labelledby="language-select-label"] .mantine-Select-option:hover, [aria-labelledby="mobile-language-select-label"] .mantine-Select-option:hover {
    background-color: #171717;
  }
`;