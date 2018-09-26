import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import React from 'react';
import EmbarkJS from 'Embark/EmbarkJS';
import DTwitter from 'Embark/contracts/DTwitter';
import DSportRank from 'Embark/contracts/DSportRank';
import Rankings from './components/Rankings';

window.EmbarkJS = EmbarkJS;
window.DTwitter = DTwitter;
window.DSportRank = DSportRank;

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
