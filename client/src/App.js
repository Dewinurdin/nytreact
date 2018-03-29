import React from 'react';
import axios from 'axios';

class App extends React.Component {
  componentDidMount = () => {

    axios.get("http://localhost:3000/test")
    .then((response) => {
      console.log("Axios Response: ", response.data);
    })
    .catch((err) => {
      console.log("Axios Err: ", err.response);
    })
  };
  render() {
    return (
      <div className="App">
          <h1 className="App-title">Welcome to React</h1>
      </div>
    );
  }
}

export default App;
