import { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

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

const ListTopics = (props) => {

    const [topics, setTopics] = useState(props.topics);

    return (
        <ListGroup>
            {
                topics.map((topic) => (
                    <ListGroupItem to="#" key={topic.id} action>
                        <ListGroupItemHeading>{topic.title}</ListGroupItemHeading>
                        <ListGroupItemText>{topic.desc}</ListGroupItemText>
                    </ListGroupItem>
                ))
            }
        </ListGroup>
    )
}

function Subject() {

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
        <div>
            <Container>
                <br />
                <hr />
                <Row>
                    <div className="subject col-sm-4 col-md-1">
                        <DropdownBtn header="Subjects" items={subjectItems} />
                    </div>
                    <div className="module col-sm-4 offset-md-1 col-md-1">
                        <DropdownBtn header="Modules" items={moduleItems} />
                    </div>
                </Row>
                <hr />
                <br />
                <container>
                    <ListTopics topics={topicItems} />
                </container>
            </Container>
        </div>
    );
}

export default Subject;
