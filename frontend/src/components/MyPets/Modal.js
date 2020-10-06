import React, { useState, useEffect } from "react";

import Axios from "axios";

const Modal = (props) => {
	const pet = props.currentPet;

	const [id, setId] = useState(0);
	const [name, setName] = useState(pet.name);
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
				<div style={{ fontSize: "50px", paddingBottom: "5%" }}>Edit</div>
				<div className='row'>
					<div className='columnLeftModal'>
						<div className='modalText'>Name: </div>
						<div className='modalText'>Type:</div>
						<div className='modalText'>Portion (to dose):</div>
						<div className='modalText'>Hours of feeding(of day):</div>
						<div className='modalText'>Minutes of feeding(of hour):</div>
					</div>
					<div className='columnRightModal'>
						<div className='modalInput'>
							<input
								className='inputModal'
								value={name}
								type='text'
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<br />
						<div className='modalInput'>
							<input
								className='inputModal'
								type='text'
								value={type}
								onChange={(e) => setType(e.target.value)}
							/>
						</div>
						<br />
						<div className='modalInput'>
							<input
								className='inputModal'
								type='text'
								value={portion}
								onChange={(e) => setPortion(e.target.value)}
							/>
						</div>
						<br />
						<div className='modalInput'>
							<input
								className='inputModal'
								type='text'
								value={hours}
								onChange={(e) => setHours(e.target.value)}
							/>
						</div>
						<br />
						<div className='modalInput'>
							<input
								className='inputModal'
								type='text'
								value={minutes}
								onChange={(e) => setMinutes(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<button className='buttonSave' onClick={handleSave}>
					Save
				</button>
				<button className='buttonClose' onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default Modal;
