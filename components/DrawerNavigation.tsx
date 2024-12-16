import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../app/(tabs)/index'; // Adjust based on your path
import AnchorsScreen from '../app/(tabs)/anchors'; // Adjust based on your path
import MapScreen from '../app/(tabs)/map'; // Adjust based on your path
import DeviceInfoScreen from '../app/(tabs)/deviceInfo'; // Adjust based on your path

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Anchors" component={AnchorsScreen} />
        <Drawer.Screen name="Map" component={MapScreen} />
        <Drawer.Screen name="Device Info" component={DeviceInfoScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigation;