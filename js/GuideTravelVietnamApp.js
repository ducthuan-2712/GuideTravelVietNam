/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @providesModule GuideTravelVietnamApp
 * @flow
 */

'use strict';

// Depdencies
import React from "react";
import { connect } from "react-redux";
import { version } from "./env.js";

// Components
import { 
  AppState,
  StyleSheet,
  StatusBar,
  View,
  NetInfo
} from "react-native";
import GActivityIndicator from './common/GActivityIndicator';
import LoginScreen from './login/LoginScreen';
import GuideTravelVietnamNavigator from './GuideTravelVietnamNavigator';
// import PushNotificationsController from './PushNotificationsController';
// var CodePush = require('react-native-code-push');

// Config
import {
  checkInternet,
  loadDestination
  // loadConfig,
} from "./actions";
// import { updateInstallation } from "./actions/installation";

class GuideTravelVietnamApp extends React.Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.isConnected.addEventListener('change',this._handleConnectivityChange);

    // TODO: Check Internet when run app (false or true is running code)
    NetInfo.isConnected.fetch().done((isConnected) => { 
      this.props.dispatch(checkInternet(isConnected)) 
    })
    // TODO: Make this list smaller, we basically download the whole internet
    this.props.dispatch(loadDestination());
    // this.props.dispatch(loadConfig());

    // updateInstallation({ version });
    // CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    NetInfo.isConnected.removeEventListener('change',this._handleConnectivityChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      // this.props.dispatch(loadConfig());
      // CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
    }
  }

  _handleConnectivityChange(isConnected) {
    this.props.dispatch(checkInternet(isConnected));
    if(isConnected) {
      // this.props.dispatch(loadConfig());
      // CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
    }
  }

  render() {
    if(!this.props.skipWelcomeScreen) {
      return <LoginScreen />
    }
    if(this.props.destination.length == 0) {
      return (
        <View style={styles.container}>
          <GActivityIndicator />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
         />
        <GuideTravelVietnamNavigator />
        {/* <PushNotificationsController /> */}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function select(store) {
  return {
    skipWelcomeScreen: store.user.hasSkippedLogin,
    destination: store.destination.results
  };
}

module.exports = connect(select)(GuideTravelVietnamApp);


