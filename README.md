# WebView bridge tests

This app tests the speed at which WebView and React Native can communicate with each other (on the old RN architecture).

## How to run

1. Clone the repo
2. Run `yarn` and `npx pod-install`
3. Run `yarn ios` or `yarn android`

## Pings

Look in App.tsx for how this works. The WebView sends a ping to the RN app and the RN app sends a ping back to the WebView. The WebView then logs the time it took to receive the ping.

For the "Send 100 pings" it repeats the process 100 times and logs the average time.
