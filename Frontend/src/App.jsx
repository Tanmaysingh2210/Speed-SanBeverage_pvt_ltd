import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './Components/Navbar';
import Burger from './Components/Burger'
import Summary from './pages/Summary'
import Statisticks from './pages/Statisticks'
import Sku from './pages/SkuFolder/Sku';

function App() {

  return (
    <>
     
      <Navbar />
      <Burger />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/statisticks" element={<Statisticks />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/sku/*" element={<Sku />} />
      </Routes>
    </>
  );
}


export default App
