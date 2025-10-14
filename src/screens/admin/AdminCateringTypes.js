import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../../lib/api';

export default function AdminCateringTypes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', foodCourseLimit: '5', price: '0' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/catering-types');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api.post('/catering-types', { ...form, foodCourseLimit: Number(form.foodCourseLimit), price: Number(form.price) });
      setForm({ name: '', description: '', foodCourseLimit: '5', price: '0' });
      load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description, foodCourseLimit: String(item.foodCourseLimit), price: String(item.price) });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/catering-types/${editId}`, { ...form, foodCourseLimit: Number(form.foodCourseLimit), price: Number(form.price) });
      setEditId(null);
      setForm({ name: '', description: '', foodCourseLimit: '5', price: '0' });
      load();
    } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const remove = async (id) => {
    await api.delete(`/catering-types/${id}`);
    load();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>{editId? 'Edit Catering Type' : 'New Catering Type'}</Text>
      <TextInput placeholder='Name' style={styles.input} value={form.name} onChangeText={(v)=>setForm({...form,name:v})} />
      <TextInput placeholder='Description' style={styles.input} value={form.description} onChangeText={(v)=>setForm({...form,description:v})} />
      <TextInput placeholder='Food Course Limit (5-8)' style={styles.input} keyboardType='numeric' value={form.foodCourseLimit} onChangeText={(v)=>setForm({...form,foodCourseLimit:v})} />
      <TextInput placeholder='Price' style={styles.input} keyboardType='numeric' value={form.price} onChangeText={(v)=>setForm({...form,price:v})} />
      {editId ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.button,{flex:1}]} onPress={saveEdit}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button,{flex:1, backgroundColor:'#6b7280'}]} onPress={()=>{ setEditId(null); setForm({ name:'', description:'', foodCourseLimit:'5', price:'0' }); }}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={create}><Text style={styles.buttonText}>Create</Text></TouchableOpacity>
      )}

      <Text style={[styles.title,{marginTop:12}]}>Existing Types</Text>
      <FlatList data={items} keyExtractor={i=>String(i.id)} renderItem={({item})=> (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name} — ₱{item.price.toFixed(2)}</Text>
          <Text>{item.description}</Text>
          <Text>Courses: {item.foodCourseLimit}</Text>
          <TouchableOpacity onPress={()=>startEdit(item)} style={[styles.button,{marginTop:6}]}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>remove(item.id)} style={[styles.button,{marginTop:6}]}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
        </View>
      )} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: '#b91c1c', marginBottom: 8 },
  input: { borderColor: '#b91c1c', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 }
});
