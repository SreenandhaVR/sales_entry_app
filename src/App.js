import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SalesEntryForm from './pages/SalesEntryForm/SalesEntryForm';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalesEntryForm />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
