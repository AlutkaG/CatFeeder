import React, { useEffect, useState } from "react";
import axios from "axios";

import Aux from "../../hoc/Aux";

import term from "../../img/term.png";
import pawWhite from "../../img/pawwhite.png";
import paw from "../../img/paw.png";

import "./Temperature.css";

function Temp() {
	const [temp, setTemp] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const result = await axios("http://catfeeder.ddns.net/api/v1/temp");

			setTemp(result.data.temp);
		};

		fetchData();
	}, []);
	return (
		<Aux>
			<div className='titleBox'>Current Temperature</div>
			<div className=' column left thermBox'>
				<img src={term} alt={"thermometer"} />
			</div>

			<div className='column right tempBox'>{temp.toFixed(2)}</div>
		</Aux>
	);
}

export default Temp;
