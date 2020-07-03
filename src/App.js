import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import HomeComponent from './Components/Home/Home'
import MeditationForm from './Components/Meditation/MeditationForm'
import videosForm from './Components/Videos/videosForm'
import MindSetForm from './Components/Mindset/MindSetForm'

function App() {
  return (
   <Router>
      <div>
      <Navbar />
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/meditation/:category" component={MeditationForm} />
      <Route exact path="/videos/:category" component={videosForm} />
      <Route exact path="/mindset" component={MindSetForm} />
    </div>
   </Router>
  );
}

export default App;
