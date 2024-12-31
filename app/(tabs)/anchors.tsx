import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AnchorsContext } from '@/components/AnchorsContext';

export default function AnchorsScreen() {
  const { anchors, setGlobalAnchors } = useContext(AnchorsContext); // Access shared anchors
  const [expandedAnchor, setExpandedAnchor] = useState<string | null>(null);

  const toggleAnchorExpansion = (anchorId: string) => {
    setExpandedAnchor((prev) => (prev === anchorId ? null : anchorId));
  };

  const updateCoordinates = (anchorId: string, x: string, y: string) => {
    setGlobalAnchors((prevAnchors) => ({
      ...prevAnchors,
      [anchorId]: {
        ...prevAnchors[anchorId],
        coordinates: { x: parseFloat(x), y: parseFloat(y) },
      },
    }));
  };

  const renderAnchor = ({ item }: { item: { id: string; name: string; coordinates: { x: number; y: number } | null } }) => {
    const isExpanded = expandedAnchor === item.id;

    return (
      <TouchableOpacity style={styles.anchorItem} onPress={() => toggleAnchorExpansion(item.id)}>
        <Text style={styles.anchorName}>{item.name}</Text>
        {item.coordinates && (
          <Text style={styles.coordinates}>
            Coordinates: ({item.coordinates.x.toFixed(2)}, {item.coordinates.y.toFixed(2)})
          </Text>
        )}
        {isExpanded && (
          <View style={styles.coordinateInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="X-coordinate"
              keyboardType="numeric"
              onChangeText={(text) => updateCoordinates(item.id, text, item.coordinates?.y.toString() || '0')}
            />
            <TextInput
              style={styles.input}
              placeholder="Y-coordinate"
              keyboardType="numeric"
              onChangeText={(text) => updateCoordinates(item.id, item.coordinates?.x.toString() || '0', text)}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Anchors</Text>
      <FlatList
        data={Object.values(anchors)}
        keyExtractor={(item) => item.id}
        renderItem={renderAnchor}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text>No anchors selected.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  anchorItem: { padding: 16, marginVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  anchorName: { fontSize: 18, fontWeight: '600' },
  coordinates: { fontSize: 14, color: '#666' },
  coordinateInputContainer: { flexDirection: 'row', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 8, marginHorizontal: 4 },
  listContainer: {paddingVertical: 10,},
});