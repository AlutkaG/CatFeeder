import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle, FaUser } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";

import Aux from "../../hoc/Aux";

import "./Navbar.css";

const Navbar = (props) => {
	const [red, setRed] = useState(0);
	const [blue, setBlue] = useState(0);
	const [temp, setTemp] = useState("No information");
	const usr = Cookies.get("user");

	useEffect(() => {
		const fetchData = async () => {
			const resultRed = await axios(
				"http://catfeeder.ddns.net/api/v1/red/" + usr
			);
			setRed(resultRed.data.red);
			const resultBlue = await axios(
				"http://catfeeder.ddns.net/api/v1/blue/" + usr
			);
			setBlue(resultBlue.data.blue);
			const resultTemp = await axios("http://catfeeder.ddns.net/api/v1/temp");
			setTemp(resultTemp.data.temp.toFixed(2) + " ℃");
		};
		const interval = setInterval(() => {
			fetchData();
		}, 2000);
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
						<Link to='/home' className='appName' style={{ fontSize: "50px" }}>
							Pets Feeder
						</Link>
					</div>
					<div
						className='topNavLinksRight'
						style={{
							width: "30%",
							float: "left",
							paddingTop: "6px",
						}}
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
						sclassName='topNavLinksRight'
						style={{
							width: "10%",
							float: "left",
							paddingTop: "16px",
							textAlign: "center",
							fontSize: "20px",
							color: "#b3ecff",
						}}
					>
						{temp}
					</div>
					<div
						className='topNavLinksRight'
						style={{ width: "40%", float: "right", paddingTop: "8px" }}
					>
						<Link to='/myPets'>My pets </Link>
						<Link to='/dailyReport'>Daily Report</Link>
						<Link to='#'>About </Link>
						<Link to='#'>
							<FaUser />

							<MdKeyboardArrowDown />
						</Link>
					</div>
				</div>
			</div>
		</Aux>
	);
};

export default Navbar;
