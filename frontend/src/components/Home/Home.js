import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router";

import Aux from "../../hoc/Aux";
import feed from "../../img/homeColor.png";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import { LoggedContext } from "../../context/LoggedContext";
import SideNavbar from "../SideNavbar/SideNavbar";

function Home() {
	const [isClicked, setIsClicked] = useState(0);
	const history = useHistory();
	const usr = Cookies.get("user");
	const [sidenavOpen, setSidenavOpen] = useState(false);

	useEffect(() => {
		if (!usr) {
			history.replace("/login");
		}
		if (isClicked == 1) {
			const fetchData = async () => {
				const result = await axios(
					"http://catfeeder.ddns.net/api/v1/activate" + usr
				);
			};
			fetchData();
			setIsClicked(0);
		}
	}, []);

	const openHandler = () => {
		setSidenavOpen(!sidenavOpen);
	};

	const closeNav = () => {
		setSidenavOpen(!sidenavOpen);
	};

	return (
		<Aux>
			<Navbar openClickHandler={openHandler} />
			<SideNavbar show={sidenavOpen} onClose={closeNav} />
			<div className='home-big'>
				<div className='row'>
					<div className='columnRightHome'>
						<img
							src={feed}
							alt='Pets'
							width='750px'
							style={{
								boxShadow: "10px 10px 75px 30px rgba(0, 0, 0, 0.64)",
								borderRadius: "100%",
							}}
						/>
					</div>
					<div className='columnLeftHome'>
						<div className='textBox1'>
							<div className='text1'>Is your pet hungry?</div>
						</div>
						<button className='pressButton' onClick={() => setIsClicked(1)} />
					</div>
					<div className='columnCenterHome'>
						<div className='textBox2'>
							<div className='text2'>
								You can feed your pet by clicking on the button!
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='home-medium'>
				<div className='row'>
					<div className='columnRightHome'>
						<div className='photo'>
							<img src={feed} alt='Pets' className='imgHome' />
						</div>
					</div>
					<div className='columnLeftHome'>
						<div className='textBox1'>
							<div className='text1'>Is your pet hungry?</div>
						</div>

						<button className='pressButton' onClick={() => setIsClicked(1)} />
					</div>
					<div className='columnCenterHome'>
						<div className='textBox2'>
							<div className='text2'>
								You can feed your pet by clicking on the button!
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='home-small'>
				<div className='textBox2'>
					<div className='text2'>
						You can feed your pet by clicking on the button!
					</div>
				</div>
				<button className='pressButton' onClick={() => setIsClicked(1)} />
			</div>
		</Aux>
	);
}

export default Home;
