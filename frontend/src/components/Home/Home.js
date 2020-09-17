import React from "react";

import Aux from "../../hoc/Aux";

import feed from "../../img/homeColor.png";

import "./Home.css";

const home = (props) => {
	return (
		<Aux>
			<div className='column right'>
				<img
					src={feed}
					alt='Pets'
					width='750px'
					style={{
						boxShadow: "10px 10px 75px 30px rgba(0, 0, 0, 0.64)",
						borderRadius: "100%",
					}}
				></img>
			</div>
			<div className='column left'>
				<div className='textBox1'>
					<div className='text1'>Are your pet hungry?</div>
				</div>
				<button className='pressButton' />
			</div>
			<div className='column center'>
				<div className='textBox2'>
					<div className='text2'>
						You can feed your pet by clicking on the button!
					</div>
				</div>
			</div>
		</Aux>
	);
};

export default home;
