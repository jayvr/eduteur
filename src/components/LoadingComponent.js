import { Row } from 'reactstrap';
import '../loading.css';

function Loading(props) {

    return (
        <div className="center" >
            <svg id="page-loader">
                <circle cx="60" cy="60" r="8" />
                <circle cx="60" cy="60" r="20" />
                <circle cx="60" cy="60" r="35" />
                <circle cx="60" cy="60" r="50" />
            </svg>
            <Row><h3 style={{ marginLeft: "15px" }}>{props.message}</h3></Row>
        </div>
    )
}
export default Loading
