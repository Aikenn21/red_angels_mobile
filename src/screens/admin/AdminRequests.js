import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../lib/api';

export default function AdminRequests() {
  const [items, setItems] = useState([]);
  const load = async () => {
    const { data } = await api.get('/bookings');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      load();
    } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const setProgress = async (id, progress) => {
    try { await api.put(`/bookings/${id}/progress`, { progress }); load(); } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Requested Schedules</Text>
      <FlatList data={items} keyExtractor={i=>String(i.id)} renderItem={({item})=> (
        <View style={styles.card}>
          <Text style={styles.name}>{item.user?.name} — {item.cateringType?.name}</Text>
          <Text>Date: {new Date(item.date).toISOString().slice(0,10)}</Text>
          <Text>Status: {item.status} • Progress: {item.progress}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            <TouchableOpacity onPress={()=>setStatus(item.id,'ACCEPTED')} style={styles.button}><Text style={styles.buttonText}>Accept</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'DENIED')} style={styles.button}><Text style={styles.buttonText}>Deny</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'CONFLICTED')} style={styles.button}><Text style={styles.buttonText}>Conflicted</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setProgress(item.id,'ONGOING')} style={styles.button}><Text style={styles.buttonText}>Mark Ongoing</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setProgress(item.id,'SUCCESS')} style={styles.button}><Text style={styles.buttonText}>Mark Success</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setProgress(item.id,'CANCELLED')} style={styles.button}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  button: { backgroundColor: '#b91c1c', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 8, marginBottom: 6 },
  buttonText: { color: '#fff', fontWeight: '700' }
});

