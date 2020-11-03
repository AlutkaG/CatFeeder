import React, { useEffect, useState } from "react";
import Axios from "axios";
import Aux from "../../hoc/Aux";

import DailyReportCard from "./DailyReportCard";
import Navbar from "../Navbar/Navbar";
import { Prev } from "react-bootstrap/esm/PageItem";

function DailyReport() {
	const [nameArray, setNameArray] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const result = await Axios("http://catfeeder.ddns.net/api/v1/list");
			for (let i = 0; i < result.data.length; i++) {
				setNameArray((prev) => [...prev, result.data[i].name]);
			}
			setIsLoading(true);
		};
		if (!isLoading) {
			fetchData();
		}
	}, []);
	return (
		<Aux>
			<Navbar />
			<div style={{ paddingTop: "10%" }}>
				<DailyReportCard nameArray={nameArray} />
			</div>
		</Aux>
	);
}

export default DailyReport;
