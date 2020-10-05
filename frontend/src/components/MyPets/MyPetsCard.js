import React, { useState, useEffect } from "react";

import "./MyPets.css";
import Modal from "./Modal";

import Axios from "axios";

const PetCard = (props) => {
	const [isShow, setIsShow] = useState(false);
	const [currentPet, setCurrentPet] = useState("");
	const [idActivePrev, setIdActivePrev] = useState(0);
	const [indexNow, setIndexNow] = useState(0);
	const [indexPrev, setIndexPrev] = useState(0);
	const [info, setInfo] = useState(props.info);

	const showModal = (e) => {
		setIsShow(!isShow);
	};

	const actualPet = (pet) => {
		setCurrentPet(pet);
	};

	const saveModal = (pet) => {
		info[currentPet.id - 1] = pet;
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await Axios(
				"http://catfeeder.ddns.net/api/v1/getActiveId"
			);
			setIdActivePrev(result.data.id);
		};
		fetchData();
	});
	const changeActive = (id, index) => {
		if (idActivePrev != id) {
			const data = {
				idPrev: idActivePrev,
				idNow: id,
			};
			setIndexNow(index);
			Axios.post("http://catfeeder.ddns.net/api/v1/changeActive", data)
				.then((res) => {
					console.log(res);
				})
				.catch((error) => {
					console.log(error.response);
				});
			info[index].active = 0;
		}
	};

	const deleteHandle = (id, index) => {
		const data = {
			id: id,
		};
		Axios.post("http://catfeeder.ddns.net/api/v1/delete", data)
			.then((res) => {
				console.log(res);
			})
			.catch((error) => {
				console.log(error.response);
			});
		console.log(info);
		props.delete(index);
		console.log("po" + info);
	};

	const listPets = info.map((pet, index) => (
		<div className='petCard' key={index}>
			<div className='row'>
				<div className='columnLeftCard namePet'>{pet.name}</div>
				<div className='columnRightCard'>
					<button
						className='cardButton'
						style={
							pet.active
								? { backgroundColor: "green" }
								: { backgroundColor: "#737373" }
						}
						onClick={(e) => {
							changeActive(pet.id, index);
						}}
					>
						{pet.active ? "Enabled" : "Disabled"}
					</button>
					<br />
					<button
						className='cardButton'
						style={{ backgroundColor: "#006699" }}
						onClick={(e) => {
							showModal();
							actualPet(pet);
						}}
					>
						Edit
					</button>
					<br />
					<button
						className='cardButton'
						style={{ backgroundColor: "black" }}
						onClick={(e) => {
							deleteHandle(pet.id, index);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	));
	return (
		<div>
			{listPets}
			<Modal
				onClose={showModal}
				show={isShow}
				currentPet={currentPet}
				saveModal={saveModal}
			/>
		</div>
	);
};

export default PetCard;
