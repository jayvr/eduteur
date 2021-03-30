import {
    Jumbotron,
    Container,
    Button
} from 'reactstrap';


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

function Landing() {
    return (
        <div>
            <LandingJumbotron>
            </LandingJumbotron>
        </div>
    );
};

export default Landing;
