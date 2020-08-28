import React from "react";
import { FaPaw } from "react-icons/fa";

import Aux from "../../hoc/Aux";

import "./StartPage.css";

const startPage = (props) => {
	return (
		<Aux>
			<div>Pet Feeder</div>
			<FaPaw />
			<button className='btn'>Home</button>
		</Aux>
	);
};

export default startPage;
