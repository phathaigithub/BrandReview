import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import "../../styles/HeaderStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jwtDecode } from "jwt-decode";
import HeaderDropDown from "./HeaderDropdown";
// import UserHeaderDropdown from "./UserHeaderDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
const Header = () => {
    const [nav, setNav] = useState(false);
    const isLoggedIn = () => {
        // Replace this with your actual authentication check
        const token = localStorage.getItem('authToken');
        return !!token; // Returns true if token exists, false otherwise
    };
    console.log(isLoggedIn());
    let tokenData = null;
    if(isLoggedIn()){
        tokenData = jwtDecode(localStorage.getItem('authToken'));
    }
    const avatar = tokenData ? tokenData.avatar : "default.png";
    const name = tokenData ? tokenData.name : "Người dùng";
    // Scroll Navbar
    const changeValueOnScroll = () => {
        const scrollValue = document?.documentElement?.scrollTop;
        scrollValue > 100 ? setNav(true) : setNav(false);
    };

    window.addEventListener("scroll", changeValueOnScroll);

    return (
        <header>
            <Navbar
                collapseOnSelect
                expand="lg"
                className={`${nav === true ? "sticky" : ""}`}
            >
                <Container>
                    <Navbar.Brand href="/">
                        <Link to="/" className="logo">
                            <img src={Logo} alt="Logo" className="img-fluid" />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            {/* <Nav.Link as={Link} to="/">
                                Home
                            </Nav.Link> */}
                            {isLoggedIn() == false &&
                                (<Nav.Link as={Link} to="/register">
                                    Login/Register
                                </Nav.Link>)
                            }
                            {isLoggedIn() == true &&
                                <HeaderDropDown 
                                avatar={avatar}
                                name={name}
                                 />
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
