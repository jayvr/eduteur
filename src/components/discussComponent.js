import { useState, useEffect } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Card, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, CardHeader, CardBody, CardFooter, Button, Form, CardTitle, FormGroup, Label, Input, CustomInput, Collapse } from "reactstrap"
import { connect } from 'react-redux';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import AskQue from "./askQueComponent"

function Discuss(props) {

    // console.log(props)
    const [userData, setUserData] = useState(props.profile);
    const [subjectItems, setSubjectItems] = useState([{ name: "Loading..." }]);
    const [discussItems, setDiscussItems] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState("Subjects");
    const [selectedSubjectData, setSelectedSubjectData] = useState({});
    const [discussPath, setDiscussPath] = useState("");

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
                <DropdownToggle style={{ backgroundColor: "blueviolet", color: "white" }} caret>
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


    return (
        <>
            {
                props.auth.uid ?
                    <div className="Discuss" style={{ marginTop: "100px" }}>
                        <div className=" row offset-md-3">
                            <div className="col-md-4">
                                <DropdownBtn header={selectedSubject} items={subjectItems} />
                            </div>
                        </div>
                        <br />
                        <hr />
                        <div><h3>{selectedSubject === "Subjects" ? "" : selectedSubject}</h3></div>
                        <div className="row justify-content-around">
                            <div className="col-md-6">
                                <ListGroup>
                                    {
                                        discussItems &&
                                        discussItems.map((item, index) => (
                                            <ListGroupItem key={index}>
                                                <ListGroupItemHeading>{item.title} ---{item.author}</ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {item.dec}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        ))
                                    }
                                </ListGroup>
                            </div>
                            <div className="col-md-3">
                                <Button onClick={() => toggleAsk(!showAsk)}>Ask Que</Button>
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
