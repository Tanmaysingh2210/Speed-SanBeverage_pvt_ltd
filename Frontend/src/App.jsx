import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './Components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from "react-hot-toast";
import { PublicRoute } from './Components/PublicRoute';


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
        <Route path='/signin' index element={<PublicRoute> <SignInPage /></PublicRoute>} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/*" element={<Dashboard />} />

        </Route>

      </Routes>
      {/* <Toaster position="top-center"  toastOptions={{ duration: 3000 }} /> */}


      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "14px 20px 14px 26px",
            overflow: "hidden",
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "0.9rem",
            maxWidth: "320px",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
              overflow: "hidden",

            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
              overflow: "hidden",

            },
          },
        }}

      />


    </>
  );
}


export default App
