import { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button, Alert } from 'reactstrap';
import Video from "./videoComponent";
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { connect, useSelector } from 'react-redux';
import { Link, Route, useParams, useRouteMatch } from "react-router-dom";
import Loading from "./LoadingComponent";
import Carousel from "./carouselComponent"



function useAsyncReference(value) {
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState(newState) {
        ref.current = newState;
        forceRender(s => !s);
    }

    return [ref, updateState];
}

function Subject(props) {

    const [subjectItems, setSubjectItems] = useState([{ name: "Loading..." }]);
    const [moduleItems, setModuleItems] = useState([{ name: "select subject " }]);
    const [topicItems, setTopicItems] = useState([]);
    const ref = useRef(topicItems)

    const [userData, setUserData] = useState(props.profile);
    const [docData, setDocData] = useState();

    const [selectedSubject, setSelectedSubject] = useState("Subjects");
    const [selectedModule, setSelectedModule] = useState("Modules");
    const [selectedTopic, setSelectedTopic] = useState("Topics");
    const [subjectPath, setSubjectPath] = useState("");
    const [topicPath, setTopicPath] = useState("");
    const [videoData, setVideoData] = useState(null);
    const [active, setActive] = useState(0);

    const [hideModule, toggleHide] = useState(false)

    let res = null;

    // firestore variables
    const firestore = getFirestore();
    const firebase = useFirebase();


    useEffect(() => {
        fetchSubject()
    }, [])


    const DropdownBtn = (props) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [items, setItems] = useState(props.items);
        const [header, setHeader] = useState(props.header);

        const toggle = () => setDropdownOpen(prevState => !prevState);

        const fetcher = (e) => {
            console.log("inside fetcher")
            if (props.fetch === "subjects") {
                // subject
            } else if (props.fetch === "modules") {
                // modules
                setSelectedSubject(e.target.value)
                fetchModules(e.target.value)
                // console.log("inside fetcher" + e.target.value)
            } else if (props.fetch === "topics") {
                // topic
                setSelectedModule(e.target.value)
                setTopicItems([]);
                fetchTopics(e.target.value)
            } else {
                // DO Nothing
            }
        }

        return (
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle style={{ backgroundColor: "blueviolet", color: "white" }} caret>
                    {header}
                </DropdownToggle>
                <DropdownMenu >
                    {
                        items.map((item, index) => (
                            <DropdownItem key={index} value={item.name} onClick={fetcher} >{item.name}</DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </Dropdown>
        )

    }


    const ListTopics = (props) => {
        const [topics, setTopics] = useState(props.topics);
        const [subject, setSubject] = useState(props.subject);
        const [module, setModule] = useState(props.module);

        const { url, path } = useRouteMatch();

        async function handleVideo(e) {
            console.log(e.target.id)

            const path = `${topicPath}/${e.target.id}`
            setTopicPath(path);

            res = topicItems.find(({ id }) => id === e.target.id)
            setSelectedTopic(res.title)
            // console.log(res)
            setVideoData(res);
        }

        return (
            <ListGroup>
                {
                    topics.map((topic) => (
                        <ListGroupItem onClick={handleVideo} id={topic.id} key={topic.id} action>
                            {/* <Link to={`/video/${topic.id}`}> */}
                            <ListGroupItemHeading id={topic.id}>{topic.title}</ListGroupItemHeading>
                            <ListGroupItemText id={topic.id}>{topic.dec}</ListGroupItemText>
                            <ListGroupItemText id={topic.id}>{topic.author}</ListGroupItemText>
                            {/* </Link> */}
                        </ListGroupItem>

                    ))
                }
            </ListGroup >
        )
    }

    const fetchSubject = () => {

        setVideoData(null);
        setTopicItems([]);

        if (props.profile.role === "student") {
            const branch = userData.branch;
            const path = `${userData.college}/sem${userData.sem}`
            console.log("Subject path: " + path)
            firestore.doc(path).get().then((doc) => {
                if (doc.exists) {
                    const data = doc.get(branch)
                    setSubjectItems(data);
                } else {
                    console.log("No such doc or field exists!")
                }
            }).catch((error) => console.log(error))
        }
        else if (props.profile.role === "faculty") {
            const subjects = userData.subjects;
            setSubjectItems(subjects)
        } else {
            // DO NOthing
        }
    }

    const fetchModules = (id) => {

        setVideoData(null);
        setTopicItems([]);

        console.log("props in subject: " + id)
        const selectedSub = subjectItems[id];
        const name = subjectItems[id].name;
        // const id = props.index;
        setSelectedSubject(name)
        // active = id;
        setActive(id)
        console.log("active in subject: " + active)

        let path = "";

        if (props.profile.role === "student")
            path = `${userData.college}/sem${userData.sem}/${userData.branch}/${name}`
        else if (props.profile.role === "faculty") {
            path = `${userData.college}/sem${selectedSub.sem}/${selectedSub.branch}/${name}`
        } else {
            // DO NOTHING
        }

        setSubjectPath(path);

        console.log("Module path: " + path)
        firestore.doc(path).get()
            .then((doc) => {
                if (doc.exists && doc.data().modules != null) {
                    setModuleItems(doc.data().modules);
                    console.log("moduleItems:" + moduleItems);
                } else {
                    console.log("No such doc or field exists!")
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    };

    function updateTopicItemsState(newState) {
        ref.current = newState;
        setTopicItems([
            ...topicItems,
            newState
        ]);
    }

    async function fetchTopics(e) {

        setSelectedModule(e.target.value);
        setVideoData(null);
        setTopicItems([]);

        const name = e.target.value;
        const path = `${subjectPath}/${name}`;
        setTopicPath(path);
        var data = [];

        const topicRef = firestore.collection(path);
        const snapshot = await topicRef.get();
        snapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id })

        });
        console.log(data)
        setTopicItems(data)
    }



    // display loding until user is profiled
    function ProfileIsLoaded({ children }) {
        const profile = useSelector(state => state.firebase.profile)
        if (!isLoaded(profile)) {
            return (
                <Loading message="Loading Profile..." />
            );
        }
        return children
    }

    return (
        <ProfileIsLoaded>
            {props.auth.uid?
            <>
            {/* <Container style={{ marginTop: "4em" }}> */}
            <div style={{ marginTop: "4em", marginLeft: "2em", marginRight: "2em" }}>
                <br />
                <Row>
                    <div className="col-12">
                        <Carousel items={subjectItems} active={active} fetch={fetchModules} />
                    </div>
                </Row>
                <hr />
                <Row>
                    <div ClassName="col">
                        {selectedSubject}/{selectedModule}
                    </div>
                </Row>
                <hr />
                <Button onClick={() => toggleHide(!hideModule)}> M </Button>
                <Row className="module-list">
                    {hideModule ?
                        <> </>
                        :
                        <ListGroup className="col-md-3">
                            {moduleItems &&
                                moduleItems.map((item, index) => (
                                    <ListGroupItem tag="button" key={index} id={index} value={item.name} onClick={fetchTopics} active={selectedModule === item.name ? true : false} action > {item.name}</ListGroupItem>
                                ))
                            }
                        </ListGroup>
                    }
                    {
                        videoData ?
                            <>
                                <Row>
                                    <Button onClick={() => {
                                        setVideoData(null)
                                        toggleHide(!hideModule)
                                    }}> back </Button>
                                </Row>
                                <Video subject={selectedSubject} module={selectedModule} topics={selectedTopic} path={topicPath} data={videoData} />
                            </>
                            :
                            <container className="fetch-topics" style={{ borderLeft: "1px solid #999", marginLeft: "30px", paddingLeft: "70px" }}>
                                <ListTopics subject={selectedSubject} module={selectedModule} topics={topicItems} />
                            </container>
                    }
                </Row>
                {/* <Route path="video/:videoID">
                    <Video subject={selectedSubject} module={selectedModule} topics={selectedTopic} path={topicPath} data={videoData} />
                </Route> */}
                {/* <Route path="video/:videoID">
                    <Video topicItems={topicItems} />
                </Route> */}
                {/* <Route path="video/:videoID" render={(props) => <Video topicItems={topicItems} />} /> */}
                {/* </Container> */}
            </div>
            <hr />
        </>
        :
          <>
          
          {window.location.replace("http://localhost:3000/")}
          </>  }
        </ProfileIsLoaded >
    );
}

const MapStateToProps = (state) => {
    console.log(state)
    return {
        profile: state.firebase.profile,
        auth: state.firebase.auth,
    };
};

export default connect(MapStateToProps)(Subject);
