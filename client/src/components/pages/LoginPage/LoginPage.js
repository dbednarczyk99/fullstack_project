import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../../config";
import { logIn } from "../../../redux/authRedux";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'clientError', 'serverError'

  const handleSubmit = e => {
    e.preventDefault();
    console.log("submit: ", { login, password });

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ login, password })
    };

    setStatus("loading");
    fetch(`${API_URL}auth/login`, options)
      .then(res => {
        if (res.status === 200) {
          setStatus("success");
          fetch(`${API_URL}auth/user`, {
            method: "GET",
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              console.log("user: ", data);
              dispatch(logIn(data.user));
            });
          setTimeout(() => navigate(from, { replace: true }), 2000);
        } else if (res.status === 400) {
          setStatus("clientError");
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
            <h2 className="mb-4">Sign in</h2>

            {status === "success" && (
              <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <p>You are now signed in.</p>
                <Spinner
                  animation="border"
                  role="status"
                  className="block mx-auto mb-3 d-flex"
                />
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
                <Alert.Heading>Invalid credentials!</Alert.Heading>
                <p>Login or password are incorrect.</p>
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
                onChange={e => setLogin(e.target.value)}
                type="text"
                placeholder="Enter login"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={status === "loading"}
            >
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
