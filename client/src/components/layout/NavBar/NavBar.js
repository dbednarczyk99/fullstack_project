import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useIsLoggedIn } from "../../../utils/authenticator";
import { IMGS_URL } from "../../../config";

const NavBar = () => {
  const isLoggedIn = useIsLoggedIn();
  console.log(isLoggedIn);

  return (
    <Navbar className={styles.navbar_background} variant="dark">
      <Container>
        <Navbar.Brand>
          <img
            src="/images/logo_wide/logo_dark_wide.png"
            alt="logo"
            height="54"
            className="d-inline-block align-top me-2"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={NavLink} to="/">
            Home
          </Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link as={NavLink} to="/logout">
                Sign Out
              </Nav.Link>
              <strong className="text-white p-2">{isLoggedIn.login}</strong>
              <img
                src={isLoggedIn.avatar ? IMGS_URL + isLoggedIn.avatar : null}
                alt="avatar"
                height="40"
                className={`d-inline-block align-top ${styles.avatar}`}
              />
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login">
                Sign In
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
