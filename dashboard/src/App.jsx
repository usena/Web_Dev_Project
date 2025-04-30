import './App.css'
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import CustomerHome from './components/Customer/customerHome';
import axios from "axios";
import { useEffect, useState } from 'react';

export default function App(){
  const [count, setCount] = useState(0);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <CustomerHome/>
    </>
  )
};
