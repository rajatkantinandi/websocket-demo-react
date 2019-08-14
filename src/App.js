import React, { useState, createRef, useEffect } from 'react';
import './App.css';

function App() {
  const [socket] = useState(new WebSocket('ws://dot-show.glitch.me/echo'));
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const responsesRef = createRef();

  socket.addEventListener('open', function (event) {
    setSocketConnected(true);
  });

  socket.addEventListener('message', function (event) {
    setResponses([...responses, { message: event.data, from: 'server' }]);
  });

  const sendMessage = (ev) => {
    ev.preventDefault();
    setResponses([...responses, { message: 'You-> ' + message, from: 'you' }]);
    socket.send(message);
    setMessage('');
  };

  useEffect(() => {
    if (responsesRef && responsesRef.current) {
      responsesRef.current.scrollTop = responsesRef.current.scrollHeight;
    }
  }, [responses, responsesRef]);

  return (
    <div className="App">
      <header>
        <h1>Websocket Echo Test</h1>
      </header>
      <main>
        {responses.length > 0 &&
          <ul ref={responsesRef}>
            {
              responses.map((response, idx) => (
                <li key={idx} className={'message ' + response.from}>{response.message}</li>
              ))
            }
          </ul>
        }
        {isSocketConnected
          ? <form onSubmit={sendMessage} className='messageForm'>
            <label htmlFor="message">Send Message to Server</label>
            <div className="sendWidget">
              <input
                type="text"
                id="message"
                placeholder="Enter message to send"
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                autoFocus
                autoComplete="off"
                required />
              <button className="sendBtn">Send</button>
            </div>
          </form>
          : <div className='connecting'>Connecting to Socket.. Please wait</div>
        }
      </main>
    </div>
  );
}

export default App;
