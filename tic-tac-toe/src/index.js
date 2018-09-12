import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
    className="square"
    // When a click is made, it can read the click function from the passed props!
    onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
      <Square 
      //This is us passing props to the Square, including a prop to handle clicks!
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
      );
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
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    calculateWinner(squares) {
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
        // Squares a b and c are potential win formations. e.g. 3,4,5 -> middle row win formation
        const [a, b, c] = lines[i];
        // Logic for the below:
        // If square a has a move, and squares b + c also have the same move => a win!
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    }

    handleClick(i) {
      // Copying all the squares in the state with slice(), adjusting the one we need to 
      // and then re-saving all squares as the new state
      const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (this.calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = this.calculateWinner(current.squares);

      const moves = history.map((step,move) => {
        const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        return (
          // Vital: use of key so React knows how to dynamically update the list
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })


      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              // Pass the boilerplate handleClick function down to the Board for execution
              // The 'i' is filled in at the board level when the function is invoked
              onClick={(i) => this.handleClick(i)}
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
  