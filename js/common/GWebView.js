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
import GColors from "./GColors";
import GHeader from "./GHeader";
import GLinking from "./GLinking";
import StyleSheet from "./GStyleSheet";
import {
  Platform,
  InteractionManager,
  View,
  Keyboard,
  PixelRatio,
  WebView,
  TouchableOpacity,
  Image
} from "react-native";

/* constants ================================================================ */

const NAVBAR_HEIGHT_IOS = 45,
  STATUS_BAR_HEIGHT_ANDROID =
    Platform.OS === "android" && Platform.Version && Platform.Version < 21
      ? 0
      : 25,
  NAVBAR_HEIGHT_ANDROID = 55 + STATUS_BAR_HEIGHT_ANDROID, // old android status bar issue (fix from GHeader)
  DISABLED_OPACITY = 0.3;

/**
* ==============================================================================
* <GWebView />
* ------------------------------------------------------------------------------
* @param {string} url WebView source prop
* @param {AnyObject} navigator GNavigator for back button 'pop'
* @param {?string} backgroundColor Optional header background color
* @param {?string} titleColor Optional header title color
* @param {?string} itemsColor Optional header items color
* @return {ReactElement}
* ==============================================================================
*/

class GWebView extends React.Component {
  static defaultProps = {
    backgroundColor: GColors.salmon,
    titleColor: GColors.white,
    itemsColor: GColors.white
  };

  constructor(props) {
    super(props);

    const { url } = this.props;
    this.state = {
      url,
      canNavigateBack: false,
      canNavigateForward: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPlatformHeader()}
        <Loading>
          <View style={{ flex: 1 }}>
            <WebView
              ref={c => (this._webview = c)}
              onNavigationStateChange={this.onNavigationStateChange}
              style={styles.webview}
              source={{ uri: this.props.url }}
              scalesPageToFit={true}
            />
            {Platform.OS === "ios" ? this.renderNavigationBarIOS() : null}
          </View>
        </Loading>
      </View>
    );
  }

  renderPlatformHeader() {
    const { backgroundColor, titleColor, itemsColor } = this.props;

    if (Platform.OS === "ios") {
      return (
        <GHeader
          backgroundColor={backgroundColor}
          titleColor={titleColor}
          itemsColor={itemsColor}
          leftItem={{
            title: "Done",
            onPress: this.dismiss
          }}
        >
          <Image
            style={{ tintColor: titleColor }}
            source={require("./img/webview/logo.png")}
          />
        </GHeader>
      );
    } else {
      return (
        <WebViewNavigationAndroid
          backgroundColor={backgroundColor}
          titleColor={titleColor}
          itemsColor={itemsColor}
          canBack={this.state.canNavigateBack}
          canForward={this.state.canNavigateForward}
          onDismiss={this.dismiss}
          onBack={_ => this.navigate("BACK")}
          onForward={_ => this.navigate("FORWARD")}
          onBrowser={_ => this.navigate("BROWSER")}
        />
      );
    }
  }

  renderNavigationBarIOS() {
    return (
      <WebViewNavigationIOS
        canBack={this.state.canNavigateBack}
        canForward={this.state.canNavigateForward}
        onBack={_ => this.navigate("BACK")}
        onForward={_ => this.navigate("FORWARD")}
        onBrowser={_ => this.navigate("BROWSER")}
      />
    );
  }

  navigate(intent) {
    if (intent === "BACK" && this.state.canNavigateBack) {
      this._webview.goBack && this._webview.goBack();
    } else if (intent === "FORWARD" && this.state.canNavigateForward) {
      this._webview.goForward && this._webview.goForward();
    } else if (intent === "BROWSER") {
      GLinking.openURL(this.state.url);
    }
  }

  onNavigationStateChange = navState => {
    this.setState({
      canNavigateBack: navState.canGoBack,
      canNavigateForward: navState.canGoForward,
      url: navState.url
    });
  };

  dismiss = _ => {
    this.props.navigator.pop();
    Keyboard.dismiss();
  };
}

