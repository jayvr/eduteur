import { useState, useEffect } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Card, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, CardHeader, CardBody, CardFooter, Button, Form, CardTitle, FormGroup, Label, Input, CustomInput, Collapse, Badge } from "reactstrap"
import { connect } from 'react-redux';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import AskQue from "./askQueComponent"
import { FiChevronRight } from 'react-icons/fi';
import { Accordion } from 'react-bootstrap';

function Discuss(props) {

    // console.log(props)
    const [userData, setUserData] = useState(props.profile);
    const [subjectItems, setSubjectItems] = useState([{ name: "Loading..." }]);
    const [discussItems, setDiscussItems] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState("Subjects");
    const [selectedSubjectData, setSelectedSubjectData] = useState({});
    const [discussPath, setDiscussPath] = useState("");
    const [selectedQue, setSelectedQue] = useState("");
    const [replies, setReplies] = useState("No answers available");

    const [subjectLoaded, setSubjectLoaded] = useState(false);
    const [showAsk, toggleAsk] = useState(false)


    const firestore = getFirestore();
    const firebase = useFirebase();


    const DropdownBtn = (props) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [items, setItems] = useState(props.items);
        const [header, setHeader] = useState(props.header);

        const toggle = () => setDropdownOpen(prevState => !prevState);

        const fetcher = (e) => {
            if (userData.role === "faculty") {
                console.log("fac", e.target.value);
            }
            setSelectedSubject(e.target.value);
            fetchDiscuss(e)
        }

        return (
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                    {header}
                </DropdownToggle>
                <DropdownMenu >
                    {
                        items.map((item, index) => (
                            <DropdownItem key={index} id={index} value={item.name} onClick={fetcher} sem={item.sem} branch={item.branch}>{item.name}</DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </Dropdown>
        )

    }

    async function fetchDiscuss(e) {

        let discPath = "";
        const id = e.target.id;
        const selectedSub = subjectItems[id];
        setSelectedSubjectData(selectedSub);

        if (props.profile.role === "student")
            discPath = `${userData.college}/sem${userData.sem}/${userData.branch}/discussion/${e.target.value}`;
        else if (props.profile.role === "faculty") {
            discPath = `${userData.college}/sem${selectedSub.sem}/${selectedSub.branch}/discussion/${e.target.value}`;
        } else {
            // DO NOTHING
        }

        setDiscussPath(discPath);
        console.log(discPath);

        let data = [];

        const discussRef = firestore.collection(discPath);
        const snapshot = await discussRef.get();
        snapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id })

        });
        console.log(data);
        setDiscussItems(data);

    }


    const fetchSubject = () => {
        console.log("Fetching....");
        if (props.profile.role === "student") {
            const branch = userData.branch;
            const path = `${userData.college}/sem${userData.sem}`
            // const dispath = `${path}/${branch}`
            // setDiscussPath(dispath);
            console.log("Subject path: " + path)
            firestore.doc(path).get().then((doc) => {
                if (doc.exists) {
                    const data = doc.get(branch)
                    console.log(data);
                    setSubjectItems(data);
                } else {
                    console.log("No such doc or field exists!")
                }
            }).catch((error) => console.log(error))
        }
        else if (props.profile.role === "faculty") {
            // console.log("UserData: " + userData.subjects[0].name);
            const tpath = userData.college;
            setDiscussPath(tpath);
            const subjects = userData.subjects;
            console.log(subjects);
            setSubjectItems(subjects);
        } else {
            // DO NOthing
        }
    }

    useEffect(() => {
        fetchSubject();
        setSubjectLoaded(true);
    }, [])

    async function fetchReplies(e) {
        console.log(discussItems[e.target.id]);
        const path = `${props.profile.college}/${discussItems[e.target.id].sem}/${discussItems[e.target.id].branch}/discussion/${discussItems[e.target.id].subject}/${discussItems[e.target.id].id}/reply`;
        let repliesData = [];
        const replyRef = firestore.collection(path);
        const replysnapshot = await replyRef.get();
        replysnapshot.forEach((doc) => {
            // console.log("replypath:", doc.data());
            // console.log(replies);
            repliesData.push({ ...doc.data(), id: doc.id });
        })
        setReplies(repliesData);
    }

    const addReply = (e) => {

    }


    return (
        <>
            {
                props.auth.uid ?
                    <div className="discuss" style={{ marginTop: "100px" }}>
                        <div className=" row offset-md-3">
                            <div className="col-md-4 select-subject">
                                <DropdownBtn header={selectedSubject} items={subjectItems} />
                            </div>
                        </div>
                        <br />
                        <hr />
                        <div className="row justify-content-around discuss-ques-list">
                            <div className="col-md-6">
                                <div className="discuss-selected-subject"><h2>{selectedSubject === "Subjects" ? "" : selectedSubject}</h2></div>
                                <ListGroup>
                                    {
                                        discussItems &&
                                        discussItems.map((item, index) => (
                                            <ListGroupItem key={index}>
                                                {
                                                    console.log("Index: " + index)
                                                }
                                                <ListGroupItemHeading>
                                                    <p className="discuss-author">{item.author}</p>
                                                    <p className="discuss-ques-module">
                                                        <Badge>{item.moduleName}</Badge>
                                                    </p>
                                                </ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    <p className="discuss-ques">Q.)  {item.title}</p>
                                                </ListGroupItemText>
                                                <div className="discuss-ques-ans">
                                                <Accordion >
                                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    <Button id={index} value={index} onClick={fetchReplies}>Answer<FiChevronRight id={index} value={index} /></Button>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey="0">
                                                        <>
                                                        {
                                                        //    code to display the answers from "replies"
                                                        }
                                                        </>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                                    {/* {console.log(replies)} */}
                                                </div>
                                            </ListGroupItem>
                                        ))
                                    }
                                </ListGroup>
                            </div>
                            <div className="col-md-3 ask-btn">
                                <Button className="askques-toggler" onClick={() => toggleAsk(!showAsk)}>Ask Question</Button>
                                {
                                    showAsk && subjectLoaded ?
                                        <AskQue subjects={subjectItems} />
                                        :
                                        <> </>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        {window.location.replace("http://localhost:3000/")}
                    </>
            }
        </>
    );
}
const MapStateToProps = (state) => {
    console.log(state)
    return {
        profile: state.firebase.profile,
        auth: state.firebase.auth,
        firebase: state.firebase
    };
};

export default connect(MapStateToProps)(Discuss);
