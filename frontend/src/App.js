import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import MyPets from "./components/MyPets/MyPets";

function App() {
	return (
		<Router>
			<div className='App'>
				<Navbar />
				<div className='container'>
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/myPets' component={MyPets} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
