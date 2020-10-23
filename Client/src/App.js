import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';


const App = (props) => {
  const [state, setState] = React.useState('');

  React.useEffect(() => {
    axios.get('/api/hello')
      .then(res => setState(res.data))
      .catch(err => console.log(err))
  }, []);

  return (
    <div>
      Home
      <p>{state}</p>
    </div>
  );
}

export default App;
