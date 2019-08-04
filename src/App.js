import React, { useState } from 'react';
import './App.css';

function App() {
  const [socket] = useState(new WebSocket('ws://dot-show.glitch.me/echo'));
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  socket.addEventListener('open', function (event) {
    console.log('Connection Established!');
  });

  socket.addEventListener('message', function (event) {
    setResponses([...responses, { message: event.data, from: 'server' }]);
  });

  const sendMessage = (ev) => {
    ev.preventDefault();
    setResponses([...responses, { message: 'You-> ' + message, from: 'you' }]);
    socket.send(message);
  };

  return (
    <div className="App">
      <header>
        <h1>Websocket Echo Test</h1>
      </header>
      <main>
        <form onSubmit={sendMessage}>
          <label htmlFor="message">Send Message to Server</label><br /><br />
          <input
            type="text"
            id="message"
            placeholder="Enter message to send"
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            autoFocus
            autoComplete="off" /> &nbsp;
          <button>Send</button>
        </form>
        <hr />
        {responses.length > 0 &&
          <ul>
            <h2>Responses</h2>
            {
              responses.map((response, idx) => (
                <li key={idx} className={'message ' + response.from}>{response.message}</li>
              ))
            }
          </ul>
        }
      </main>
    </div>
  );
}

export default App;
