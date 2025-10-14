import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (password !== confirm) return Alert.alert('Error', 'Passwords do not match');
    setLoading(true);
    try {
      await register({ name, email: email.trim(), password, phone, location });
      Alert.alert('Success', 'Account created. Please log in.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Registration failed', e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" autoCapitalize='none' keyboardType='email-address' style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Cellphone Number" keyboardType='phone-pad' style={styles.input} value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Location" style={styles.input} value={location} onChangeText={setLocation} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TextInput placeholder="Repeat Password" secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />
      <TouchableOpacity style={styles.button} onPress={onRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginVertical: 16, color: '#b91c1c' },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#b91c1c', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' }
});

