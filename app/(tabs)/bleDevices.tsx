import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { BleError, BleManager, Device } from 'react-native-ble-plx';
import { AnchorsContext } from '@/components/AnchorsContext';


const BleDevicesScreen = () => {
  const [bleManager] = useState(new BleManager());
  const { globalAnchors, setGlobalAnchors } = useContext(AnchorsContext);

  const [devices, setDevices] = useState<Device[]>([]);
  const [areAnchors, setAreAnchors] = useState<Record<string, boolean>>({});

  const { rssiAtOneMeter, pathLossExponent } = { rssiAtOneMeter: -65, pathLossExponent: 2 };

  useEffect(() => {
    const updateDistance = (device: Device) => {
      if (device.rssi === null) return;

      const distance = calculateDistance(device.rssi, rssiAtOneMeter, pathLossExponent);
      setGlobalAnchors((prevAnchors) => ({ ...prevAnchors, [device.id]: { ...prevAnchors[device.id], distance } }));
    }

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert('Permissions Denied', 'Required permissions not granted');
          return false;
        }
      }
      return true;
    };

    const scanListener = (error: BleError | null, device: Device | null) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }

      if (!(device && device.name && device.rssi))
        return;

      setDevices((prevDevices) => {
        if (prevDevices.find((d) => d.id === device.id)) {
          return prevDevices;
        }
        return [...prevDevices, device];
      });

      if (areAnchors[device.id])
        updateDistance(device);
    }

    const initializeScan = async () => {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      bleManager.startDeviceScan(null, null, scanListener);
    };
    initializeScan();

    return () => {
      bleManager.stopDeviceScan();
    };
  }, [areAnchors]);

  const calculateDistance = (rssi: number, rssiAtOneMeter: number, pathLossExponent: number): number => {
    if (rssi === 0) {
      return -1.0;
    }

    const ratio = (rssiAtOneMeter - rssi) / (10 * pathLossExponent);
    return Math.pow(10, ratio);
  };

  const toggleAnchor = (deviceId: string, isAnchor: boolean) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    setAreAnchors((prevAnchors) => ({
      ...prevAnchors,
      [deviceId]: isAnchor,
    }));

    setGlobalAnchors((prevGlobalAnchors) => {
      const updatedAnchors = { ...prevGlobalAnchors };
      if (isAnchor) {
        updatedAnchors[deviceId] = {
          id: deviceId,
          name: device.name || 'Unknown Device',
          coordinates: null,
          distance: null
        };
      } else {
        delete updatedAnchors[deviceId];
      }
      return updatedAnchors;
    });
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const distance = globalAnchors[item.id]?.distance;
    const isAnchor = areAnchors[item.id] || false;

    return (
      <TouchableOpacity style={styles.deviceItem} onPress={() => { }}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
        {isAnchor && (
          <Text style={styles.distance}>
            Distance: {distance ? `${distance.toFixed(2)} meters` : 'Calculating...'}
          </Text>
        )}
        {(
          <View style={styles.configContainer}>
            <View style={styles.row}>
              <Text style={styles.configLabel}>Set as Anchor:</Text>
              <Switch value={isAnchor} onValueChange={(value) => toggleAnchor(item.id, value)} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No devices found</Text>}
      />
    </View>
  );
};

export default BleDevicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  deviceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  distance: {
    marginTop: 5,
    fontSize: 14,
    color: '#4a90e2',
  },
  configContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  configLabel: {
    fontSize: 14,
    color: '#333',
  },
  configInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoButton: {
    marginLeft: 10,
    backgroundColor: '#4a90e2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  autoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});