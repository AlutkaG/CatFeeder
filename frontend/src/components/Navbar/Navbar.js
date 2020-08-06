import React from "react";

import Aux from "../../hoc/Aux";

import "./Navbar.css";

const navbar = (props) => {
	return (
		<Aux>
			<div className='sideNav'>
				<p className='appName'>Pet Feeder</p>
				<div className='sideNavLinks'>
					<a href='/'>Home</a>
					<a href='/'>My pets</a>
					<a href='/'>Dose</a>
					<a href='/'>Camera</a>
					<a href='/'>Settings</a>
				</div>
			</div>
		</Aux>
	);
};

export default navbar;
