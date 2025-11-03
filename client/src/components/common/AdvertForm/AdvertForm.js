// AdvertForm.js

import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import { useIsLoggedIn } from "../../../utils/authenticator";
import style from "./AdvertForm.module.scss";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const AdvertForm = ({ action, actionText, children, ...props }) => {
  const loggedUser = useIsLoggedIn()?.id;
  const isCreate = actionText.toLowerCase().includes("post");

  const [title, setTitle] = useState(props.title || "");
  const [location, setLocation] = useState(props.location || "");
  const [price, setPrice] = useState(props.price || "");
  const [content, setContent] = useState(props.content || "");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({
    title: null,
    location: null,
    price: null,
    content: null,
    image: null
  });

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value) return "Title is required";
        if (value.length < 3) return "Title must be at least 3 characters long";
        return null;
      case "location":
        if (!value) return "Location is required";
        if (value.length < 3)
          return "Location must be at least 3 characters long";
        return null;
      case "price":
        if (!value) return "Price is required";
        if (isNaN(value) || value <= 0)
          return "Price must be a positive number";
        return null;
      case "content": {
        const plain = (value || "").replace(/<[^>]*>/g, "").trim();
        if (!plain) return "Content is required";
        if (plain.length < 20)
          return "Content must be at least 20 characters long";
        return null;
      }
      case "image":
        if (isCreate && !value) return "Image is required";
        if (value && value.size > MAX_IMAGE_SIZE)
          return "File too large (max 10MB)";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "content":
        setContent(value);
        break;
      case "image":
        setImage(value);
        break;
      default:
        break;
    }

    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const isFormValid = () => {
    const current = {
      title: validateField("title", title),
      location: validateField("location", location),
      price: validateField("price", price),
      content: validateField("content", content),
      image: validateField("image", image)
    };
    setErrors(current);
    return Object.values(current).every(v => v === null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid()) {
      props.onError && props.onError("clientError");
      return;
    }

    const payload = {
      _id: props._id,
      title,
      location,
      price,
      content,
      publishedDate: new Date(),
      author: loggedUser || props.author,
      image
    };

    action(payload);
  };

  let returnPath = "/";
  if (actionText.toLowerCase().includes("edit"))
    returnPath = `/ad/${props._id}`;

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={9}>
        {children}
        <Form className="w-100 mx-auto" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              value={title}
              onChange={e => handleChange("title", e.target.value)}
              type="text"
              placeholder="Enter title"
            />
            {errors.title && (
              <Form.Text className="text-danger">{errors.title}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location:</Form.Label>
            <Form.Control
              value={location}
              onChange={e => handleChange("location", e.target.value)}
              type="text"
              placeholder="Enter location"
            />
            {errors.location && (
              <Form.Text className="text-danger">{errors.location}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              value={price}
              onChange={e => handleChange("price", e.target.value)}
              type="number"
              placeholder="Enter price"
            />
            {errors.price && (
              <Form.Text className="text-danger">{errors.price}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formContent">
            <Form.Label>Content:</Form.Label>
            <ReactQuill
              value={content}
              onChange={value => handleChange("content", value)}
            />
            {errors.content && (
              <Form.Text className="text-danger">{errors.content}</Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Image:</Form.Label>
            <Form.Control
              type="file"
              onChange={e => handleChange("image", e.target.files[0])}
            />
            {errors.image && (
              <Form.Text className="text-danger">{errors.image}</Form.Text>
            )}
            <p className={style.sm}>
              Max file size: 10MB. Accepted formats: jpg, jpeg, png.
            </p>
          </Form.Group>

          <Button type="submit">{actionText}</Button>
          <Link to={returnPath}>
            <Button className="mx-2" variant="secondary">
              Return
            </Button>
          </Link>
        </Form>
      </Col>
    </Row>
  );
};

AdvertForm.propTypes = {
  action: PropTypes.func.isRequired,
  actionText: PropTypes.string.isRequired,
  _id: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  content: PropTypes.string,
  publishedDate: PropTypes.string,
  location: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.string,
  children: PropTypes.node,
  onError: PropTypes.func
};

export default AdvertForm;
