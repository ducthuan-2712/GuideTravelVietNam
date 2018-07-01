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
 */
"use strict";

import React from "react";
import { StyleSheet, Alert } from "react-native";
import GButton from "./GButton";
import { logInWithFacebook } from "../actions";
import { connect } from "react-redux";

class LoginButton extends React.Component {
  props: {
    style: any,
    source?: string, // For Analytics
    dispatch: (action: any) => Promise,
    onLoggedIn: ?() => void
  };
  state: {
    isLoading: boolean
  };
  _isMounted: boolean;

  constructor() {
    super();
    this.state = { isLoading: false };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(): ReactElement {
    if (this.state.isLoading) {
      return (
        <GButton
          theme="fb"
          style={[styles.button, this.props.style]}
          caption="Vui lòng chờ ..."
          onPress={() => {}}
        />
      );
    }

    return (
      <GButton
        theme="fb"
        style={[styles.button, this.props.style]}
        icon={require('../login/img/f-logo.png')}
        caption="Kết nối bằng tài khoản Facebook"
        onPress={() => this.logIn()}
      />
    );
  }

  async logIn() {
    const { dispatch, onLoggedIn } = this.props;

    this.setState({ isLoading: true });
    try {
      await Promise.all([dispatch(logInWithFacebook(this.props.source))]);
    } catch (e) {
      const message = e.message || e;
      if (message !== "Timed out" && message !== "Canceled by user") {
        Alert.alert(message);
      }
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }

    onLoggedIn && onLoggedIn();
  }
}

var styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#3b5998',
    borderRadius: 50,
  },
});

module.exports = connect()(LoginButton);
