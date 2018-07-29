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
 * @providesModule LocalMap
 * @flow
 */
'use strict';

// Depdencies
import React from 'react'
import haversine from 'haversine'
import pick from 'lodash/pick'
import MapView from 'react-native-maps'
import Immutable from 'immutable'

// Components
import { 
  Linking, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Navigator, 
  Text, 
  Image,
  Animated, 
  StyleSheet, 
  InteractionManager,
  Alert,
  Platform,
} from 'react-native'
import GHeader from '../../../common/GHeader'
import GColors from '../../../common/GColors'
import GActivityIndicator from '../../../common/GActivityIndicator'

// Pages
import SlideCarousel from '../carousel/SlideCarousel'
import GalleryMarker from './GalleryMarker'
import RoutesMap from './RoutesMap'
import BoxMarker from './BoxMarker'
import customStyle from './customStyle'

type Props = {
  navigatorPage: Navigator;
  region: Object;
}

type State = {
  region: Object;
  initialPosition: Object;
  checkLoading: boolean;
  fadeAnim: number;
  markers: Array<Object>;
  routeCoordinates: Array<Object>;
  dataMarker: Object;
  coords: string;
  routesPlan: Array<Object>;
}

class LocalMap extends React.Component {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      region: this.props.region,
      initialPosition: this.props.region,
      checkLoading: false,
      fadeAnim: new Animated.Value(0),
      markers: this.props.markers,
      routeCoordinates: [],
      dataMarker: '',
      coords: '',
      routesPlan: [],
      slideIndex: 0
    }

    this.map = null;

    (this: any).onRegionChange = this.onRegionChange.bind(this);
    (this: any).handleCloseDataMaker = this.handleCloseDataMaker.bind(this);
    (this: any).handleOpenDataMaker = this.handleOpenDataMaker.bind(this);
    (this: any).handleSlideIndex = this.handleSlideIndex.bind(this);
    (this: any).handleSlide = this.handleSlide.bind(this);
  }

  componentDidUpdate() {
    const { animateRegion } = this.props
    if (animateRegion) {
      this.animateRegion()
    }
  }

  componentDidMount() {
    const { animateRegion, types } = this.props
    if (animateRegion) {
      this.animateRegion()
    }
    if (types) {
      this.handleGetLink()
      this.fitToCoordinates()
    }
  }

  showAlertOffline() {
    Alert.alert(
      'Không có kết nối internet',
      'Vui lòng di chuyển đến vùng sóng tốt hơn và thử lại !',
      [
        {text: 'Đồng ý', onPress: () => this.close()},
      ]
    )
  }

  fitToCoordinates() {
    const _this = this
    setTimeout(() => {
      let arrayMarkers = Immutable.List([])

      Promise.resolve(
        _this.state.markers.map((marker, i) => {
          return arrayMarkers = arrayMarkers.push({
            latitude: marker.geometry.location.lat,
            longitude: marker.geometry.location.lng
          })
        })
      ).then(() => {
        _this.map.fitToCoordinates(
          arrayMarkers,
          {
            edgePadding: { top: 200, right: 150, bottom: 300, left: 150 },
            animated: true
          }
        )
      })
    }, 1000)
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   const { callGoogleMap } = this.props
  //   if (callGoogleMap !== nextProps.callGoogleMap) {
  //     this.handleGetLink()
  //   }
  // }

  onRegionChange(region: Object) {
    this.setState({ 
      region,
      initialPosition: {
        latitude: this.state.initialPosition.latitude,
        longitude: this.state.initialPosition.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      }
    })
  }

  animateRegion() {
    this.map.animateToRegion(this.Region())
  }

  Region() {
    let { initialPosition } = this.state
    return initialPosition
  }

  handleSlide(synsData) {
    this.props.navigator.push({
      detail: synsData
    })
  }

  handleOutLink(value: Object) {
    // Current Location
    let { markers } = this.state

    // Get Url from Google
    // https://www.google.com/maps/dir/10.788573,+106.695950/10.77980,+106.699069

    let url = 'https://www.google.com/maps/dir/'

    markers.map((location, index) => {
      if (location.geometry.location) {
        url += location.geometry.location.lat + '%2C' + '%2B' + location.geometry.location.lng + '/'
      }
    })

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url)
      } else {
        this.showAlertOffline()
      }
    })
  }

  handleReturnMarker() {
    this.setState({ coords: '' })
  }

  handleDataMaker(dataMarker: Object) {
    if (this.props.types) {
      this.setState({ dataMarker: dataMarker })

      setTimeout(() => {
        this.map.animateToRegion({
          latitude: dataMarker.geometry.location.lat,
          longitude: dataMarker.geometry.location.lng,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta
        })
      }, 200)
    }
  }

  handleCloseDataMaker(dataMarker: Object) {
    this.setState({ dataMarker: '' })
  }

  handleOpenDataMaker(dataMarker) {
    this.props.navigator.push({
      detail: dataMarker
    })
  }

  handleSlideIndex(slideIndex) {
    this.setState({
      slideIndex: slideIndex
    })
  }

  calcDistance(newLatLng) {
    const { region } = this.state
    const prevLatLng = { latitude: region.latitude, longitude: region.longitude }

    return (haversine(prevLatLng, newLatLng) || 0)
  }

  handleGetLink() {
    let { isOnline, apiKeyGoogle } = this.props
    let { markers } = this.state
    let routes = Immutable.List([])

    if (isOnline) {
      // Change to component pin
      this.setState({ 
        checkLoading: true,
      })
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 200,
        }
      ).start( this.props.preventClick() )

      markers.map((location, index) => {
        if (location.geometry.location) {
          // location.marker.setOptions(getMarkerIcon(index, _.filter(state.locations, (location)=>{return !_.isUndefined(location.marker)}).length, pinfrom));
          return routes = routes.push({
            location: {
              latitude: location.geometry.location.lat,
              longitude: location.geometry.location.lng,
            },
            stopover: true
          })
        }
      })

      // Declare API from Google
      let mode = 'driving' // 'walking'
      let origin = 'origin=' + routes.first().location.latitude + '%2C' + routes.first().location.longitude
      let destination = '&destination=' + routes.last().location.latitude + '%2C' + routes.last().location.longitude
      let waypoints = ''
      if (routes.length > 2) {
        routes = routes.splice(routes.size - 1, 1).splice(0, 1)
        waypoints = '&waypoints='
        routes.map((route, index) => {
          if(index == routes.length - 1) {
            return waypoints += route.location.latitude + '%2C' + route.location.longitude
          }
          return waypoints += route.location.latitude + '%2C' + route.location.longitude + '|'
        })
      }

      // Get Url from Google
      let url = 'https://maps.googleapis.com/maps/api/directions/json?'
          url += origin
          url += destination
          url += waypoints
          url += '&key=' + apiKeyGoogle

      fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.routes.length) {
            this.setState({
              coords: this.decode(responseJson.routes[0].overview_polyline.points), // definition below
              routesPlan: responseJson.routes[0],
            });
            // Change checkLoading to false so return result
            Animated.timing(
              this.state.fadeAnim,
              {
                toValue: 0,
                duration: 200,
              }
            ).start(
              this.setState({ checkLoading: false }),
              this.props.preventClickDone(),
              this.animateRegion(),
            );
          }
        }).catch(e => {console.warn(e)})

    } else {
      this.showAlertOffline()
    }
  }

  decode(t,e) {
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})
  }

  render() {
    let renderAnimateSpin, renderAnimateMore

    if (this.state.checkLoading) {
      renderAnimateSpin = (
        // Spin loading when map is connect to server to check data
        <Animated.View style={[styles.pin, {opacity: this.state.fadeAnim}]}>
          <GActivityIndicator />
        </Animated.View>
      );
    }

    return (
      <View style={[styles.container, this.props.style]}>
        <MapView
          style={styles.map}
          ref={ref => { this.map = ref }}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          provider={this.props.provider}
          // customMapStyle={customStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={Platform.OS === 'ios' ? true : false}
          loadingEnabled={true}
          toolbarEnabled={Platform.OS === 'ios' ? true : false}
          moveOnMarkerPress={Platform.OS === 'ios' ? true : false}
        >
          {
            this.state.markers.map((marker, i) => {
              return (
                <MapView.Marker
                  key={i}
                  coordinate={{
                    latitude: marker.geometry.location.lat,
                    longitude: marker.geometry.location.lng
                  }}
                  onPress={() => this.handleDataMaker(marker)}
                >
                  <GalleryMarker
                    number={i}
                    marker={marker}
                    slideIndex={this.state.slideIndex}
                  />
                </MapView.Marker>
              )
            })
          }

          {
            this.state.coords
              ? <MapView.Polyline
                  key="editingPolyline"
                  // coordinates={[
                  //     {latitude: this.state.region.latitude, longitude: this.state.region.longitude}, // optional
                  //     ...this.props.coords,
                  //     {latitude: this.state.lastPosition.latitude, longitude: this.state.lastPosition.longitude}, // optional
                  // ]}
                  coordinates={this.state.coords}
                  strokeColor={GColors.darkBackground}
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={4}
                />
              : null
          }

        </MapView>

        {
          !this.props.types
            ? <BoxMarker
                style={styles.viewMarker}
                dataMarker={this.props.markers[0]}
                apiKeyGoogle={this.props.apiKeyGoogle}
                onPress={this.handleOpenDataMaker}
              />
            : <View style={styles.viewRoutes}>
                <SlideCarousel
                  customMap={true}
                  source={this.state.markers}
                  onPress={this.handleOpenDataMaker}
                  onSlideIndex={this.handleSlideIndex}
                  routes={this.state.routesPlan}
                  coords={this.state.coords}
                />
              </View>
        }

        {renderAnimateSpin}
      </View>
    );
  }
}

LocalMap.propTypes = {
  provider: MapView.ProviderPropType,
}

var styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 4,
    backgroundColor: GColors.white,
  },
  viewRoutes: {
    position: 'absolute',
    backgroundColor: GColors.white,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
})

module.exports = LocalMap
