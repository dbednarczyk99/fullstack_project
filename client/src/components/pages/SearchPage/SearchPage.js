import React from "react";
import { Row, Col, Button, Container, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAds } from "../../../redux/adsRedux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AdvertTiles from "../../common/AdvertTiles/AdvertTiles";
import SearchBar from "../../common/SearchBar/SearchBar";
import { getAdsByPhrase } from "../../../redux/adsRedux";
import { API_URL } from "../../../config";

const SearchPage = () => {
  const location = useLocation();
  console.log("location: ", location);
  const searchPhrase = location.pathname.split("/").pop();
  console.log("searchPhrase: ", searchPhrase);
  const [ads, setAds] = React.useState([]);

  useEffect(() => {
    const res = fetch(`${API_URL}api/ads/search/${searchPhrase}`);
    const data = res.json();
    console.log("search data: ", data);
    setAds(data);
  }, [searchPhrase]);

  console.log("ads: ", ads);
  return (
    <Container>
      <h1 className="my-4">Search results</h1>
      <p>
        Results for: <strong>{searchPhrase}</strong>
      </p>
      {ads.length === 0 && <p>No ads found matching your search criteria.</p>}
      <SearchBar />
      <AdvertTiles ads={ads} />
    </Container>
  );
};

export default SearchPage;
