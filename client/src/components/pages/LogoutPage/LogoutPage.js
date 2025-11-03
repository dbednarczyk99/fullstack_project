import React from "react";
import { useEffect } from "react";
import { API_URL } from "../../../config";
import { logOut } from "../../../redux/authRedux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert, Spinner, Container, Col, Row } from "react-bootstrap";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: "DELETE",
      credentials: "include"
    };
    fetch(`${API_URL}auth/logout`, options)
      .then(res => {
        if (res.status === 200) {
          dispatch(logOut());
        } else {
          console.log("Logout failed with status:", res.status);
        }
      })
      .catch(err => {
        console.log("Logout error:", err);
      });

    setTimeout(() => navigate("/"), 1000);
  }, [dispatch, navigate]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} lg={6}>
          <Alert variant="info" className="m-3">
            <Alert.Heading>Logging out...</Alert.Heading>
            <p>
              You are being logged out. You will be redirected to the homepage
              shortly.
            </p>
            <Spinner
              animation="border"
              role="status"
              className="block mx-auto mb-3 d-flex"
            />
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default LogoutPage;
