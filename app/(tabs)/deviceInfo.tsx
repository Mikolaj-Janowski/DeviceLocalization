import ReturnHomeButton from '@/components/ReturnToHomeButton';
import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const DeviceInfoScreen = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    model: 'Unknown',
    os: 'Unknown',
    osVersion: 'Unknown',
    manufacturer: 'Unknown',
    deviceName: 'Unknown',
    brand: 'Unknown',
    isTablet: false,
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      if (Platform.OS === 'web') {
        // Web-specific device info
        const model = 'Web Browser'; // Static information for web
        const os = navigator.platform;
        const osVersion = navigator.userAgent;
        const manufacturer = 'Unknown';
        const deviceName = navigator.appVersion;
        const brand = 'Unknown';
        const isTablet = /tablet/i.test(navigator.userAgent);

        setDeviceInfo({
          model,
          os,
          osVersion,
          manufacturer,
          deviceName,
          brand,
          isTablet,
        });
      } else {
        // Mobile devices logic (same as before)
        const model = await DeviceInfo.getModel();
        const os = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Unknown';
        const osVersion = await DeviceInfo.getSystemVersion();
        const manufacturer = await DeviceInfo.getManufacturer();
        const deviceName = await DeviceInfo.getDeviceName();
        const brand = await DeviceInfo.getBrand();
        const isTablet = await DeviceInfo.isTablet();
  
        setDeviceInfo({
          model,
          os,
          osVersion,
          manufacturer,
          deviceName,
          brand,
          isTablet,
        });
      };
    }

    fetchDeviceInfo();
  }, []);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Information</Text>
        <ReturnHomeButton />
      </View>
      <View >
        <Text style={styles.infoText}>Model Name: <Text style={styles.value}>{deviceInfo.model}</Text></Text>
        <Text style={styles.infoText}>Operating System: <Text style={styles.value}>{deviceInfo.os}</Text></Text>
        <Text style={styles.infoText}>OS Version: <Text style={styles.value}>{deviceInfo.osVersion}</Text></Text>
        <Text style={styles.infoText}>Manufacturer: <Text style={styles.value}>{deviceInfo.manufacturer}</Text></Text>
        <Text style={styles.infoText}>Device Name: <Text style={styles.value}>{deviceInfo.deviceName}</Text></Text>
        <Text style={styles.infoText}>Brand: <Text style={styles.value}>{deviceInfo.brand}</Text></Text>
        <Text style={styles.infoText}>Is Tablet: <Text style={styles.value}>{deviceInfo.isTablet ? 'Yes' : 'No'}</Text></Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
 
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
    color: '#4a90e2', // Accent color for the values
  },
});

export default DeviceInfoScreen;