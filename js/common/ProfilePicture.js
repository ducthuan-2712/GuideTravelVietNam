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

var Image = require('Image');
var React = require('React');
var PixelRatio = require('PixelRatio');
var Text = require('Text');
var View = require('View');

type Props = {
  userID: string;
  userName: string;
  size: number;
};

class ProfilePicture extends React.Component {
  props: Props;

  render(): ReactElement {
    const {userID, userName, size} = this.props;
    const scaledSize = size * PixelRatio.get();
    const uri = `https://graph.facebook.com/${userID}/picture?width=${scaledSize}&height=${scaledSize}`;
    if(size === 80) {
      var renderText = userName && <Text style={{color: '#333', marginTop: 15, fontWeight: 'bold'}}>{userName}</Text>
    } else {
      var renderText = userName && <Text style={{color: 'white', marginTop: 15, fontWeight: 'bold'}}>{userName}</Text>
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{uri}}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
        {renderText}
      </View>
    );
  }
}

module.exports = ProfilePicture;
