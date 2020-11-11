import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Button
} from "reactstrap";
// import { NavLink } from "react-router-dom";

import eduteur from "../images/logo.svg";

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar className="m-2" id="navigation">
                <NavbarBrand><img src={eduteur} /></NavbarBrand>
                <Nav className="col-8" >
                    <NavItem><NavLink href="#">About us</NavLink></NavItem>
                    <NavItem><NavLink href="#">Contact us</NavLink></NavItem>
                </Nav>
                <Nav className="col-auto">
                    <NavItem><Button>Login</Button></NavItem>
                </Nav>
            </Navbar>
        );
    }
}

export default Header;
