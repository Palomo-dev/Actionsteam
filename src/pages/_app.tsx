import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@/styles/base.css';

interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <BrowserRouter>
      <Component {...pageProps} />
    </BrowserRouter>
  );
};

export default App;
