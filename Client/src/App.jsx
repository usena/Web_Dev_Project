import './App.css'
import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from './components/Customer/home';
//import Home from './components/Staff/home';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* All paths lead to Home for now */}
        <Route path="/" element={<Home />} />
        
        {/* Temporarily disabled auth routes */}
        {/* <Route path="/signup" element={<Signup/>} /> */}
        {/* <Route path="/signin" element={<Login />} /> */}
        {/* <Route path="/profile" element={<Profile/>}/> */}

        {/* Redirect everything else to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;