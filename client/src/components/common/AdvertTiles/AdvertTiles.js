import React from "react";
import { Row, Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IMGS_URL } from "../../../config";
import styles from "./AdvertTiles.module.scss";

import PropTypes from "prop-types";

const AdvertTiles = ({ ads }) => {
  return (
    <Row className="mt-4 d-flex">
      {ads.map(ad => {
        console.log("ad._id: ", ad._id);
        const imageUrl = ad.image
          ? `${IMGS_URL}${ad.image}`
          : "https://via.placeholder.com/150";
        return (
          <Col key={ad._id} xs={12} sm={6} md={4} lg={3} className="d-flex">
            <Card key={ad._id} className="mb-4 w-100">
              <Card.Img
                variant="top"
                src={imageUrl}
                className={styles.tileImage}
                onError={e => {
                  const img = e.currentTarget;
                  if (!img.src.includes("via.placeholder.com")) {
                    img.onerror = null;
                    img.src = `/images/image_placeholder.jpg`;
                  }
                }}
              />
              <Card.Body>
                <Card.Title>{ad.title}</Card.Title>
                <Card.Text>{ad.description}</Card.Text>
                <Button as={Link} to={`/ad/${ad._id}`} variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default AdvertTiles;

AdvertTiles.propTypes = {
  ads: PropTypes.arrayOf(PropTypes.object).isRequired
};
