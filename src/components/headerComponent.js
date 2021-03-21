import React, { Component, useState } from "react";
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
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import eduteur from "../images/logo.svg";


const UserLogged = (props) => {
  return (
    <Nav pills>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>User</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Stats</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Logout</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown >
    </Nav >
  );
}
const LoginModal = (props) => {

  // const onClosed = props; // will have a function that will exectute on model close
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="primary" onClick={toggle}>Login</Button>
      <Modal isOpen={modal} toggle={toggle} className="Login">
        <ModalHeader toggle={toggle}>Login</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="login-email">Email</Label>
              <Input type="email" name="email" id="login-email" placeholder="john.doe@xyz.com" />
            </FormGroup>
            <FormGroup>
              <Label for="login-password">Password</Label>
              <Input type="password" name="password" id="login-password" placeholder="*********" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle} id="login">login</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

const UserLogin = (props) => {
  // isLogged will be true of user is logged in else it will be false
  // get the value from user authentication
  const isLogged = true;

  if (isLogged) {
    return (
      <UserLogged></UserLogged>
    );
  } else {
    return (
      <LoginModal></LoginModal>

    );
  }
}


const NavHeader = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Eduteur</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="#">Subject</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Discuss</NavLink>
            </NavItem>
          </Nav>
          <UserLogin></UserLogin>
        </Collapse>
      </Navbar>
    </div>
  );
}

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavHeader></NavHeader>
    );
  }
}

export default Header;
