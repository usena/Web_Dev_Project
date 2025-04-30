import './App.css'
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import CustomerHome from './components/Customer/customerHome';
import axios from "axios";
import { useEffect, useState } from 'react';

export default function App(){

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/api");
    console.log(response.data);
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
