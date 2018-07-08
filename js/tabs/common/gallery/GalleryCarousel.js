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
import React from 'react'

// Components
import { 
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { Text } from '../../../common/GText'
import GHeader from '../../../common/GHeader'
import GColors from '../../../common/GColors'
import GFonts from '../../../common/GFonts'
import StyleSheet from '../../../common/GStyleSheet'
import GImage from '../../../common/GImage'
import Swiper from 'react-native-swiper'
import PhotoView from 'react-native-photo-view'

// Config
import { API_KEY_GOOGLE } from '../../../env'

const {
  width: viewportWidth,
  height: viewportHeight
} = Dimensions.get('window')

class GalleryCarousel extends React.Component {
  props: Props

  constructor(props) {
    super(props);
    this.state = {}

    this.close = this.close.bind(this);
  }

  close() {
    this.props.navigator.pop()
  }

  render() {
    const { gallery, types } = this.props
    const checkIndex = gallery.index + 1
    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../../common/img/header/back.png"),
      onPress: this.close
    }

    return (
      <View style={styles.container}>
        <GHeader
          backgroundColor={GColors.black}
          titleColor={GColors.white}
          navItem={backItem}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.day}>
              {gallery.data.result.name}
            </Text>
            <View style={styles.sumGallery}>
              <Text style={styles.color}>
                {this.state.updateIndex || checkIndex }
              </Text>
              <Text style={styles.color}> / </Text>
              <Text style={styles.color}>{gallery.data.result.photos.length}</Text>
            </View>
          </View>
        </GHeader>
        <Swiper 
          style={styles.wrapper}
          index={gallery.index}
          loadMinimal={true}
          showsPagination={false}
          loop={false}
          onIndexChanged={(index) => this.setState({updateIndex: index+1})}
        >
          {gallery.data.result.photos.map((data, index) => {
            if(!data.photo_reference) return null
              
            return (
              <PhotoView
                source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photo_reference}&key=${API_KEY_GOOGLE}`}}
                style={{ width: viewportWidth, height: viewportHeight }}
              />
            )
          })}
        </Swiper>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  wrapper: {
    flex: 1
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    android: {
      alignItems: "flex-start",
    },
    ios: {
      alignItems: "center"
    }
  },
  day: {
    color: GColors.white,
    fontFamily: GFonts.fontWithWeight("basis", "helveticaBold"),
    fontSize: 18,
  },
  sumGallery: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  color: {
    color: '#fff',
    fontSize: 14
  }
})

module.exports = GalleryCarousel
