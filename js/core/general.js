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

function convertVietnamese(str) { 
  str= str.toLowerCase();
  str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str= str.replace(/đ/g,"d"); 
  str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
  str= str.replace(/-+-/g,"-");
  str= str.replace(/^\-+|\-+$/g,""); 

  return str; 
}

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function compare(a,b) {
  if (a.check < b.check)
    return -1;
  if (a.check > b.check)
    return 1;
  return 0;
}

function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
  };
  img.src = url;
}

function convertFileToDataURLviaFileReader(url, callback) {
  var reader = new FileReader();
  reader.onloadend = function() {
    callback(reader.result);
  }
  reader.readAsDataURL(url);
}

function convertFileToDataURLviaFileReaderLocal(url, callback) {
  var xhr = new XMLHttpRequest();       
      xhr.open("GET", "url", true); 
      xhr.responseType = "blob";
      xhr.onload = function (e) {
        var reader = new FileReader();
        reader.onload = function(event) {
          callback(event.target.result);
        }
        var file = this.response;
        reader.readAsDataURL(file)
      };
      xhr.send()
}

function checkLengthInteger(num) {
  if(num/86400000 == 1) return ['1']
  if(num/86400000 == 2) return ['1', '2']
  if(num/86400000 == 3) return ['1', '2', '3']
  if(num/86400000 == 4) return ['1', '2', '3', '4']
  if(num/86400000 == 5) return ['1', '2', '3', '4', '5']
  if(num/86400000 == 6) return ['1', '2', '3', '4', '5', '6']
  if(num/86400000 == 7) return ['1', '2', '3', '4', '5', '6', '7']
}

module.exports = {
	convertVietnamese, 
	youtube_parser, 
	compare,
	convertImgToDataURLviaCanvas,
	convertFileToDataURLviaFileReader,
  convertFileToDataURLviaFileReaderLocal,
  checkLengthInteger
};
