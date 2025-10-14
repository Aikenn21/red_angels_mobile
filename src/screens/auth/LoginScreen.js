import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login failed', e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      {!!process.env.EXPO_PUBLIC_LOGO_URL && (
        <Image source={{ uri: process.env.EXPO_PUBLIC_LOGO_URL }} style={styles.logo} />
      )}
      <Text style={styles.title}>RedAngels' Catering Creator</Text>
      <TextInput placeholder="Email" autoCapitalize='none' keyboardType='email-address' style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerWrap}>
        <Text style={styles.registerText}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { width: 140, height: 140, resizeMode: 'contain', alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#b91c1c' },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#b91c1c', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  registerWrap: { alignItems: 'center', marginTop: 12 },
  registerText: { color: '#b91c1c', fontWeight: '600' }
});
