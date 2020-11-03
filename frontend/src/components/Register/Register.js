import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import "./Register.css";

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
	passwordConfirm: Yup.string()
		.oneOf([Yup.ref("password"), null], "Passwords must match")
		.required("Required!"),
});

const Register = () => {
	const [error, setError] = useState("");
	const history = useHistory();

	const handleSubmit = (event) => {
		let data = {
			name: event.name,
			password: event.password,
		};

		Axios.post("http://catfeeder.ddns.net/api/v1/register", data)
			.then((res) => {
				console.log(res);
				if (res.data.msg == "Registration successful") {
					history.replace("/login");
				} else if (res.data.msg == "Account is already exist") {
					setError("Account is already exist!");
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
				<p>Registration</p>
				<Formik
					initialValues={{
						name: "",
						password: "",
						passwordConfirm: "",
					}}
					validationSchema={AddLoginSchema}
					onSubmit={(values) => {
						handleSubmit(values);
					}}
				>
					{({ errors, touched, handleChange }) => (
						<Form>
							Device key:
							<Field type='text' name='name' />
							{errors.name && touched.name ? <div>{errors.name}</div> : null}
							<br />
							Password:
							<Field type='password' name='password' />
							{errors.password && touched.password ? (
								<div>{errors.password}</div>
							) : null}
							<br />
							Password confirm:
							<Field type='password' name='passwordConfirm' />
							{errors.passwordConfirm && touched.passwordConfirm ? (
								<div>{errors.passwordConfirm}</div>
							) : null}
							<br />
							{error}
							<input type='submit' value='Sign up' />
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default Register;
