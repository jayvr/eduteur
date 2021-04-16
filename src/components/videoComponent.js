import { useState, useEffect } from "react";
import { Container, Jumbotron, Button, Row } from "reactstrap";
import { useParams } from "react-router-dom";

const VideoPage = (props) => {
    // const [topics, setTopics] = useState(props.topics);
    // const [subject, setSubject] = useState(props.subject);
    // const [module, setModule] = useState(props.module);
    // const [path, setPath] = useState(props.path);
    const [data, setData] = useState(props.data);

    console.log("DATA in VIDEO" + data)

    return (
        <Container>
            <div className="d-flex justify-content-center">
                <video className="col-md-8" style={{ outline: "none" }} src="" controls></video>
            </div>
            <hr />
            <Row className=" row d-flex justify-content-between">
                <h3>data.title</h3>
                <Button>Download Resource</Button>
            </Row>
            <Row>
                <h5><i>- data.author</i></h5>
            </Row>
            <hr />
            <div>
                <h4>Description</h4>
                <p>data.dec</p>
            </div>
            {/* Description will be collapsible like YouTube */}
        </Container>
    )
}

const Video = (props) => {
    // const [topics, setTopics] = useState(props.topics);
    // const [subject, setSubject] = useState(props.subject);
    // const [module, setModule] = useState(props.module);
    // const [path, setPath] = useState(props.path);
    // const [data, setData] = useState({ videoURL: "", title: "...", author: "...", dec: "..." });

    const topicItems = props.topicItems;
    console.log("Props in Video" + props.topicItems)


    const { videoID } = useParams();
    console.log(videoID)
    let item = null

    // console.log("IN VIDEO COMPONENT")
    // console.log("topic" + props.topics)
    // console.log("subject" + props.subject)
    // console.log("module" + props.module)
    // console.log("module" + props.path)
    // console.log("DATA in VIDEO" + props.data)

    useEffect(() => {
        // item = props.data.find(d => d.id === videoID);
        // setData(props.data.find(d => d.id === videoID))
        // setData(data)
    }, [])

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
                {/* <div className="d-flex justify-content-center">
                    <video className="col-md-8" style={{ outline: "none" }} src={data.videoURL} controls></video>
                </div>
                <hr />
                <Row className=" row d-flex justify-content-between">
                    <h3>{data.title}</h3>
                    <Button>Download Resource</Button>
                </Row>
                <Row>
                    <h5><i>- {data.author}</i></h5>
                </Row>
                <hr />
                <div>
                    <h4>Description</h4>
                    <p>{data.dec}</p>
                </div>
                Description will be collapsible like YouTube  */}
            </Container>
        </PropsIsLoaded >
    )
}

export default Video;
