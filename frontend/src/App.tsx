import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SignUp from './component/auth/SignUp'
import Login from './component/auth/Login';
import Home from './pages/Home';
import Footer from './component/footer';
import Balance from './pages/Balance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Bet from './pages/Bet';
import Market from './pages/Market';
import History from './pages/History';

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/login", "/signup", "/", "/verify"].includes(location.pathname);

  return (
    <div className='w-full min-h-screen bg-[#1d0630]'>
      <div className='w-full h-[calc(100vh-4rem)] overflow-y-auto'>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/login' Component={Login} />
          <Route path='/signup' Component={SignUp} />
          <Route path='/home' Component={Home} />
          <Route path='/market' Component={Market} />
          <Route path='/history' Component={History} />
          <Route path='/bet' Component={Bet} />
          <Route path='/balance' Component={Balance} />
          <Route path='/verify' Component={Verify} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;