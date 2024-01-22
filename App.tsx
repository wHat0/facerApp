// import React from 'react';
// // import type {PropsWithChildren} from 'react';
// import {
//   Button,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';
// import FaceSDK, {
//   FaceCaptureResponse,
// } from '@regulaforensics/react-native-face-api';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import facerAppFaceSDK from '@regulaforensics/react-native-face-api';

// // type SectionProps = PropsWithChildren<{
// //   title: string;
// // }>;

// function Section({children, title}) {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   // const facerApp = new FaceS,DK;
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   const faceDetect = () => {
//     try {
//       const successCallback = response => {
//         console.log('Initialization successful:', response);
//       };

//       const errorCallback = error => {
//         console.error('Initialization failed:', error);
//       };
//       const successCallbackForPresent = response => {
//         console.log('PRESENTING>>> successful:', response);
//       };

//       FaceSDK.init(successCallback, errorCallback);
//       console.log('DONE WITH the detection');
//       FaceSDK.presentFaceCaptureActivity(
//         successCallbackForPresent,
//         errorCallback,
//       );
//     } catch (err) {
//       console.log('werr>>>', err);
//     }
//   };
//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <Button title="Cam Scan" onPress={faceDetect} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Text,
  Image,
  Alert,
  NativeEventEmitter,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  LivenessResponse,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  MatchFacesSimilarityThresholdSplit,
  RNFaceApi,
  LivenessNotification,
  VideoEncoderCompletion,
} from '@regulaforensics/react-native-face-api';

interface IProps {}

interface IState {
  img1: any;
  img2: any;
  similarity: string;
  liveness: string;
}

var image1 = new MatchFacesImage();
var image2 = new MatchFacesImage();

