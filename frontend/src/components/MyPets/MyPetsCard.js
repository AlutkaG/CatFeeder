import React, { useState } from "react";

import "./MyPets.css";
import Modal from "./Modal";

function PetCard(props) {
	const [isShow, setIsShow] = useState(false);
	const [currentPet, setCurrentPet] = useState("");

	const showModal = (e) => {
		setIsShow(!isShow);
	};

	const actualPet = (pet) => {
		setCurrentPet(pet);
	};

	const info = props.info;

	const saveModal = (pet) => {
		info[currentPet.id - 1] = pet;
	};

	const listPets = info.map((pet) => (
		<div className='petCard' key={pet.id}>
			<p className='namePet'>{pet.name}</p>
			<button
				onClick={(e) => {
					showModal();
					actualPet(pet);
				}}
			>
				Edit
			</button>
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
}

export default PetCard;
