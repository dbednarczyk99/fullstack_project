// HomePage.js

import React from "react";
import {
  Row,
  Col,
  Button,
  Container,
  Card,
  Form,
  Alert
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAds } from "../../../redux/adsRedux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../common/SearchBar/SearchBar";
import AdvertTiles from "../../common/AdvertTiles/AdvertTiles";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.user);
  const [alert, setAlert] = React.useState("");

  const handleButton = e => {
    e.preventDefault();

    if (!user || user === null || user === undefined) {
      setAlert("notLoggedIn");
    } else {
      navigate("ad/add");
    }
  };

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const ads = useSelector(state => state.ads);
  console.log("ads: ", ads);

  return (
    <Container>
      <p>
        Discover the best deals and offers from various advertisers and post
        your own ads!
      </p>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button onClick={handleButton} variant="primary" className="px-3">
            Post your own ad
          </Button>
        </Col>
      </Row>

      <Row className="mt-2 justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {alert === "notLoggedIn" && (
            <Alert variant="warning" className="text-center">
              <p className="mb-3">
                Please log in to post an advertisement. <br></br> If you
                don&apos;t have an account, you can register for free!
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  className="px-3 mx-2"
                  variant="secondary"
                  as={Link}
                  to="/login"
                  state={{ from: "/ad/add" }}
                >
                  Sign In
                </Button>
                <Button
                  className="px-3 mx-2"
                  variant="primary"
                  as={Link}
                  to="/register"
                  state={{ from: "/ad/add" }}
                >
                  Sign Up
                </Button>
              </div>
            </Alert>
          )}
        </Col>
      </Row>
      <SearchBar />
      <AdvertTiles ads={ads} />
    </Container>
  );
};

export default HomePage;
