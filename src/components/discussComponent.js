import { useState, useEffect } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Card, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, CardHeader, CardBody, CardFooter, Button, Form, CardTitle, FormGroup, Label, Input, CustomInput, Collapse } from "reactstrap"
import { connect } from 'react-redux';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';


const AskQue = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const closeCard = () => setIsOpen(false)

    return (
        <div>
            <Card className="askques-card">
                <Form>
                    <CardHeader className="d-flex justify-content-between">

                        <h3 color="primary">Ask Question</h3>

                    </CardHeader>
                    <CardBody>
                        <FormGroup className="askQues-input">
                            <Input type="text" name="question" id="question" style={{ backgroundColor: "#fff" }} placeholder="Your question here" bsSize="lg" />
                        </FormGroup>
                        <FormGroup className="askQues-input">
                            <Input type="textarea" name="desc" id="desc" style={{ backgroundColor: "#fff" }} placeholder="Description of your Question" />
                        </FormGroup>
                        {/* Add file attachment UI and backend */}
                        <FormGroup>
                            {/* <Label for="addresources" className="col-md-3" >Additional Resources</Label> */}
                            <CustomInput type="file" id="file" name="file" label="upload file" />
                        </FormGroup>
                    </CardBody>
                    <CardFooter className="d-flex justify-content-end">
                        <Button className="btn-success">Add</Button>
                    </CardFooter>

                </Form>
            </Card>
        </div>
    );
}
function Discuss(props) {

    console.log(props)
    const [subjectItems, setSubjectItems] = useState([{ name: "Loading..." }]);
    const [userData, setUserData] = useState(props.profile);
    const [selectedSubject, setSelectedSubject] = useState("Subjects");
    const [discussPath,setDiscussPath] = useState("");


    const firestore = getFirestore();
    const firebase = useFirebase();


    const DropdownBtn = (props) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [items, setItems] = useState(props.items);
        const [header, setHeader] = useState(props.header);

        const toggle = () => setDropdownOpen(prevState => !prevState);

        const fetcher = (e) => {
            if(userData.role == "faculty"){
                console.log("fac",e.target.value);
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
                            <DropdownItem key={index} value={item.name} onClick={fetcher} sem={item.sem} branch={item.branch}>{item.name}</DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </Dropdown>
        )

    }

    const fetchDiscuss = (e) => {
        console.log("WE HAVE FETCHED THE DISCUSS");
    }


    const fetchSubject = () => {
        console.log("Fetching....");
        if (props.profile.role === "student") {
            const branch = userData.branch;
            const path = `${userData.college}/sem${userData.sem}`
            const dispath = `${path}/${branch}`
            setDiscussPath(dispath);
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
        fetchSubject()
    }, [])




    return (
        <>
        {props.auth.uid ? 
        <div className="Discuss" style={{ marginTop: "100px" }}>
            <div className=" row offset-md-3">
                <div className="col-md-4">
                    <DropdownBtn header="Subjects" items={subjectItems} />
                    {console.log(selectedSubject)}
                </div>
            </div>
            <br />
            <hr />
            <div className="row justify-content-around">
                <div className="col-md-6">
                    <ListGroup>
                        <ListGroupItem>
                            <ListGroupItemHeading>Question</ListGroupItemHeading>
                            <ListGroupItemText>
                                Description of the question
                        </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Question</ListGroupItemHeading>
                            <ListGroupItemText>
                                Description of the question
                        </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Question</ListGroupItemHeading>
                            <ListGroupItemText>
                                Description of the question
                        </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Question</ListGroupItemHeading>
                            <ListGroupItemText>
                                Description of the question
                        </ListGroupItemText>
                        </ListGroupItem>
                    </ListGroup>
                </div>
                <div className="col-md-3">
                    <AskQue />
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
