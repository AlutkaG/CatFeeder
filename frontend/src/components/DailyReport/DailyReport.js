import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import Aux from "../../hoc/Aux";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

import DailyReportCard from "./DailyReportCard";
import Navbar from "../Navbar/Navbar";
import { LoggedContext } from "../../context/LoggedContext";

function DailyReport() {
	const [nameArray, setNameArray] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { isLogged } = useContext(LoggedContext);
	const history = useHistory();
	const usr = Cookies.get("user");

	useEffect(() => {
		if (!usr) {
			history.replace("/login");
		}
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
