import { useState } from 'react';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import IntroGuidePage from './components/IntroGuidePage';
import { AppProvider } from './context/AppContext';

function App() {
  const [stage, setStage] = useState<'landing' | 'guide' | 'studio'>('landing');

  return (
    <AppProvider>
      {stage === 'landing' && <LandingPage onStart={() => setStage('guide')} />}
      {stage === 'guide' && (
        <IntroGuidePage
          onBack={() => setStage('landing')}
          onContinue={() => setStage('studio')}
        />
      )}
      {stage === 'studio' && <MainLayout />}
    </AppProvider>
  );
}

export default App;
