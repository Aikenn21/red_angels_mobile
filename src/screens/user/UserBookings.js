import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../../lib/api';

export default function UserBookings() {
  const [items, setItems] = useState([]);
  const load = async () => {
    const { data } = await api.get('/bookings/me');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList data={items} keyExtractor={i => String(i.id)} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.cateringType?.name}</Text>
          <Text>Date: {new Date(item.date).toISOString().slice(0,10)}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Progress: {item.progress}</Text>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 }
});

