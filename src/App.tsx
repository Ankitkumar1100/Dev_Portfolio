import React from 'react';
import Portfolio from './components/Portfolio';
import VoiceAgent from './components/VoiceAgent/VoiceAgent';
import './components/VoiceAgent/VoiceAgent.css';

function App(): JSX.Element {
  return (
    <>
      <Portfolio />
      
      {/* Voice Agent - Floating widget */}
      <VoiceAgent 
        position="bottom-right"
        primaryColor="#218096"
        agencyName="Your Agency Name"
        initialMessage="Hi! I'm here to help you learn about our web development, mobile app development, and system integration services. Feel free to speak to me or type your questions!"
        showToggle={true}
        theme="light"
      />
    </>
  );
}

export default App;
