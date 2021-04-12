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
        <>
            <Card>
                <Form>
                    <CardHeader className="d-flex justify-content-between">
                        <h3 color="primary" onClick={toggle} style={{ marginBottom: '1rem', cursor: "pointer" }}>Ask Question</h3>
                        {isOpen ?
                            <div className="col-4">
                                <Input type="reset" value="Reset" />
                            </div> : <> </>}
                    </CardHeader>
                    <Collapse isOpen={isOpen} >
                        <CardBody>
                            <CardTitle tag="h5">Question</CardTitle>
                            <FormGroup>
                                <Input type="text" name="question" id="question" placeholder="Your question here" bsSize="lg" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="textarea" name="desc" id="desc" placeholder="Description of your question" />
                            </FormGroup>
                            {/* Add file attachment UI and backend */}
                            <FormGroup>
                                {/* <Label for="addresources" className="col-md-3" >Additional Resources</Label> */}
                                <CustomInput type="file" id="file" name="file" label="upload file" />
                            </FormGroup>
                        </CardBody>
                        <CardFooter className="d-flex justify-content-end">
                            <Button color="primary">Ask</Button> {"  "}
                            <Button color="danger" onClick={toggle}
                            >Cancel</Button>
                        </CardFooter>
                    </Collapse>
                </Form>
            </Card>
        </>
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
        <div className="Discuss">
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
