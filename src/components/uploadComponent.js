import { useState } from "react";
import { Container, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Form, Row, Input, FormGroup, Label, Button, CustomInput } from "reactstrap"


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
                        <DropdownItem key={item.id} >{item.title}</DropdownItem>
                    ))
                }
            </DropdownMenu>
        </Dropdown>
    )

}


function Upload(props) {

    const subjectItems = [
        {
            id: 1,
            title: "Maths"
        },
        {
            id: 2,
            title: "Physics"
        },
        {
            id: 3,
            title: "Chemistry"
        }

    ]

    const moduleItems = [
        {
            id: 1,
            title: "Module 1"
        },
        {
            id: 2,
            title: "Module 2"
        },
        {
            id: 3,
            title: "Module 3"
        },
        {
            id: 4,
            title: "Module 4"
        }

    ]
    const topicItems = [
        {
            id: 1,
            title: "Topic 1",
            desc: "Description of Topic 1"
        },
        {
            id: 2,
            title: "Topic 2",
            desc: "Description of Topic 2"
        },
        {
            id: 3,
            title: "Topic 3",
            desc: "Description of Topic 3"
        },
        {
            id: 4,
            title: "Topic 4",
            desc: "Description of Topic 4"
        },
        {
            id: 5,
            title: "Topic 5",
            desc: "Description of Topic 5"
        }
    ]

    return (
        <Form>
            <Container>
                <h1>Upload/Go Live</h1>
                <FormGroup className=" row offset-md-3">
                    <div className="col-md-4">
                        <DropdownBtn header="Subjects" items={subjectItems} />
                    </div>
                    <div className="col-md-4">
                        <DropdownBtn header="Modules" items={moduleItems} />
                    </div>
                </FormGroup>
                <FormGroup className="row">
                    <Label for="title" className="col-md-3">Title</Label>
                    <Input className="col-md-8" type="text" name="title" id="title" placeholder="Title for the video" />
                </FormGroup>
                <FormGroup className="row">
                    <Label for="desc" className="col-md-3">Description</Label>
                    <Input className="col-md-8" type="textarea" name="desc" id="exampleText" placeholder="Add Description" />
                </FormGroup>
                <FormGroup className="row">
                    <Label for="videofile" className="col-md-3" >Video File</Label>
                    <CustomInput className="col-md-8" type="file" id="videofile" name="customFvideofileile" label="Yo, pick a file!" />
                </FormGroup>
                <FormGroup className="row">
                    <Label for="addresources" className="col-md-3" >Additional Resources</Label>
                    <CustomInput className="col-md-8" type="file" id="videofile" name="videofile" label="Yo, pick a file!" />
                </FormGroup>
                <Row className="offset-md-3 ">
                    <Button style={{ backgroundColor: "green" }} className="col-md-4">Upload</Button>
                    <Button style={{ backgroundColor: "red" }} className="offset-md-1 col-md-4">GO LIVE!</Button>
                </Row>
            </Container>
        </Form >
    )
}

export default Upload;
