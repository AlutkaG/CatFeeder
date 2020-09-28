import React, { useEffect, useState } from "react";
import axios from "axios";

import Aux from "../../hoc/Aux";

import feed from "../../img/homeColor.png";

import "./Home.css";

function Home() {
	const [isClicked, setIsClicked] = useState(0);

	useEffect(() => {
		console.log(isClicked);
		if (isClicked == 1) {
			const fetchData = async () => {
				const result = await axios("http://catfeeder.ddns.net/api/v1/activate");
			};

			fetchData();
			setIsClicked(0);
		}
	});

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
					<div className='text1'>Is your pet hungry?</div>
				</div>
				<button className='pressButton' onClick={() => setIsClicked(1)} />
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
}

export default Home;
