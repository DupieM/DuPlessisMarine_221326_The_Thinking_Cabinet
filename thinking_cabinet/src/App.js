import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Authentications from './Pages/Authentication/Authentication';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import CabinetAIPre from './Pages/CabinetAI/SetUp/CabinetAI-pre';
import BasicNavbar from './componements/navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router';
import Wunderchat from './Pages/Wunderchat/Wunderchat';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Authentications />} />
        <Route path="/wunderchat" element={<Wunderchat />} />
        <Route
          element={
            <>
              <BasicNavbar />
              <Outlet />
            </>
          }
        >
            <Route path='/home' element= { <Home />} />
            <Route path='/cabinetAI-pre' element={<CabinetAIPre />} />
            <Route path='/profile' element={<Profile  />} />
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;
