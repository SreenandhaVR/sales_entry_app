import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SalesEntry from './pages/SalesEntryForm/SalesEntry'
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Route for SalesEntry component */}
            <Route path="/" element={<SalesEntry />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
