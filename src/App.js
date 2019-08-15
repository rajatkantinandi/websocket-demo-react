import React, { useState, createRef, useEffect } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const responsesRef = createRef();

  // Initially connect to socket
  useEffect(() => {
    setSocket(new WebSocket('wss://dot-show.glitch.me/echo'));
  }, []);

  // attach event listeners
  useEffect(() => {
    function onOpen(event) {
      setSocketConnected(true);
    }

    function onMessage(event) {
      setResponses([...responses, { message: event.data, from: 'server' }]);
    }

    if (socket) {
      socket.addEventListener('open', onOpen);
      socket.addEventListener('message', onMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('message', onMessage);
      }
    };
  }, [responses, socket]);

  // Scroll to bottom
  useEffect(() => {
    if (responsesRef && responsesRef.current) {
      responsesRef.current.scrollTop = responsesRef.current.scrollHeight;
    }
  }, [responses, responsesRef]);

  const sendMessage = (ev) => {
    ev.preventDefault();
    setResponses([...responses, { message: 'You-> ' + message, from: 'you' }]);
    socket.send(message);
    setMessage('');
  };

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
