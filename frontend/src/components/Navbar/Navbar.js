import React from "react";
import {
	FaHome,
	FaPaw,
	FaTemperatureLow,
	FaClock,
	FaVideo,
	FaQuestion,
	FaCog,
} from "react-icons/fa";

import Aux from "../../hoc/Aux";

import "./Navbar.css";

const navbar = (props) => {
	return (
		<Aux>
			<div className='sideNav'>
				<p className='appName'>Pet Feeder</p>
				<div className='sideNavLinks'>
					<a href='/'>
						<FaHome style={{ paddingRight: "20px", color: " #e0afa0" }} />
						Home
					</a>
					<a href='/'>
						<FaPaw style={{ paddingRight: "20px", color: " #e0afa0" }} />
						My pets
					</a>
					<a href='/'>
						<FaTemperatureLow
							style={{ paddingRight: "20px", color: " #e0afa0" }}
						/>
						Temperature
					</a>
					<a href='/'>
						<FaClock style={{ paddingRight: "20px", color: " #e0afa0" }} />
						Dose
					</a>
					<a href='/'>
						<FaVideo style={{ paddingRight: "20px", color: " #e0afa0" }} />
						Camera
					</a>
					<a href='/'>
						<FaQuestion style={{ paddingRight: "20px", color: " #e0afa0" }} />{" "}
						About app
					</a>
					<a href='/'>
						<FaCog style={{ paddingRight: "20px", color: " #e0afa0" }} />
						Settings
					</a>
				</div>
				<div className='footerNav'>
					©{new Date().getFullYear()} <strong>Pet Feeder</strong>
					<br />
					<div className='footerLink'>
						<a href='/' style={{ textDecoration: "none", color: "white" }}>
							Contact
						</a>
					</div>
				</div>
			</div>
		</Aux>
	);
};

export default navbar;
