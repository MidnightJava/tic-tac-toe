import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function getLocation(i) {
  let x = i % 3;
  let y = i <= 2 ? 0 : (i <= 5 ? 1 : 2)
  return ` (${x},${y})`
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    count += lines[i].filter(l => squares[l]).length
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null, count];
}


function Square(props) {
  return (
    <button className={`square${props.winner ? ' winner' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winner={this.props.winningSquares.includes(i) && (this.props.lastStep === null || this.props.lastStep)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      [0,3,6].map(i => {
        return (
          <div className="board-row" key={i}>
           {[0,1,2].map(j => {
              return this.renderSquare(i + j)
            })}
          </div>
         )
      })
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: ''
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      moveOrder: 0,
      winningSquares: [],
      lastStep: null
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: getLocation(i)
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step, lastStep) {
    console.log(`step ${step} last ${lastStep}`)
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      lastStep
    });
  }
  
  toggleMoveOrder() {
    this.setState(prevState => {
      return {moveOrder: 1 - prevState.moveOrder}
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winningSquares, count] = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + step.location:
        'Go to game start';
      let cname = move === this.state.stepNumber ? 'bold' : '';
      return (
        <li key={move}>
          <button className={cname} onClick={() => this.jumpTo(move, move === history.length-1)}>{desc}</button>
        </li>
      );
    }).sort(item => this.state.moveOrder ? item.key: -item.key);

    let status;
    if (winner) {
      status = "Winner: " + winner;
      setTimeout(() => this.setState({winningSquares}));
    } else if (count === 24) {
      status = "DRAW"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={this.state.winningSquares}
            lastStep={this.state.lastStep}
            onClick={i => this.handleClick(i)}
          />
          <button className='toggle-btn' onClick={this.toggleMoveOrder.bind(this)}>Toggle Moves Order</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
