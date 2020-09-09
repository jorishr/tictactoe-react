import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * We’ll want the top-level Game component to display a list of past moves. 
 * It will need access to the history to do that, so we will place the history 
 * state in the top-level Game component.
 * 
 * State is thus removed from Board and lifted up again
 */

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {
/*     constructor(props){
        super(props)
        this.state = { 
            squares: Array(9).fill(null),
            xIsNext: true 
        }
    } */
/*     handleClick = (i) => {
        const squares = this.state.squares.slice();
        //if winner or square is already filled
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        })
    } */
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={ () => this.props.onClick(i) }
            />
        )
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
 
class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }
    /** 
     * The stepNumber state we’ve added reflects the move displayed to the 
     * user now. After we make a new move, we need to update stepNumber by 
     * adding stepNumber: history.length as part of the this.setState argument. 
     * This ensures we don’t get stuck showing the same move after a new one has 
     * been made. We will also replace reading this.state.history with 
     * this.state.history.slice(0, this.state.stepNumber + 1). This ensures that 
     * if we “go back in time” and then make a new move from that point, we throw 
     * away all the “future” history that would now become incorrect.
    */

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        //if winner or square is already filled
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //add a the updated state to the history array
            //use concat instead of push() to keep data immutable
            history: history.concat([
                { squares: squares }
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    //when going back into the history of the game update state with step and
    //set player status
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        //rendering the currently selected move according to stepNumber:
        //const current = history[history.length - 1]
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const description = move ?
                `Go to move: ${move}` :
                `Go to game start`
            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move)}}>
                        {description}
                    </button>
                </li>
            )
        })

        let status;
        if(winner){
            status = `Winner ${winner}`;
        } else {
            status = this.props.xIsNext ? 'Next player: X' : 'Next player: O';
        }
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    onClick={(i) => this.handleClick(i)}
                    squares={current.squares}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
 
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    //all possible lines, including diagonals
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
    //return X, O or null
}