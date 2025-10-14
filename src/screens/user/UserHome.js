import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../../lib/api';

export default function UserHome() {
  const [types, setTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [date, setDate] = useState(''); // YYYY-MM-DD

  const load = async () => {
    const { data } = await api.get('/catering-types');
    setTypes(data.items);
  };

  useEffect(() => { load(); }, []);

  const requestBooking = async () => {
    if (!selectedId || !date) return Alert.alert('Missing', 'Select type and date (YYYY-MM-DD)');
    try {
      const { data } = await api.post('/bookings', { cateringTypeId: selectedId, date });
      Alert.alert('Requested', `Booking status: ${data.status}`);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Catering Types</Text>
      <FlatList data={types} keyExtractor={i => String(i.id)} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedId(item.id)} style={[styles.card, selectedId === item.id && { borderColor: '#b91c1c', borderWidth: 2 }]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text numberOfLines={2} style={{ color: '#444' }}>{item.description}</Text>
          <Text style={{ color: '#b91c1c', fontWeight: '700' }}>Food Courses: {item.foodCourseLimit} • ₱{item.price.toFixed(2)}</Text>
        </TouchableOpacity>
      )} />

      <Text style={styles.title}>Request Schedule</Text>
      <TextInput placeholder='YYYY-MM-DD' style={styles.input} value={date} onChangeText={setDate} />
      <TouchableOpacity style={styles.button} onPress={requestBooking}><Text style={styles.buttonText}>Request Booking</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '700' }
});

