import 'react-native-url-polyfill/auto';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
