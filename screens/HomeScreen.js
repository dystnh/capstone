import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>Guest</Text>
        <Text style={styles.title}>Guest Profile</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Sign up to unlock more features and personalize your experience!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  name: {
    fontSize: 24,
    color: '#222',
    fontWeight: 'bold',
  },
  title: {
    color: '#222',
    fontSize: 16,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#FFBED4',
    borderRadius: 15,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E03C67',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
