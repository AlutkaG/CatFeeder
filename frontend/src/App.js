import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Temperature from "./components/Temperature/Temperature";
import StartPage from "./components/StartPage/StartPage";
import Home from "./components/Home/Home";

function App() {
	const [ala, setAla] = useState([{}]);

	return (
		<Router>
			<div className='App'>
				<Navbar />
				<div className='container'>
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/temperature' component={Temperature} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
