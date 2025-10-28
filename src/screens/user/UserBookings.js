import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import api from '../../lib/api';

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: { bg: '#fef3c7', text: '#92400e' },
    ACCEPTED: { bg: '#d1fae5', text: '#065f46' },
    DENIED: { bg: '#fee2e2', text: '#991b1b' },
    CONFLICTED: { bg: '#fecaca', text: '#7f1d1d' }
  };
  const color = colors[status] || { bg: '#e5e7eb', text: '#1f2937' };
  return (
    <View style={[styles.badge, { backgroundColor: color.bg }]}>
      <Text style={[styles.badgeText, { color: color.text }]}>{status}</Text>
    </View>
  );
};

const ProgressBadge = ({ progress }) => {
  const colors = {
    NOT_STARTED: { bg: '#e5e7eb', text: '#374151' },
    ONGOING: { bg: '#dbeafe', text: '#1e40af' },
    SUCCESS: { bg: '#d1fae5', text: '#065f46' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' }
  };
  const color = colors[progress] || { bg: '#e5e7eb', text: '#1f2937' };
  return (
    <View style={[styles.badge, { backgroundColor: color.bg }]}>
      <Text style={[styles.badgeText, { color: color.text }]}>{progress.replace('_', ' ')}</Text>
    </View>
  );
};

export default function UserBookings() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/bookings/me');
      setItems(data.items);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Book your first catering service from the Home tab</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => String(i.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#b91c1c']} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.cateringType?.name || 'Catering Service'}</Text>
                <Text style={styles.price}>₱{item.cateringType?.price?.toFixed(2) || '0.00'}</Text>
              </View>
              <Text style={styles.date}>📅 {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              <View style={styles.badgeContainer}>
                <StatusBadge status={item.status} />
                <ProgressBadge progress={item.progress} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b91c1c'
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32
  }
});

