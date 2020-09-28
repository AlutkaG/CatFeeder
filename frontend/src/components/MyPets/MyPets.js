import React from "react";

import Aux from "../../hoc/Aux";

import "./MyPets.css";

function MyPets() {
	return (
		<Aux>
			<div className='column left2'>
				<div className='boxForm'>
					<div className='addPetText'>Add Pet</div>
					<form className='formAddPet'>
						<label>
							Name: <span />
							<input
								type='text'
								placeholder='Name...'
								style={{ marginLeft: "6%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Type: <span />
							<input
								type='text'
								placeholder='Type...'
								style={{ marginLeft: "8%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Dose: <span />
							<input
								type='text'
								placeholder='Portion (1 portion -> 1 rotation of the servo)...'
								style={{ marginLeft: "7%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Hour: <span />
							<input
								type='text'
								placeholder='Hour (1-24)...'
								style={{ marginLeft: "7%", marginBottom: "4%" }}
							/>
						</label>
						<br />
						<label>
							Minutes: <span />
							<input
								type='text'
								placeholder='Minutes (1-59)...'
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
