import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Signup from "./views/Signup";
import Header from "./components/forHeader/header";
import IndexedSearch from './components/forSearchPage/indexedSearch'
function App() {
  return (
   
      <div>
        
     
      <IndexedSearch></IndexedSearch>
      </div>
     
  );
}

export default App;


