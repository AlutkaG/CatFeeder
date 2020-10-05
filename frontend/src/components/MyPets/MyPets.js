import React, { useEffect, useState } from "react";

import Aux from "../../hoc/Aux";

import "./MyPets.css";
import PetCard from "./MyPetsCard";

import Axios from "axios";

function MyPets() {
	const [id, setId] = useState(0);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [portion, setPortion] = useState("");
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");
	const [isActive, setIsActive] = useState(0);
	const [idArray, setIdArray] = useState([]);
	const [nameArray, setNameArray] = useState([]); // tablica imion zwierząt
	const [typeArray, setTypeArray] = useState([]); // tablica typów zwierząt (czy krolik, czy kot...)
	const [portionArray, setPortionArray] = useState([]); // tablica porcji dla poszczegolnych zwierzat
	const [hoursArray, setHoursArray] = useState([]); // tablica godzin, o ktorych ma byc serwowane jedzenie
	const [minutesArray, setMinutesArray] = useState([]); // tablica minut, o ktorych ma byc serwowane jedzenie
	const [isActiveArray, setIsActiveArray] = useState([]);
	const [isAdded, setIsAdded] = useState(0); // czy dodano nowy rekord: 0 - nie, 1 - tak
	const [didIt, setDidIt] = useState(false); // czy zczytalo pierwszy raz przed dodaniem czegokolwiek baze danych
	const [infoArray, setInfoArray] = useState([]); // pelne informacje o zwierzakach zapisane w formie [name: 'jan', type: 'kowalski' ....]
	const [isLoading, setIsLoading] = useState(false);
	const [isDelete, setIsDelete] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		let pom;
		if (id === 0) {
			pom = 1;
		} else {
			pom = 0;
		}
		let data = {
			name: name,
			type: type,
			portion: portion,
			hours: hours,
			minutes: minutes,
			active: pom,
		};
		console.log(data);
		Axios.post("http://catfeeder.ddns.net/api/v1/addpet", data)
			.then((res) => {
				console.log(res);
			})
			.catch((error) => {
				console.log(error.response);
			});

		setIsAdded(1);
		setId(id + 1);

		setIsLoading(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await Axios("http://catfeeder.ddns.net/api/v1/list");

			if (didIt === false || isDelete === true) {
				for (let i = 0; i < result.data.length; i++) {
					idArray.push(result.data[i].id);
					nameArray.push(result.data[i].name);
					typeArray.push(result.data[i].type);
					portionArray.push(result.data[i].portion);
					hoursArray.push(result.data[i].hours);
					minutesArray.push(result.data[i].minutes);
					isActiveArray.push(result.data[i].active);
					infoArray.push(result.data[i]);

					setId(result.data[result.data.length - 1].id);
				}
				setDidIt(true);
				setIsDelete(false);
				console.log("usuniete");
				console.log(infoArray);
			} else if (didIt === true && isAdded === 1) {
				nameArray.push(name);
				typeArray.push(type);
				portionArray.push(portion);
				hoursArray.push(hours);
				minutesArray.push(minutes);
				isActiveArray.push(0);

				let data = {
					hours: hours,
					id: id,
					minutes: minutes,
					name: name,
					portion: portion,
					type: type,
					active: isActive,
				};
				infoArray.push(data);
				setIsAdded(0);
			}
		};

		if (!isLoading || isDelete) {
			fetchData();
			setIsLoading(true);
			console.log("is" + isDelete);
		}
	});

	const deletePet = (index) => {
		let tmpinfo = infoArray.splice(0, infoArray.length);
		let tmpid = idArray.splice(0, idArray.length);
		let tmpname = nameArray.splice(0, nameArray.length);
		let tmptype = typeArray.splice(0, typeArray.length);
		let tmpportion = portionArray.splice(0, portionArray.length);
		let tmphours = hoursArray.splice(0, hoursArray.length);
		let tmpminutes = minutesArray.splice(0, minutesArray.length);
		let tmpisactive = isActiveArray.splice(0, isActiveArray.length);
		setInfoArray(tmpinfo);
		setIdArray(tmpid);
		setNameArray(tmpname);
		setTypeArray(tmptype);
		setPortionArray(tmpportion);
		setHoursArray(tmphours);
		setMinutesArray(tmpminutes);
		setIsActiveArray(tmpisactive);
		setIsDelete(true);
	};

	return (
		<Aux>
			<div className='row'>
				<div className='columnLeftPet'>
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
				<div className='columnRightPet'>
					<PetCard info={infoArray} delete={deletePet} />
				</div>
			</div>
		</Aux>
	);
}

export default MyPets;
