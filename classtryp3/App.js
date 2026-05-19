import 'react-native-url-polyfill/auto';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </LanguageProvider>
  );
}
