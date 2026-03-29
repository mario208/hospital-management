import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';  // instead of react dom renders 
import { Provider } from 'react-redux';
import store from './redux/store'; // get the store -> 
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}> {/* access redux (use selector & use dispatch) }*/}  
      <App />
    </Provider>
  </StrictMode>
);
