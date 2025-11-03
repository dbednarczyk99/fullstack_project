// EditAdvert.js

import React from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdvertForm from "../../common/AdvertForm/AdvertForm";
import { editAd, getAdById } from "../../../redux/adsRedux";
import { API_URL } from "../../../config";

const EditAdvert = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const path = useParams();
  const adId = path.adId;
  const ad = useSelector(state => getAdById(state, adId));
  console.log("ad to edit: ", adId);

  const [status, setStatus] = React.useState(null);

  const handleSubmit = async ad => {
    setStatus("loading");
    try {
      //console.log('submit: ', ad.author, ad.title, ad.image, ad.price, ad.content, ad.location, ad.publishedDate);
      const fdata = new FormData();
      fdata.append("author", ad.author);
      fdata.append("title", ad.title);
      fdata.append("price", ad.price);
      fdata.append("content", ad.content);
      fdata.append("location", ad.location);
      fdata.append("publishedDate", ad.publishedDate);
      if (ad.image) fdata.append("adImage", ad.image);

      const options = {
        method: "PUT",
        body: fdata
      };

      const res = await fetch(`${API_URL}api/ads/${adId}`, options);
      if (res.status === 201) {
        const updatedAd = await res.json();
        console.log("updatedAd: ", updatedAd);
        const adRes = await fetch(`${API_URL}api/ads/${updatedAd.adId}`);
        const adData = await adRes.json();
        console.log("adData: ", adData);
        dispatch(editAd(adData));
        setStatus("success");
        setTimeout(() => navigate(`/ad/${adData._id}`), 2000);
      } else if (res.status === 400) {
        const err = await res.json();
        throw err;
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error(err);
      if (err.message === "Server error") {
        setStatus("serverError");
      } else {
        setStatus("clientError");
      }
    }
  };

  return (
    <Container>
      <p>Edit your advertisement!</p>
      <AdvertForm action={handleSubmit} actionText="Edit your advert" {...ad}>
        {status === "success" && (
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>You have successfully edited your ad!</p>
            <Spinner
              animation="border"
              role="status"
              className="block mx-auto mb-3 d-flex"
            />
            <p>You&apos;ll be redirected to your ad page shortly.</p>
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

        {status === "loading" && (
          <Spinner
            animation="border"
            role="status"
            className="block mx-auto mb-3 d-flex"
          />
        )}
      </AdvertForm>
    </Container>
  );
};

export default EditAdvert;
