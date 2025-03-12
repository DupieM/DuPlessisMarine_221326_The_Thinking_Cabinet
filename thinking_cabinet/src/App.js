import './App.css';
import { Route, Routes } from 'react-router-dom';
import Authentications from './Pages/Authentication/Authentication';
import Home from './Pages/Home/Home';

import Profile from './Pages/Profile/Profile';
import CabinetAIPre from './Pages/CabinetAI/SetUp/CabinetAI-pre';
import CabinetAIPost from './Pages/CabinetAI/Reslut/CabinetAI-post';
import WunderchatPre from './Pages/Wunderchat/Setup/Wunderchat-pre';
import WunderchatPost from './Pages/Wunderchat/Result/Wunderchat-post';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/authentication" element={<Authentications />} />
          <Route path="/" element={<Home />} />
          
          <Route path="/wunderchat-pre" element={<WunderchatPre />} />
          <Route path="/cabinetAI-pre" element={<CabinetAIPre />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/wunderchat-post" element={<WunderchatPost />} />
          <Route path="/cabinetAI-post" element={<CabinetAIPost />} />
        </Routes>

        <h1> The thinking cabinet </h1>

      </header>
    </div>
  );
}

export default App;
