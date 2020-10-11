import React, { useEffect, useState } from "react";
import axios from "axios";

import Aux from "../../hoc/Aux";

import feed from "../../img/homeColor.png";

import "./Home.css";

function Home() {
	const [isClicked, setIsClicked] = useState(0);

	useEffect(() => {
		if (isClicked == 1) {
			const fetchData = async () => {
				const result = await axios("http://catfeeder.ddns.net/api/v1/activate");
			};

			fetchData();
			setIsClicked(0);
			console.log(isClicked);
		}
	});

	return (
		<div className='row'>
			<div className='columnRightHome'>
				<img
					src={feed}
					alt='Pets'
					width='750px'
					style={{
						boxShadow: "10px 10px 75px 30px rgba(0, 0, 0, 0.64)",
						borderRadius: "100%",
					}}
				/>
			</div>
			<div className='columnLeftHome'>
				<div className='textBox1'>
					<div className='text1'>Is your pet hungry?</div>
				</div>
				<button className='pressButton' onClick={() => setIsClicked(1)} />
			</div>
			<div className='columnCenterHome'>
				<div className='textBox2'>
					<div className='text2'>
						You can feed your pet by clicking on the button!
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
