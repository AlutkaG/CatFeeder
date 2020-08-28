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
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Aux from "../../hoc/Aux";
import Temperature from "../Temperature/Temperature";

import "./Navbar.css";

const navbar = (props) => {
	return (
		<Aux>
			<div className='sideNav'>
				<p className='appName'>Pet Feeder</p>
				<div className='sideNavLinks'>
					<a href='/'>
						<FaHome style={{ paddingRight: "20px", color: " #CD8987" }} />
						Home
					</a>
					<a href='/'>
						<FaPaw style={{ paddingRight: "20px", color: " #CD8987" }} />
						My pets
					</a>
					<Link to='/temperature'>
						<FaTemperatureLow
							style={{ paddingRight: "20px", color: " #CD8987" }}
						/>
						Temperature
					</Link>
					<a href='/'>
						<FaClock style={{ paddingRight: "20px", color: " #CD8987" }} />
						Dose
					</a>
					<a href='/'>
						<FaVideo style={{ paddingRight: "20px", color: " #CD8987" }} />
						Camera
					</a>
					<a href='/'>
						<FaQuestion style={{ paddingRight: "20px", color: " #CD8987" }} />{" "}
						About app
					</a>
					<a href='/'>
						<FaCog style={{ paddingRight: "20px", color: " #CD8987" }} />
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
