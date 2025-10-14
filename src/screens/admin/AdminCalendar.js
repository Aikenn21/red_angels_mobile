import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import api from '../../lib/api';

export default function AdminCalendar() {
  const [marked, setMarked] = useState({});
  const load = async () => {
    const { data } = await api.get('/bookings/calendar/accepted-dates');
    const marks = {};
    (data.dates || []).forEach(d => { marks[d] = { selected: true, selectedColor: '#ef4444' }; });
    setMarked(marks);
  };
  useEffect(() => { load(); }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>Accepted Schedules</Text>
      <Calendar markedDates={marked} theme={{ todayTextColor: '#b91c1c' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', margin: 16 }
});

