import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Select from "react-select";

import Aux from "../../hoc/Aux";

import "./MyPets.css";
import PetCard from "./MyPetsCard";

const AddPetSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too short!")
		.max(8, "Too long!")
		.required("Required"),

	portion: Yup.number()
		.min(1, "Minimum 1 serving!")
		.max(6, "Maximum 6 servings!")
		.required("Required!"),
	hours: Yup.array().of(Yup.number().min(1, "Minimum 1").max(23, "Maximum 23")),
	minutes: Yup.array().of(Yup.number().min(1).max(59)),
});

const options = [
	{ value: "cat", label: "Cat" },
	{ value: "dog", label: "Dog" },
	{ value: "rabbit", label: "Rabbit" },
	{ value: "guinea pig", label: "Guinea Pig" },
	{ value: "hamster", label: "Hamster" },
];

const selectStyles = {
	control: (style) => ({
		...style,
		outline: "none",
	}),
	option: (provided, state) => ({
		...provided,
		borderBottom: "1px ",
		color: state.isSelected ? "black" : "#333333",
		backgroundColor: "white",
		"&:hover": {
			backgroundColor: "#c8bab6",
		},
		padding: 10,
	}),
};

function MyPets() {
	const [id, setId] = useState(0);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [portion, setPortion] = useState("");
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");
	const [isActive] = useState(0);
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
	const [isSave, setIsSave] = useState(false);
	const [isChangeActive, setIsChangeActive] = useState(false);
	const [isEnabled, setIsEnabled] = useState(false);

	const handleSubmit = (event) => {
		setName(event.name);
		setType(event.type);
		setPortion(event.portion);
		setHours(event.hours);
		setMinutes(event.minutes);
		console.log(event.type);
		let data = {
			name: event.name,
			type: event.type,
			portion: event.portion,
			hours: event.hours,
			minutes: event.minutes,
			active: 0,
		};
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

			if (didIt === false) {
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

		if (!isLoading || isDelete || isSave || isChangeActive || isEnabled) {
			fetchData();
			setIsLoading(true);
			setIsDelete(false);
			setIsSave(false);
			setIsChangeActive(false);
			setIsEnabled(false);
		}
	}, [
		isLoading,
		isDelete,
		isSave,
		isChangeActive,
		isEnabled,
		didIt,
		isAdded,
		idArray,
		nameArray,
		typeArray,
		portionArray,
		hoursArray,
		minutesArray,
		isActiveArray,
		infoArray,
		name,
		type,
		portion,
		hours,
		minutes,
		id,
		isActive,
	]);

	const deletePet = (index) => {
		let _info = infoArray;
		let _id = idArray;
		let _name = nameArray;
		let _type = typeArray;
		let _portion = portionArray;
		let _hours = hoursArray;
		let _minutes = minutesArray;
		let _isActive = isActiveArray;
		_info.splice(index, 1);
		_name.splice(index, 1);
		_type.splice(index, 1);
		_portion.splice(index, 1);
		_hours.splice(index, 1);
		_minutes.splice(index, 1);
		_isActive.splice(index, 1);
		setInfoArray(_info);
		setIdArray(_id);
		setNameArray(_name);
		setTypeArray(_type);
		setPortionArray(_portion);
		setHoursArray(_hours);
		setMinutesArray(_minutes);
		setIsActiveArray(_isActive);
		setIsDelete(true);
	};

	const savePet = (id, pet) => {
		infoArray[id] = pet;
		setIsSave(true);
	};

	const activeHandle = (id) => {
		let info = infoArray;
		for (let i = 0; i < info.length; i++) {
			if (i == id) {
				info[i].active = 1;
			} else {
				info[i].active = 0;
			}
		}
		setInfoArray(info);
		console.log("change");
		setIsChangeActive(true);
	};

	const disabledHandle = (id) => {
		let info = infoArray;
		info[id].active = 0;
		setInfoArray(info);
		console.log("disabled");
	};

	const handleTypeChange = (selectedType) => {
		setType(selectedType.value);
		console.log(selectedType.value);
	};
	return (
		<Aux>
			<div className='row'>
				<div className='columnLeftPet'>
					<div className='boxForm'>
						<div className='addPetText'>Add Pet</div>
						<Formik
							initialValues={{
								name: "",
								type: "",
								portion: "",
								hours: [],
								minutes: [],
							}}
							validationSchema={AddPetSchema}
							onSubmit={(values) => {
								handleSubmit(values);
							}}
						>
							{({ errors, touched, handleChange }) => (
								<Form className='formAddPet'>
									<div className='row'>
										<div className='columnLeftFormSelect'>
											<div style={{ paddingBottom: "1%" }}>Name: </div>
											<br /> <div style={{ paddingBottom: "1%" }}>
												Type:
											</div>{" "}
											<br /> <div style={{ paddingBottom: "1%" }}>Portion:</div>{" "}
											<br /> <div style={{ paddingBottom: "1%" }}>Hours:</div>{" "}
											<br />{" "}
											<div style={{ paddingBottom: "1%" }}>Minutes: </div>{" "}
										</div>
										<div className='columnRightFormSelect'>
											<Field
												className='input'
												type='text'
												placeholder='Name...'
												name='name'
											/>
											<div style={{ fontSize: "15px", color: "red" }}>
												{errors.name && touched.name ? (
													<div>{errors.name}</div>
												) : null}
											</div>
											<Select
												placeholder='Type...'
												options={options}
												onChange={(select) => {
													handleTypeChange(select);
													handleChange("type")(select.value);
												}}
												styles={selectStyles}
												name='type'
												className='inputSelect'
											/>
											<Field
												className='input'
												type='text'
												placeholder='Portion (1 portion -> 1 rotation of the servo)...'
												name='portion'
											/>
											<div style={{ fontSize: "15px", color: "red" }}>
												{errors.portion && touched.portion ? (
													<div>{errors.portion}</div>
												) : null}
											</div>

											<Field
												className='input'
												type='text'
												placeholder='Hour (1-24)...'
												name='hours'
											/>
											<div style={{ fontSize: "15px", color: "red" }}>
												{errors.hours && touched.hours ? (
													<div>{errors.hours}</div>
												) : null}
											</div>

											<Field
												className='input'
												type='text'
												placeholder='Minutes (1-59)...'
												name='minutes'
											/>
											<div style={{ fontSize: "15px", color: "red" }}>
												{errors.minutes && touched.minutes ? (
													<div>{errors.minutes}</div>
												) : null}
											</div>
										</div>

										{/* 	<div style={{ fontSize: "15px", color: "red" }}>
										{errors.type && touched.type ? (
											<div>{errors.type}</div>
										) : null} */}
										{/* </div> */}
									</div>
									<input type='submit' value='Add Pet' />
								</Form>
							)}
						</Formik>
					</div>
				</div>
				<div className='columnRightPet'>
					<PetCard
						info={infoArray}
						delete={deletePet}
						save={savePet}
						active={activeHandle}
						disabled={disabledHandle}
					/>
				</div>
			</div>
		</Aux>
	);
}

export default MyPets;
