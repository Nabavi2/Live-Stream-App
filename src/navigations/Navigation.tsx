import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import StartLiveScreen from '../screens/StartLiveScreen';
import CameraRenderScreen from '../screens/CameraRenderScreen';
import LiveScreen from '../screens/LiveScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import ViewerLiveScreen from '../screens/ViewerLiveScreen';
// import LiveScreen2 from '../screens/LiveScreen2';
import JoinToLiveScreen from '../screens/JoinToLiveScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

//Stack Navigator for navigate to other page
const Stack1 = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack1.Navigator
      initialRouteName="LiveStream"
      screenOptions={{headerShown: false}}>
      <Stack1.Screen name="LiveStream" component={StartLiveScreen} />
      <Stack1.Screen name="CameraScreen" component={CameraRenderScreen} />
      <Stack1.Screen name="LiveScreen" component={LiveScreen} />
      <Stack1.Screen name="VideoScreen" component={VideoPlayerScreen} />
      <Stack1.Screen name="ViewerScreen" component={ViewerLiveScreen} />
      {/* <Stack1.Screen name="LiveScreen2" component={LiveScreen2} /> */}
      <Stack1.Screen name="JoinToLive" component={JoinToLiveScreen} />
    </Stack1.Navigator>
  );
};

//Bottom Tab navigator for navigate to other home from page bottom
