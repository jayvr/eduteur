import React, { useState } from "react";
import '../carousel.css';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


function Item(props) {
    const [level, setLevel] = useState(props.level)
    const [id, setID] = useState(props.id)
    const [data, setData] = useState(props.data)
    const [index, setIndex] = useState(props.index)

    const className = 'item level' + props.level

    const handleClick = () => {
        console.log(data)
        props.center(index)
    }

    return (
        <div className={className} onClick={handleClick}>
            {data.name}
        </div>
    )
}


function Carousel(props) {

    const [items, setItems] = useState(props.items)
    const [active, setActive] = useState(props.active)
    const [direction, setDirection] = useState("")
    const [isLeftEnd, setLeftEnd] = useState(true)
    const [isRightEnd, setRightEnd] = useState(false)
    // const [touchPosition, setTouchPosition] = useState(null)

    // const handleTouchStart = (e) => {
    //     const touchDown = e.touches[0].clientX
    //     setTouchPosition(touchDown)
    // }

    // const handleTouchMove = (e) => {
    //     const touchDown = touchPosition
    //     if (touchDown === null) {
    //         return
    //     }
    //     const currentTouch = e.touches[0].clientX
    //     const diff = touchDown - currentTouch
    //     if (diff > 20) {
    //         moveRight()
    //     }
    //     if (diff < -20) {
    //         moveLeft()
    //     }
    //     setTouchPosition(null)
    // }


    const setNewActive = (act) => {
        setActive(act)

        if (act === 0) {
            setLeftEnd(true)
            setRightEnd(false)
        } else if (act === items.length - 1) {
            console.log(act);
            setRightEnd(true)
            setLeftEnd(false)
        } else {
            setLeftEnd(false)
            setRightEnd(false)
        }
        props.fetch(act)
    }

    const generateItems = () => {
        var newItems = []
        var level

        for (var i = active - 2; i < active + 3; i++) {
            var index = i
            if (i < -1) {
                i += 2
                index = i
            } else if (i < 0) {
                i++
                index = i
            }
            else if (i >= items.length) {
                index = items.length - 1
                break
            }
            level = active - i
            newItems.push(<Item key={index} index={index} id={items[index].id} level={level} data={items[index]} center={setNewActive} left={moveLeft} right={moveRight} />)
        }
        return newItems
    }

    const moveLeft = () => {
        var newActive = active
        newActive--
        if (newActive === 0) {
            setLeftEnd(true)
        } else {
            setLeftEnd(false)
            setRightEnd(false)
        }
        const currentActive = newActive < 0 ? 0 : newActive
        setActive(currentActive)
        setDirection("left")
        props.fetch(currentActive)

    }

    const moveRight = () => {
        var newActive = active + 1
        if (newActive === items.length - 1) {
            setRightEnd(true)
        } else {
            setRightEnd(false)
            setLeftEnd(false)
        }
        const currentActive = (newActive) >= items.length - 1 ? items.length - 1 : newActive
        setActive(currentActive)
        setDirection("right")
        props.fetch(currentActive)
    }
    // onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
    return (
        <div id="carousel" className="noselect car-container">

            <div className={"arrow arrow-left " + (isLeftEnd ? "end" : "")} onClick={moveLeft}><FiChevronLeft /></div>
            {/* <ReactCSSTransitionGroup */}
            {/* transitionName={this.state.direction}> */}
            {generateItems()}
            {/* </ReactCSSTransitionGroup> */}
            <div className={"arrow arrow-right " + (isRightEnd ? "end" : "")} onClick={moveRight}><FiChevronRight /></div>

        </div>
    )
}

export default Carousel;
