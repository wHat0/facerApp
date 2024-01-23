import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterFace from '../RegisterFace';
import PageReading from '../PageReading';

const Stack = createNativeStackNavigator();

export function StackNav() {
  return (
    <Stack.Navigator initialRouteName="RegisterFace">
      <Stack.Screen
        name="RegisterFace"
        component={RegisterFace}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PageReading"
        component={PageReading}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default StackNav;
