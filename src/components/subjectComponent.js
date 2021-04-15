import { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import Video from "./videoComponent";
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { connect, useSelector } from 'react-redux';
import Loading from "./LoadingComponent";

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

    const firestore = getFirestore();
    const firebase = useFirebase();

    const DropdownBtn = (props) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [items, setItems] = useState(props.items);
        const [header, setHeader] = useState(props.header);

        const toggle = () => setDropdownOpen(prevState => !prevState);

        const fetcher = (e) => {
            console.log("inside fetcher")
            if (props.fetch == "subjects") {
                // subject
            } else if (props.fetch == "modules") {
                // modules
                setSelectedSubject(e.target.value)
                fetchModules(e.target.value)
                // console.log("inside fetcher" + e.target.value)
            } else if (props.fetch == "topics") {
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
                <DropdownMenu>
                    {
                        items.map((item, index) => (
                            <DropdownItem key={index} value={item.name} onClick={fetcher}>{item.name}</DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </Dropdown>
        )

    }


    const ListTopics = (props) => {

        const [topics, setTopics] = useState(props.topics);

        return (
            <ListGroup>
                {
                    topics.map((topic) => (
                        <ListGroupItem to="#" key={topic.id} action>
                            <ListGroupItemHeading>{topic.title} --- {topic.moduleName}</ListGroupItemHeading>
                            <ListGroupItemText>{topic.dec}</ListGroupItemText>
                        </ListGroupItem>
                    ))
                }
            </ListGroup>
        )
    }

    // console.log("UserData: " + userData);

    const fetchSubject = () => {

        const branch = userData.branch;
        const path = `${userData.college}/sem${userData.sem}`
        console.log("Subject path: " + path)
        firestore.doc(path).get().then((doc) => {
            if (doc.exists) {
                const data = doc.get(branch)
                // console.log("data respond: " + data)
                setSubjectItems(data);
                // const data = doc.get(branch)
                // console.log(subjectItems);
            } else {
                console.log("No such doc or field exists!")
            }
        }).catch((error) => console.log(error))

        // console.log("Subject state" + subjectItems);
    }

    const fetchModules = (name) => {
        // const index = e.target.id;
        // const name = e.target.value;

        const path = `${userData.college}/sem${userData.sem}/${userData.branch}/${name}`
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

    async function fetchTopics(name) {
        const path = `${userData.college}/sem${userData.sem}/${userData.branch}/${selectedSubject}/${name}`;
        var data = [];

        const topicRef = firestore.collection(path);
        const snapshot = await topicRef.get();
        snapshot.forEach((doc) => {
            data.push({ ...doc.data() })
        });
        setTopicItems(data)
    }


    useEffect(() => {
        // const profile = props.profile
        // if (isLoaded(profile)) {
        //     fetchSubject()
        // }
        fetchSubject()
    }, [])


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
            <Container>
                <br />
                <hr />
                <Row className="justify-content-around">
                    <div className="subject col-sm-4 col-md-1">
                        <DropdownBtn header={selectedSubject} items={subjectItems} fetch="modules" />
                    </div>
                    <div className="module col-sm-4 offset-md-1 col-md-1">
                        <DropdownBtn header={selectedModule} items={moduleItems} fetch="topics" />
                    </div>
                    {/* <div className="module col-sm-4 offset-md-1 col-md-1">
                        <DropdownBtn header={selectedTopic} items={topicItems} fetch="data" />
                    </div> */}
                </Row>
                <hr />
                <br />
                <container>
                    <ListTopics topics={topicItems} />
                </container>

                {/* <Video /> */}

            </Container>

        </ProfileIsLoaded>
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
