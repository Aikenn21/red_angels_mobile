import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import api from '../../lib/api';
import * as ImagePicker from 'expo-image-picker';
import upload from '../../lib/upload';

export default function AdminSettings() {
  const [gcashPhone, setGcashPhone] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/settings/payment');
    if (data.settings) {
      setGcashPhone(data.settings.gcashPhone || '');
      setQrImageUrl(data.settings.qrImageUrl || '');
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      await api.put('/settings/payment', { gcashPhone, qrImageUrl });
      Alert.alert('Saved', 'Payment settings updated');
    } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const pickQr = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission required', 'Please allow photo library access');

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Fixed: Changed from MediaTypeOptions.Images
      allowsEditing: true,
      quality: 0.8
    });

    if (!res.canceled && res.assets?.[0]) {
      setUploading(true);
      try {
        const url = await upload(res.assets[0].uri);
        setQrImageUrl(url);
        Alert.alert('Success', 'QR code uploaded successfully!');
      } catch (e) {
        Alert.alert('Upload failed', e.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Payment Settings</Text>
      <TextInput placeholder='GCash Phone Number' style={styles.input} value={gcashPhone} onChangeText={setGcashPhone} />
      {!!qrImageUrl && <Image source={{ uri: qrImageUrl }} style={{ width: 220, height: 220, alignSelf: 'center', marginVertical: 12, borderWidth:1, borderColor:'#b91c1c', borderRadius:8 }} />}
      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={pickQr}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : qrImageUrl ? 'Change QR Image' : 'Import QR Image'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={save}><Text style={styles.buttonText}>Save Settings</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '700' }
});
