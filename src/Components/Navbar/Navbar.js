import React from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  const Happiness = "Happiness";
  const Health = "Health";
  const Wise = "Wise";
  const breath_work = "breath_work";
  const challenges = "challenges";
  const exercise = "exercise";
  const mobility = "mobility";
  const motivation = "motivation";
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand ml-5 " to="/">
        PUSH
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ml-auto mr-5 pr-3 text-center">
          <li className="nav-item">
            <Link className="nav-link" to={`/mindset`}>
              MindSet
            </Link>
          </li>

          <li className="nav-item dropdown pl-2">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Meditation
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <Link className="dropdown-item" to={`/meditation/${Health}`}>
                Health
              </Link>
              <Link className="dropdown-item" to={`/meditation/${Happiness}`}>
                Happiness
              </Link>
              <Link className="dropdown-item" to={`/meditation/${Wise}`}>
                Wise
              </Link>
            </div>
          </li>
          <li className="nav-item dropdown pl-2">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Vidoes
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink1"
            >
               <Link className="dropdown-item" to={`/videos/${breath_work}`}>
                Breath Work
              </Link>
              <Link className="dropdown-item" to={`/videos/${challenges}`}>
                Challenges
              </Link>
              <Link className="dropdown-item" to={`/videos/${exercise}`}>
                 Exercise
              </Link>
              <Link className="dropdown-item" to={`/videos/${mobility}`}>
                Mobility
              </Link>
              <Link className="dropdown-item" to={`/videos/${motivation}`}>
                Motivation
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
