import React from "react";

import Aux from "../../hoc/Aux";

import pets from "../../img/pets_home.png";

import "./Home.css";

const home = (props) => {
	return (
		<Aux>
			<div className='background'>
				<div className='column left'>
					<img width='1000px' src={pets} alt={"Pets"} />
				</div>
				<div className='column right'>
					<div className='pressText'>Press to feed:</div>

					<button className='pressButton' />
				</div>
			</div>
		</Aux>
	);
};

export default home;
