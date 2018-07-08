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
 * @providesModule MapView
 * @flow
 */
'use strict';

// Depdencies
import React from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

// Components
import { 
  View, 
  Navigator, 
  Platform, 
  ActivityIndicator, 
  Alert,
  PermissionsAndroid,
  Dimensions
} from 'react-native'
import { Text, Heading2 } from '../../../common/GText'
import StyleSheet from '../../../common/GStyleSheet'
import GHeader from '../../../common/GHeader'
import GColors from '../../../common/GColors'

// Pages
import LocalMap from './LocalMap'

// Config
import { API_KEY_GOOGLE } from '../../../env'

type Props = {
  navigatorPage: Navigator;
  isOnline: boolean;
  geolocationOptions: Object;
}

type State = {
  myPosition: 'unknown';
  animateRegion: boolean;
  handlePreventClick: boolean;
  init: boolean;
  isOnline: boolean;
}

// Temporary solution - GIẢM maximumAge từ 1000 xuống 0 để lấy location
const SET_MAXIMUM_AGE = Platform.OS === 'android' ? 0 : 1000
const SET_TIME_OUT = Platform.OS === 'android' ? 5000 : 20000
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: SET_TIME_OUT, maximumAge: SET_MAXIMUM_AGE }

const defaultProps = {
  geolocationOptions: GEOLOCATION_OPTIONS,
}

class MapView extends React.Component {
  props: Props
  state: State
  watchID: ?number = null

  constructor(props: Props) {
    super(props)
    this.state = {
      myPosition: null,
      animateRegion: false,
      handlePreventClick: false,
      init: false,
      callGoogleMap: false,
      isOnline: this.props.isOnline
    }

    this.close = this.close.bind(this)
    this.callDirection = this.callDirection.bind(this)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isOnline !== nextProps.isOnline) {
      this.setState({ isOnline: nextProps.isOnline })
      if (nextProps.isOnline && !this.state.init) {
        this._requestLocationPermissionDetect()
      }
    }
  }

  componentDidMount() {
    this._requestLocationPermissionDetect()
  }

  _requestLocationPermissionDetect() {
    if (Platform.OS == 'android' && Platform.Version >= 23)
      this._requestLocationPermission()
    else
      this._fetch()
  }

  _requestLocationPermission = async () => {
    try {
      console.log('Asking for location permission');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location',
          'message': 'Access to your location ' + 'for some reason.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location granted')
        this._fetch()
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  _fetch() {
    // navigator.geolocation.getCurrentPosition((position) => {
    //     var myLastPosition = this.state.myPosition;
    //     var myPosition = position.coords;
    //     if (!isEqual(myPosition, myLastPosition)) {
    //       this.setState({ myPosition });
    //       if (!this.state.myPosition) {
    //         this.setState({ init: true });
    //       }
    //     }
    //   },
    //   (error) => alert(JSON.stringify(error)), this.props.geolocationOptions);

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var myLastPosition = this.state.myPosition
      var myPosition = position.coords
      if (!myLastPosition) {
        this.setState({ init: true })
      }
      if (!isEqual(myPosition, myLastPosition)) {
        this.setState({ myPosition })
      }
    }, null, this.props.geolocationOptions)
  }

  componentWillUnmount() {
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID)
  }

  close() {
    this.props.navigatorPage.pop()
  }

  render() {
    const { map, types } = this.props
    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../../common/img/header/back.png"),
      onPress: this.close
    }

    const rightItem = {
      layout: 'icon',
      title: 'Định vị',
      icon: require('../../../common/img/header/direction.png'),
      onPress: this.callDirection,
    }

    const { width, height } = Dimensions.get('window')
    const ASPECT_RATIO = width / height
    const LATITUDE_DELTA = 0.0922
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
    const SPACE = 0.01
    const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 }
    const region = {
      latitude: types ? map.list[0].geometry.location.lat : map.geometry.location.lat,
      longitude: types ? map.list[0].geometry.location.lng : map.geometry.location.lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }

    return (
      <View style={styles.container}>
        <GHeader
          title="Bản đồ"
          backgroundColor="#fe9375"
          titleColor={GColors.white}
          navItem={backItem}
          rightItem={types && rightItem}
        />
        <LocalMap
          navigator={this.props.navigatorPage}
          animateRegion={this.state.animateRegion}
          isOnline={this.state.isOnline}
          preventClick={_ => this.setState({ handlePreventClick: true })}
          preventClickDone={_ => this.setState({ handlePreventClick: false })}
          markers={types ? map.list : [map]}
          types={types}
          region={region}
          callGoogleMap={this.state.callGoogleMap}
          returnCallMap={_ => this.setState({callGoogleMap: false})}
          apiKeyGoogle={API_KEY_GOOGLE}
          style={styles.map}
        />
      </View>
    )
  }

  callDirection() {
    if(!this.state.handlePreventClick) {
      this.setState({
        callGoogleMap: true
      })
    }
  }
}

MapView.defaultProps = defaultProps

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e9f4'
  },
  header: {
    backgroundColor: GColors.darkBackground,
  },
  map: {
    flex: 1,
    marginTop: GHeader.height,
    ios: {
      marginBottom: 50,
    }
  },
  headerContent: {
    android: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    ios: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  title: {
    ios: {
      textAlign: 'center',
    },
  },
  text: {
    color: 'white',
    android: {
      fontWeight: 'bold',
      fontSize: 17,
    }
  },
});

function select(store) {
  return {
    isOnline: store.checkInternet,
  };
}

module.exports = connect(select)(MapView)
