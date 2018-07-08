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
  Linking,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { Text, Heading4 } from "../../../../common/GText";
import StyleSheet from "../../../../common/GStyleSheet";
import GImage from "../../../../common/GImage";
import GRating from "../../../../common/GRating";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

type Props = {

};

class Review extends React.Component {
  props: Props;

  openReview(data) {
    Linking.canOpenURL(data.author_url).then(supported => {
      if (supported) {
        Linking.openURL(data.author_url);
      } else {
        Alert.alert(
          'Không thể truy cập ' + url,
          'Vui lòng di chuyển đến vùng sóng tốt hơn và thử lại !',
          [
            {text: 'Đồng ý', onPress: () => console.log('Cancel Pressed!')},
          ]
        )
      }
    });
  }

  render() {
    const { source } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Top Reviews</Text>
        {source.result.reviews && source.result.reviews.map((data, index) => {
          return (
            <View style={styles.box} key={`review-${index}`} >
              <TouchableOpacity 
                accessibilityTraits="button"
                activeOpacity={0.8}
                onPress={_ => this.openReview(data)}
                style={styles.top}
              >
                <GImage 
                  style={styles.img}
                  sizeWidth={40}
                  sizeHeight={40}
                  sizeBorderRadius={50}
                  source={data.profile_photo_url} 
                />
                <View style={styles.topName}>
                  <Text style={styles.h4}>{data.author_name}</Text>
                  <View style={styles.merged}>
                    <GRating star={data.rating} />
                    <Text style={styles.topName}>{data.relative_time_description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.info}>
                <Text>{data.text}</Text>
              </View>
            </View>
          )
        })}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    color: '#1a1917',
    marginTop: 15,
    paddingHorizontal: 20,
  },  
  box: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 20
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  topName: {
    paddingLeft: 10
  },
  h4: {
    fontWeight: 'bold',
    color: '#fe9375',
    fontSize: 14,
    margin: 0,
    padding: 0
  },
  info: {
    marginTop: 15,
    paddingLeft: 50
  },
  merged: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

module.exports = Review;
