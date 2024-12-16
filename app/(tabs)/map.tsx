import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ReturnToHomeButton from '@/components/ReturnToHomeButton';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Map will be here!</Text>
      <ReturnToHomeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  placeholderText: {
    fontSize: 20,
    color: 'gray',
  },
});