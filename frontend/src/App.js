import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
	const [ala, setAla] = useState([{}]);

	useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => console.log(data));
	});
	return (
		<div className='App'>
			{/*<Navbar />*/}
			<p> Cos powinno tu byc: {ala}</p>
		</div>
	);
}

export default App;
