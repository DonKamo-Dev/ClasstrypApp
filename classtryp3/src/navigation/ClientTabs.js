import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import HomeScreen from '../screens/client/HomeScreen';
import ExplorarScreen from '../screens/client/ExplorarScreen';
import CuentaScreen from '../screens/client/CuentaScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Descubrir: { outline: 'home-outline',     filled: 'home' },
  Explorar:  { outline: 'search-outline',   filled: 'search' },
  Paquetes:  { outline: 'airplane-outline', filled: 'airplane' },
  Reservas:  { outline: 'calendar-outline', filled: 'calendar' },
  Cuenta:    { outline: 'person-outline',   filled: 'person' },
};

function TabIcon({ name, focused }) {
  const icon = TAB_ICONS[name];
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Ionicons
        name={focused ? icon.filled : icon.outline}
        size={24}
        color={focused ? colors.secondary : '#9CA3AF'}
      />
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? typography.semibold : typography.regular,
        color: focused ? colors.secondary : '#9CA3AF',
      }}>{name}</Text>
    </View>
  );
}

function PlaceholderScreen({ title }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="construct-outline" size={48} color={colors.textSecondary} style={{ marginBottom: 12 }} />
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
          height: 80,
          paddingBottom: 12,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Descubrir"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Descubrir" focused={focused} /> }}
      />
      <Tab.Screen
        name="Explorar"
        component={ExplorarScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Explorar" focused={focused} /> }}
      />
      <Tab.Screen
        name="Paquetes"
        component={() => <PlaceholderScreen title="Mis Paquetes" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Paquetes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Reservas"
        component={() => <PlaceholderScreen title="Mis Reservas" />}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Reservas" focused={focused} /> }}
      />
      <Tab.Screen
        name="Cuenta"
        component={CuentaScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Cuenta" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
