import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './Components/Navbar';
import Burger from './Components/Burger'
import Summary from './pages/Summary';
import Statistics from './pages/Statistics';
import Sku from './pages/SkuFolder/Sku';
import Salesman from './pages/Salesman';

function App() {

  return (
    <>
     
      <Navbar />
      <Burger />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/sku/*" element={<Sku />} />
        <Route path="/salesman" element={<Salesman />} />
      </Routes>
    </>
  );
}


export default App
