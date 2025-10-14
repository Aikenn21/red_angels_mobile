import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import * as ImagePicker from 'expo-image-picker';
import upload from '../../lib/upload';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');

  const onSave = async () => {
    try {
      await api.put('/users/me', { name, phone, location, password: password || undefined, avatarUrl: avatarUrl || undefined, bio: bio || undefined });
      Alert.alert('Success', 'Profile updated');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission required', 'Please allow photo library access');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!res.canceled && res.assets?.[0]) {
      try {
        const up = await upload(res.assets[0].uri);
        setAvatarUrl(up.url);
      } catch (e) {
        Alert.alert('Upload failed', e.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar,{ backgroundColor:'#fee2e2', alignItems:'center', justifyContent:'center' }]}>
            <Text style={{ color:'#b91c1c' }}>No Photo</Text>
          </View>
        )}
        <TouchableOpacity style={[styles.button,{ marginTop:8, paddingVertical:8, paddingHorizontal:12 }]} onPress={pickAvatar}><Text style={styles.buttonText}>Change Photo</Text></TouchableOpacity>
      </View>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Name' />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder='Phone' />
      <TextInput style={[styles.input,{height:100,textAlignVertical:'top'}]} value={bio} onChangeText={setBio} placeholder='Description' multiline />
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder='Location / Address' />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='New Password (optional)' secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={onSave}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#991b1b' }]} onPress={logout}><Text style={styles.buttonText}>Logout</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', color: '#b91c1c', marginBottom: 12 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#b91c1c' },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' }
});
