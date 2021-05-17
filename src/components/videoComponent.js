import { useState, useEffect } from "react";
import { Container, Jumbotron, Button, Row } from "reactstrap";
import { useParams } from "react-router-dom";

const Video = (props) => {
    // const [topics, setTopics] = useState(props.topics);
    // const [subject, setSubject] = useState(props.subject);
    // const [module, setModule] = useState(props.module);
    // const [path, setPath] = useState(props.path);
    // const [data, setData] = useState({ videoURL: "", title: "...", author: "...", dec: "..." });
    const [data, setData] = useState(props.data);

    function PropsIsLoaded({ children }) {
        const data = props.data
        if (!props) {
            return (
                <div>Loading</div>
            )
        }
        return children
    }

    return (
        <PropsIsLoaded>
            <Container>
                <div className="d-flex justify-content-center">
                    <video className="col-md-8" style={{ outline: "none" }} src={data.videoURL} controls>
                    </video>
                </div>
                <hr />
                <Row className=" row d-flex justify-content-between">
                    <h3>{data.title}</h3>
                    {data.fileURL ? <Button>Download Resource</Button> : <Button disabled>No Resource</Button>}
                </Row>
                <Row>
                    <h5><i>- {data.author}</i></h5>
                </Row>
                <hr />
                <div>
                    <h4>Description</h4>
                    <p>{data.dec}</p>
                </div>
                {/* Description will be collapsible like YouTube  */}
            </Container>
        </PropsIsLoaded >
    )
}

export default Video;
