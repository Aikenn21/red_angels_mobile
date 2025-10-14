import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import api from '../../lib/api';

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  const load = async () => {
    const { data } = await api.get('/transactions');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try { await api.put(`/transactions/${id}/status`, { status }); load(); } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>#{item.id} • {item.booking?.user?.name} • {item.booking?.cateringType?.name}</Text>
      <Text>Method: {item.method} • Status: {item.status}</Text>
      {item.amount != null && <Text>Amount: ₱{item.amount.toFixed(2)}</Text>}
      {item.method === 'GCASH' && item.receiptImageUrl && (
        <Image source={{ uri: item.receiptImageUrl }} style={{ width: 180, height: 180, marginTop: 8 }} />
      )}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TouchableOpacity style={styles.button} onPress={()=>setStatus(item.id,'CONFIRMED')}><Text style={styles.buttonText}>Confirm</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>setStatus(item.id,'FAILED')}><Text style={styles.buttonText}>Fail</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList data={items} keyExtractor={i=>String(i.id)} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700' },
  button: { backgroundColor: '#b91c1c', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' }
});

