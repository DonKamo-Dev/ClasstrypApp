import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import HomeScreen from '../screens/client/HomeScreen';
import ExplorarScreen from '../screens/client/ExplorarScreen';
import CuentaScreen from '../screens/client/CuentaScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? typography.semibold : typography.regular,
        color: focused ? colors.secondary : '#9CA3AF',
      }}>{label}</Text>
    </View>
  );
}

function PlaceholderScreen({ title }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>🚧</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>{title}</Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>Próximamente</Text>
    </View>
  );
}

export default function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Descubrir"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Descubrir" focused={focused} /> }}
      />
      <Tab.Screen
        name="Explorar"
        component={ExplorarScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Explorar" focused={focused} /> }}
      />
      <Tab.Screen
        name="Paquetes"
        component={() => <PlaceholderScreen title="Mis Paquetes" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="✈️" label="Paquetes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Reservas"
        component={() => <PlaceholderScreen title="Mis Reservas" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Reservas" focused={focused} /> }}
      />
      <Tab.Screen
        name="Cuenta"
        component={CuentaScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Cuenta" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
