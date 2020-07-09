import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import HomeComponent from './Components/Home/Home'
import MeditationForm from './Components/Meditation/MeditationForm'
import videosForm from './Components/Videos/videosForm'
import MindSetForm from './Components/Mindset/MindSetForm'
import NutritionForm from './Components/Nutrition/NutritionForm'
import WaterMark from './Components/WaterMark/watermark'
import Profile from './Components/Profile/profile'

function App() {
  return (
   <Router>
      <div>
      <Navbar />
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/meditation/:category" component={MeditationForm} />
      <Route exact path="/videos/:category" component={videosForm} />
      <Route exact path="/mindset" component={MindSetForm} />
      <Route exact path="/nutrition" component={NutritionForm} />
      <Route exact path="/watermarks" component={WaterMark} />
      <Route exact path="/profile" component={Profile} />
    </div>
   </Router>
  );
}

export default App;
