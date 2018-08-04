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
 * @providesModule GuideTravelVietnamNavigator
 * @flow
 */

'use strict';

// Depdencies
import React from 'react'
import { connect } from 'react-redux'

// Components
import { 
  Platform, 
  BackHandler, 
  StyleSheet 
} from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components'

// Pages
import GTabsView from './tabs/GTabsView'
import GDetailView from './tabs/detail/GDetailView'
import GPlanView from './tabs/plan/GPlanView'
import FilterScreen from './tabs/common/filter/FilterScreen'
import SavePlaced from './tabs/common/save/SavePlaced'
import GalleryCarousel from './tabs/common/gallery/GalleryCarousel'
import MapView from './tabs/common/map/MapView'
import MyFilter from './tabs/trip/component/filter/myFilter'

// Config
import { switchTab } from './actions';

const GuideTravelVietnamNavigator = React.createClass({
  _handlers: ([]: Array<() => boolean>),

  componentDidMount: function() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  },

  componentWillUnmount: function() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  },

  getChildContext: function() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  },

  addBackButtonListener: function(listener) {
    this._handlers.push(listener);
  },

  removeBackButtonListener: function(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  },

  handleBackButton: function() {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'trip') {
      this.props.dispatch(switchTab('trip'));
      return true;
    }
    return false;
  },

  render: function() {
    return (
      <Navigator
        ref={c => (this._navigator = c)}
        style={styles.container}
        configureScene={route => {
          // TODO: Proper scene support
          if (route.gallery) {
            return Navigator.SceneConfigs.FloatFromRight;
          } else {
            if (Platform.OS === 'android') {
              return Navigator.SceneConfigs.FloatFromBottomAndroid;
            }
            return Navigator.SceneConfigs.FloatFromBottom;
          }
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  },

  renderScene: function(route, navigator) {
    if (route.filter) { return <FilterScreen results={route.filter} callback={route.callback} navigator={navigator} /> }
    if (route.gallery) { return <GalleryCarousel gallery={route.gallery} types={route.types} navigator={navigator} /> }
    if (route.myFilter) { return <MyFilter results={route.myFilter} navigator={navigator} /> }
    if (route.detail) { return <GDetailView detail={route.detail} navigator={navigator} /> }
    if (route.plan) { return <GPlanView callback={route.planCallback} isEdit={route.isEdit} navigator={navigator} /> }
    if (route.map) { return <MapView map={route.map} types={route.types} navigatorPage={navigator} /> }
    if (route.savePlaced) { return <SavePlaced {...route} navigator={navigator} /> }

    return <GTabsView navigator={navigator} />
  }
});

GuideTravelVietnamNavigator.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  }
});

function select(store) {
  return {
    tab: store.navigation.tab,
    isLoggedIn: store.user.hasSkippedLogin
  };
}

module.exports = connect(select)(GuideTravelVietnamNavigator);
