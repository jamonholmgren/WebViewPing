import React, {useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {WebView} from 'react-native-webview';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const webref = useRef<WebView>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={{fontSize: 30, padding: 5}}>WebView:</Text>
      <WebView
        style={{width: 400, height: 200}}
        ref={webref}
        onMessage={event => {
          const dataFromWebView = event.nativeEvent.data;
          // send back to webview via ref
          webref.current?.injectJavaScript(
            `receiveMessageFromRN('${dataFromWebView}');`,
          );
        }}
        source={{
          html: `
            <script>
              let sentMessageDateTime = 0;
              let pings = 0;
              function sendMessageToRN(message) {
                sentMessageDateTime = performance.now();
                window.ReactNativeWebView.postMessage(message);
              }

              function receiveMessageFromRN(message) {
                if (message === 'ping') {
                  const receivedMessageDateTime = performance.now();
                  const timeDiff = receivedMessageDateTime - sentMessageDateTime;
                  document.getElementById('timeDiff').innerHTML = timeDiff;
                } else if (message === 'pings') {
                  pings += 1;
                  if (pings < 100) {
                    window.ReactNativeWebView.postMessage("pings");
                  } else {
                    pings = 0;
                    const receivedMessageDateTime = performance.now();
                    const timeDiff = receivedMessageDateTime - sentMessageDateTime;
                    const timeDiffAverage = timeDiff / 100;
                    document.getElementById('timeDiffAverage').innerHTML = timeDiffAverage;
                  }
                }
              }
            </script>

            <style>
              body { font-size: 30px; padding: 40px; background-color: #999; }
              button { font-size: 30px; }
            </style>

            <button onClick="sendMessageToRN('ping')">Send 1 ping</button>
            <div>Single ping: <span id="timeDiff">0</span>ms</div>

            <button onClick="sendMessageToRN('pings')">Send 100 pings</button>
            <div>Average ping: <span id="timeDiffAverage">0</span>ms</div>
          `,
        }}
      />
    </SafeAreaView>
  );
}

export default App;
