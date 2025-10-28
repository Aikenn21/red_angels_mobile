import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../../lib/api';
import * as ImagePicker from 'expo-image-picker';
import upload from '../../lib/upload';

export default function UserTransactions() {
  const [items, setItems] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [method, setMethod] = useState('CASH');
  const [amount, setAmount] = useState('');
  const [gcashPhone, setGcashPhone] = useState('');
  const [receiptImageUrl, setReceiptImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/transactions/me');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const createTx = async () => {
    try {
      await api.post('/transactions', { bookingId: Number(bookingId), method, amount: amount? Number(amount): undefined, gcashPhone: gcashPhone||undefined, receiptImageUrl: receiptImageUrl||undefined });
      Alert.alert('Submitted', 'Transaction created');
      setBookingId(''); setAmount(''); setGcashPhone(''); setReceiptImageUrl('');
      load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const pickReceipt = async () => {
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
        setReceiptImageUrl(url);
        Alert.alert('Success', 'Receipt uploaded successfully!');
      } catch (e) {
        Alert.alert('Upload failed', e.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Create Transaction</Text>
      <TextInput placeholder='Booking ID (accepted only)' value={bookingId} onChangeText={setBookingId} keyboardType='numeric' style={styles.input} />
      <View style={styles.segmentWrap}>
        <TouchableOpacity style={[styles.segment, method==='CASH' && styles.segmentActive]} onPress={()=>setMethod('CASH')}><Text style={[styles.segmentText, method==='CASH' && styles.segmentTextActive]}>Cash</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.segment, method==='GCASH' && styles.segmentActive]} onPress={()=>setMethod('GCASH')}><Text style={[styles.segmentText, method==='GCASH' && styles.segmentTextActive]}>E‑Money (GCash)</Text></TouchableOpacity>
      </View>
      <TextInput placeholder='Amount (optional)' value={amount} onChangeText={setAmount} keyboardType='numeric' style={styles.input} />
      {method==='GCASH' && (
        <>
          <TextInput placeholder='GCash Phone' value={gcashPhone} onChangeText={setGcashPhone} keyboardType='phone-pad' style={styles.input} />
          {!!receiptImageUrl && <Image source={{ uri: receiptImageUrl }} style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: 8, borderRadius: 8 }} />}
          <TouchableOpacity
            style={[styles.button, uploading && styles.buttonDisabled]}
            onPress={pickReceipt}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? 'Uploading...' : receiptImageUrl ? 'Change Receipt' : 'Upload Receipt (Optional)'}
            </Text>
          </TouchableOpacity>
          {method==='GCASH' && !receiptImageUrl && (
            <Text style={styles.helperText}>Note: Receipt upload is optional but recommended for faster verification</Text>
          )}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={createTx}><Text style={styles.buttonText}>Submit Payment</Text></TouchableOpacity>

      <Text style={[styles.title, { marginTop: 12 }]}>My Transactions</Text>
      <FlatList data={items} keyExtractor={i => String(i.id)} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>#{item.id} — {item.booking?.cateringType?.name}</Text>
          <Text>Method: {item.method}</Text>
          <Text>Status: {item.status}</Text>
          {item.amount != null && <Text>Amount: ₱{item.amount.toFixed(2)}</Text>}
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '700' },
  helperText: { fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 4, marginBottom: 8, textAlign: 'center' },
  segmentWrap: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  segment: { flex: 1, borderWidth: 1, borderColor: '#b91c1c', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: '#b91c1c' },
  segmentText: { color: '#b91c1c', fontWeight: '700' },
  segmentTextActive: { color: '#fff' },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 }
});
