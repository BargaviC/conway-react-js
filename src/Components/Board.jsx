
import React from 'react';
import Square from './Square';

class Board extends React.Component {
    constructor(props) {
        super(props);
        const board = [];

        const size = 25;
        var living = 0;

        for (let i = 0; i < size; i++) {
            board.push([]);
            for (let j = 0; j < size; j++) {
                board[i].push(Math.random() > 0.9 ? 1 : 0);
                living += board[i][j];
            }
        }


        this.state = {
            board: board,
            generation: 0,
            paused: false,
            stopped: false,
            living: living,
            history: [board]
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (!this.state.paused) {
                this.nextGeneration();
            }
        }, 1000);
    }

    countNeighbours(i, j) {
        const neighbours = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        let count = 0;

        neighbours.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;

            if (newI >= 0 && newI < this.state.board.length && newJ >= 0 && newJ < this.state.board[0].length) {
                count += this.state.board[newI][newJ];
            }
        });

        return count;
    }

    stopIfNeeded(newBoard, living) {
        const previouslySeen = this.state.history.find((board) => {
            return board.toString() === newBoard.toString();
        });
        if (newBoard.toString() === this.state.board.toString() || living === 0 || previouslySeen) {
            clearInterval(this.interval);
            this.setState({
                stopped: true
            });
        }
    }

    nextGeneration() {
        var living = 0;
        const newBoard = this.state.board.map((row, i) => {
            return row.map((cell, j) => {
                const neighbours = this.countNeighbours(i, j);
                var result = 0;
                if (cell === 1) {
                    if (neighbours < 2 || neighbours > 3) {
                        result = 0;
                    } else {
                        result = 1;
                    }
                } else {
                    if (neighbours === 3) {
                        result = 1;
                    } else {
                        result = 0;
                    }
                }
                living += result;
                return result;
            });
        });

        this.stopIfNeeded(newBoard, living);
        this.setState({
            board: newBoard,
            generation: this.state.generation + 1,
            living: living,
            history: [...this.state.history, newBoard],
        });

        // console.log(this.state.board);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onStop() {
        clearInterval(this.interval);
        this.setState({
            stopped: true
        });
    }

    onPause() {
        this.setState({
            paused: !this.state.paused
        });
    }

    render() {
        return (
            <>
            <span className='heading'>
                <span>Conway's Game of Life</span>
            </span>
            <div className='mainBody'>
                <div className='board'>
                    {this.state.board.map((row, i) => {
                        return (
                            <div className="row" key={i}>
                                {row.map((cell, j) => {
                                    return <Square key={`${i}-${j}`} state={cell} />
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className='controls'>
                        Generation: {this.state.generation}
                        <button onClick={() => {this.onStop()}} disabled={this.state.stopped}> Stop </button>
                        <button onClick={() => {this.onPause()}} disabled={this.state.stopped}> {this.state.paused ? 'Restart' : 'Pause'} </button>
                    </div>
                </div>
            </>
        );

        // console.log(this.state.generation)

        return main;
    }
}

export default Board;