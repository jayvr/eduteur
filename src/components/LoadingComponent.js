import { Row, Spinner } from 'reactstrap';

function Loading(props) {

    return (
        <div className="center" >
            <Spinner style={{ width: '5rem', height: '5rem', color: "#ff589e", borderWidth: ".5em" }} />
            <Row><h3>{props.message}</h3></Row>
        </div>

    )
}
export default Loading
