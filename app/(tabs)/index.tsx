import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Device Localization</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.menuIconContainer}>
                <Ionicons name="menu" size={28} color="white" />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item onPress={() => { router.push('/(tabs)/anchors'); closeMenu(); }} title="View Anchors" />
            <Menu.Item onPress={() => { router.push('/(tabs)/map'); closeMenu(); }} title="Map" />
            <Menu.Item onPress={() => { router.push('/(tabs)/deviceInfo'); closeMenu(); }} title="Settings" />
          </Menu>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome to Your Dashboard</Text>
          <Text style={styles.subtitle}>Manage and track all your devices effortlessly</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.quickButton} onPress={() => router.push('/(tabs)/bleDevices')}>
              <Ionicons name="bluetooth" size={24} color="#FFF" />
              <Text style={styles.quickButtonText}>Scan Devices</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton} onPress={() => router.push('/(tabs)/anchors')}>
              <Ionicons name="location" size={24} color="#FFF" />
              <Text style={styles.quickButtonText}>View Anchors</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsPanel}>
            <Text style={styles.statItem}>Connected Devices: 5</Text>
            <Text style={styles.statItem}>Battery Status: 80%</Text>
            <Text style={styles.statItem}>Last Sync: Just now</Text>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#798b9a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  menuIconContainer: {
    padding: 5,
  },
  menuContent: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: 40,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  quickButton: {
    backgroundColor: '#798b9a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  statsPanel: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  activityLog: {
    width: '90%',
    marginVertical: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  activityItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#28A745', // Green for "Connected" or red if disconnected
  },
});