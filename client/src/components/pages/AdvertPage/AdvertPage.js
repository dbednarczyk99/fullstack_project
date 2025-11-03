// AdvertPage.js

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdById, getAllAds, removeAd } from "../../../redux/adsRedux";
import { Container, Row, Button, Col, Spinner, Alert } from "react-bootstrap";
import { useIsOwner } from "../../../utils/authenticator";
import { fetchAds } from "../../../redux/adsRedux";
import { IMGS_URL, API_URL } from "../../../config";
import styles from "./AdvertPage.module.scss";

const AdvertPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adId } = useParams();
  const ads = useSelector(getAllAds);
  const ad = useSelector(state => getAdById(state, adId));
  const userIsThOwner = useIsOwner(adId);
  console.log("AdvertPage.js -> adId: ", adId);
  console.log("AdvertPAge.js -> ad: ", ad);

  const [confirmRemove, setConfirmRemove] = React.useState(false);

  const handleRemove = () => {
    setConfirmRemove(true);
  };

  const handleConfirmRemove = async () => {
    try {
      const res = await fetch(`${API_URL}api/ads/${adId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        console.log("Ad removed successfully");
        dispatch(removeAd(adId));
        setConfirmRemove(false);
        navigate("/");
      } else {
        console.log("Failed to remove the ad");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleCancelRemove = () => {
    setConfirmRemove(false);
  };

  const handleEdit = () => {
    navigate(`/ad/edit/${adId}`);
  };

  useEffect(() => {
    if (!ads || ads.length === 0) {
      dispatch(fetchAds());
    }
  }, [ads, dispatch]);

  useEffect(() => {
    if (ads && ads.length > 0 && !ad) {
      const timeout = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [ads, ad, navigate]);

  if (ads && ads.length > 0 && !ad) {
    return (
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={9}>
            <Alert variant="warning" className="my-5">
              <Alert.Heading>Ad not found.</Alert.Heading>
              <p>You&apos;ll be now redirected to the home page</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
  if (!ad)
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={9}>
            <div className="my-5">
              <Spinner
                animation="border"
                role="status"
                className="block mx-auto mb-3 d-flex"
              />
              <p className="text-center">loading...</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  else {
    let imageUrl = ad.image
      ? `${IMGS_URL}${ad.image}`
      : `/public/image_placeholder.jpg`;
    return (
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">{ad.title}</h2>
              {userIsThOwner && (
                <div className="d-flex align-items-center">
                  <Button
                    className="mx-2"
                    variant="outline-info"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button variant="outline-danger" onClick={handleRemove}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
            {confirmRemove && (
              <Alert variant="warning" className="d-flex flex-column">
                <Alert.Heading>
                  Are you sure you want to remove this ad?
                </Alert.Heading>
                <div>
                  <Button
                    variant="danger"
                    className="me-2"
                    onClick={handleConfirmRemove}
                  >
                    Yes, remove it
                  </Button>
                  <Button
                    className="mx-2"
                    variant="secondary"
                    onClick={handleCancelRemove}
                  >
                    Cancel
                  </Button>
                </div>
              </Alert>
            )}
            <p>
              <strong>Price:</strong> {ad.price} $
            </p>
            <p>
              <strong>Location:</strong> {ad.location}
            </p>
            <img
              src={imageUrl}
              alt={ad.title}
              className={`${styles.adImage} mb-4`}
              onError={e => {
                const img = e.currentTarget;
                if (!img.src.includes("image_placeholder.jpg")) {
                  img.onerror = null;
                  img.src = `/images/image_placeholder.jpg`;
                }
              }}
            />
            <strong>Description:</strong>
            <p
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: ad.content }}
            ></p>
            <p>
              <strong>Author:</strong> {ad.author.login}
            </p>
            <p>
              <strong>Contact:</strong> {ad.author.phone}
            </p>
            <p>
              <strong>Published:</strong>{" "}
              {new Date(ad.publishedDate).toLocaleDateString()}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default AdvertPage;
