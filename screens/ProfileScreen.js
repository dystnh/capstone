import React, { useState, useEffect } from 'react';
import {View, Text, Image, TextInput, TouchableOpacity,StyleSheet, ScrollView, Animated, Dimensions, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.6;

export default function ProfileScreen({ navigation }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-SIDEBAR_WIDTH))[0];
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('Edit Name');
  const [email, setEmail] = useState('Add Email');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null });
    loadUserData();
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const { name, email, avatar } = JSON.parse(storedUser);
        if (name) setName(name);
        if (email) setEmail(email);
        if (avatar) setAvatar(avatar);
      }
    } catch (err) {
      console.error('Failed to load user data', err);
    }
  };

  const saveUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, name, email, avatar };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        Alert.alert('Profile Updated');
      }
    } catch (err) {
      Alert.alert('Error updating profile');
      console.error(err);
    }
  };

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -SIDEBAR_WIDTH : 0;
    setSidebarVisible(!sidebarVisible);
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const pickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      // Immediately persist avatar change for reliability
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = { ...user, avatar: uri };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error('Error saving avatar', err);
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('rememberedEmail');
    await AsyncStorage.removeItem('rememberedPassword');
    navigation.replace('Login');
  };

  const handleSave = () => {
    saveUserData();
    setEditing(false);
  };

  return (
    <View style={styles.screen}>
      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
      )}

      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <Text style={styles.sidebarTitle}>Menu</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon} accessibilityLabel="Toggle Sidebar">
        <Ionicons
          name={sidebarVisible ? 'arrow-forward' : 'arrow-back'}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickAvatar} accessibilityLabel="Change Avatar">
            <Image
              source={avatar ? { uri: avatar } : require('../assets/default-avatar.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {editing ? (
            <TextInput
              style={styles.input}
              value={name} onChangeText={(text) => { setName(text); saveUserData(); }}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.name}>{name}</Text>
          )}
          <Text style={styles.title}>User Profile</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={email} onChangeText={(text) => { setEmail(text); saveUserData(); }}
                keyboardType="email-address"
                placeholder="Enter your email"
              />
            ) : (
              <Text style={styles.info}>{email}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={editing ? handleSave : () => setEditing(true)}
            style={styles.editButton}
            accessibilityLabel={editing ? 'Save Changes' : 'Edit Profile'}
          >
            <Text style={styles.editButtonText}>
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, backgroundColor: '#E03C67', flexGrow: 1 },
  header: {
    backgroundColor: '#FFBED4',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
    backgroundColor: '#ddd',
  },
  name: { fontSize: 20, color: '#222', fontWeight: 'bold' },
  title: { color: '#222', marginBottom: 15 },
  infoContainer: {
    backgroundColor: '#FFBED4',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  infoRow: { marginBottom: 15 },
  label: { fontWeight: 'bold', color: '#333' },
  info: { color: '#222', marginTop: 5 },
  input: {
    backgroundColor: '#FFE5ED',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#E03C67',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuIcon: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: '#FF83AC',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    borderColor: '#fff',
    borderWidth: 2,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
    zIndex: 99,
  },
  sidebarTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  logoutBtn: {
    backgroundColor: '#FF83AC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 98,
  },
});
