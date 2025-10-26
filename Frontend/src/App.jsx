import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './Components/Navbar';
import Burger from './Components/Burger'
import Summary from './pages/Summary';
import Statistics from './pages/Statistics';
import Sku from './pages/SkuFolder/Sku';
import Salesman from './pages/Salesman';
import PriceRoutes from './pages/pricesMarter/priceRoutes';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './Components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';


function App() {

  return (
    <>

      {/* <Navbar />
      <Burger />
      <div className='big-box'>
        <Routes>
          <Route path='signin' element={<SignInPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/sku/*" element={<Sku />} />
          <Route path="/salesman" element={<Salesman />} />
          <Route path="/prices/*" element={<PriceRoutes />} />
        </Routes>
      </div> */}


      <Routes>
        <Route path='/signin' index  element={<SignInPage />} /> 
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/*" element={<Dashboard />} />

        </Route>

      </Routes>


    </>
  );
}


export default App
