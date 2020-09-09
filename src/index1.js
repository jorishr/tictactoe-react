import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//  Components classes that use the render method return JSX
//  The JSX consists of React elements
//  The <button /> syntax is transformed at build time to React.createElement('button')
//  Props or properties are available on React components when passed through,
//  Here Square receives a property called value, passed on by its parent, the Board
//  All React components must act like pure functions with respect to their props: read-only

class Square extends React.Component {
/*
-   State has been lifte to the parent component: Board
-   Since state is considered to be private to a component that defines it, 
we cannot update the Board’s state directly from Square.
-   The Square components are now 'controlled components'. The Board has full 
control over them.
*/
    render() {
        //console.log(this.props)
        return (
            <button 
                className="square"
                onClick={this.props.onClick}
            >
            {this.props.value}
            </button>
        );
    }
}

/*
Components that are stateless and only return JSX can be easily replaced by the 
shorter functional components syntax:

function Square(props) {
    return (
        <button className="square" onclick={props.onClick}>
            {props.value}
        </button>
    )
}
  
/*
-  By lifting the state up into the Board component we can keep track of the
state of each of the 9 child components
-   The initial state is an array of null values
-   These values will be modified by state changes to become either 'X' or 'O'

The board state may look like:
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]

-   The state needs to be passed down to the corresponding props
-   Use the index of each square, as it corresponds with the position in the state array
*/
class Board extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            squares: Array(9).fill(null),
            xIsNext: true 
        }
    }
    handleClick = (i) => {
        /*
        There are generally two approaches to changing data. The first approach 
        is to mutate the data by directly changing the data’s values. The second 
        approach is to replace the data with a new copy which has the desired changes.

        An ability to undo and redo certain actions is a common requirement in 
        applications. Avoiding direct data mutation lets us keep previous versions 
        of the game’s history intact, and reuse them later.

        Detecting changes in immutable objects is considerably easier. If the 
        immutable object that is being referenced is different than the previous 
        one, then the object has changed.
        */
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
    }
    renderSquare(i) {
        return (
            <Square 
                value={this.state.squares[i]}
                onClick={ () => this.handleClick(i) }
            />
        )
    }
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if(winner){
            status = `Winner ${winner}`;
        } else {
            status = this.state.xIsNext ? 'Next player: X' : 'Next player: O';
        }
  
        return (
            <div>
                <div className="status">{status}</div>
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
 
/**
 * We’ll want the top-level Game component to display a list of past moves. 
 * It will need access to the history to do that, so we will place the history 
 * state in the top-level Game component.
 */
class Game extends React.Component {
    render() {
        return (
            <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
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