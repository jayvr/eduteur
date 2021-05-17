import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  UncontrolledDropdown,
  Dropdown,
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
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logIn, logOut } from "../redux/actioncreators/authActions";
import Avatar from "../images/avatar.svg";
import { FiMail, FiLock, FiChevronUp, FiChevronDown, FiSliders, FiPieChart, FiLogOut, FiLogIn, FiSearch, FiX, FiBookOpen } from "react-icons/fi";
import { GoCommentDiscussion } from "react-icons/go"
import { AiOutlineHome } from "react-icons/ai"
import '../App.css';
import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";


const UserLogged = (props) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const username = props.profile.firstname

  // performs logout
  const handleLogout = (e) => {
    props.logOut()
  }

  return (
    <Nav pills>
      <Dropdown nav isOpen={dropdownOpen} toggle={toggle} inNavbar>
        <DropdownToggle id="user-name" nav>
          {username}
          {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
        </DropdownToggle>
        <DropdownMenu id="user-drop" right>
          <DropdownItem id="stats-btn"><FiPieChart id="stats-icon" />Stats</DropdownItem>
          <DropdownItem id="settings-btn"><FiSliders id="settings-icon" />Settings</DropdownItem>
          <DropdownItem divider />
          <DropdownItem id="logout-btn" onClick={handleLogout}><FiLogOut id="logout-icon" />Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Nav >
  );
}


//Modal popup for Login
const LoginModal = (props) => {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [email, setEmail] = useState(null);
  const [password, setPass] = useState(null);
  const [isEmailFocus, setEmailFocus] = useState(false)
  const [isPassFocus, setPassFocus] = useState(false)
  const closeBtn = <button className="close" onClick={toggle}><FiX /></button>;


  const handleEmailChange = (e) => {
    console.log("Change of field")
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
  }

  const handleEmailOnBlur = (e) => {
    if (e.target.value === "") {
      setEmailFocus(false)
    }
  }
  const handlePassOnBlur = (e) => {
    if (e.target.value === "") {
      setPassFocus(false)
    }
  }

  return (
    <div style={{ marginLeft: "auto", marginRight: "30px" }}>
      <Button className="login-header-btn" onClick={toggle}><FiLogIn style={{ marginRight: "10px" }} />Login</Button>
      <div className="Modal-Container">
        <Modal isOpen={modal} toggle={toggle} id="loginModal">
          <ModalHeader toggle={toggle} close={closeBtn} className="loginModal-header">
            <h2>Login</h2>
          </ModalHeader>
          <ModalBody className="login-content">
            <Form onSubmit={handleSubmit}>
              <img src={Avatar} width="70px" />
              <FormGroup>
                <div className={"input-div email " + (isEmailFocus ? "focus" : "")}>
                  <div className="i">
                    <FiMail size="20" stroke-width="1.5" />
                  </div>
                  <div className="div">
                    <h5>Email</h5>
                    <input type="email" name="email" className="login-fields" onKeyDown={() => setEmailFocus(true)} onClick={() => setEmailFocus(true)} onBlur={handleEmailOnBlur} onChange={handleEmailChange} />
                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <div className={"input-div pass " + (isPassFocus ? "focus" : "")}>
                  <div className="i">
                    <FiLock size="20" stroke="currentColor" stroke-width="1.5" />
                  </div>
                  <div className="div" >
                    <h5>Password</h5>
                    <input type="password" name="password" className="login-fields" onKeyPress={() => setPassFocus(true)} onChange={handlePasswordChange} onClick={() => setPassFocus(true)} onBlur={handlePassOnBlur} />
                  </div>
                </div>
              </FormGroup>
              <Button type="submit" onClick={handleSubmit} id="login-btn"><FiLogIn /> &nbsp;Login</Button>{' '}
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </div >
  );
}

function Header(props) {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand><Link to="/">Eduteur</Link></NavbarBrand>

      {props.auth.uid ?
        <>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink activeClassName="active-link" className="nav-links" exact to="/"><AiOutlineHome id="nav-icons" />Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink activeClassName="active-link" className="nav-links" to="/subject"><FiBookOpen id="nav-icons" />Subject</NavLink>
              </NavItem>
              <NavItem>
                <NavLink activeClassName="active-link" className="nav-links" to="/discuss"><GoCommentDiscussion id="nav-icons" />Discuss</NavLink>
              </NavItem>
            </Nav>
            <div class="search">
              <div class="search_bar"></div>
              <input type="text" name="search here" class="search_placeholder" placeholder="Search here..." />
              <div class="search_icon_space">
                <FiSearch />
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
