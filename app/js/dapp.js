import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import React from 'react';
import EmbarkJS from '../../src/embarkArtifacts/embarkjs';
//import DTwitter from 'Embark/contracts/DTwitter';
import DSportRank from '../../src/embarkArtifacts/contracts/DSportRank';


window.EmbarkJS = EmbarkJS;
//window.DTwitter = DTwitter;
window.DSportRank = DSportRank;

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
