import { Container, Jumbotron, Button, Row } from "reactstrap";
const Video = () => {

    return (
        <Container>
            <div className="d-flex justify-content-center">
                <video className="col-md-8" src="https://firebasestorage.googleapis.com/v0/b/eduteur-715e2.appspot.com/o/LJ%2Fsem1%2Fict%2Fpython%2FOOPython%2Fzelda.mp4?alt=media&token=7b7aa08c-61f9-4bf6-a5c1-4431cb01e7e9" controls></video>
            </div>
            <hr />
            <Row className=" row d-flex justify-content-between">
                <h3>Zelda</h3>
                <Button>Download Resource</Button>
            </Row>
            <Row>
                <h5><i>- author</i></h5>
            </Row>
            <hr />
            <div>
                <h4>Description</h4>
                <p>Legend of Zelda: Breath of the wild on PC for FREE!</p>
            </div>
            {/* Description will be collapsible like YouTube */}
        </Container>
    )
}

export default Video;
