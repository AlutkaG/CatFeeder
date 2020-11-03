import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";

import "./Login.css";
import { UserContext } from "../../context/UserContext";

const AddLoginSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too short!")
		.max(15, "Too long!")
		.required("Required"),
	password: Yup.string()
		.min(8, "Password is too short - minimum 8 chars")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
			"Password must contain minimum: 1 capital letter, 1 small letter, 1 digit "
		)
		.required("Required!"),
});

function Login() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const { user, setUser } = useContext(UserContext);
	const [error, setError] = useState("");
	const history = useHistory();

	const handleSubmit = (event) => {
		setName(event.name);
		setPassword(event.password);
		setUser(event.name);

		let data = {
			name: event.name,
			password: event.password,
		};

		Axios.post("http://catfeeder.ddns.net/api/v1/login", data)
			.then((res) => {
				console.log(res);
				if (res.data.msg == "Logged successful") {
					Cookies.set("user", event.name, { expires: 7 });
					history.replace("/home");
				} else if (res.data.msg == "Bad name") {
					setError("Bad name!");
				} else if (res.data.msg == "Bad password") {
					setError("Bad password!");
				}
			})
			.catch((error) => {
				console.log(error.response);
			});
	};

	return (
		<div className='loginBody'>
			<div
				style={{
					textAlign: "center",
					color: "white",
					fontSize: "100px",
					paddingTop: "5%",
				}}
			>
				Pet Feeder
			</div>
			<div className='loginBox'>
				<p>Login</p>
				<Formik
					initialValues={{
						name: "",
						password: "",
					}}
					validationSchema={AddLoginSchema}
					onSubmit={(values) => {
						handleSubmit(values);
					}}
				>
					{({ errors, touched, handleChange }) => (
						<Form>
							Name:
							<Field type='text' name='name' />
							{errors.name && touched.name ? <div>{errors.name}</div> : null}
							<br />
							Password:
							<Field type='password' name='password' />
							{errors.password && touched.password ? (
								<div>{errors.password}</div>
							) : null}
							<br />
							{error}
							<input type='submit' value='Sign in' />
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default Login;
