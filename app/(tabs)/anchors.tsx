import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ReturnToHomeButton from '@/components/ReturnToHomeButton';


const anchorData = [
  { id: '1', name: 'Anchor 1', location: 'Room 101' },
  { id: '2', name: 'Anchor 2', location: 'Room 102' },
  { id: '3', name: 'Anchor 3', location: 'Lobby' },
];

export default function AnchorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Anchors</Text>
      <FlatList
        data={anchorData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.anchorItem}>
            <Text style={styles.anchorName}>{item.name}</Text>
            <Text style={styles.anchorLocation}>Location: {item.location}</Text>
          </View>
        )}
      />
      <ReturnToHomeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  anchorItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  anchorName: {
    fontSize: 18,
    fontWeight: '600',
  },
  anchorLocation: {
    fontSize: 14,
    color: '#666',
  },
});