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
 * @providesModule GTabsView
 */

'use strict';

var GColors = require('GColors');
var GCreateView = require('GCreateView');
var GDestinationView = require('GDestinationView');
var GLocalView = require('GLocalView');
var GInfoView = require('GInfoView');
var GMapView = require('GMapView');
var React = require('React');
var TabBarIOS = require('TabBarIOS');
var Navigator = require('Navigator');
//var unseenNotificationsCount = require('./notifications/unseenNotificationsCount');

var { switchTab } = require('../actions');
var { connect } = require('react-redux');

import type { Tab } from '../reducers/navigation';

type Props = {
  tab: Tab;
  onTabSelect: (tab: Tab) => void;
  navigator: Navigator;
};

class GTabsView extends React.Component {
  props: Props;

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    return (
      <TabBarIOS tintColor={GColors.darkText}>
        <TabBarIOS.Item
          title="Cảm nhận"
          selected={this.props.tab === 'create'}
          onPress={this.onTabSelect.bind(this, 'create')}
          icon={require('./create/img/create-icon.png')}
          selectedIcon={require('./create/img/create-icon-active.png')}>
          <GCreateView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Địa danh"
          selected={this.props.tab === 'destination'}
          onPress={this.onTabSelect.bind(this, 'destination')}
          icon={require('./destination/img/destination-icon.png')}
          selectedIcon={require('./destination/img/destination-icon-active.png')}>
          <GDestinationView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Lịch sử"
          selected={this.props.tab === 'local'}
          onPress={this.onTabSelect.bind(this, 'local')}
          icon={require('./local/img/local-icon.png')}
          selectedIcon={require('./local/img/local-icon-active.png')}>
          <GLocalView navigator={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Vui chơi"
          selected={this.props.tab === 'map'}
          onPress={this.onTabSelect.bind(this, 'map')}
          //badge={this.props.notificationsBadge || null}
          icon={require('./map/img/map-icon.png')}
          selectedIcon={require('./map/img/map-icon-active.png')}>
          <GMapView navigatorPage={this.props.navigator} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title={this.props.user.isLoggedIn ? "Cá nhân" : "Hướng dẫn" }
          selected={this.props.tab === 'info'}
          onPress={this.onTabSelect.bind(this, 'info')}
          icon={this.props.user.isLoggedIn ? require('./info/img/user-icon.png') : require('./info/img/info-icon.png')}
          selectedIcon={this.props.user.isLoggedIn ? require('./info/img/user-icon-active.png') : require('./info/img/info-icon-active.png')}>
          <GInfoView navigator={this.props.navigator} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
    user: store.user,
    // Get Notification from local destination
    // notificationsBadge: unseenNotificationsCount(store) + store.surveys.length,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(GTabsView);

