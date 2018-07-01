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
  Dimensions
} from "react-native";
import { Text } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GImage from "../../../../common/GImage";

// Config
import { API_KEY_GOOGLE } from "../../../../env";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

type Props = {

};

class Gallery extends React.Component {
  props: Props;

  openGallery(index, data) {
    let synsData = {
      index,
      data
    }
    this.props.onPress(synsData)
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.source.result.photos.map((session, index) => {
          if(!session.photo_reference) return null
            
          return (
            <TouchableOpacity 
              key={`gallery-${index}`} 
              accessibilityTraits="button"
              activeOpacity={0.8}
              onPress={_ => this.openGallery(index, this.props.source)}
            >
              <GImage 
                style={styles.img}
                sizeWidth={index == 0 ? viewportWidth/1.5 : viewportWidth/3}
                sizeHeight={viewportWidth/3}
                sizeBorderRadius={0}
                source={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${session.photo_reference}&key=${API_KEY_GOOGLE}`}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

module.exports = Gallery;
