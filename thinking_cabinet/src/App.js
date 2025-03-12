import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authentications from './Pages/Authentication/Authentication';
import Home from './Pages/Home/Home';

import Profile from './Pages/Profile/Profile';
import CabinetAIPre from './Pages/CabinetAI/SetUp/CabinetAI-pre';
import CabinetAIPost from './Pages/CabinetAI/Reslut/CabinetAI-post';
import WunderchatPre from './Pages/Wunderchat/Setup/Wunderchat-pre';
import WunderchatPost from './Pages/Wunderchat/Result/Wunderchat-post';
import Navbar from './componements/navbar';


function App() {
  return (
      <div>
          <Navbar />
          <Routes>
            <Route path="/authentication" element={<Authentications />} />
            <Route path="/" element={<Home />} />

            <Route path="/wunderchat-pre" element={<WunderchatPre />} />
            <Route path="/cabinetAI-pre" element={<CabinetAIPre />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/wunderchat-post" element={<WunderchatPost />} />
            <Route path="/cabinetAI-post" element={<CabinetAIPost />} />
          </Routes> 
      </div>
  );
}

export default App;
