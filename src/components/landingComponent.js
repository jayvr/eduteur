import React, { useState } from 'react';
import {
    Jumbotron,
    Container,
    Button
} from 'reactstrap';
import classnames from 'classnames';

// const LoginModal = (props) => {

//     // const onClosed = props; // will have a function that will exectute on model close
//     const [modal, setModal] = useState(false);
//     const toggle = () => setModal(!modal);

//     return (
//         <div>
//             <Button color="primary" onClick={toggle}>Login</Button>
//             <Modal isOpen={modal} toggle={toggle} className="Login">
//                 <ModalHeader toggle={toggle}>Login</ModalHeader>
//                 <ModalBody>
//                     <Form>
//                         <FormGroup>
//                             <Label for="login-email">Email</Label>
//                             <Input type="email" name="email" id="login-email" placeholder="john.doe@xyz.com" />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="login-password">Password</Label>
//                             <Input type="password" name="password" id="login-password" placeholder="*********" />
//                         </FormGroup>
//                     </Form>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button color="primary" onClick={toggle} id="login">login</Button>{' '}
//                     <Button color="secondary" onClick={toggle}>Cancel</Button>
//                 </ModalFooter>
//             </Modal>
//         </div>
//     );
// }

// const SignupModal = (props) => {

//     const scrollable = props;
//     const onClosed = props;
//     const [modal, setModal] = useState(false);
//     const toggle = () => setModal(!modal);

//     const [activeTab, setActiveTab] = useState('1');
//     const toggleTab = tab => {
//         if (activeTab !== tab) setActiveTab(tab);
//     }

//     return (
//         <div>
//             <Button color="secondary" onClick={toggle}>Signup</Button>
//             <Modal isOpen={modal} toggle={toggle} className="Signup">
//                 <ModalHeader>
//                     <Nav tabs>
//                         <NavItem>
//                             <NavLink
//                                 className={classnames({ active: activeTab === 'student' })}
//                                 onClick={() => { toggleTab('student'); }}>
//                                 Student
//                             </NavLink>
//                         </NavItem>
//                         <NavItem>
//                             <NavLink
//                                 className={classnames({ active: activeTab === 'teacher' })}
//                                 onClick={() => { toggleTab('teacher'); }}>
//                                 Teacher
//                                 </NavLink>
//                         </NavItem>
//                     </Nav>
//                 </ModalHeader>
//                 <ModalBody>
//                     <TabContent activeTab={activeTab}>
//                         {/* student Sign Up form */}
//                         <TabPane tabId="student">
//                             <Form>
//                                 <FormGroup>
//                                     <Label for="login-email">Email</Label>
//                                     <Input type="email" name="email" id="login-email" placeholder="john.doe@xyz.com" />
//                                 </FormGroup>
//                                 <FormGroup>
//                                     <Label for="login-password">Password</Label>
//                                     <Input type="password" name="password" id="login-password" placeholder="*********" />
//                                 </FormGroup>
//                             </Form>
//                         </TabPane>

//                         {/* Teacher SignUp Form */}
//                         <TabPane tabId="teacher">
//                             <Form>
//                                 <FormGroup>
//                                     <Label for="login-email">Email</Label>
//                                     <Input type="email" name="email" id="login-email" placeholder="john.doe@xyz.com" />
//                                 </FormGroup>
//                                 <FormGroup>
//                                     <Label for="login-password">Password</Label>
//                                     <Input type="password" name="password" id="login-password" placeholder="*********" />
//                                 </FormGroup>
//                             </Form>
//                         </TabPane>
//                     </TabContent>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button color="primary" onClick={toggle}>Signup</Button>{' '}
//                     <Button color="secondary" onClick={toggle}>Cancel</Button>
//                 </ModalFooter>
//             </Modal>
//         </div>
//     );
// }

const LandingJumbotron = (props) => {
    return (
        <div>
            <Container fluid>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-3">Eduteur!</h1>
                        <p className="lead">A Unique, Innovative and Interactive place for student to learn the concept of the sujbect which are based on their university syllabus.</p>
                        <hr className="my-2" />
                        <p>Sign up to get ready for experiencing the same.</p>
                        <br />
                        <Button color="primary">Get Started</Button>
                        {/* <div className=" row justify-content-center">
                            <div><LoginModal></LoginModal></div>
                            <div className="offset-1"><SignupModal scrollable="true" ></SignupModal></div>
                        </div> */}
                    </Container>
                </Jumbotron>
            </Container>
        </div>
    );
};

function Landing() {
    return (
        <div>
            <LandingJumbotron>
            </LandingJumbotron>
        </div>
    );
};

export default Landing;
