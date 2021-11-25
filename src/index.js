import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
// function component
function Square(props) {
  const squareStyle = props.winTrackLabel
    ? { backgroundColor: "#DBEFBC", color: "#5F634F" }
    : { backgroundColor: null };
  return (
    <button
      style={squareStyle}
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winTrackLabel = false;
    if (this.props.winTrack) {
      winTrackLabel = this.props.winTrack.indexOf(i) > -1;
    }
    return (
      <Square
        winTrackLabel={winTrackLabel}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  loopTable() {
    // practice 3
    let table = [];
    for (let row = 0; row < 3; row++) {
      let child = [];
      for (let col = 0; col < 3; col++) {
        child.push(this.renderSquare(col * 3 + row));
      }
      table.push(<div className="board-row">{child}</div>);
    }

    return table;
  }
  render() {
    return (
      <div>
        {this.loopTable()}
        {/* <div className="board-row">
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
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      orderToggle: true, // order toggle practice 4. add order toggle
      winTrack: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // deep copy array(copy by value)
    this.state.winTrack = calculateWinner(squares).winTrack;
    if (calculateWinner(squares).winTrack || squares[i]) {
      this.setState({
        winTrack: calculateWinner(squares).winTrack,
      });
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    //console.log(squares);
    this.setState({
      history: history.concat([{ squares: squares, movPosition: i }]), // movPosition for practice 1. Display location
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winTrack: calculateWinner(squares).winTrack, // log win blocks practice 5. highlight squares
    });
  }
  jumpTo(step) {
    console.log(step);
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  orderClick() {
    this.setState({
      orderToggle: !this.state.orderToggle,
    });
  }
  render() {
    const history = this.state.history;
    console.log(this.state.stepNumber);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " position(" +
          ((step.movPosition % 3) + 1) +
          "," +
          Math.floor(step.movPosition / 3 + 1) +
          ")"
        : "Go to game start";
      const logButtonStyle = // practice 2 bold the selected item
        move === this.state.stepNumber
          ? {
              backgroundColor: "#9bc4cb",
            }
          : {};
      return (
        <li ki={move}>
          <button style={logButtonStyle} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner" + winner;
    } else {
      if (this.state.stepNumber === 9 && !this.state.winTrack) {
        // draw practice 6. display message when draw
        alert("It's a draw!");
      }
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winTrack={this.state.winTrack}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol style={{ listStyleType: "none" }}>
            {this.state.orderToggle ? moves : moves.reverse()}
          </ol>
          <button onClick={() => this.orderClick()}>orderToggle</button>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    if (
      squares[lines[i][0]] &&
      squares[lines[i][0]] === squares[lines[i][1]] &&
      squares[lines[i][0]] === squares[lines[i][2]]
    ) {
      console.log("Winner is " + squares[lines[i][0]]);
      return { winner: squares[lines[i][0]], winTrack: lines[i] };
    }
  }
  return { winner: null, winTrack: null };
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
