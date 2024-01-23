import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as RNSCamera from 'react-native-vision-camera';
import * as faceapi from 'face-api.js';

// export default function pageReading() {
export default function PageReading({navigation, route}) {
  const cam = useRef(null);
  const [similarityTest, setSimilarityState] = useState({});
  const [image1, setImage1] = useState(route.params?.camPic);
  // const [image2, setImage2] = useState('');
  console.log('firstImage>>>>', image1);
  // useEffect(() => {
  //   getToken();
  // }, []);

  // async function getToken() {
  //   const camPic = await AsyncStorage.getItem('RegisteredFace');
  //   if (camPic) {
  //     setImage1(camPic);
  //     console.log('camPic>>>>', camPic);
  //   }
  //   return;
  // }
  // const {hasPermission, requestPermission} = Camera.useCameraPermission();

  const device = RNSCamera.useCameraDevice('front');
  //  if (device == null) return{' '}
  //       <NoCameraErrorView />
  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'black'}}>App camera is getting ready.</Text>
      </View>
    );
  }
  //   const frameProcessor = RNSCamera.useFrameProcessor(frame => {
  //     'worklet';
  //     // const resizedFrame = resize(frame, 720, 480);

  //     // const faces = scanFaces(frame);
  //     // const objects = (frame);
  //     console.log(`Faces: ${frame}`);
  //   }, []);

  // useEffect(() => {
  //   // captureMYPIc();
  //   setInterval(async () => {
  //     if (cam.current != null) {
  //       console.log('first Pic Captured');
  //       const camPic = await cam.current.takePhoto();
  //       console.log('first>>>', camPic);
  //     }
  //   }, 5000);
  // }, []);

  async function matchFaces() {
    console.log('MATCHINGGG');
    // if (
    //   image1 == null ||
    //   image1.bitmap == null ||
    //   image1.bitmap == '' ||
    //   image2 == null ||
    //   image2.bitmap == null ||
    //   image2.bitmap == ''
    // ) {
    //   console.log('MATCHINGGG DONE FAILED');
    //   return;
    // }
    const imagePath2 = await captureMYPIc();
    console.log('IMAGES WE HAVE>>>>>', image1.path, imagePath2.path);
    setSimilarityState({similarity: 'Processing...'});
    const detection = await faceapi.detectAllFaces(image1.path);
    console.log('detection>>>', detection);
  }

  const captureMYPIc = async () => {
    if (cam.current != null) {
      console.log('first Pic Captured');
      const camPic = await cam.current.takePhoto();
      return camPic;
      // console.log('first>>>', camPic);
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
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          // flex: 1,
          padding: 25,
          borderRadius: 12,
        }}>
        <Text style={{color: 'black'}}>
          HELLO World Testing the Reading Mode.{`\n`} similarity:
          {similarityTest.similarity}
        </Text>
      </View>
      <TouchableOpacity
        onPress={matchFaces}
        style={{
          backgroundColor: 'pink',
          padding: 25,
          borderRadius: 12,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>Check Similarity</Text>
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
