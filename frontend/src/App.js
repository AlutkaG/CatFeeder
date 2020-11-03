import React, { useState, useMemo } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import MyPets from "./components/MyPets/MyPets";
import DailyReport from "./components/DailyReport/DailyReport";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { UserContext } from "./context/UserContext";

function App() {
	const [user, setUser] = useState(null);

	const value = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<Router>
			<div className='App'>
				<div className='container'>
					<UserContext.Provider value={value}>
						<Switch>
							<Route exact path='/'>
								<Redirect to='login' />
							</Route>
							<Route path='/home' component={Home} />
							<Route path='/myPets' component={MyPets} />
							<Route path='/dailyReport' component={DailyReport} />
							<Route path='/register' component={Register} />
							<Route path='/login' component={Login} />
							<Route path='*'>
								<Redirect to='/login' />
							</Route>
						</Switch>
					</UserContext.Provider>
				</div>
			</div>
		</Router>
	);
}

export default App;
