import { useState } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Card, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, CardHeader, CardBody, CardFooter, Button, Form, CardTitle, FormGroup, Label, Input, CustomInput, Collapse } from "reactstrap"


const DropdownBtn = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [items, setItems] = useState(props.items);
    const [header, setHeader] = useState(props.header);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle style={{ backgroundColor: "blueviolet", color: "white" }} caret>
                {header}
            </DropdownToggle>
            <DropdownMenu>
                {
                    items.map((item) => (
                        <DropdownItem key={item.id} >{item.name}</DropdownItem>
                    ))
                }
            </DropdownMenu>
        </Dropdown>


    )

}

const AskQue = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const closeCard = () => setIsOpen(false)

    return (
        <div>
            <Card className="askques-card">
                <Form>
                    <CardHeader className="d-flex justify-content-between">
                        <div className="askques-card-heading" onClick={toggle} style={{
                            cursor: "pointer",
                        }}>
                            <h3 color="primary" style={{ marginBottom: '1rem' }}>Ask Question</h3>
                        </div>
                        {isOpen ?
                            <div className="col-4">
                                <Input type="reset" value="Reset" />
                            </div> : <> </>}
                    </CardHeader>
                    <Collapse isOpen={isOpen} >
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
                                <CustomInput type="file" id="file" name="file" label="upload file" />+
                            </FormGroup>
                        </CardBody>
                        <CardFooter className="d-flex justify-content-end">
                            <Button className="btn-success">Ask</Button> {"  "}
                            <Button color="danger" onClick={toggle}
                            >Cancel</Button>
                        </CardFooter>
                    </Collapse>
                </Form>
            </Card>
        </div>
    );
}
function Discuss() {


    const subjectItems = [
        {
            id: 1,
            name: "Maths"
        },
        {
            id: 2,
            name: "Physics"
        },
        {
            id: 3,
            name: "Chemistry"
        }

    ]

    const moduleItems = [
        {
            id: 1,
            name: "Module 1"
        },
        {
            id: 2,
            name: "Module 2"
        },
        {
            id: 3,
            name: "Module 3"
        },
        {
            id: 4,
            name: "Module 4"
        }

    ]

    return (
        <div className="Discuss" style={{ marginTop: "100px" }}>
            <div className=" row offset-md-3">
                <div className="col-md-4">
                    <DropdownBtn header="Subjects" items={subjectItems} />
                </div>
                <div className="col-md-4">
                    <DropdownBtn header="Modules" items={moduleItems} />
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
    );
}

export default Discuss;
