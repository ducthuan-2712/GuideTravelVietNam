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

'use strict';

// Depdencies
import React from "react";

// Components
import { 
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
  Image
} from "react-native";
import { Text, Heading1, Heading3, Heading2, Heading4, Heading5 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GImage from "../../../../common/GImage";
import GRating from "../../../../common/GRating";
import GColors from "../../../../common/GColors";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    }
  }

  showAlertOffline() {
    Alert.alert(
      'Không có kết nối internet',
      'Vui lòng di chuyển đến vùng sóng tốt hơn và thử lại !',
      [
        {text: 'Đồng ý', onPress: () => console.log('Cancel Pressed!')},
      ]
    )
  }

  openInfo(source) {
    Linking.canOpenURL(source.result.url).then(supported => {
      if (supported) {
        Linking.openURL(source.result.url);
      } else {
        this.showAlertOffline()
      }
    });
  }

  openWeb(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        this.showAlertOffline()
      }
    });
  }

  openPhone(number) {
    Linking.canOpenURL(number).then(supported => {
      if (supported) {
        Linking.openURL(number);
      } else {
        this.showAlertOffline()
      }
    });
  }

  openMap(session) {
    this.props.onMap && this.props.onMap(session)
  }

  openToggle() {
    this.setState((prevState, props) => {
      return {toggle: !prevState.toggle};
    });
  }

  render() {
    const { source, apiKeyGoogle, bottom } = this.props;
    const getSourceAPI = source.result.photos
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${source.result.photos[0].photo_reference}&key=${apiKeyGoogle}`
      : {}

    if(bottom) {
      return (
        <View style={styles.container}>
          {this.renderInfo(source)}
          <TouchableOpacity
            accessibilityTraits="button"
            activeOpacity={1}
            onPress={_ => this.openMap(source.result)}
          >
            <GImage
              source={`https://maps.googleapis.com/maps/api/staticmap?center=${source.result.geometry.location.lat},${source.result.geometry.location.lng}&zoom=16&size=802x302&markers=icon:${source.result.url}%7C${source.result.geometry.location.lat},${source.result.geometry.location.lng}&key=${apiKeyGoogle}`}
              sizeWidth={viewportWidth}
              sizeHeight={viewportWidth/2}
              sizeBorderRadius={0}
            />
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          accessibilityTraits="button"
          activeOpacity={0.8}
          onPress={_ => this.openInfo(source)}
          style={styles.top}
        >
          <GImage 
            style={styles.img}
            sizeWidth={viewportWidth}
            sizeHeight={viewportWidth/2}
            sizeBorderRadius={0}
            source={getSourceAPI}
          />
        </TouchableOpacity>
        <Heading3 style={styles.h1}>
          {source.result.name}
        </Heading3>
        <View style={styles.rating}>
          <GRating star={source.result.rating} />
        </View>
      </View>
    );
  }

  renderInfo(source) {
    return (
      <View style={styles.box}>
        {source.result.formatted_address && this.renderAddress(source)}
        {source.result.opening_hours && source.result.opening_hours.weekday_text.length ? this.renderOpenHours(source) : null}
        {source.result.international_phone_number && this.renderPhone(source)}
        {source.result.website && this.renderWebsite(source)}
      </View>
    )
  }

  renderAddress(source) {
    return (
      <View style={styles.boxInfo}>
        <Image
          source={require("../../img/icon-address.png")}
          style={styles.icon}
        />
        <Text style={styles.boxText}>
          {source.result.formatted_address}
        </Text>
      </View>
    )
  }

  renderOpenHours(source) {
    let d = new Date()
    let n = d.getDay() == 0 ? 6 : d.getDay() - 1

    return (
      <View>
        <View style={styles.boxInfo}>
          <Image
            source={require("../../img/icon-clock.png")}
            style={styles.icon}
          />
          <Text style={styles.boxText}>
            {source.result.opening_hours.weekday_text[n]}
          </Text>
          <TouchableOpacity
            accessibilityTraits="button"
            activeOpacity={0.8}
            onPress={_ => this.openToggle()}
          >
            <Image
              source={require("../../../my/img/icon-arrow.png")}
              style={this.state.toggle ? styles.iconCustomRotate : styles.iconCustom}
            />
          </TouchableOpacity>
        </View>
        {this.state.toggle && this.renderToggle(source)}
      </View>
    )
  }

  renderToggle(source) {
    return (
      <View style={styles.boxInfoCustom}>
        {source.result.opening_hours.weekday_text.map((session, index) => {
          return (
            <Text style={styles.boxTextCustom}>
              {session}
            </Text>
          )
        })}
      </View>
    )
  }

  renderPhone(source) {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.8}
        onPress={_ => this.openPhone(source.result.international_phone_number)}
      >
        <View style={styles.boxInfo}>
          <Image
            source={require("../../img/icon-phone.png")}
            style={styles.icon}
          />
          <Text style={styles.boxText}>
            {source.result.international_phone_number}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderWebsite(source) {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.8}
        onPress={_ => this.openWeb(source.result.website)}
      >
        <View style={styles.boxInfo}>
          <Image
            source={require("../../img/icon-website.png")}
            style={styles.icon}
          />
          <Text style={styles.boxText}>
            {source.result.website}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.white
  },
  h1: {
    color: GColors.black,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  rating: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  box: {
    backgroundColor: GColors.white,
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  marginTop: {
    marginTop: 15
  },
  boxInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  boxText: {
    color: GColors.black,
    marginBottom: 20,
    flex: 1,
    marginLeft: 10
  },
  boxIcon: {
    width: 24,
    height: 24,
  },
  iconCustom: {
    marginTop: -6,
    transform: ([{ rotate: '90deg' }])
  },
  iconCustomRotate: {
    marginTop: -6,
    transform: ([{ rotate: '-90deg' }])
  },
  boxInfoCustom: {
    flex: 1,
    marginLeft: 33,
    paddingBottom: 15,
    marginTop: -5,
  },
  boxTextCustom: {
    marginBottom: 5
  }
});

module.exports = Info
