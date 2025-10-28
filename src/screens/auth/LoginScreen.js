import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function LoginScreen({ navigation }) {
  const { login, serverStatus } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(null);
  const [checkingServer, setCheckingServer] = useState(true);

  // Check server status on component mount
  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setCheckingServer(true);
    const status = await api.checkServerStatus();
    setServerOnline(status.online);
    setCheckingServer(false);
  };

  const onLogin = async () => {
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Show server status on successful login
      if (serverStatus) {
        Alert.alert('Login Successful', `Server Status: ${serverStatus.status}\nVersion: ${serverStatus.version}`);
      }
    } catch (e) {
      Alert.alert('Login failed', e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      {/* Server Status Indicator */}
      <View style={styles.serverStatusContainer}>
        {checkingServer ? (
          <View style={[styles.serverStatus, styles.serverChecking]}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.serverStatusText}>Checking server...</Text>
          </View>
        ) : serverOnline ? (
          <View style={[styles.serverStatus, styles.serverOnline]}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.serverStatusText}>Server Online</Text>
            <Text style={styles.serverUrl}>{api.API_URL}</Text>
          </View>
        ) : (
          <View style={[styles.serverStatus, styles.serverOffline]}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.serverStatusText}>Server Offline</Text>
            <TouchableOpacity onPress={checkServer} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!!process.env.EXPO_PUBLIC_LOGO_URL && (
        <Image source={{ uri: process.env.EXPO_PUBLIC_LOGO_URL }} style={styles.logo} />
      )}
      <Text style={styles.title}>RedAngels' Catering Creator</Text>
      <TextInput placeholder="Email" autoCapitalize='none' keyboardType='email-address' style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TouchableOpacity
        style={[styles.button, !serverOnline && styles.buttonDisabled]}
        onPress={onLogin}
        disabled={loading || !serverOnline}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing in...' : serverOnline ? 'Login' : 'Server Unavailable'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerWrap}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  serverStatusContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10
  },
  serverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  serverOnline: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#10b981'
  },
  serverOffline: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  serverChecking: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  statusDot: {
    fontSize: 12,
    color: '#065f46'
  },
  serverStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    flex: 1
  },
  serverUrl: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace'
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  retryText: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 12
  },
  logo: { width: 140, height: 140, resizeMode: 'contain', alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#b91c1c' },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#b91c1c', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '700' },
  registerWrap: { alignItems: 'center', marginTop: 12 },
  registerText: { color: '#b91c1c', fontWeight: '600' }
});
