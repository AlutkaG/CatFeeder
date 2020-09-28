import React from "react";
import { FaCog } from "react-icons/fa";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Aux from "../../hoc/Aux";
import Temperature from "../Temperature/Temperature";

import "./Navbar.css";

const navbar = (props) => {
	return (
		<Aux>
			<div className='topNav'>
				<div
					className='topNavLinks'
					style={{ float: "left", textDecoration: "none" }}
				>
					<Link to='/' className='appName' style={{ fontSize: "50px" }}>
						Pets Feeder
					</Link>
				</div>
				<div className='topNavLinks'>
					<Link to='/myPets'>My pets </Link>
					<Link to='#'>About </Link>
					<Link to='#'>Settings</Link>
					<Link to='#'>Log out</Link>
				</div>
			</div>
		</Aux>
		/*
		<Aux>
			<div className='sideNav'>
				<p className='appName'>Pet Feeder</p>
				<div className='sideNavLinks'>
					<a href='/'>
						<FaHome style={{ paddingRight: "20px", color: " #6E0D25" }} />
						Home
					</a>
					<a href='/'>
						<FaPaw style={{ paddingRight: "20px", color: " #6E0D25" }} />
						My pets
					</a>
					<Link to='/temperature'>
						<FaTemperatureLow
							style={{ paddingRight: "20px", color: " #6E0D25" }}
						/>
						Temperature
					</Link>
					<a href='/'>
						<FaClock style={{ paddingRight: "20px", color: " #6E0D25" }} />
						Dose
					</a>
					<a href='/'>
						<FaVideo style={{ paddingRight: "20px", color: " #6E0D25" }} />
						Camera
					</a>
					<a href='/'>
						<FaQuestion style={{ paddingRight: "20px", color: " #6E0D25" }} />{" "}
						About app
					</a>
					<a href='/'>
						<FaCog style={{ paddingRight: "20px", color: " #6E0D25" }} />
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
		*/
	);
};

export default navbar;