/* =============================================================================
<Loading /> (iOS & Android)
--------------------------------------------------------------------------------
Wait until WebView is ready before rendering children.
============================================================================= */
class Loading extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ loaded: true })
    );
  }

  render() {
    if (this.state.loaded) {
      return React.Children.only(this.props.children);
    }
    return null;
  }
}

/* =============================================================================
<WebViewNavigationIOS />
--------------------------------------------------------------------------------
Back, forward and open in a browser
============================================================================= */
class WebViewNavigationIOS extends React.Component {
  render() {
    return (
      <View style={styles.navBar}>
        <View style={styles.navBarArrows}>
          <TouchableOpacity
            onPress={_ => this.props.onBack && this.props.onBack()}
            disabled={!this.props.canBack}
            style={styles.navBarAction}
          >
            <Image
              style={!this.props.canBack ? { opacity: DISABLED_OPACITY } : null}
              source={require("./img/webview/back.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={_ => this.props.onForward && this.props.onForward()}
            disabled={!this.props.canForward}
            style={styles.navBarAction}
          >
            <Image
              style={
                !this.props.canForward ? { opacity: DISABLED_OPACITY } : null
              }
              source={require("./img/webview/forward.png")}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={_ => this.props.onBrowser && this.props.onBrowser()}
          style={styles.navBarAction}
        >
          <Image source={require("./img/webview/browser.png")} />
        </TouchableOpacity>
      </View>
    );
  }
}

/* =============================================================================
<WebViewNavigationAndroid />
--------------------------------------------------------------------------------
Back, forward and open in a browser
============================================================================= */
class WebViewNavigationAndroid extends React.Component {
  render() {
    const { backgroundColor, itemsColor } = this.props;

    return (
      <View style={[styles.navBar, { backgroundColor }]}>
        <View style={styles.navBarContent}>
          <TouchableOpacity
            onPress={_ => this.props.onDismiss && this.props.onDismiss()}
            style={styles.navBarDismiss}
          >
            <Image
              style={{ tintColor: itemsColor }}
              source={require("./img/webview/close.png")}
            />
          </TouchableOpacity>

          <View style={styles.navBarArrows}>
            <TouchableOpacity
              onPress={_ => this.props.onBack && this.props.onBack()}
              disabled={!this.props.canBack}
              style={styles.navBarAction}
            >
              <Image
                style={[
                  { tintColor: itemsColor },
                  !this.props.canBack ? { opacity: DISABLED_OPACITY } : null
                ]}
                source={require("./img/webview/back.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={_ => this.props.onForward && this.props.onForward()}
              disabled={!this.props.canForward}
              style={styles.navBarAction}
            >
              <Image
                style={[
                  { tintColor: itemsColor },
                  !this.props.canForward ? { opacity: DISABLED_OPACITY } : null
                ]}
                source={require("./img/webview/forward.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={_ => this.props.onBrowser && this.props.onBrowser()}
              style={styles.navBarAction}
            >
              <Image
                style={{ tintColor: itemsColor }}
                source={require("./img/webview/browser.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

/* StyleSheet =============================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.bianca
  },
  webview: {
    flex: 1
  },

  navBar: {
    ios: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: NAVBAR_HEIGHT_IOS,
      backgroundColor: GColors.bianca,
      borderTopWidth: 1 / PixelRatio.get(),
      borderColor: GColors.magnesium
    },
    android: {
      height: NAVBAR_HEIGHT_ANDROID,
      paddingHorizontal: 10,
      paddingBottom: 10,
      justifyContent: "flex-end"
    }
  },

  navBarContent: {
    android: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  },

  navBarArrows: {
    flexDirection: "row",
    justifyContent: "space-between",

    ios: {
      width: 150
    },
    android: {
      width: 122,
      alignItems: "center"
    }
  },

  navBarDismiss: {
    android: {
      padding: 5
    }
  },

  navBarAction: {
    ios: {
      justifyContent: "center",
      paddingHorizontal: 15
    },
    android: {
      padding: 5
    }
  }
});

/* playground cards ========================================================= */

const webView = GWebView;
webView.__cards__ = define => {
  define("Default", _ => <GWebView url="https://fbG.com" />);
};

/* exports ================================================================== */
module.exports = webView;
