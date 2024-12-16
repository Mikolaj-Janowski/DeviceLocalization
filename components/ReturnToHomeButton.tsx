import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReturnHomeButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/')} 
    >
      <Ionicons name="arrow-forward" size={24} color="black" style={styles.icon} />
      <Text style={styles.text}>Home</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 40, // For status bar padding
    right: 16,
    zIndex: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  icon: {
    transform: [{ rotate: '180deg' }], // Make the arrow point to the left
  },
});