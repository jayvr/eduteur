import { Row } from 'reactstrap';
import '../loading.css';

function Loading(props) {

    return (
        <div className="center" >
            <svg id="page-loader">
                <circle cx="75" cy="75" r="20" />
                <circle cx="75" cy="75" r="35" />
                <circle cx="75" cy="75" r="50" />
                <circle cx="75" cy="75" r="65" />
            </svg>
            <Row><h3 style={{ marginLeft: "10px" }}>{props.message}</h3></Row>
        </div>
    )
}
export default Loading
