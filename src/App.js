import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import SalesEntry from './pages/SalesEntryForm/SalesEntry';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <SalesEntry />
      </div>
    </Provider>
  );
}

export default App;