import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {RNCamera} from 'react-native-camera';
import * as RNSCamera from 'react-native-vision-camera';

export default function RegisterFace({navigation}) {
  const cam = useRef(null);
  const [setUpCam, setCam] = useState(false);
  // useEffect(() => {
  //   setCam(true);
  // }, []);
  const {hasPermission, requestPermission} = RNSCamera.useCameraPermission();

  const device = setUpCam
    ? RNSCamera.useCameraDevice('back')
    : RNSCamera.useCameraDevice('front');

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = hasPermission;
    console.log('cameraPermission>>>', cameraPermission);
    // setCameraPermission(cameraPermission.status === 'granted');
    if (!cameraPermission) {
      const imagePermission = await requestPermission()
        .then(res => res)
        .catch(err => {
          alert('Permission for media access needed.');
        });
      console.log(imagePermission);
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  if (device == null)
    return (
      <View style={styles.container}>
        <Text style={{color: 'black'}}>App camera is getting ready.</Text>
      </View>
    );

  const captureMyPic = async () => {
    if (cam.current != null) {
      console.log('first Pic Captured');
      const camPic = await cam.current.takePhoto();
      console.log('first Pic>>>', camPic);
      await AsyncStorage.setItem('RegisteredFace', JSON.stringify(camPic));
      navigation.navigate('PageReading', {camPic: camPic});
    }
  };
  return (
    <View style={styles.container}>
      <RNSCamera.Camera
        ref={cam}
        style={
          {height: '60%', width: '80%', position: 'relative'}
          // StyleSheet.absoluteFill
        }
        // frameProcessor={frameProcessor}
        resizeMode="contain"
        device={device ?? 'front'}
        isActive={true}
        photo
      />

      <TouchableOpacity
        onPress={captureMyPic}
        style={{
          backgroundColor: 'blue',
          padding: 25,
          borderRadius: 12,
          marginVertical: 10,
        }}>
        <Text style={{color: 'black'}}>Register Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCam(!setUpCam)}
        style={{
          backgroundColor: 'pink',
          padding: 25,
          borderRadius: 12,
        }}>
        <Text style={{color: 'white'}}>Change Camera</Text>
      </TouchableOpacity>
      {/* <RNCamera
        style={{height: '60%', position: 'relative'}}
        // style={{height: '60%', display: 'flex'}}
        faceDetectionClassifications={
          RNCamera.Constants.FaceDetection.Classifications.all
        }
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}

        // onFacesDetected={face => {
        //   if (setUpCam) {
        //     // this.setState({fd: face.faces.length === 0});
        // console.log('>>>>>>>', JSON.stringify(face));
        //     // alert(JSON.stringify(face));
        //   }
        // }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
