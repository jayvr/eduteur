import { useState } from "react";
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
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logIn, logOut } from "../redux/actioncreators/authActions";
import eduteur from "../images/logo.svg";



const UserLogged = (props) => {

  const handleLogout = (e) => {
    // do logout
    props.logOut()
  }
  return (
    <Nav pills>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret style={{ color: "blueviolet" }}>User</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Stats</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown >
    </Nav >
  );
}



const LoginModal = (props) => {

  // const onClosed = props; // will have a function that will exectute on model close
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [email, setEmail] = useState(null);
  const [password, setPass] = useState(null);

  const handleEmailChange = (e) => {
    console.log("Change of field")
    // console.log(e.target.value);
    setEmail({
      email: e.target.value
    })
  }
  const handlePasswordChange = (e) => {
    console.log("Change of field")
    setPass({
      password: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const mail = email.email;
    const pass = password.password;
    console.log({ mail, pass });
    props.logIn({ mail, pass })
    toggle()
    // console.log(state);
  }

  return (
    <div style={{ marginLeft: "auto", marginRight: 0 }}>
      <Button style={{ backgroundColor: "blueviolet", color: "white" }} onClick={toggle}>Login</Button>
      <Modal isOpen={modal} toggle={toggle} className="Login">
        <ModalHeader toggle={toggle}>Login</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="login-email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="john.doe@xyz.com" onBlur={handleEmailChange} />
            </FormGroup>
            <FormGroup>
              <Label for="login-password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="*********" onBlur={handlePasswordChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: "blueviolet", color: "white" }} onClick={handleSubmit} id="login">login</Button>{' '}
          <Button style={{ backgroundColor: "grey", color: "white" }} onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}

function Header(props) {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  // console.log(props);
  return (
    <Navbar color="light" light expand="md"  >
      <NavbarBrand><Link style={{ color: "blueviolet", fontSize: "1.5em", textDecoration: "none" }} to="/">Eduteur</Link></NavbarBrand>

      {props.auth.uid ?
        <>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink><Link to="/subject" style={{ color: "blueviolet" }}>Subject</Link></NavLink>
              </NavItem>
              <NavItem>
                <NavLink><Link to="/discuss" style={{ color: "blueviolet" }}>Discuss</Link></NavLink>
              </NavItem>
            </Nav>
            <UserLogged logOut={props.logOut}></UserLogged>
          </Collapse>
        </> :
        <LoginModal logIn={props.logIn}></LoginModal>}
    </Navbar>
  );

}

const MapStateToProps = (state) => {
  // console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut())
  }
}
export default connect(MapStateToProps, mapDispatchToProps)(Header);
