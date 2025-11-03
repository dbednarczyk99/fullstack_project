import React from "react";
import styles from "./RegisterPage.module.scss";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { useState } from "react";
import { API_URL, MAX_AVATAR_SIZE } from "../../../config";

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [status, setStatus] = useState(null);

  // validation
  const [errors, setErrors] = React.useState({
    login: null,
    phone: null,
    avatar: null,
    password: null,
    repeatPassword: null
  });

  const validateField = (name, value) => {
    switch (name) {
      case "login":
        if (!value) return "Login is required";
        if (value.length < 3) return "Login must be at least 3 characters long";
        if (value.length > 20)
          return "Login must be at most 20 characters long";
        return null;
      case "phone": {
        const digits = (value || "").replace(/\D/g, "");
        if (!digits) return "Phone number is required";
        if (digits.length < 9)
          return "Phone number must be at least 9 digits long";
        if (digits.length > 15)
          return "Phone number must be at most 15 digits long";
        return null;
      }
      case "avatar":
        if (value && value.size > MAX_AVATAR_SIZE)
          return "Avatar file size must be less than 2MB";
        return null;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6)
          return "Password must be at least 6 characters long";
        return null;
      case "repeatPassword":
        if (value !== password) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "login":
        setLogin(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "avatar":
        setAvatar(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "repeatPassword":
        setRepeatPassword(value);
        break;
      default:
        break;
    }

    const err = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: err }));

    if (name === "password" && repeatPassword) {
      setErrors(prevErrors => ({
        ...prevErrors,
        repeatPassword: validateField("repeatPassword", repeatPassword)
      }));
    }
    if (name === "repeatPassword") {
      setErrors(prevErrors => ({
        ...prevErrors,
        repeatPassword: validateField("repeatPassword", value)
      }));
    }
  };

  const isFormValid = () => {
    const current = {
      login: validateField("login", login),
      phone: validateField("phone", phone),
      avatar: validateField("avatar", avatar),
      password: validateField("password", password),
      repeatPassword: validateField("repeatPassword", repeatPassword)
    };
    setErrors(current);
    return Object.values(current).every(v => v === null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid()) {
      setStatus("clientError");
      return;
    }
    //console.log('submit: ', {login, phone, avatar, password, repeatPassword});

    const fdata = new FormData();
    fdata.append("login", login);
    fdata.append("phone", phone);
    fdata.append("avatar", avatar);
    fdata.append("password", password);

    const options = {
      method: "POST",
      body: fdata
    };

    setStatus("loading");
    fetch(`${API_URL}auth/register`, options)
      .then(res => {
        if (res.status === 201) {
          setStatus("success");
        } else if (res.status === 400) {
          setStatus("clientError");
        } else if (res.status === 409) {
          setStatus("loginError");
        } else if (res.status === 413) {
          setStatus("clientError");
          setErrors(prev => ({
            ...prev,
            avatar: body.message || "File too large"
          }));
        } else {
          setStatus("serverError");
        }
      })
      .catch(err => {
        console.log(err);
        setStatus("serverError");
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} lg={6}>
          <Form className="mx-auto" onSubmit={handleSubmit}>
            <h2 className="mb-4">Sign up</h2>

            {status === "success" && (
              <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <p>You have registered successfully. You can now sign in.</p>
                <Button
                  as={Link}
                  to="/login"
                  variant="success"
                  className="w-100"
                >
                  Go to &quot;Sign in&quot;
                </Button>
              </Alert>
            )}

            {status === "serverError" && (
              <Alert variant="danger">
                <Alert.Heading>Something went wrong...</Alert.Heading>
                <p>Unexpected error... Try again!</p>
              </Alert>
            )}

            {status === "clientError" && (
              <Alert variant="warning">
                <Alert.Heading>No enough data</Alert.Heading>
                <p>You have to fill all the fields.</p>
              </Alert>
            )}

            {status === "loginError" && (
              <Alert variant="warning">
                <Alert.Heading>Login already in use</Alert.Heading>
                <p>You have to use another login.</p>
              </Alert>
            )}

            {status === "loading" && (
              <Spinner
                animation="border"
                role="status"
                className="block mx-auto mb-3 d-flex"
              />
            )}

            <Form.Group className="mb-3" controlId="formBasicLogin">
              <Form.Label>Login</Form.Label>
              <Form.Control
                value={login}
                onChange={e => handleChange("login", e.target.value)}
                type="text"
                placeholder="Enter login"
              />
              {errors.login && (
                <Form.Text className="text-danger">{errors.login}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                value={phone}
                onChange={e => handleChange("phone", e.target.value)}
                type="tel"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <Form.Text className="text-danger">{errors.phone}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFile">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                onChange={e => handleChange("avatar", e.target.files[0])}
              />
              {errors.avatar && (
                <Form.Text className="text-danger">{errors.avatar}</Form.Text>
              )}
              <p className={styles.sm}>
                Max file size: 2MB. Accepted formats: jpg, jpeg, png.
              </p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={e => handleChange("password", e.target.value)}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                value={repeatPassword}
                onChange={e => handleChange("repeatPassword", e.target.value)}
                type="password"
                placeholder="Repeat Password"
              />
              {errors.repeatPassword && (
                <Form.Text className="text-danger">
                  {errors.repeatPassword}
                </Form.Text>
              )}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={status === "loading"}
            >
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
