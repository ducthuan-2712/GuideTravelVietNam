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

'use strict'

// Depdencies
import React from 'react'

// Components
import { 
  View,
  Image,
  ScrollView,
  Dimensions
} from 'react-native'
import { Text, Heading5, Heading4 } from '../../../common/GText'
import StyleSheet from '../../../common/GStyleSheet'
import GButton from '../../../common/GButton'

// Pages
import SlideCarousel from '../../common/carousel/SlideCarousel'
import Gallery from './gallery/Gallery'

const { 
  width: viewportWidth, 
  height: viewportHeight 
} = Dimensions.get('window')

class GTripContainer extends React.Component {
  props: Props

  constructor(props) {
    super(props);
    this.state = {}

    this.handleGallery = this.handleGallery.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleMore = this.handleMore.bind(this);
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

  handleGallery(synsData) {
    if (this.props.isOnline) {
      this.props.navigator.push({
        gallery: synsData,
        types: true
      })
    } else {
      this.showAlertOffline()
    }
  }

  handleSlide(synsData) {
    if (this.props.isOnline) {
      this.props.navigator.push({
        detail: synsData
      })
    } else {
      this.showAlertOffline()
    }
  }

  handleCheck() {
    const { onPressCheck } = this.props
    onPressCheck && onPressCheck()
  }

  handleMore() {
    const { onPressMore } = this.props
    onPressMore && onPressMore()
  }

  render() {
    const { destination, filter, detail, nearby } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titles}>
            {filter.name}
          </Text>
        </View>
        <ScrollView 
          style={styles.container}
          directionalLockEnabled={false}
          scrollEventThrottle={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.slider}>
            <View style={styles.slide}>
              <SlideCarousel
                source={nearby}
                onPress={this.handleSlide}
              />
            </View>
          </View>
          <View style={styles.buttons}>
            {this.props.plan.show.name !== this.props.filter.name
              ? <GButton
                  icon={require("../../../common/img/buttons/icon-check.png")}
                  caption="Check"
                  onPress={this.handleCheck}
                  style={[styles.btnCheck, styles.btn]}
                />
              : null
            }
            <GButton
              icon={require("../../../common/img/buttons/icon-search.png")}
              caption="More"
              onPress={this.handleMore}
              style={[styles.btnMore, styles.btn]}
            />
          </View>
          <Gallery 
            source={detail}
            onPress={this.handleGallery} 
          />
        </ScrollView>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24
  },
  titles: {
    color: '#3f6072',
    fontSize: 12,
  },
  slider: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 20
  },
  slideTitle: {
    marginTop: 15,
    marginLeft: 20,
    width: 15,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingRight: 20,
    paddingBottom: 30
  },
  btn: {
    minWidth: viewportWidth / 3,
    borderRadius: 40,
  },
  btnCheck: {
    backgroundColor: '#c1c1c1'
  },
  btnMore: {
    backgroundColor: '#fe9375',
    marginLeft: 15
  }
})

module.exports = GTripContainer
