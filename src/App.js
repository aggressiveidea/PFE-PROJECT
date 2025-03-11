import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/forHeader/header";
import QuizPage from "./views/QuizPage";
import LevelsComponent from "./components/forQuiz/LevelsComponent";
function App() {
  return (
   
      <div>
       <Header></Header>
       <QuizPage></QuizPage>
      </div>
     
  );
}

export default App;


