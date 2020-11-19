import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsChevronCompactUp } from "react-icons/bs";

import "./SideNavbar.css";
import { Link } from "react-router-dom";

const SideNavbar = (props) => {
	const [temp, setTemp] = useState("No information");

	const onClose = (e) => {
		props.onClose && props.onClose(e);
	};

	useEffect(() => {
		const fetchData = async () => {
			const resultTemp = await axios("http://catfeeder.ddns.net/api/v1/temp");
			setTemp(resultTemp.data.temp.toFixed(2) + " ℃");
		};
		const interval = setInterval(() => {
			fetchData();
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	if (!props.show) {
		return null;
	}
	return (
		<div className='sidenav'>
			<Link to='/myPets'>My Pets</Link>
			<Link to='/dailyReport'>Daily Report</Link>
			<Link to='#'>About</Link>
			<div className='sideTemp'>
				Temperature:{" "}
				<div style={{ fontWeight: "bold", paddingTop: "2%" }}>{temp}</div>
			</div>
			<button className='sideCloseBtn' onClick={onClose}>
				<BsChevronCompactUp size='20px' />
			</button>
		</div>
	);
};

export default SideNavbar;
