import React from 'react';
import { Button } from 'reactstrap';

import landing from "../images/landing.svg";
import "../CSS/landingComponent.css";

function LeftContent() {
    return (
        <div className="container" id="leftcontent">
            <div className="row">
                <h2 className="col-12">Learn with us</h2>
                <br />
                <p className="col-5">Where learning online becomes more interactive and fun. Experince effective learning from home with us.</p>
                <div class="col-12">
                    <Button className="start-btn">Get Started</Button>
                </div>
            </div>
        </div>
    );
};

function Landing() {
    return (
        <div id="landing-page">
            <LeftContent />
            <div id="landing-image" >
                <img src={landing} />
            </div>
        </div>

    );
};

export default Landing;
