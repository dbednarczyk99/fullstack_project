// AddAdvert.js

import React from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdvertForm from "../../common/AdvertForm/AdvertForm";
import { addAd } from "../../../redux/adsRedux";
import { API_URL } from "../../../config";

const AddAdvert = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = React.useState(null);

  const handleSubmit = async ad => {
    setStatus("loading");
    try {
      const fdata = new FormData();
      fdata.append("author", ad.author);
      fdata.append("title", ad.title);
      fdata.append("price", ad.price);
      fdata.append("content", ad.content);
      fdata.append("location", ad.location);
      fdata.append("publishedDate", ad.publishedDate);
      if (ad.image) fdata.append("adImage", ad.image);

      const options = {
        method: "POST",
        body: fdata
      };

      const res = await fetch(`${API_URL}api/ads`, options);
      if (res.status === 201) {
        const created = await res.json();
        const adRes = await fetch(`${API_URL}api/ads/${created.adId}`);
        const adData = await adRes.json();
        dispatch(addAd(adData));
        setStatus("success");
        setTimeout(() => navigate(`/ad/${adData._id}`), 2000);
      } else if (res.status === 400) {
        setStatus("clientError");
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message === "Server error" ? "serverError" : "clientError");
    }
  };

  return (
    <Container>
      <p>Create your own advertisement!</p>
      <AdvertForm
        action={handleSubmit}
        actionText="Post your advert"
        onError={setStatus}
      >
        {status === "success" && (
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>You have successfully posted your ad!</p>
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
            <Alert.Heading>Not enough data</Alert.Heading>
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

export default AddAdvert;
