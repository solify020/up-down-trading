import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SignUp from './component/auth/SignUp'
import Login from './component/auth/Login';
import Home from './pages/Home';
import Footer from './component/footer';
import Balance from './pages/Balance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/login", "/signup", "/"].includes(location.pathname);

  return (
    <div className='w-full min-h-screen bg-[#1d0630]'>
      <div className='w-full h-[calc(100vh-4rem)] overflow-y-auto'>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/login' Component={Login} />
          <Route path='/signup' Component={SignUp} />
          <Route path='/home' Component={Home} />
          <Route path='/balance' Component={Balance} />
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