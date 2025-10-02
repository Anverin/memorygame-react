import React from 'react';

class Timer extends React.Component {
    constructor() {
        super();
        this.state = { minute: 0, second: 0 };
        this.updateTimer = this.updateTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    updateTimer() {
        this.setState((state) => {
            return {
                second: state.second === 59 ? 0 : state.second + 1,
                minute: state.second === 59 ? state.minute + 1 : state.minute
            };
        });
    }

    resetTimer() {
        this.setState({ minute: 0, second: 0 });
    }

    render() {
        return (
            <>
                <p>
                    {this.state.minute}:{this.state.second}
                </p>

                {/*<Toggle updateTimer={this.updateTimer} resetTimer={this.resetTimer} />*/}
            </>
        );
    }
}

export default Timer;

// class Toggle extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { isToggleOn: false };
//         this.interval = null;
//         // This binding is necessary to make `this` work in the callback
//         this.handleClick = this.handleClick.bind(this);
//     }
//
//     componentDidUpdate(prevProps, prevState) {
//         if (prevState.isToggleOn !== this.state.isToggleOn) {
//             if (this.state.isToggleOn) {
//                 this.interval = setInterval(this.props.updateTimer, 1000);
//             } else {
//                 clearInterval(this.interval);
//                 this.props.resetTimer();
//             }
//         }
//     }
//
//     handleClick() {
//         this.setState((prevState) => ({
//             isToggleOn: !prevState.isToggleOn
//         }));
//     }
//
//     render() {
//         return (
//             <button onClick={this.handleClick}>
//                 {this.state.isToggleOn ? "OFF" : "ON"}
//             </button>
//         );
//     }
// }


// import React from 'react';
// import {useTimer} from "react-timer-and-stopwatch";
//
// function Timer() {
//         const timer = useTimer({
//             create: {
//                 stopwatch: {}
//             },
//             includeMilliseconds: false,
//             intervalRate: 1000
//         });
//
//         // return (
//         //     <span>Время: {timer.timerText}</span>
//         // );
//
//
//     const {pauseTimer, resetTimer, timerIsPaused, timerText} = timer;
//     return (
//         <>
//             <span>Time Left: {timerText}</span>
//             <button onClick={pauseTimer} disabled={timerIsPaused}>Pause</button>
//             <button onClick={() => resetTimer()}>Reset Timer</button>
//         </>
//     );
// }
//
// export default Timer;