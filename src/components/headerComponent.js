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
import Search from "../images/icons/search.svg";
import User from "../images/icons/user.svg";
import UserDrop from "../images/icons/user-drop.svg";
import Stats from "../images/icons/stats.svg";
import Settings from "../images/icons/settings.svg";
import '../App.css';


const UserLogged = (props) => {

  const username = props.profile.firstname

  // performs logout
  const handleLogout = (e) => {
    props.logOut()
  }

  return (
    <Nav pills>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle id="user-name" nav><img id="user-avatar-icon" src={User} /> {username} <img src={UserDrop} /></DropdownToggle>
        <DropdownMenu id="user-drop" right>
          <DropdownItem id="stats-btn"><img src={Stats} id="stats-icon" />Stats</DropdownItem>
          <DropdownItem id="settings-btn"><img src={Settings} id="settings-icon" />Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem id="logout-btn" onClick={handleLogout}><svg xmlns="http://www.w3.org/2000/svg" id="logout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e84545" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>Logout</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown >
    </Nav >
  );
}


//Modal popup for Login
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
          <Button type="submit" style={{ backgroundColor: "blueviolet", color: "white" }} onClick={handleSubmit} id="login">Login</Button>{' '}
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
    <Navbar color="light" light expand="md">
      <NavbarBrand><Link to="/">Eduteur</Link></NavbarBrand>

      {props.auth.uid ?
        <>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink className="nav-links active"><Link to="/subject">Subject</Link></NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-links"><Link to="/discuss">Discuss</Link></NavLink>
              </NavItem>
            </Nav>
            <div class="search">
              <div class="search_bar"></div>
              <input type="text" name="search here" class="search_placeholder" placeholder="Search here..." />
              <div class="search_icon_space">
                <img src={Search} />
              </div>
            </div>
            <UserLogged logOut={props.logOut} profile={props.profile}></UserLogged>
          </Collapse>
        </> :
        <LoginModal logIn={props.logIn}></LoginModal>
      }
    </Navbar >
  );

}

const MapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut())
  }
}
export default connect(MapStateToProps, mapDispatchToProps)(Header);
