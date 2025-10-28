import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Image, ScrollView } from 'react-native';
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Available Catering Services</Text>
        <Text style={styles.subtitle}>Choose your preferred catering package</Text>

        {types.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedId(item.id)}
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
          >
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.courseText}>🍽️ {item.foodCourseLimit} Courses</Text>
                <Text style={styles.priceText}>₱{item.price.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bookingSection}>
          <Text style={styles.title}>Request Schedule</Text>
          <Text style={styles.label}>Select Date (YYYY-MM-DD):</Text>
          <TextInput
            placeholder='Example: 2025-12-25'
            style={styles.input}
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity
            style={[styles.button, (!selectedId || !date) && styles.buttonDisabled]}
            onPress={requestBooking}
            disabled={!selectedId || !date}
          >
            <Text style={styles.buttonText}>
              {selectedId && date ? 'Request Booking' : 'Please select a package and date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: '#b91c1c', marginBottom: 4, marginTop: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  selectedCard: {
    borderColor: '#b91c1c',
    borderWidth: 3,
    shadowColor: '#b91c1c',
    shadowOpacity: 0.3
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0'
  },
  cardContent: {
    padding: 16
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#1a1a1a' },
  description: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  courseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444'
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#b91c1c'
  },
  bookingSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 24
  },
  input: {
    borderColor: '#b91c1c',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#b91c1c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#b91c1c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  }
});

