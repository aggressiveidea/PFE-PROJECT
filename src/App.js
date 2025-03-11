import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Signup from "./views/Signup";
import Header from "./components/forHeader/header";
import QuizPage from "./views/QuizPage";

function App() {
  return (
   
      <div>
       <Header></Header>
       <QuizPage></QuizPage>
      
      </div>
     
  );
}

export default App;


