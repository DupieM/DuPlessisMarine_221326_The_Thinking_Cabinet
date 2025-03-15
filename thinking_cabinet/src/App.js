import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authentications from './Pages/Authentication/Authentication';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import CabinetAIPre from './Pages/CabinetAI/SetUp/CabinetAI-pre';
import CabinetAIPost from './Pages/CabinetAI/Reslut/CabinetAI-post';
import WunderchatPre from './Pages/Wunderchat/Setup/Wunderchat-pre';
import WunderchatPost from './Pages/Wunderchat/Result/Wunderchat-post';
import BasicNavbar from './componements/navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/authentication" element={<Authentications />} />
        <Route
          element={
            <>
              <BasicNavbar />
              <Outlet />
            </>
          }
        >
            <Route path='/' element= { <Home />} />
            <Route path='/cabinetAI-pre' element={<CabinetAIPre />} />
            <Route path='/profile' element={<Profile  />} />
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;
