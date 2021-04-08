import { Row, Spinner } from 'reactstrap';

function Loading(props) {

    return (
        <div className="center" >
            <Spinner style={{ width: '5rem', height: '5rem', color: "#8A2BE2", borderWidth: ".5em" }} />
            <Row><h3>{props.message}</h3></Row>
        </div>

    )
}
export default Loading
