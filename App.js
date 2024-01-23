import React from 'react';
import StackNav from './src/routes/StackNav';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  // const [isFaceRegistered, setRegisterFace] = useState(false);
  // useEffect(async()=>{

  //   await AsyncStorage.getItem('RegisteredFace');
  // },[])
  // useEffect(() => {
  //   async function getToken() {
  //     const token = await AsyncStorage.getItem('RegisteredFace');
  //     if (token) {
  //       setRegisterFace(true);
  //     }
  //     return;
  //   }
  //   getToken();
  // }, []);

  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({});
