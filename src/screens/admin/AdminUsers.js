import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Switch, ScrollView } from 'react-native';
import api from '../../lib/api';

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'USER', phone: '', location: '', active: true });

  const load = async () => {
    const { data } = await api.get('/users');
    setItems(data.users);
  };
  useEffect(() => { load(); }, []);

  const startEdit = (u) => {
    setEditing(u.id);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'USER', phone: u.phone || '', location: u.location || '', active: !!u.active });
  };

  const save = async () => {
    try {
      await api.put(`/users/${editing}`, { name: form.name, phone: form.phone, location: form.location, active: form.active });
      await api.put(`/users/${editing}/role`, { role: form.role });
      setEditing(null);
      load();
    } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const remove = async (id) => {
    Alert.alert('Confirm', 'Delete this account?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async ()=> { await api.delete(`/users/${id}`); load(); } }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name} — {item.role}</Text>
      <Text>{item.email}</Text>
      <Text>{item.phone || 'No phone'} • {item.location || 'No location'} • {item.active ? 'Active' : 'Deactivated'}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
        <TouchableOpacity style={styles.button} onPress={()=>startEdit(item)}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>remove(item.id)}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {editing ? (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.title}>Edit Account</Text>
          <TextInput style={styles.input} placeholder='Name' value={form.name} onChangeText={(v)=>setForm({...form,name:v})} />
          <TextInput style={styles.input} placeholder='Phone' value={form.phone} onChangeText={(v)=>setForm({...form,phone:v})} />
          <TextInput style={styles.input} placeholder='Location' value={form.location} onChangeText={(v)=>setForm({...form,location:v})} />
          <TextInput style={styles.input} placeholder='Role (ADMIN/STAFF/USER)' value={form.role} onChangeText={(v)=>setForm({...form,role:v})} />
          <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 12 }}>
            <Text style={{ marginRight: 8 }}>Active</Text>
            <Switch value={form.active} onValueChange={(v)=>setForm({...form,active:v})} trackColor={{ true: '#b91c1c' }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.button,{flex:1}]} onPress={save}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button,{flex:1, backgroundColor:'#6b7280'}]} onPress={()=>setEditing(null)}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={styles.title}>Manage Accounts</Text>
          <FlatList data={items} keyExtractor={i=>String(i.id)} renderItem={renderItem} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700' },
  button: { backgroundColor: '#b91c1c', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' }
});

