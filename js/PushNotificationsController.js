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
 * @flow
 */

"use strict";

import React from "react";
import unseenNotificationsCount from "./tabs/notifications/unseenNotificationsCount";
import { AppState, Platform, PushNotificationIOS } from "react-native";

// $FlowIssue
import PushNotification from "react-native-push-notification";

import { connect } from "react-redux";
import {
  storeDeviceToken,
  receivePushNotification,
  updateInstallation,
  markAllNotificationsAsSeen
} from "./actions";

import type { Dispatch } from "./actions/types";

import { gcmSenderId } from "./env";

class AppBadgeController extends React.Component {
  props: {
    tab: string,
    enabled: boolean,
    badge: number,
    dispatch: Dispatch
  };

  handleAppStateChange = appState => {
    if (appState === "active") {
      this.updateAppBadge();
      if (this.props.tab === "info") {
        this.eventuallyMarkNotificationsAsSeen();
      }
    }
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);

    const { dispatch } = this.props;
    PushNotification.configure({
      onRegister: ({ token }) => dispatch(storeDeviceToken(token)),
      onNotification: notif => dispatch(receivePushNotification(notif)),
      senderID: gcmSenderId,
      requestPermissions: this.props.enabled
    });

    this.updateAppBadge();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.enabled && this.props.enabled) {
      PushNotification.requestPermissions();
    }
    if (this.props.badge !== prevProps.badge) {
      this.updateAppBadge();
    }
    if (this.props.tab === "info" && prevProps.tab !== "info") {
      this.eventuallyMarkNotificationsAsSeen();
    }
  }

  updateAppBadge() {
    if (this.props.enabled && Platform.OS === "ios") {
      PushNotificationIOS.setApplicationIconBadgeNumber(this.props.badge);
      updateInstallation({ badge: this.props.badge });
    }
  }

  eventuallyMarkNotificationsAsSeen() {
    const { dispatch } = this.props;
    setTimeout(() => dispatch(markAllNotificationsAsSeen()), 1000);
  }

  render() {
    return null;
  }
}

function select(store) {
  return {
    enabled: store.notifications.enabled === true,
    badge: unseenNotificationsCount(store),
    tab: store.navigation.tab
  };
}

module.exports = connect(select)(AppBadgeController);
