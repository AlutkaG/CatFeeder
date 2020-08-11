import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
	const [ala, setAla] = useState("");

	useEffect(() => {
		fetch("192.168.1.22:8000")
			.then((res) => res.json())
			.then((data) => {
				setAla(data.body);
			});
	}, []);
	return (
		<div className='App'>
			<Navbar />
			{ala}
		</div>
	);
}

export default App;
