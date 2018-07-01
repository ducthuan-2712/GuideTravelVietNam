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

import SCAMDATA from '../fakeData.js';
import type { Action, ThunkAction } from './types';

import { API_KEY_GOOGLE, API_GOOGLE, LIST_TYPES_GOOGLE } from "../env.js";

function loadDestination() {
  let results = SCAMDATA.results
  return {
    type: 'LOADED_DESTINATION',
    results
  };
}

function loadAPIFromGooglePlace(session, types, dispatchType): ThunkAction {
	return (dispatch, getState) => {
		if(Object.keys(session).length) {
			dispatch(loadAPI(session, types, dispatchType))
		}
	}
}

async function queryAPI(url): Promise {
  return new Promise((resolve, reject) => {
		return fetch(url)
						.then((response) => response.json())
						.then(responseJson => {
							resolve(responseJson)
						}, error => {
							reject(new Error(error.message))
						})
  });
}

function loadAPI(topic, types, dispatchType): Promise<Action> {
	return async (dispatch, getState) => {
		try {
			if(types === 'details') {
				// Fetch API search Username
				const resultsDetail = await queryAPI(`${API_GOOGLE}/${types}/json?placeid=${topic.place_id}&key=${API_KEY_GOOGLE}`);

				// TODO: Make sure reducers clear their state
				return dispatch({
					type: dispatchType,
					resultsDetail
				})
			}
			if(types === 'nearbysearch') {
				const radius = 25000
				const resultsNearby = []

				// Fetch API search Username
				for(let i = 0; i < LIST_TYPES_GOOGLE.length; i++) {
					const keyword = LIST_TYPES_GOOGLE[i]
					const result = await queryAPI(`${API_GOOGLE}/${types}/json?location=${topic.geometry.location.lat},${topic.geometry.location.lng}&radius=${radius}&type=${keyword}&keyword=${keyword}&key=${API_KEY_GOOGLE}`)

					result.results.map(session => {
						resultsNearby = [
							...resultsNearby,
							session
						]
					})
					if(result.next_page_token) {
						const resultOther = await queryAPI(`${API_GOOGLE}/${types}/json?pagetoken=${result.next_page_token}&key=${API_KEY_GOOGLE}`)

						resultOther.results.map(session => {
							resultsNearby = [
								...resultsNearby,
								session
							]
						})
					}
				}

				// TODO: Make sure reducers clear their state
				return dispatch({
					type: dispatchType,
					resultsNearby
				})
			}
		} catch (error) {
		  return console.log(error)
		}
	}
}

function resetDestination(): Action {
  return {
    type: "RESET_DESTINATION"
  };
}

module.exports = {
	loadDestination,
	loadAPIFromGooglePlace,
	resetDestination
};
