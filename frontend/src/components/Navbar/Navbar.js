import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import axios from "axios";

import Aux from "../../hoc/Aux";

import "./Navbar.css";

const Navbar = (props) => {
	const [red, setRed] = useState(0);
	const [blue, setBlue] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const resultRed = await axios("http://catfeeder.ddns.net/api/v1/red");
			setRed(resultRed.data.red);
			const resultBlue = await axios("http://catfeeder.ddns.net/api/v1/blue");
			setBlue(resultBlue.data.blue);
		};
		const interval = setInterval(() => {
			fetchData();
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<Aux>
			<div className='topNav'>
				<div className='row'>
					<div
						className='topNavLinksRight'
						style={{
							width: "20%",
							float: "left",
							textDecoration: "none",
							textAlign: "left",
						}}
					>
						<Link to='/' className='appName' style={{ fontSize: "50px" }}>
							Pets Feeder
						</Link>
					</div>
					<div
						className='topNavLinksRight'
						style={{ width: "50%", float: "left", paddingTop: "6px" }}
					>
						{blue == 1 ? (
							<FaCircle
								size='40px'
								style={{ color: "#3399ff", paddingRight: "20px" }}
							/>
						) : null}
						{red == 1 ? (
							<FaCircle size='40px' style={{ color: "#ff0000" }} />
						) : null}
					</div>
					<div
						className='topNavLinksRight'
						style={{ width: "30%", float: "right", paddingTop: "8px" }}
					>
						<Link to='/myPets'>My pets </Link>
						<Link to='/dailyReport'>Daily Report</Link>
						<Link to='#'>About </Link>
					</div>
				</div>
			</div>
		</Aux>
	);
};

export default Navbar;
