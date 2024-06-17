import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/ui.css';

function App() {
  const textbox = React.useRef<HTMLInputElement>(undefined);
  const vhbox = React.useRef<HTMLInputElement>(undefined);

  const countRef = React.useCallback((element: HTMLInputElement) => {
    if (element) {element.value = '5';}
    textbox.current = element;
  }, []);

  const vhRef = React.useCallback((element: HTMLInputElement) => {
    if (element) {element.value = 'not selected';}
    vhbox.current = element;
  }, []);

  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  const onParse = () => {
    parent.postMessage({ pluginMessage: {type: 'parse-vh'}}, '*')
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
      if (type === 'select-element') {
        vhbox.current.value = message
      }
    };
  }, []);

  return (
    <div>
      <img src={logo} />
      <h2>View Hierarchy Parser</h2>
      <p>
        Count: <input ref={countRef} />
      </p>
      <p>
        Selected VH: <input type="text" ref={vhRef} readOnly />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button id="parse" onClick={onParse}>
        Parse VH
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default App;
