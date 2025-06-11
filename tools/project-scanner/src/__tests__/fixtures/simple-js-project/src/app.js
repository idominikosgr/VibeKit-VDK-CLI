// Main app component
const React = require('react');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  handleIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  handleDecrement = () => {
    this.setState(prevState => ({
      count: prevState.count - 1
    }));
  }

  render() {
    return React.createElement('div', { className: 'app' },
      React.createElement('h1', null, 'Counter App'),
      React.createElement('p', null, `Count: ${this.state.count}`),
      React.createElement('button', { onClick: this.handleIncrement }, 'Increment'),
      React.createElement('button', { onClick: this.handleDecrement }, 'Decrement')
    );
  }
}

function renderApp() {
  return '<div id="app">Server-side rendered content</div>';
}

module.exports = {
  App,
  renderApp
};
