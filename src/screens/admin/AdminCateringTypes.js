import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../lib/upload';
import api from '../../lib/api';

export default function AdminCateringTypes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', foodCourseLimit: '5', price: '0' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/catering-types');
    setItems(data.items);
  };
  useEffect(() => { load(); }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Please allow photo access');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      try {
        setUploading(true);
        const url = await uploadFile(result.assets[0].uri);
        setForm({ ...form, imageUrl: url });
        Alert.alert('Success', 'Image uploaded!');
      } catch (e) {
        Alert.alert('Upload failed', e.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const create = async () => {
    try {
      await api.post('/catering-types', { ...form, foodCourseLimit: Number(form.foodCourseLimit), price: Number(form.price) });
      setForm({ name: '', description: '', imageUrl: '', foodCourseLimit: '5', price: '0' });
      load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description, imageUrl: item.imageUrl || '', foodCourseLimit: String(item.foodCourseLimit), price: String(item.price) });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/catering-types/${editId}`, { ...form, foodCourseLimit: Number(form.foodCourseLimit), price: Number(form.price) });
      setEditId(null);
      setForm({ name: '', description: '', imageUrl: '', foodCourseLimit: '5', price: '0' });
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
      <TextInput placeholder='Description' style={styles.input} multiline numberOfLines={3} value={form.description} onChangeText={(v)=>setForm({...form,description:v})} />

      <TouchableOpacity style={[styles.button, { marginBottom: 10, backgroundColor: '#4b5563' }]} onPress={pickImage} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
      </TouchableOpacity>
      {form.imageUrl ? <Image source={{ uri: form.imageUrl }} style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }} resizeMode="cover" /> : null}

      <TextInput placeholder='Food Course Limit (5-8)' style={styles.input} keyboardType='numeric' value={form.foodCourseLimit} onChangeText={(v)=>setForm({...form,foodCourseLimit:v})} />
      <TextInput placeholder='Price' style={styles.input} keyboardType='numeric' value={form.price} onChangeText={(v)=>setForm({...form,price:v})} />
      {editId ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.button,{flex:1}]} onPress={saveEdit}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button,{flex:1, backgroundColor:'#6b7280'}]} onPress={()=>{ setEditId(null); setForm({ name:'', description:'', imageUrl:'', foodCourseLimit:'5', price:'0' }); }}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={create}><Text style={styles.buttonText}>Create</Text></TouchableOpacity>
      )}

      <Text style={[styles.title,{marginTop:12}]}>Existing Types</Text>
      <FlatList
        data={items}
        keyExtractor={i=>String(i.id)}
        scrollEnabled={false}
        renderItem={({item})=> (
        <View style={styles.card}>
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 8 }} resizeMode="cover" />}
          <Text style={styles.name}>{item.name} — ₱{item.price.toFixed(2)}</Text>
          <Text>{item.description}</Text>
          <Text>Courses: {item.foodCourseLimit}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <TouchableOpacity onPress={()=>startEdit(item)} style={[styles.button, { flex: 1 }]}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>remove(item.id)} style={[styles.button, { flex: 1, backgroundColor: '#dc2626' }]}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
          </View>
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
