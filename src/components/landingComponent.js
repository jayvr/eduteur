import {
    Jumbotron,
    Container,
    Button,
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardText,
    Row,
    Col
} from 'reactstrap';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import LatestImg from "../images/latest-img.svg";
import { FiAirplay, FiUpload } from "react-icons/fi"
import '../App.css';


const LandingJumbotron = (props) => {
    return (
        <div>
            <Container fluid>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="site-name">Eduteur!</h1>
                        <p className="site-desc">A Unique, Innovative and Interactive place for student to learn the concept of the subject which are based on their university syllabus.</p>
                        <hr className="my-2" />
                        <p>Sign up to get ready for experiencing the same.</p>
                        <br />
                        <Button className="get-started-btn">Get Started</Button>
                    </Container>
                </Jumbotron>
            </Container>
        </div>
    );
};


const StudentLandingPage = (props) => {
    return (
        <>
            <div> Student Landing Page</div>
        </>
    );
}

const TeacherLandingPage = (props) => {

    const uid = props.auth.uid;
    return (
        <Container className="main">
            <div id="heading-text">UPLOAD / GO LIVE</div>
            <Row>
                <Col>
                    <Link to="/upload">
                        <Card className="upload-card">
                            <CardBody className="upload-body">
                                <CardText className="upload-text"><FiUpload id="upload-icon" />UPLOAD</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link to="#">
                        <Card className="golive-card">
                            <CardBody className="golive-body">

                                <CardText className="golive-text"><FiAirplay id="golive-icon" />GO LIVE</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <hr id="line" />
            <div id="heading-text">LATEST</div>
            <Row>
                <Col>
                    <Link to="#">
                        <Card className="latest-card-1">
                            <CardImg id="latest-image" top width="10%" src={LatestImg} alt=":(" />
                            <CardBody className="latest-body-1">
                                <CardTitle className="latest-title-text">LATEST-1</CardTitle>
                                <CardText className="latest-desc-text">About the lecture</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link to="#">
                        <Card className="latest-card-2">
                            <CardImg id="latest-image" top width="10%" src={LatestImg} alt=":(" />
                            <CardBody className="latest-body-2">
                                <CardTitle className="latest-title-text">LATEST-2</CardTitle>
                                <CardText className="latest-desc-text">About the lecture</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link to="#">
                        <Card className="latest-card-3">
                            <CardImg id="latest-image" top width="10%" src={LatestImg} alt=":(" />
                            <CardBody className="latest-body-3">
                                <CardTitle className="latest-title-text">LATEST-3</CardTitle>
                                <CardText className="latest-desc-text">About the lecture</CardText>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

const ShowProperLandingPage = (props) => {
    // console.log(props); good boiii :)
    if (props.firebase.profile.role === "faculty") {
        return (
            <TeacherLandingPage auth={props.firebase.auth} />
        );
    }

    else if (props.firebase.profile.role === "student") {
        return (
            <StudentLandingPage auth={props.firebase.auth} />
        );
    }
    else {
        return (
            <div>
                <h1>NO PROFILE</h1>
            </div>
        )
    }
};


function Landing(props) {
    return (
        <>
            { props.firebase.auth.uid ? <ShowProperLandingPage firebase={props.firebase} /> : <LandingJumbotron />}
        </>
    );
};

const MapStateToProps = (state) => {
    // console.log(state);
    return {
        firebase: state.firebase

    }
}


export default connect(MapStateToProps)(Landing);
