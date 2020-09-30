import React, { useEffect, useState } from "react";

import Aux from "../../hoc/Aux";

import "./MyPets.css";
import Axios from "axios";

function MyPets() {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [portion, setPortion] = useState("");
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
		formData.append("type", type);
		formData.append("portion", portion);
		formData.append("hours", hours);
		formData.append("minutes", minutes);
		let data = {
			name: name,
			type: type,
			portion: portion,
			hours: hours,
			minutes: minutes,
		};
		Axios.post("http://catfeeder.ddns.net/api/v1/addpet", data)
			.then((res) => {
				console.log(res);
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	return (
		<Aux>
			<div className='column left2'>
				<div className='boxForm'>
					<div className='addPetText'>Add Pet</div>
					<form className='formAddPet' onSubmit={handleSubmit}>
						<label>
							Name: <span />
							<input
								type='text'
								placeholder='Name...'
								name='name'
								onChange={(e) => setName(e.target.value)}
								style={{ marginLeft: "6%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Type: <span />
							<input
								type='text'
								placeholder='Type...'
								name='type'
								onChange={(e) => setType(e.target.value)}
								style={{ marginLeft: "8%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Dose: <span />
							<input
								type='text'
								placeholder='Portion (1 portion -> 1 rotation of the servo)...'
								name='portion'
								onChange={(e) => setPortion(e.target.value)}
								style={{ marginLeft: "7%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Hour: <span />
							<input
								type='text'
								placeholder='Hour (1-24)...'
								name='hours'
								onChange={(e) => setHours(e.target.value)}
								style={{ marginLeft: "7%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Minutes: <span />
							<input
								type='text'
								placeholder='Minutes (1-59)...'
								name='minutes'
								onChange={(e) => setMinutes(e.target.value)}
								style={{ marginLeft: "1%", marginBottom: "7%" }}
							/>
						</label>
						<br />
						<input type='submit' value='Add Pet' />
					</form>
				</div>
			</div>
			<div className='column right2'></div>
		</Aux>
	);
}

export default MyPets;
