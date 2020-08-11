import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
	const [ala, setAla] = useState("");

	useEffect(() => {
		fetch("192.168.1.22:8000/time")
			.then((res) => res.json())
			.then((data) => {
				setAla(data.time);
			});
	}, []);
	return (
		<div className='App'>
			{/*<Navbar />*/}
			<p> Cos powinno tu byc: {ala}</p>
		</div>
	);
}

export default App;
