import { useState, useEffect } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Card, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, CardHeader, CardBody, CardFooter, Button, Form, CardTitle, FormGroup, Label, Input, CustomInput, Collapse, ButtonGroup, ButtonDropdown } from "reactstrap"
import { connect } from 'react-redux';
import { getFirestore } from 'redux-firestore';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { FiPlus, FiMinus, FiChevronUp, FiChevronDown } from "react-icons/fi"


const AskQue = (props) => {

    const [subjectItems, setSubjectItems] = useState(props.subjects);
    const [moduleItems, setModuleItems] = useState([{ id: "0", name: "select the subject" }]);
    const [userData, setUserData] = useState(props.profile);
    const [formData, setformData] = useState({
        college: props.profile.college,
        title: "",
        desc: "",
        module: "",
        subject: "",
        author: "",
        sem: "",
        branch: "",
        uid: "",
        moduleID: "",
    })
    const [selectedSubject, setSelectedSubject] = useState("Subjects");
    const [selectedModule, setSelectedModule] = useState("Modules");
    const [subjectPath, setSubjectPath] = useState("");

    const [video, setVideo] = useState(null)
    const [file, setFile] = useState(null)

    const [progress, setProgress] = useState(0);
    // const [dropdownOpen, setDropdownOpen] = useState(false);

    // const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [modToggle, setMod] = useState(false);
    const [linkToggle, setLink] = useState(false);

    const firebase = useFirebase();
    const firestore = getFirestore();

    // useEffect(() => {
    //     setSubjectItems(props.subjects)
    // }, [])


    const DropdownBtn = (props) => {
        const [items, setItems] = useState(props.items);
        const [header, setHeader] = useState(props.header);

        const [dropdownOpen, setDropdownOpen] = useState(false);
        const toggle = () => setDropdownOpen(prevState => !prevState);

        let toggleClass = "subject-toggle";
        let toggleDrop = "subject-drop";

        if (props.from === "module") {
            toggleClass = "module-toggle";
            toggleDrop = "module-drop";
        }

        const fetcher = (e) => {
            console.log("inside fetcher")
            if (props.from === "subject") {
                setSelectedSubject(e.target.value);
                fetchModule(e)
            } else if (props.from === "module") {
                handleModule(e)
            }
        }


        return (
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle id={toggleClass}>
                    {header}
                    {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                </DropdownToggle>
                <DropdownMenu id={toggleDrop}>
                    {items &&
                        items.map((item, index) => (
                            <DropdownItem key={index} id={index} value={item.name} onClick={fetcher} >{item.name}</DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </ButtonDropdown>
        )
    }

    // extract the modules form the selected subject field
    const fetchModule = (e) => {
        const index = e.target.id;
        const name = e.target.value;
        const selectedSub = subjectItems[index];
        let path = "";

        if (props.profile.role === "student") {
            path = `${userData.college}/sem${userData.sem}/${userData.branch}/${name}`;
            setformData({
                ...formData,
                subject: name,
                branch: userData.branch,
                sem: "sem" + userData.sem,
            })
        } else if (props.profile.role === "faculty") {
            path = `${userData.college}/sem${selectedSub.sem}/${selectedSub.branch}/${name}`;
            setformData({
                ...formData,
                subject: name,
                branch: selectedSub.branch,
                sem: "sem" + selectedSub.sem,
            })
        } else {
            // DO NOTHING
        }

        setSubjectPath(path);
        console.log("path to subject: " + path)

        firestore.doc(path).get()
            .then((doc) => {
                if (doc.exists && doc.data().modules != null) {
                    setModuleItems(doc.data().modules);
                    console.log(moduleItems);
                } else {
                    console.log("No such doc or field exists!")
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    };

    // Update modules in put formData state when a module is selected
    const handleModule = (e) => {

        setSelectedModule(e.target.value)
        setformData({
            ...formData,
            module: e.target.value,
            moduleID: e.target.id
        })
    };

    // Complete the formData state field with its respective value
    const handleChange = (e) => {
        const authName = props.profile.firstname + " " + props.profile.lastname;
        const authID = props.auth.uid;
        setformData({
            ...formData,
            [e.target.name]: e.target.value,
            author: authName,
            uid: authID
        })
    }
    // submit function of the form
    async function handleUpload(e) {

        e.preventDefault();

        var VideoURL = null;
        var FileURL = null;
        const videoName = formData.title;
        const fileName = videoName + " - Resources"

        console.log(formData);
        console.log(video);
        console.log(file);

        const fullpath = `${formData.college}/${formData.sem}/${formData.branch}/discussion/${formData.subject}/`;
        const path = `${formData.college}/${formData.sem}/${formData.branch}`

        console.log(fullpath);
        console.log(path);

        console.log(formData);

        (async () => {
            // if (linkToggle) {
            //     VideoURL = await fileUploader(fullpath, video, videoName);
            //     console.log("Video URL: " + VideoURL);
            // } else {
            //     VideoURL = video;
            //     console.log("Video URL: " + VideoURL);
            // }

        })().then(async () => {
            if (file != null) {
                // FileURL = await fileUploader(fullpath, file, fileName);
                console.log("File URL: " + FileURL);
            }
        }).then(async () => {
            console.log('Creating Document...');
            // make a new doc for every new video/topic
            await firestore.collection(`${fullpath}`)
                .add({
                    title: formData.title,
                    dec: formData.desc,
                    branch: formData.branch,
                    createdAt: new Date(),
                    module: formData.moduleID,
                    moduleName: formData.module,
                    sem: formData.sem,
                    subject: formData.subject,
                    author: formData.author,
                    uid: formData.uid,
                    fileURL: FileURL,
                    videoURL: VideoURL,
                    resloved: false
                })
                .then((res) => {
                    document.getElementById("upload-form").reset();
                    console.log("sucessfully added question")
                }).catch((error) => {
                    console.log(error);
                });
        })

    };

    return (
        <div>
            <Card className="askques-card">
                <Form>
                    <CardHeader className="d-flex justify-content-center">
                        <h3 color="primary">Ask Question</h3>
                    </CardHeader>
                    <CardBody>
                        <FormGroup className=" row">
                            <ButtonGroup>
                                <DropdownBtn className="subject-toggle" header={selectedSubject} items={subjectItems} from="subject" required data-error="Subject is Required." />
                                {"  "}
                                <DropdownBtn header={selectedModule} items={moduleItems} from="module" required data-error="module is Required." />
                            </ButtonGroup>
                        </FormGroup>
                        <FormGroup className="askQues-input">
                            <Input type="text" name="title" id="title" placeholder="Your question here" onChange={handleChange} />
                        </FormGroup>
                        <FormGroup className="askQues-input">
                            <Input type="textarea" name="desc" id="desc" style={{ backgroundColor: "#fff" }} placeholder="Description of your Question" onChange={handleChange} />
                        </FormGroup>
                        {/* Add file attachment UI and backend */}
                        {/* <FormGroup>
                            {/* <Label for="addresources" className="col-md-3" >Additional Resources</Label> }
                            <CustomInput type="file" id="file" name="file" label="upload file" />
                        </FormGroup> */}
                    </CardBody>
                    <CardFooter className="d-flex justify-content-end">
                        <Button style={{ width: "100px" }} className="btn-success" onClick={handleUpload}>Add</Button>
                    </CardFooter>

                </Form>
            </Card>
        </div>
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
export default connect(MapStateToProps)(AskQue);
