import React, { useEffect, useState } from "react";
import DailyReport from "./DailyReport";
import Axios from "axios";

import "./DailyReport.css";
import Modal from "./DailyReportModal";

const DailyReportCard = (props) => {
	const nameArray = props.nameArray;

	const [isShow, setIsShow] = useState(false);
	const [currentName, setCurrentName] = useState("");
	const [info, setInfo] = useState([]);

	const showModal = () => {
		setIsShow(!isShow);
	};

	const handleGetInfo = (pet) => {
		const data = {
			name: pet,
		};
		Axios.post("http://catfeeder.ddns.net/api/v1/reportPet", data)
			.then((res) => {
				setInfo(res.data);
			})
			.catch((error) => {
				console.log(error.response);
			});
	};
	const listPetsReport = nameArray.map((name, index) => (
		<button
			key={index}
			className='reportCard'
			onClick={(e) => {
				showModal();
				handleGetInfo(name);
				setCurrentName(name);
			}}
		>
			<div className='reportName' style={{ textAlign: "center" }}>
				{name}
			</div>
		</button>
	));
	return (
		<div style={{ marginLeft: "50px" }}>
			{listPetsReport}
			<Modal onClose={showModal} show={isShow} info={info} name={currentName} />
		</div>
	);
};

export default DailyReportCard;
