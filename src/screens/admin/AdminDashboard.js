import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, bookings: 0, accepted: 0, txs: 0 });
  const load = async () => {
    const [users, bookings, txs] = await Promise.all([
      api.get('/users'),
      api.get('/bookings'),
      api.get('/transactions')
    ]);
    setCounts({
      users: users.data.users?.length || 0,
      bookings: bookings.data.items?.length || 0,
      accepted: bookings.data.items?.filter(b => b.status === 'ACCEPTED').length || 0,
      txs: txs.data.items?.length || 0
    });
  };
  useEffect(() => { load(); }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.row}><Text style={styles.label}>Users</Text><Text style={styles.value}>{counts.users}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Bookings</Text><Text style={styles.value}>{counts.bookings}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Accepted</Text><Text style={styles.value}>{counts.accepted}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Transactions</Text><Text style={styles.value}>{counts.txs}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', color: '#b91c1c', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#fafafa', borderRadius: 8, marginBottom: 8 },
  label: { fontWeight: '600' },
  value: { fontWeight: '800', color: '#b91c1c' }
});

