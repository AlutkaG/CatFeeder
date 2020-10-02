import React, { useState, useEffect } from "react";

const Modal = (props) => {
	const pet = props.currentPet;

	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [portion, setPortion] = useState("");
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");
	const [info, setInfo] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onClose = (e) => {
		props.onClose && props.onClose(e);
	};

	if (!props.show) {
		return null;
	}

	const handleSave = () => {
		const data = {
			name: name,
			type: type,
			portion: portion,
			hours: hours,
			minutes: minutes,
		};

		props.saveModal(data);
	};

	console.log(name);
	return (
		<div className='popup'>
			<div className='popup-inner'>
				Name:{" "}
				<input
					type='text'
					placeholder={pet.name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button onClick={handleSave()}>Save</button>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default Modal;
