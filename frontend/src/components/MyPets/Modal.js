import React, { useState, useEffect } from "react";

import Axios from "axios";

const Modal = (props) => {
	const pet = props.currentPet;

	const [id, setId] = useState(0);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [portion, setPortion] = useState("");
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");

	const onClose = (e) => {
		props.onClose && props.onClose(e);
	};

	useEffect(() => {
		setId(pet.id);
		setName(pet.name);
		setType(pet.type);
		setPortion(pet.portion);
		setHours(pet.hours);
		setMinutes(pet.minutes);
	}, [pet.id, pet.name, pet.type, pet.portion, pet.hours, pet.minutes]);

	if (!props.show) {
		return null;
	}

	const handleSave = () => {
		const data = {
			id: id,
			name: name,
			type: type,
			portion: portion,
			hours: hours,
			minutes: minutes,
			active: pet.active,
		};

		props.saveModal(data);
		Axios.post("http://catfeeder.ddns.net/api/v1/update", data)
			.then((res) => {
				console.log(res);
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	return (
		<div className='popup'>
			<div className='popup-inner'>
				Name:{" "}
				<input
					value={name}
					type='text'
					onChange={(e) => setName(e.target.value)}
				/>
				<br />
				Type:
				<input
					type='text'
					value={type}
					onChange={(e) => setType(e.target.value)}
				/>
				<br />
				Portion (to dose):
				<input
					type='number'
					value={portion}
					onChange={(e) => setPortion(e.target.value)}
				/>
				<br />
				Hours of feeding(of day):
				<input
					type='text'
					value={hours}
					onChange={(e) => setHours(e.target.value)}
				/>
				<br />
				Minutes of feeding(of hour):
				<input
					type='text'
					value={minutes}
					onChange={(e) => setMinutes(e.target.value)}
				/>
				<br />
				<button onClick={handleSave}>Save</button>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default Modal;
