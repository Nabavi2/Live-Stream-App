import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LiveStreamScreen from '../screens/LiveStreemScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
// This methode is for Top Tab Navigator

//Stack Navigator for navigate to other page
const Stack1 = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack1.Navigator
      initialRouteName="LiveStream"
      screenOptions={{headerShown: false}}>
      <Stack1.Screen name="LiveStream" component={LiveStreamScreen} />
    </Stack1.Navigator>
  );
};

//Bottom Tab navigator for navigate to other home from page bottom
