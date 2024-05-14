import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SiteBanner from './layouts/Banner';
import SiteNavbar from './layouts/Navbar';
import SiteFooter from './layouts/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Login from './pages/Login';


function App() {
  return (
    <div className='App'>
      <SiteBanner />
      <SiteNavbar />
      <div className='Content'>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
      <SiteFooter />
    </div>
  );
}

export default App;
