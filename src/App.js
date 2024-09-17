// src/App.js
import React from 'react';
import Chat from './components/Chat';
import './index.css'; // Importing global CSS

const App = () => {
  return (
      <div className="app">
          <h1>Llama3 Chat Interface</h1>
          <Chat />
      </div>
  );
};

export default App;
