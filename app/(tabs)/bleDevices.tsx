import React, { useState, useEffect, useContext } from 'react';
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
import { BleManager, Device } from 'react-native-ble-plx';
import { AnchorsContext } from '@/components/AnchorsContext';


const BleDevicesScreen = () => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceDistances, setDeviceDistances] = useState<Record<string, number>>({});
  const [deviceConfigs, setDeviceConfigs] = useState<Record<string, { rssiAtOneMeter: number; pathLossExponent: number }>>(
    {}
  );
  const [anchors, setAnchors] = useState<Record<string, boolean>>({});
  const { setGlobalAnchors } = useContext(AnchorsContext);
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  const [tempConfigs, setTempConfigs] = useState<Record<string, { rssiAtOneMeter: string; pathLossExponent: string }>>({});

  const updateDistances = (device: Device | null) => {
    if (device === null) return;
    if (device.rssi === null) return;

    // Update distances only for anchors
    if (anchors[device.id]) {
      const { rssiAtOneMeter, pathLossExponent } = deviceConfigs[device.id] || { rssiAtOneMeter: -65, pathLossExponent: 2 };
      const distance = calculateDistance(device.rssi, rssiAtOneMeter, pathLossExponent);
      setDeviceDistances((prevDistances) => ({
        ...prevDistances,
        [device.id]: distance,
      }));
    }
  };

  useEffect(() => {
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

    const initializeScan = async () => {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          return;
        }

        if (device && device.name && device.rssi !== null) {
          setDevices((prevDevices) => {
            if (prevDevices.find((d) => d.id === device.id)) {
              return prevDevices;
            }
            return [...prevDevices, device];
          });

          // Initialize configs for new devices
          setDeviceConfigs((prevConfigs) => {
            if (!prevConfigs[device.id]) {
              return {
                ...prevConfigs,
                [device.id]: { rssiAtOneMeter: -65, pathLossExponent: 2 },
              };
            }
            return prevConfigs;
          });

          updateDistances(device);
        }
      });
    };

    initializeScan();

    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const calculateDistance = (rssi: number, rssiAtOneMeter: number, pathLossExponent: number): number => {
    if (rssi === 0) {
      return -1.0;
    }

    const ratio = (rssiAtOneMeter - rssi) / (10 * pathLossExponent);
    return Math.pow(10, ratio);
  };

  const toggleDeviceExpansion = (deviceId: string) => {
    if (expandedDevice === deviceId) {
      if (tempConfigs[deviceId]) {
        setDeviceConfigs((prevConfigs) => ({
          ...prevConfigs,
          [deviceId]: {
            rssiAtOneMeter: parseFloat(tempConfigs[deviceId].rssiAtOneMeter) || prevConfigs[deviceId].rssiAtOneMeter,
            pathLossExponent: parseFloat(tempConfigs[deviceId].pathLossExponent) || prevConfigs[deviceId].pathLossExponent,
          },
        }));
      }
      setExpandedDevice(null);
    } else {
      setTempConfigs((prevTempConfigs) => ({
        ...prevTempConfigs,
        [deviceId]: {
          rssiAtOneMeter: deviceConfigs[deviceId]?.rssiAtOneMeter.toString() || '-65',
          pathLossExponent: deviceConfigs[deviceId]?.pathLossExponent.toString() || '2',
        },
      }));
      setExpandedDevice(deviceId);
    }
  };

  const toggleAnchor = (deviceId: string, value: boolean) => {
    const device = devices.find((d) => d.id === deviceId); // Find the device object
    if (!device) return;

    setAnchors((prevAnchors) => ({
      ...prevAnchors,
      [deviceId]: value,
    }));

    const distance = deviceDistances[deviceId]; // Retrieve calculated distance

    setGlobalAnchors((prevGlobalAnchors) => {
      const updatedAnchors = { ...prevGlobalAnchors };
      if (value) {
        updatedAnchors[deviceId] = {
          id: deviceId,
          name: device.name || 'Unknown Device',
          coordinates: null,
          distance // Include distance here
        };
      } else {
        delete updatedAnchors[deviceId];
      }
      return updatedAnchors;
    });
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const distance = deviceDistances[item.id];
    const isExpanded = expandedDevice === item.id;
    const tempConfig = tempConfigs[item.id] || { rssiAtOneMeter: '-65', pathLossExponent: '2' };
    const isAnchor = anchors[item.id] || false;

    return (
      <TouchableOpacity style={styles.deviceItem} onPress={() => toggleDeviceExpansion(item.id)}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
        {isAnchor && (
          <Text style={styles.distance}>
            Distance: {distance !== undefined ? `${distance.toFixed(2)} meters` : 'Calculating...'}
          </Text>
        )}
        {isExpanded && (
          <View style={styles.configContainer}>
            <Text style={styles.configLabel}>RSSI at 1 Meter:</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.configInput}
                keyboardType="numeric"
                value={tempConfig.rssiAtOneMeter}
                onChangeText={(text) => handleTempConfigChange(item.id, 'rssiAtOneMeter', text)}
              />
              <TouchableOpacity style={styles.autoButton} onPress={() => autoSetRSSIAtOneMeter(item.id)}>
                <Text style={styles.autoButtonText}>AUTO</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.configLabel}>Path Loss Exponent:</Text>
            <TextInput
              style={styles.configInput}
              keyboardType="numeric"
              value={tempConfig.pathLossExponent}
              onChangeText={(text) => handleTempConfigChange(item.id, 'pathLossExponent', text)}
            />
            <View style={styles.row}>
              <Text style={styles.configLabel}>Set as Anchor:</Text>
              <Switch value={isAnchor} onValueChange={(value) => toggleAnchor(item.id, value)} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleTempConfigChange = (deviceId: string, field: 'rssiAtOneMeter' | 'pathLossExponent', value: string) => {
    setTempConfigs((prevTempConfigs) => ({
      ...prevTempConfigs,
      [deviceId]: {
        ...prevTempConfigs[deviceId],
        [field]: value,
      },
    }));
  };

  const autoSetRSSIAtOneMeter = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device && device.rssi !== null) {
      setTempConfigs((prevTempConfigs) => ({
        ...prevTempConfigs,
        [deviceId]: {
          ...prevTempConfigs[deviceId],
          rssiAtOneMeter: String(device.rssi),
        },
      }));
    } else {
      Alert.alert('Error', 'RSSI data is not available for this device.');
    }
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