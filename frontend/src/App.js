import './App.css';
import UserRegister from './pages/user/Register.jsx';
import UserLogin from './pages/user/Login.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';
import NavbarComponent from './components/Navbar.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Test from './pages/Test.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
    <NavbarComponent/>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/user' element={<UserPage/>}></Route>
        <Route path='/user/login' element={<UserLogin/>}></Route>
        <Route path='/user/register' element={<UserRegister/>}></Route>
        <Route path='/admin' element={<Dashboard/>}></Route>
        <Route path='/admin/login' element={<AdminLogin/>}></Route>
        <Route path='/test' element={<Test/>}></Route>
      </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;
