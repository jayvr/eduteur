import {
    Jumbotron,
    Container,
    Button
} from 'reactstrap';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';



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
                        <Button style={{ backgroundColor: "blueviolet", color: "white" }} >Get Started</Button>
                    </Container>
                </Jumbotron>
            </Container>
        </div>
    );
};


const StudentLandingPage = (props) => {
    return (
        <div> Student Landing Page</div>
    );
}

const TeacherLandingPage = (props) => {

    const uid = props.auth.uid;
    return (
        <Container>
            <Link to="/upload"> <Button> Upload</Button></Link>
        </Container>
    );
}

const ShowProperLandingPage = (props) => {
    // console.log(props); good boiii :)
    if ( props.firebase.profile.role == "faculty") {
        return(
            <TeacherLandingPage auth={props.firebase.auth} />
        );
    }
    
    else if ( props.firebase.profile.role == "student"){
        return (
            <StudentLandingPage auth={props.firebase.auth} />
        );
    }
    else {
        return(
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
        firebase : state.firebase
        
    }
}


export default connect(MapStateToProps)(Landing);
