import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import HomeComponent from './Components/Home/Home'
import MeditationForm from './Components/Meditation/MeditationForm'
import Breath_Work from './Components/Videos/Breath_Work'
import Challenges from './Components/Videos/Challenges'
import Motivation from './Components/Videos/Motivation';
import Mobility from './Components/Videos/Mobility'
import Exercise from './Components/Videos/Exercise'
import MindSetForm from  './Components/Mindset/MindSetForm'
import NutritionForm from './Components/Nutrition/NutritionForm'
import WaterMark from './Components/WaterMark/watermark'
import Profile from './Components/Profile/profile'

function App() {
  return (
   <Router>
      <div>
      <Navbar />
      <Route exact path="/PUSH" component={HomeComponent} />
      <Route exact path="/meditation/:category" component={MeditationForm} />
      <Route exact path="/videos/breath_work" component={Breath_Work} />
      <Route exact path="/videos/challenges" component={Challenges} />
      <Route exact path="/videos/mobility" component={Mobility} />
      <Route exact path="/videos/exercise" component={Exercise} />
      <Route exact path="/videos/motivation" component={Motivation} />
      <Route exact path="/mindset" component={MindSetForm} />
      <Route exact path="/nutrition" component={NutritionForm} />
      <Route exact path="/watermarks" component={WaterMark} />
      <Route exact path="/profile" component={Profile} />
    </div>
   </Router>
  );
}

export default App;
