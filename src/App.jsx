import React from 'react';
import Main from "./components/Main/Main";
import ContextProvider from './context/context';

function App() {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
}

export default App;

