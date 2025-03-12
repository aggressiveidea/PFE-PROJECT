import React from 'react'
import Dailyquiz from '../components/forQuiz/Dailyquiz'
import HeroQuiz from '../components/forQuiz/HeroQuiz'
import DemoPage from '../components/forQuiz/Demo'
function QuizPage() {
  return (
    <div>
         <HeroQuiz></HeroQuiz>
        <Dailyquiz></Dailyquiz>
        <DemoPage></DemoPage>
    </div>
  )
}

export default QuizPage
