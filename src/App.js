import './App.css';
import config from './config';
import React from "react";
import Card from "./components/Card";
import Popup from 'reactjs-popup';

class App extends React.Component {

    constructor() {
        super();
        // this.state = {cards: this.prepareCards(), clicks: 0, isPopupOpened: false}
        this.state = {cards: [], clicks: 0, isPopupOpened: false, isBestScore: false}  //первоначально в state размещать пустые данные
        // this.state = {cards: [], clicks: 0, isPopupOpened: false, isBestScore: false, time: {minutes: 0, seconds: 0}}


        // this.seconds = 0;
        // this.minutes = 0;
        // this.interval = null;
        // this.startTimer();
    }

    componentDidMount() {
        this.startGame();  //начать игру после отрисовки компонента
    }

    startGame() {  //функция обеспечивает правильный старт всех состояний (карточек, кликов, поп-апа)
        this.setState({
            cards: this.prepareCards(),
            clicks: 0,
            isPopupOpened: false,
            isBestScore: false,
        });   //обновить state, исходя из новых данных
    }



    // startTimer() {
    //     clearInterval(this.interval);
    //     this.interval =
    //         setInterval(this.timer, 1000);
    // }
    //
    // stopTimer() {
    //     clearInterval(this.interval);
    // }
    //
    // resetTimer() {
    //     clearInterval(this.interval);
    //     this.minutes = "00";
    //     this.seconds = "00";
    // }
    //
    //
    // timer() {
    //     this.seconds++;
    //     if (this.seconds === 60) {
    //         this.minutes++;
    //         this.seconds = 0;
    //     }
    //
    //     return {
    //         minutes: this.minutes,
    //         seconds: this.seconds
    //     }

        // this.state.time.seconds++;
        // if (this.state.time.seconds === 60) {
        //     this.state.time.minutes++;
        //     this.state.time.seconds = 0;
        // }

    // }

    prepareCards() {
        let id = 1;
        return [...config.cards, ...config.cards]
            .sort(() => Math.random() - 0.5)
            .map(item => ({...item, id: id++, isOpened: false, isCompleted: false}));
    }

    choiceCardHandler(openedItem) {
        //не обрабатывать уже открытые карточки (для экономии) + запретить открытие более двух карточек за раз
        if (openedItem.isCompleted || this.state.cards.filter(item => item.isOpened).length >= 2) {
            return;  //дальнейший код не выполняется, больше карточек не откроется
        }

        this.setState({
            cards: this.state.cards.map(item => {
                // если элемент массива имеет тот же id, что и открытый (передан в метод) - возвращается новый item: объект со всеми теми же свойствами, но флаг isOpened заменен на true; если сейчас кликнули не на этот элемент - массив не меняется, в него возвращается тот же item
                return item.id === openedItem.id ? {...item, isOpened: true} : item
            })
        }, () => {
            this.processChoosingCards();
        });

        this.setState({
            clicks: this.state.clicks + 1
        });

        // console.log(openedItem.name);
    }

    processChoosingCards() {
        const openedCards = this.state.cards.filter(item => item.isOpened); //взять массив открытых карточек
        if (openedCards.length === 2) {   //если их там уже 2
            if (openedCards[0].name === openedCards[1].name) {  //сравнить их названия
                this.setState({     //если совпадают, пройтись по всему массиву
                    cards: this.state.cards.map(item => {
                            if (item.id === openedCards[0].id || item.id === openedCards[1].id) { //если имя совпадает с одной из открытых, изменить флаг isCompleted
                                item.isCompleted = true;  //пометить как найденную
                            }
                            item.isOpened = false;  //у всех станет закрытое состояние
                            return item;
                        }
                    )
                }, () => {
                    this.checkForAllCompleted();
                })
            } else {  //закрыть все через 1 сек
                setTimeout(() => {
                    this.setState({
                        cards: this.state.cards.map(item => {
                            item.isOpened = false;  //у всех станет закрытое состояние
                            return item;
                        })
                    })
                }, 1000)
            }
        }
    }

    //проверка, что все isCompleted (игра завершена)
    checkForAllCompleted() {
        if (this.state.cards.every(item => item.isCompleted)) {
            this.setState({
                isPopupOpened: true
            });

            const bestScore = localStorage.getItem('bestScore');  //посмотреть лучший результат в LS
            if (bestScore !== null && this.state.clicks < parseInt(bestScore)) {  //если там что-то есть, сравнить результаты
                localStorage.setItem('lastBestScore', bestScore);  //сразу что есть в bestScore на момент проверки записать в lastBestScore, чтобы далее к нему обращаться
                localStorage.setItem('bestScore', this.state.clicks);  //записать в bestScore новый результат, если он меньше
                this.setState({isBestScore: true});
            } else if (bestScore === null) {  //если там ничего (это первая игра) - записать что есть
                localStorage.setItem('bestScore', this.state.clicks);
                this.setState({isBestScore: true});
            }


        }
    }

    closePopup() {
        this.setState({
            isPopupOpened: false
        });
        this.startGame(); //запустить новую игру (сбросить все значения в state)
    }

    render() {
        return (
            <div className="App">
                <header className={"header"}>Memory Game</header>

                <div className="game">
                    <div className="score">Нажатий: {this.state.clicks}</div>

                    {/*<div className="timer">Время: {this.timer().minutes} : {this.timer().seconds}</div>*/}


                    <div className="cards">
                        {
                            this.state.cards.map(item => (
                                <Card item={item} key={item.id} isShowed={item.isOpened || item.isCompleted}
                                      onChoice={this.choiceCardHandler.bind(this)}/>
                            ))
                        }
                    </div>
                </div>

                <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)}>
                    <div className="modal">
                        <span className="close" onClick={this.closePopup.bind(this)}>
                            &times;
                        </span>

                        {/*если это был лучший результат*/}
                        {this.state.isBestScore &&
                            <div className="game-complete">Игра завершена! <br/> Вы показали лучший результат! Ваш
                                результат: {this.state.clicks} кликов!</div>}
                        {/*после первой игры не покажется (в lastBestScore ничего) */}
                        {this.state.isBestScore && localStorage.getItem('lastBestScore') &&
                            <div className="best-score">Прежний лучший
                                результат: {localStorage.getItem('lastBestScore')} кликов.</div>}

                        {/*если не лучший*/}
                        {!this.state.isBestScore && <div className="game-complete">Игра завершена! <br/> Ваш
                            результат: {this.state.clicks} кликов!</div>}
                        {!this.state.isBestScore && <div className="best-score">Лучший
                            результат: {localStorage.getItem('bestScore')} кликов.</div>}

                    </div>
                </Popup>
            </div>
        );
    }

}

export default App;
