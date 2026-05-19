import { useState } from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
import WizardScreen from './src/screens/WizardScreen';
import SupabaseTestScreen from './src/screens/SupabaseTestScreen';

// Cambiar a false cuando ya no necesites el test de conexión
const SHOW_SUPABASE_TEST = false;

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [wizardAnswers, setWizardAnswers] = useState(null);

  if (SHOW_SUPABASE_TEST) {
    return <SupabaseTestScreen />;
  }

  if (screen === 'wizard') {
    return (
      <WizardScreen
        onComplete={(answers) => {
          setWizardAnswers(answers);
          setScreen('welcome');
        }}
      />
    );
  }

  return <WelcomeScreen onStartWizard={() => setScreen('wizard')} />;
}
