import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import UserHome from './screens/user/UserHome';
import UserBookings from './screens/user/UserBookings';
import UserTransactions from './screens/user/UserTransactions';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminCateringTypes from './screens/admin/AdminCateringTypes';
import AdminRequests from './screens/admin/AdminRequests';
import AdminSettings from './screens/admin/AdminSettings';
import AdminTransactions from './screens/admin/AdminTransactions';
import AdminCalendar from './screens/admin/AdminCalendar';
import AdminUsers from './screens/admin/AdminUsers';
import ProfileScreen from './screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#b91c1c',
    background: '#fff',
    card: '#b91c1c',
    text: '#111',
    border: '#b91c1c'
  }
};

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#b91c1c' },
      headerTintColor: '#fff',
      tabBarActiveTintColor: '#b91c1c',
      tabBarInactiveTintColor: '#6b7280',
      tabBarLabelStyle: { fontWeight: '700' },
      tabBarIcon: ({ color, size }) => {
        const map = { Home: 'home', Bookings: 'calendar', Transactions: 'card', Profile: 'person' };
        return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
      }
    })}>
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Bookings" component={UserBookings} />
      <Tab.Screen name="Transactions" component={UserTransactions} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#b91c1c' },
      headerTintColor: '#fff',
      tabBarActiveTintColor: '#b91c1c',
      tabBarInactiveTintColor: '#6b7280',
      tabBarLabelStyle: { fontWeight: '700' },
      tabBarIcon: ({ color, size }) => {
        const map = { Dashboard: 'speedometer', CateringTypes: 'restaurant', Requests: 'list', Calendar: 'calendar', Settings: 'settings', Profile: 'person', Tx: 'card' };
        return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
      }
    })}>
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="CateringTypes" component={AdminCateringTypes} options={{ title: 'Catering Types' }} />
      <Tab.Screen name="Requests" component={AdminRequests} />
      <Tab.Screen name="Accounts" component={AdminUsers} options={{ title: 'Manage Accounts' }} />
      <Tab.Screen name="Calendar" component={AdminCalendar} />
      <Tab.Screen name="Tx" component={AdminTransactions} options={{ title: 'Transactions' }} />
      <Tab.Screen name="Settings" component={AdminSettings} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#b91c1c' }, headerTintColor: '#fff' }}>
        {!user && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "RedAngels' Login" }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        {user?.role === 'USER' && (
          <Stack.Screen name="User" component={UserTabs} options={{ headerShown: false }} />
        )}
        {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
          <Stack.Screen name="Admin" component={AdminTabs} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
