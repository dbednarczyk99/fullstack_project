// SearchBar.js

import React from "react";
import { Form, FormControl, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [searchError, setSearchError] = React.useState(null);
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (searchPhrase.trim()) {
      setSearchError(null);
      navigate(`/search/${searchPhrase}`);
    } else {
      setTimeout(() => setSearchError(null), 3000);
      setSearchError("emptyField");
    }
    console.log("Search submitted");
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={8}>
        {searchError === "emptyField" && (
          <Alert variant="warning">Please enter a search phrase.</Alert>
        )}
        <Form className="d-flex" onSubmit={handleSearch}>
          <FormControl
            value={searchPhrase}
            onChange={e => setSearchPhrase(e.target.value)}
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-warning" type="submit">
            Search
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SearchBar;