export default class App extends React.Component<IProps, IState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    const eventManager = new NativeEventEmitter(RNFaceApi);
    eventManager.addListener('onCustomButtonTappedEvent', event =>
      console.log(event),
    );

    eventManager.addListener('videoEncoderCompletionEvent', json => {
      var completion = VideoEncoderCompletion.fromJson(JSON.parse(json))!;
      console.log('VideoEncoderCompletion:');
      console.log('    success: ' + completion.success);
      console.log('    transactionId: ' + completion.transactionId);
    });
    eventManager.addListener('livenessNotificationEvent', json => {
      var notification = LivenessNotification.fromJson(JSON.parse(json))!;
      console.log('LivenessProcessStatus: ' + notification.status);
    });

    FaceSDK.init(
      json => {
        var response = JSON.parse(json);
        if (!response['success']) {
          console.log('Init failed: ');
          console.log(json);
        }
      },
      _e => {},
    );

    this.state = {
      img1: require('./images/portrait.png'),
      img2: require('./images/portrait.png'),
      similarity: 'nil',
      liveness: 'nil',
    };
  }

  pickImage(first: boolean) {
    Alert.alert(
      'Select option',
      '',
      [
        {
          text: 'Use gallery',
          onPress: () =>
            launchImageLibrary(
              {
                mediaType: 'photo',
                selectionLimit: 1,
                includeBase64: true,
              },
              response => {
                if (response.assets == undefined) return;
                this.setImage(
                  first,
                  response.assets[0].base64!,
                  Enum.ImageType.PRINTED,
                );
              },
            ),
        },
        {
          text: 'Use camera',
          onPress: () =>
            FaceSDK.presentFaceCaptureActivity(
              json => {
                var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
                if (response.image != null && response.image.bitmap != null)
                  this.setImage(
                    first,
                    response.image.bitmap,
                    Enum.ImageType.LIVE,
                  );
              },
              _e => {},
            ),
        },
      ],
      {cancelable: true},
    );
  }

  setImage(first: boolean, base64: string, type: number) {
    if (base64 == null) return;
    this.setState({similarity: 'null'});
    if (first) {
      image1.bitmap = base64;
      image1.imageType = type;
      this.setState({img1: {uri: 'data:image/png;base64,' + base64}});
      this.setState({liveness: 'null'});
    } else {
      image2.bitmap = base64;
      image2.imageType = type;
      this.setState({img2: {uri: 'data:image/png;base64,' + base64}});
    }
  }

  clearResults() {
    this.setState({img1: require('./images/portrait.png')});
    this.setState({img2: require('./images/portrait.png')});
    this.setState({similarity: 'null'});
    this.setState({liveness: 'null'});
    image1 = new MatchFacesImage();
    image2 = new MatchFacesImage();
  }

  matchFaces() {
    console.log('MATCHINGGG');
    if (
      image1 == null ||
      image1.bitmap == null ||
      image1.bitmap == '' ||
      image2 == null ||
      image2.bitmap == null ||
      image2.bitmap == ''
    ) {
      console.log('MATCHINGGG DONE FAILED');

      return;
    }
    this.setState({similarity: 'Processing...'});
    var request = new MatchFacesRequest();
    request.images = [image1, image2];
    FaceSDK.matchFaces(
      JSON.stringify(request),

      json => {
        console.log('MATCHING doing>>>', typeof json);
        var response = MatchFacesResponse.fromJson(JSON.parse(json));

        console.log('RESPONSE>>>>', response?.results);
        FaceSDK.matchFacesSimilarityThresholdSplit(
          JSON.stringify(response!.results),
          0.75,
          str => {
            var split = MatchFacesSimilarityThresholdSplit.fromJson(
              JSON.parse(str),
            )!;
            console.log(
              'WE ARE DONE WITH CHANGING>>>>>',
              split,
              // (split.matchedFaces![0]?.similarity! * 100).toFixed(2),
            );
            this.setState({
              similarity:
                split.matchedFaces!.length > 0
                  ? (split.matchedFaces![0]?.similarity! * 100).toFixed(2) + '%'
                  : (split.unmatchedFaces![0]?.similarity! * 100).toFixed(2) +
                    '%',
            });
          },
          e => {
            this.setState({similarity: e});
          },
        );
      },
      e => {
        this.setState({similarity: e});
      },
    );
  }

  liveness() {
    FaceSDK.startLiveness(
      json => {
        var response = LivenessResponse.fromJson(JSON.parse(json))!;
        if (response.bitmap != null) {
          this.setImage(true, response.bitmap, Enum.ImageType.LIVE);
          this.setState({
            liveness:
              response['liveness'] == Enum.LivenessStatus.PASSED
                ? 'passed'
                : 'unknown',
          });
        }
      },
      _e => {},
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{padding: 15}}>
          <TouchableOpacity
            onPress={() => this.pickImage(true)}
            style={{alignItems: 'center'}}>
            <Image
              source={this.state.img1}
              resizeMode="contain"
              style={{height: 150, width: 150}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.pickImage(false)}
            style={{alignItems: 'center'}}>
            <Image
              source={this.state.img2}
              resizeMode="contain"
              style={{height: 150, width: 200}}
            />
          </TouchableOpacity>
        </View>

        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={{padding: 3, width: '60%'}}>
            <Button
              title="Match"
              color="#4285F4"
              onPress={() => {
                this.matchFaces();
              }}
            />
          </View>
          <View style={{padding: 3, width: '60%'}}>
            <Button
              title="Liveness"
              color="#4285F4"
              onPress={() => {
                this.liveness();
              }}
            />
          </View>
          <View style={{padding: 3, width: '60%'}}>
            <Button
              title="Clear"
              color="#4285F4"
              onPress={() => {
                this.clearResults();
              }}
            />
          </View>
        </View>

        <View style={{flexDirection: 'row', padding: 10}}>
          <Text style={{color: 'black'}}>
            Similarity: {this.state.similarity}
          </Text>
          <View style={{padding: 10}} />
          <Text style={{color: 'black'}}>Liveness: {this.state.liveness}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 12,
  },
});
