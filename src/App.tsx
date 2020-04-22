import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Scroller from './components/Scroller';

const GlobalStyle = createGlobalStyle`
  .animate-slide {
    transition: all .3s ease-out;
  }
`;

const AppContainers = styled.div`
  background-color: #fff;
  width: 768px;
  height: 100vh;
  margin: auto;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

function App() {
  return (
    <AppContainers>
      <GlobalStyle />
      <Scroller images={[
        'https://picsum.photos/800/1000',
        'https://picsum.photos/1000/1000',
        'https://picsum.photos/1000/800',
      ]} />
    </AppContainers>
  );
}

export default App;
