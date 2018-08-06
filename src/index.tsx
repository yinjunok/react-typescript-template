import * as React from 'react';
import { render } from 'react-dom';
import './style.css';

class App extends React.Component {
  public render() {
    return (
      <div className='container'>
        <div className='bg' />
        <p>你吵到我用 TNT 了!</p>
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('example'),
);
