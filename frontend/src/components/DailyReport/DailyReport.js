import React, { useEffect, useState } from "react";
import Axios from "axios";

import DailyReportCard from "./DailyReportCard";
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
		<div style={{ paddingTop: "10%" }}>
			<DailyReportCard nameArray={nameArray} />
		</div>
	);
}

export default DailyReport;
