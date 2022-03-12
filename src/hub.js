import "./utils/debug-log";
import "./webxr-bypass-hacks";
import configs from "./utils/configs";
import "./utils/theme";
import "@babel/polyfill";

console.log(`App version: ${process.env.BUILD_VERSION || "?"}`);

import "./react-components/styles/global.scss";
import "./assets/stylesheets/globals.scss";
import "./assets/stylesheets/hub.scss";
import initialBatchImage from "./assets/images/warning_icon.png";
import loadingEnvironment from "./assets/models/LoadingEnvironment.glb";

import "aframe";
import "./utils/logging";
import { patchWebGLRenderingContext } from "./utils/webgl";
patchWebGLRenderingContext();

import "three/examples/js/loaders/GLTFLoader";
import "networked-aframe/src/index";
import "aframe-rounded";
import "webrtc-adapter";
import "aframe-slice9-component";
import "./utils/threejs-positional-audio-updatematrixworld";
import "./utils/threejs-world-update";
import patchThreeAllocations from "./utils/threejs-allocation-patches";
import { isSafari } from "./utils/detect-safari";
import {
  getReticulumFetchUrl,
  getReticulumMeta,
  invalidateReticulumMeta,
  migrateChannelToSocket
} from "./utils/phoenix-utils";

import nextTick from "./utils/next-tick";
import { addAnimationComponents } from "./utils/animation";
import { authorizeOrSanitizeMessage } from "./utils/permissions-utils";
import Cookies from "js-cookie";
import "./naf-dialog-adapter";

import "./components/scene-components";
import "./components/scale-in-screen-space";
import "./components/mute-mic";
import "./components/bone-mute-state-indicator";
import "./components/bone-visibility";
import "./components/fader";
import "./components/in-world-hud";
import "./components/emoji";
import "./components/emoji-hud";
import "./components/virtual-gamepad-controls";
import "./components/ik-controller";
import "./components/hand-controls2";
import "./components/hoverable-visuals";
import "./components/hover-visuals";
import "./components/offset-relative-to";
import "./components/player-info";
import "./components/debug";
import "./components/hand-poses";
import "./components/hud-controller";
import "./components/freeze-controller";
import "./components/icon-button";
import "./components/text-button";
import "./components/block-button";
import "./components/mute-button";
import "./components/kick-button";
import "./components/close-vr-notice-button";
import "./components/leave-room-button";
import "./components/visible-if-permitted";
import "./components/visibility-on-content-types";
import "./components/hide-when-pinned-and-forbidden";
import "./components/visibility-while-frozen";
import "./components/stats-plus";
import "./components/networked-avatar";
import "./components/media-views";
import "./components/avatar-volume-controls";
import "./components/pinch-to-move";
import "./components/pitch-yaw-rotator";
import "./components/position-at-border";
import "./components/pinnable";
import "./components/pin-networked-object-button";
import "./components/mirror-media-button";
import "./components/close-mirrored-media-button";
import "./components/drop-object-button";
import "./components/remove-networked-object-button";
import "./components/camera-focus-button";
import "./components/unmute-video-button";
import "./components/destroy-at-extreme-distances";
import "./components/visible-to-owner";
import "./components/camera-tool";
import "./components/emit-state-change";
import "./components/action-to-event";
import "./components/action-to-remove";
import "./components/emit-scene-event-on-remove";
import "./components/follow-in-fov";
import "./components/matrix-auto-update";
import "./components/clone-media-button";
import "./components/open-media-button";
import "./components/refresh-media-button";
import "./components/tweet-media-button";
import "./components/remix-avatar-button";
import "./components/transform-object-button";
import "./components/scale-button";
import "./components/hover-menu";
import "./components/disable-frustum-culling";
import "./components/teleporter";
import "./components/set-active-camera";
import "./components/track-pose";
import "./components/replay";
import "./components/visibility-by-path";
import "./components/tags";
import "./components/hubs-text";
import "./components/periodic-full-syncs";
import "./components/inspect-button";
import "./components/inspect-pivot-child-selector";
import "./components/inspect-pivot-offset-from-camera";
import "./components/optional-alternative-to-not-hide";
import "./components/avatar-audio-source";
import "./components/avatar-inspect-collider";
import "./components/video-texture-target";

import ReactDOM from "react-dom";
import React from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory, createMemoryHistory } from "history";
import { pushHistoryState } from "./utils/history";
import UIRoot from "./react-components/ui-root";
import { ExitedRoomScreenContainer } from "./react-components/room/ExitedRoomScreenContainer";
import AuthChannel from "./utils/auth-channel";
import HubChannel from "./utils/hub-channel";
import LinkChannel from "./utils/link-channel";
import { connectToReticulum } from "./utils/phoenix-utils";
import { disableiOSZoom } from "./utils/disable-ios-zoom";
import { proxiedUrlFor } from "./utils/media-url-utils";
import { traverseMeshesAndAddShapes } from "./utils/physics-utils";
import { handleExitTo2DInterstitial, exit2DInterstitialAndEnterVR } from "./utils/vr-interstitial";
import { getAvatarSrc } from "./utils/avatar-utils.js";
import MessageDispatch from "./message-dispatch";
import SceneEntryManager from "./scene-entry-manager";
import Subscriptions from "./subscriptions";
import { createInWorldLogMessage } from "./react-components/chat-message";

import "./systems/nav";
import "./systems/frame-scheduler";
import "./systems/personal-space-bubble";
import "./systems/app-mode";
import "./systems/permissions";
import "./systems/exit-on-blur";
import "./systems/auto-pixel-ratio";
import "./systems/idle-detector";
import "./systems/camera-tools";
import "./systems/pen-tools";
import "./systems/userinput/userinput";
import "./systems/userinput/userinput-debug";
import "./systems/ui-hotkeys";
import "./systems/tips";
import "./systems/interactions";
import "./systems/hubs-systems";
import "./systems/capture-system";
import "./systems/listed-media";
import "./systems/linked-media";
import { SOUND_CHAT_MESSAGE } from "./systems/sound-effects-system";

import "./gltf-component-mappings";

import { App } from "./App";
import MediaDevicesManager from "./utils/media-devices-manager";
import { sleep } from "./utils/async-utils";
import { platformUnsupported } from "./support";

import { text_chat_data } from "./react-components/room/ChatSidebarContainer";

window.timeCount = 420;
let min = 0;
let sec = 0;
let interval;
let isStart = false;

function count_start() {
  if(isStart === false) {
    interval = setInterval(count_down, 1000);
    isStart = true;
  }
}

function count_down(){
  if(timeCount === 1){
    var display = document.getElementById("time");
    display.style.color = 'red';
    display.innerHTML = "TIME UP!";
    clearInterval(interval);
  } else {
    timeCount--;
    min = Math.floor(timeCount / 60);
    sec = timeCount % 60;
    var count_down = document.getElementById("time");
    count_down.innerHTML = ("0"+min) +":" + ("0"+sec).slice(-2);
  }
}

function count_reset(){
  clearInterval(interval);
  timeCount = 420;
  isStart = false;
  var count_down = document.getElementById("time");
  count_down.style.color = 'black';
  count_down.innerHTML = "07:00";
}    

var current_url = (location.protocol + '//' + location.hostname + location.pathname).split("/");

var room_name = current_url[current_url.length - 1];
console.log(room_name)
document.addEventListener('keyup', event => {
  if (event.code === 'KeyO') {
    text_chat_data.count();
    console.log(text_chat_data)
  }
});

let team;

window.APP = new App();
window.APP.RENDER_ORDER = {
  HUD_BACKGROUND: 1,
  HUD_ICONS: 2,
  CURSOR: 3
};
const store = window.APP.store;
store.update({ preferences: { shouldPromptForRefresh: undefined } }); // Clear flag that prompts for refresh from preference screen
const mediaSearchStore = window.APP.mediaSearchStore;
const OAUTH_FLOW_PERMS_TOKEN_KEY = "ret-oauth-flow-perms-token";
const NOISY_OCCUPANT_COUNT = 30; // Above this # of occupants, we stop posting join/leaves/renames

const qs = new URLSearchParams(location.search);
const isMobile = AFRAME.utils.device.isMobile();
const isMobileVR = AFRAME.utils.device.isMobileVR();
const isEmbed = window.self !== window.top;
if (isEmbed && !qs.get("embed_token")) {
  // Should be covered by X-Frame-Options, but just in case.
  throw new Error("no embed token");
}

THREE.Object3D.DefaultMatrixAutoUpdate = false;

import "./components/owned-object-limiter";
import "./components/owned-object-cleanup-timeout";
import "./components/set-unowned-body-kinematic";
import "./components/scalable-when-grabbed";
import "./components/networked-counter";
import "./components/event-repeater";
import "./components/set-yxz-order";

import "./components/cursor-controller";

import "./components/nav-mesh-helper";

import "./components/tools/pen";
import "./components/tools/pen-laser";
import "./components/tools/networked-drawing";
import "./components/tools/drawing-manager";

import "./components/body-helper";
import "./components/shape-helper";

import registerNetworkSchemas from "./network-schemas";
import registerTelemetry from "./telemetry";

import { getAvailableVREntryTypes, VR_DEVICE_AVAILABILITY, ONLY_SCREEN_AVAILABLE } from "./utils/vr-caps-detect";
import detectConcurrentLoad from "./utils/concurrent-load-detector";

import qsTruthy from "./utils/qs_truthy";
import { WrappedIntlProvider } from "./react-components/wrapped-intl-provider";
import { ExitReason } from "./react-components/room/ExitedRoomScreen";
import { OAuthScreenContainer } from "./react-components/auth/OAuthScreenContainer";
import { SignInMessages } from "./react-components/auth/SignInModal";
import { ThemeProvider } from "./react-components/styles/theme";
import { addLeadingSlash } from "history/PathUtils";
import CognitoUser from "amazon-cognito-identity-js/src/CognitoUser";
import CognitoUserPool from "amazon-cognito-identity-js/src/CognitoUserPool";
import AuthenticationHelper from "amazon-cognito-identity-js/src/AuthenticationHelper";
import DateHelper from "amazon-cognito-identity-js/src/DateHelper";
import BigInteger from "amazon-cognito-identity-js/src/BigInteger";
import CryptoJS from "crypto-js/core";
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import CognitoAccessToken from 'amazon-cognito-identity-js/src/CognitoAccessToken';
import CognitoIdToken from 'amazon-cognito-identity-js/src/CognitoIdToken';
import CognitoRefreshToken from 'amazon-cognito-identity-js/src/CognitoRefreshToken';
import CognitoUserSession from 'amazon-cognito-identity-js/src/CognitoUserSession';
import Client from "amazon-cognito-identity-js/src/Client";

import CognitoUserAttribute from 'amazon-cognito-identity-js/src/CognitoUserAttribute';
import StorageHelper from 'amazon-cognito-identity-js/src/StorageHelper';
import { func, string } from "prop-types";
import { room } from "networked-aframe/src/NafIndex";


const PHOENIX_RELIABLE_NAF = "phx-reliable";
NAF.options.firstSyncSource = PHOENIX_RELIABLE_NAF;
NAF.options.syncSource = PHOENIX_RELIABLE_NAF;

let isOAuthModal = false;

/*AWS.config.region = 'ap-northeast-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-northeast-1:1a5b9f55-2ccb-494f-964f-6fda4d7f9eda',
});*/

AWS.config.region = 'ap-northeast-1'; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:ed1df237-f6f6-441a-8a2c-7f958ab642ae',
});

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var currentUserData = {}; 

var docClient = new AWS.DynamoDB.DocumentClient();

/*const poolData = {
  UserPoolId: "ap-northeast-1_OBc87MXYg",
  ClientId: "2a0a73brf9cnv2u7pbn3aa3e5r"
};*/

const poolData = {
  UserPoolId: "ap-northeast-1_RWH9txS1J",
  ClientId: "4h2qfcv13p4c6246q37bb4v9dk"
};

const isBrowser = typeof navigator !== 'undefined';
const userAgent = isBrowser ? navigator.userAgent : 'nodejs';
class myCognitouserclass extends CognitoUser {
  /**
	 * Constructs a new CognitoUser object
	 * @param {object} data Creation options
	 * @param {string} data.Username The user's username.
	 * @param {CognitoUserPool} data.Pool Pool containing the user.
	 * @param {object} data.Storage Optional storage object.
	 */
  constructor(data) {
    super(data);

		if (data == null || data.Username == null || data.Pool == null) {
			throw new Error('Username and Pool information are required.');
		}

		this.username = data.Username || '';
		this.pool = data.Pool;
		this.Session = null;
		this.client = data.Pool.client;

		this.signInUserSession = null;
		this.authenticationFlowType = 'USER_SRP_AUTH';

		this.storage = window.sessionStorage;

		this.keyPrefix = `CognitoIdentityServiceProvider.${this.pool.getClientId()}`;
		this.userDataKey = `${this.keyPrefix}.${this.username}.userData`;
	}

  /**
	 * @typedef {Object} GetSessionOptions
	 * @property {Record<string, string>} clientMetadata - clientMetadata for getSession
	 */

	/**
	 * This is used to get a session, either from the session object
	 * or from  the local storage, or by using a refresh token
	 *
	 * @param {nodeCallback<CognitoUserSession>} callback Called on success or error.
	 * @param {GetSessionOptions} options
	 * @returns {void}
	 */
	getSession(callback, options = {}) {
		if (this.username == null) {
			return callback(
				new Error('Username is null. Cannot retrieve a new session'),
				null
			);
		}

		if (this.signInUserSession != null && this.signInUserSession.isValid()) {
			return callback(null, this.signInUserSession);
		}

		const keyPrefix = `CognitoIdentityServiceProvider.${this.pool.getClientId()}.${
			this.username
		}`;
		const idTokenKey = `${keyPrefix}.idToken`;
		const accessTokenKey = `${keyPrefix}.accessToken`;
		const refreshTokenKey = `${keyPrefix}.refreshToken`;
		const clockDriftKey = `${keyPrefix}.clockDrift`;

		if (this.storage.getItem(idTokenKey)) {
			const idToken = new CognitoIdToken({
				IdToken: this.storage.getItem(idTokenKey),
			});
			const accessToken = new CognitoAccessToken({
				AccessToken: this.storage.getItem(accessTokenKey),
			});
			const refreshToken = new CognitoRefreshToken({
				RefreshToken: this.storage.getItem(refreshTokenKey),
			});
			const clockDrift = parseInt(this.storage.getItem(clockDriftKey), 0) || 0;

			const sessionData = {
				IdToken: idToken,
				AccessToken: accessToken,
				RefreshToken: refreshToken,
				ClockDrift: clockDrift,
			};
			const cachedSession = new CognitoUserSession(sessionData);

			if (cachedSession.isValid()) {
				this.signInUserSession = cachedSession;
				return callback(null, this.signInUserSession);
			}

			if (!refreshToken.getToken()) {
				return callback(
					new Error('Cannot retrieve a new session. Please authenticate.'),
					null
				);
			}

			this.refreshSession(refreshToken, callback, options.clientMetadata);
		} else {
			callback(
				new Error('Local storage is missing an ID Token, Please authenticate'),
				null
			);
		}

		return undefined;
	}
}

/**
 * method for getting the current user of the application from the local storage
 *
 * @returns {CognitoUser} the user retrieved from storage
 */
class myCognitouserpoolclass extends CognitoUserPool {
	constructor(data, wrapRefreshSessionCallback) {
    const USER_POOL_ID_MAX_LENGTH = 55;

    super(data, wrapRefreshSessionCallback);

		const {
			UserPoolId,
			ClientId,
			endpoint,
			fetchOptions,
			AdvancedSecurityDataCollectionFlag,
		} = data || {};
		if (!UserPoolId || !ClientId) {
			throw new Error('Both UserPoolId and ClientId are required.');
		}
		if (UserPoolId.length > USER_POOL_ID_MAX_LENGTH || !/^[\w-]+_[0-9a-zA-Z]+$/.test(UserPoolId)) {
			throw new Error('Invalid UserPoolId format.');
		}
		const region = UserPoolId.split('_')[0];

		this.userPoolId = UserPoolId;
		this.clientId = ClientId;

		this.client = new Client(region, endpoint, fetchOptions);

		/**
		 * By default, AdvancedSecurityDataCollectionFlag is set to true,
		 * if no input value is provided.
		 */
		this.advancedSecurityDataCollectionFlag =
			AdvancedSecurityDataCollectionFlag !== false;

		this.storage = window.sessionStorage;

		if (wrapRefreshSessionCallback) {
			this.wrapRefreshSessionCallback = wrapRefreshSessionCallback;
		}
	}

  /**
	 * @typedef {object} SignUpResult
	 * @property {CognitoUser} user New user.
	 * @property {bool} userConfirmed If the user is already confirmed.
	 */
	/**
	 * method for signing up a user
	 * @param {string} username User's username.
	 * @param {string} password Plain-text initial password entered by user.
	 * @param {(AttributeArg[])=} userAttributes New user attributes.
	 * @param {(AttributeArg[])=} validationData Application metadata.
	 * @param {(AttributeArg[])=} clientMetadata Client metadata.
	 * @param {nodeCallback<SignUpResult>} callback Called on error or with the new user.
	 * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
	 * @returns {void}
	 */
	signUp(
		username,
		password,
		userAttributes,
		validationData,
		callback,
		clientMetadata
	) {
		const jsonReq = {
			ClientId: this.clientId,
			Username: username,
			Password: password,
			UserAttributes: userAttributes,
			ValidationData: validationData,
			ClientMetadata: clientMetadata,
		};
		if (this.getUserContextData(username)) {
			jsonReq.UserContextData = this.getUserContextData(username);
		}
		this.client.request('SignUp', jsonReq, (err, data) => {
			if (err) {
				return callback(err, null);
			}

			const cognitoUser = {
				Username: username,
				Pool: this,
				Storage: this.storage,
			};

			const returnData = {
				user: new myCognitouserclass(cognitoUser),
				userConfirmed: data.UserConfirmed,
				userSub: data.UserSub,
				codeDeliveryDetails: data.CodeDeliveryDetails,
			};

			return callback(null, returnData);
		});
	}

  /**
	 * method for getting the current user of the application from the local storage
	 *
	 * @returns {myCognitouserclass} the user retrieved from storage
	 */
	getCurrentUser() {
		const lastUserKey = `CognitoIdentityServiceProvider.${this.clientId}.LastAuthUser`;

		const lastAuthUser = this.storage.getItem(lastUserKey);
		if (lastAuthUser) {
			const cognitoUser = {
				Username: lastAuthUser,
				Pool: this,
				Storage: this.storage,
			};

			return new myCognitouserclass(cognitoUser);
		}

		return null;
	}
}

const userPool = new myCognitouserpoolclass(poolData);

// OAuth popup handler
// TODO: Replace with a new oauth callback route that has this postMessage script.
if (window.opener && window.opener.doingTwitterOAuth) {
  window.opener.postMessage("oauth-successful");
  isOAuthModal = true;
}

const isBotMode = qsTruthy("bot");
const isTelemetryDisabled = qsTruthy("disable_telemetry");
const isDebug = qsTruthy("debug");

if (!isBotMode && !isTelemetryDisabled) {
  registerTelemetry("/hub", "Room Landing Page");
}

disableiOSZoom();

if (!isOAuthModal) {
  detectConcurrentLoad();
}

function setupLobbyCamera() {
  const camera = document.getElementById("scene-preview-node");
  const previewCamera = document.getElementById("environment-scene").object3D.getObjectByName("scene-preview-camera");

  if (previewCamera) {
    camera.object3D.position.copy(previewCamera.position);
    camera.object3D.rotation.copy(previewCamera.rotation);
    camera.object3D.rotation.reorder("YXZ");
  } else {
    const cameraPos = camera.object3D.position;
    camera.object3D.position.set(cameraPos.x, 2.5, cameraPos.z);
  }

  camera.object3D.matrixNeedsUpdate = true;

  camera.removeAttribute("scene-preview-camera");
  camera.setAttribute("scene-preview-camera", "positionOnly: true; duration: 60");
}

let uiProps = {};
let connectionErrorTimeout = null;

// Hub ID and slug are the basename
let routerBaseName = document.location.pathname
  .split("/")
  .slice(0, 2)
  .join("/");

if (document.location.pathname.includes("hub.html")) {
  routerBaseName = "/";
}

// when loading the client as a "default room" on the homepage, use MemoryHistory since exposing all the client paths at the root is undesirable
const history = routerBaseName === "/" ? createMemoryHistory() : createBrowserHistory({ basename: routerBaseName });
window.APP.history = history;

const qsVREntryType = qs.get("vr_entry_type");

function mountUI(props = {}) {
  const scene = document.querySelector("a-scene");
  const disableAutoExitOnIdle =
    qsTruthy("allow_idle") || (process.env.NODE_ENV === "development" && !qs.get("idle_timeout"));
  const forcedVREntryType = qsVREntryType;

  ReactDOM.render(
    <WrappedIntlProvider>
      <ThemeProvider store={store}>
        <Router history={history}>
          <Route
            render={routeProps =>
              props.showOAuthScreen ? (
                <OAuthScreenContainer oauthInfo={props.oauthInfo} />
              ) : props.roomUnavailableReason ? (
                <ExitedRoomScreenContainer reason={props.roomUnavailableReason} />
              ) : (
                <UIRoot
                  {...{
                    scene,
                    isBotMode,
                    disableAutoExitOnIdle,
                    forcedVREntryType,
                    store,
                    mediaSearchStore,
                    ...props,
                    ...routeProps
                  }}
                />
              )
            }
          />
        </Router>
      </ThemeProvider>
    </WrappedIntlProvider>,
    document.getElementById("ui-root")
  );
}

function remountUI(props) {
  uiProps = { ...uiProps, ...props };
  mountUI(uiProps);
}

function setupPeerConnectionConfig(adapter) {
  const forceTurn = qs.get("force_turn");
  const forceTcp = qs.get("force_tcp");
  adapter.setTurnConfig(forceTcp, forceTurn);
}

async function updateEnvironmentForHub(hub, entryManager) {
  let sceneUrl;
  let isLegacyBundle; // Deprecated

  const sceneErrorHandler = () => {
    remountUI({ roomUnavailableReason: ExitReason.sceneError });
    entryManager.exitScene();
  };

  const environmentScene = document.querySelector("#environment-scene");
  const sceneEl = document.querySelector("a-scene");

  if (hub.scene) {
    isLegacyBundle = false;
    sceneUrl = hub.scene.model_url;
  } else if (hub.scene === null) {
    // delisted/removed scene
    sceneUrl = loadingEnvironment;
  } else {
    const defaultSpaceTopic = hub.topics[0];
    const glbAsset = defaultSpaceTopic.assets.find(a => a.asset_type === "glb");
    const bundleAsset = defaultSpaceTopic.assets.find(a => a.asset_type === "gltf_bundle");
    sceneUrl = (glbAsset || bundleAsset).src || loadingEnvironment;
    const hasExtension = /\.gltf/i.test(sceneUrl) || /\.glb/i.test(sceneUrl);
    isLegacyBundle = !(glbAsset || hasExtension);
  }

  if (isLegacyBundle) {
    // Deprecated
    const res = await fetch(sceneUrl);
    const data = await res.json();
    const baseURL = new URL(THREE.LoaderUtils.extractUrlBase(sceneUrl), window.location.href);
    sceneUrl = new URL(data.assets[0].src, baseURL).href;
  } else {
    sceneUrl = proxiedUrlFor(sceneUrl);
  }

  console.log(`Scene URL: ${sceneUrl}`);

  let environmentEl = null;

  if (environmentScene.childNodes.length === 0) {
    const environmentEl = document.createElement("a-entity");

    environmentEl.addEventListener(
      "model-loaded",
      () => {
        environmentEl.removeEventListener("model-error", sceneErrorHandler);

        // Show the canvas once the model has loaded
        document.querySelector(".a-canvas").classList.remove("a-hidden");

        sceneEl.addState("visible");

        //TODO: check if the environment was made with spoke to determine if a shape should be added
        traverseMeshesAndAddShapes(environmentEl);
      },
      { once: true }
    );

    environmentEl.addEventListener("model-error", sceneErrorHandler, { once: true });

    environmentEl.setAttribute("gltf-model-plus", { src: sceneUrl, useCache: false, inflate: true });
    environmentScene.appendChild(environmentEl);
  } else {
    // Change environment
    environmentEl = environmentScene.childNodes[0];

    // Clear the three.js image cache and load the loading environment before switching to the new one.
    THREE.Cache.clear();
    const waypointSystem = sceneEl.systems["hubs-systems"].waypointSystem;
    waypointSystem.releaseAnyOccupiedWaypoints();

    environmentEl.addEventListener(
      "model-loaded",
      () => {
        environmentEl.addEventListener(
          "model-loaded",
          () => {
            environmentEl.removeEventListener("model-error", sceneErrorHandler);
            traverseMeshesAndAddShapes(environmentEl);

            // We've already entered, so move to new spawn point once new environment is loaded
            if (sceneEl.is("entered")) {
              waypointSystem.moveToSpawnPoint();
            }

            const fader = document.getElementById("viewing-camera").components["fader"];

            // Add a slight delay before de-in to reduce hitching.
            setTimeout(() => fader.fadeIn(), 2000);
          },
          { once: true }
        );

        sceneEl.emit("leaving_loading_environment");
        if (environmentEl.components["gltf-model-plus"].data.src === sceneUrl) {
          console.warn("Updating environment to the same url.");
          environmentEl.setAttribute("gltf-model-plus", { src: "" });
        }
        environmentEl.setAttribute("gltf-model-plus", { src: sceneUrl });
      },
      { once: true }
    );

    if (!sceneEl.is("entered")) {
      environmentEl.addEventListener("model-error", sceneErrorHandler, { once: true });
    }

    if (environmentEl.components["gltf-model-plus"].data.src === loadingEnvironment) {
      console.warn("Transitioning to loading environment but was already in loading environment.");
      environmentEl.setAttribute("gltf-model-plus", { src: "" });
    }
    environmentEl.setAttribute("gltf-model-plus", { src: loadingEnvironment });
  }
}

async function updateUIForHub(hub, hubChannel) {
  remountUI({ hub, entryDisallowed: !hubChannel.canEnterRoom(hub) });
}

function onConnectionError(entryManager, connectError) {
  console.error("An error occurred while attempting to connect to networked scene:", connectError);
  // hacky until we get return codes
  const isFull = connectError.msg && connectError.msg.match(/\bfull\b/i);
  remountUI({ roomUnavailableReason: isFull ? ExitReason.full : ExitReason.connectError });
  entryManager.exitScene();
}

function handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data) {
  const scene = document.querySelector("a-scene");
  const isRejoin = NAF.connection.isConnected();

  if (isRejoin) {
    // Slight hack, to ensure correct presence state we need to re-send the entry event
    // on re-join. Ideally this would be updated into the channel socket state but this
    // would require significant changes to the hub channel events and socket management.
    if (scene.is("entered")) {
      hubChannel.sendEnteredEvent();
    }

    // Send complete sync on phoenix re-join.
    NAF.connection.entities.completeSync(null, true);
    return;
  }

  // Turn off NAF for embeds as an optimization, so the user's browser isn't getting slammed
  // with NAF traffic on load.
  if (isEmbed) {
    hubChannel.allowNAFTraffic(false);
  }

  const hub = data.hubs[0];
  let embedToken = hub.embed_token;

  if (!embedToken) {
    const embedTokenEntry = store.state.embedTokens && store.state.embedTokens.find(t => t.hubId === hub.hub_id);

    if (embedTokenEntry) {
      embedToken = embedTokenEntry.embedToken;
    }
  }

  console.log(`Dialog host: ${hub.host}:${hub.port}`);

  remountUI({
    messageDispatch: messageDispatch,
    onSendMessage: messageDispatch.dispatch,
    onLoaded: () => store.executeOnLoadActions(scene),
    onMediaSearchResultEntrySelected: (entry, selectAction) =>
      scene.emit("action_selected_media_result_entry", { entry, selectAction }),
    onMediaSearchCancelled: entry => scene.emit("action_media_search_cancelled", entry),
    onAvatarSaved: entry => scene.emit("action_avatar_saved", entry),
    embedToken: embedToken
  });

  scene.addEventListener("action_selected_media_result_entry", e => {
    const { entry, selectAction } = e.detail;
    if ((entry.type !== "scene_listing" && entry.type !== "scene") || selectAction !== "use") return;
    if (!hubChannel.can("update_hub")) return;

    hubChannel.updateScene(entry.url);
  });

  // Handle request for user gesture
  scene.addEventListener("2d-interstitial-gesture-required", () => {
    remountUI({
      showInterstitialPrompt: true,
      onInterstitialPromptClicked: () => {
        remountUI({ showInterstitialPrompt: false, onInterstitialPromptClicked: null });
        scene.emit("2d-interstitial-gesture-complete");
      }
    });
  });

  const objectsScene = document.querySelector("#objects-scene");
  const objectsUrl = getReticulumFetchUrl(`/${hub.hub_id}/objects.gltf`);
  const objectsEl = document.createElement("a-entity");

  scene.addEventListener("adapter-ready", () => {
    // Append objects once adapter is ready since ownership may be taken.
    objectsEl.setAttribute("gltf-model-plus", { src: objectsUrl, useCache: false, inflate: true });

    if (!isBotMode) {
      objectsScene.appendChild(objectsEl);
    }
  });

  // TODO Remove this once transition completed.
  // Wait for scene objects to load before connecting, so there is no race condition on network state.
  const connectToScene = async () => {
    const adapter = "dialog";

    scene.setAttribute("networked-scene", {
      room: hub.hub_id,
      serverURL: `wss://${hub.host}:${hub.port}`,
      debug: !!isDebug,
      adapter
    });

    while (!scene.components["networked-scene"] || !scene.components["networked-scene"].data) await nextTick();

    scene.addEventListener("adapter-ready", ({ detail: adapter }) => {
      const sendViaPhoenix = reliable => (clientId, dataType, data) => {
        const payload = { dataType, data };

        if (clientId) {
          payload.clientId = clientId;
        }

        const isOpen = hubChannel.channel.socket.connectionState() === "open";

        if (isOpen || reliable) {
          const hasFirstSync =
            payload.dataType === "um" ? payload.data.d.find(r => r.isFirstSync) : payload.data.isFirstSync;

          if (hasFirstSync) {
            if (isOpen) {
              hubChannel.channel.push("naf", payload);
            } else {
              // Memory is re-used, so make a copy
              hubChannel.channel.push("naf", AFRAME.utils.clone(payload));
            }
          } else {
            // Optimization: Strip isFirstSync and send payload as a string to reduce server parsing.
            // The server will not parse messages without isFirstSync keys when sent to the nafr event.
            //
            // The client must assume any payload that does not have a isFirstSync key is not a first sync.
            const nafrPayload = AFRAME.utils.clone(payload);
            if (nafrPayload.dataType === "um") {
              for (let i = 0; i < nafrPayload.data.d.length; i++) {
                delete nafrPayload.data.d[i].isFirstSync;
              }
            } else {
              delete nafrPayload.data.isFirstSync;
            }

            hubChannel.channel.push("nafr", { naf: JSON.stringify(nafrPayload) });
          }
        }
      };

      adapter.reliableTransport = sendViaPhoenix(true);
      adapter.unreliableTransport = sendViaPhoenix(false);
    });

    const connect = () => {
      // Safety guard just in case Protoo doens't fail in some case so we don't get stuck in the loading screen forever.
      connectionErrorTimeout = setTimeout(onConnectionError, 30000, entryManager, "Timeout connecting to the room");
      scene.components["networked-scene"]
        .connect()
        .then(() => {
          clearTimeout(connectionErrorTimeout);
          connectionErrorTimeout = null;
          console.log("Successfully connected to the networked scene.");
          scene.emit("didConnectToNetworkedScene");
        })
        .catch(connectError => {
          clearTimeout(connectionErrorTimeout);
          connectionErrorTimeout = null;
          adapter.disconnect();
          onConnectionError(entryManager, connectError);
        });
    };

    const loadEnvironmentAndConnect = () => {
      updateEnvironmentForHub(hub, entryManager);
      connect();
    };

    window.APP.hub = hub;
    updateUIForHub(hub, hubChannel);
    scene.emit("hub_updated", { hub });

    if (!isEmbed) {
      loadEnvironmentAndConnect();
    } else {
      remountUI({
        onPreloadLoadClicked: () => {
          hubChannel.allowNAFTraffic(true);
          remountUI({ showPreload: false });
          loadEnvironmentAndConnect();
        }
      });
    }
  };

  connectToScene();
}

async function runBotMode(scene, entryManager) {
  const noop = () => {};
  const alwaysFalse = () => false;
  scene.renderer = {
    setAnimationLoop: noop,
    render: noop,
    shadowMap: {},
    vr: { isPresenting: alwaysFalse },
    setSize: noop
  };

  while (!NAF.connection.isConnected()) await nextTick();
  entryManager.enterSceneWhenLoaded(false);
}

function checkForAccountRequired() {
  // If the app requires an account to join a room, redirect to the sign in page.
  if (!configs.feature("require_account_for_join")) return;
  if (store.state.credentials && store.state.credentials.token) return;
  document.location = `/?sign_in&sign_in_destination=hub&sign_in_destination_url=${encodeURIComponent(
    document.location.toString()
  )}`;
}

function get_current_Date() {
  var date = new Date();
  var str = date.getFullYear()
  + '年' + ('0' + (date.getMonth() + 1)).slice(-2)
  + '月' + ('0' + date.getDate()).slice(-2)
  + '日' ;
  return str;
}

export function Get_Coupon(number){
  const current_Date = get_current_Date();

  let shop_name;
  let shop_content;

  if(number == 1){
    shop_name = "アンドリューのエッグタルト 大阪難波駅店";
    shop_content = "5個お買い上げ毎にエッグタルトを1個サービス";
  } else if(number == 2) {
    shop_name = "お好み焼き 千房 道頓堀支店";
    shop_content = "ご飲食代金10%OFF（割引額上限2,000円まで）";
  } else if(number == 3) {
    shop_name = "串カツだるま 道頓堀店";
    shop_content = "串カツ（120円/本・税別）1本サービス";
  } else if(number == 4) {
    shop_name = "くれおーる 道頓堀店";
    shop_content = "たこ焼お買い上げのお客様に2個増量";
  } else if(number == 5) {
    shop_name = "道頓堀コナモンミュージアム";
    shop_content = "たこ焼10個お買い上げのお客様に2個増量";
  } else if(number == 6) {
    shop_name = "たこ八 道頓堀総本店";
    shop_content = "たこ焼き1個おまけ!+オンラインショップで使える10%OFFクーポンコード";
  } else if(number == 7) {
    shop_name = "なにわ名物 いちびり庵 道頓堀店";
    shop_content = "1,100円（税込）以上のお買い上げで10%割引き（一部商品を除く）";
  }

  function getUniqueStr(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return current_Date + Math.floor(strong*Math.random()).toString(16)
  }

  let Play_ID = getUniqueStr();

  var cognitoUser_me2 = userPool.getCurrentUser(); 
  cognitoUser_me2.getSession((err, session) => {
    if (err) {
      console.log(err)
      return
    } else {
      cognitoUser_me2.getUserAttributes((err,result) => {
        if (err) {
          console.log(err)
          return
        } else {
          var i;
          for (i = 0; i < result.length; i++) {
            currentUserData[result[i].getName()] = result[i].getValue();
          };   
          
          if (!alert(shop_name + "のクーポンを獲得しました!!マイページで確認しましょう。")) {
            var coupon_params = {
              TableName: 'coupon',
              Item:{
                Play_ID: currentUserData["sub"] + ":" + current_Date + ":" + shop_name,
                coupon_number: number,
                shop: shop_name,
                content: shop_content,
                User_ID: currentUserData["sub"],
                available_or_used: "available",
                get_Date: current_Date
              }
            };
        
            docClient.put(coupon_params, function(err, data){
              if(err){
                console.log('error');
              }else{
                console.log('success');
              }
            });
          }
        };
      });
    };
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  var Player_UI = document.getElementById("Player-UI");
  Player_UI.style.display = "none";
  const cognito_mine = userPool.getCurrentUser();
  const map_img = document.getElementById("map_img");
  const map_img2 = document.getElementById("map_img2");
  const map_img3 = document.getElementById("map_img3");
  const Player_map = document.getElementById("Player_map");
  if (room_name == "kooky-passionate-safari") {
    map_img.style.display = "none"; 
    map_img3.style.display = "none"; 
    Player_map.setAttribute("viewBox", "0 0 123.5 74.1");
    document.getElementById("hex-background").style.display = "none";
    document.getElementById("go-to-game").style.display = "none";
    /*if (cognito_mine != null){
      cognito_mine.getSession((err, session) => {
        if (err) {
          location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
        } else {
          document.getElementById("hex-background").style.display = "none";
          document.getElementById("go-to-game").style.display = "none";
        }
      })
    } else {
      location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
    }*/
    //document.getElementById("tool_buttons").setAttribute("icon-button", "active", this.el.sceneEl.is("pen"));
  } else if (room_name == "strong-elementary-meetup") {
    map_img2.style.display = "none";
    map_img3.style.display = "none"; 
    Player_map.setAttribute("viewBox", "0 0 123.5 74.1");
    document.getElementById("life").style.display = "none";
    document.getElementById("score-display").style.display = "none";
  } else if(room_name == "silky-quick-congregation") {
    map_img.style.display = "none"; 
    map_img2.style.display = "none"; 
    document.getElementById("life").style.display = "none";
    document.getElementById("score-display").style.display = "none";
    document.getElementById("hex-background").style.display = "none";
    /*if (cognito_mine != null){
      cognito_mine.getSession((err, session) => {
        if (err) {
          location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
        } else {
          document.getElementById("life").style.display = "none";
          document.getElementById("score-display").style.display = "none";
          document.getElementById("hex-background").style.display = "none";
        }
      })
    } else {
      location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
    }*/
  } else if (room_name == "euphoric-rare-commons") {
    if (cognito_mine != null){
      cognito_mine.getSession((err, session) => {
        if (err) {
          location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
        } else {
          map_img.setAttribute("src", "");
          document.getElementById("life").style.display = "none";
          document.getElementById("score-display").style.display = "none";
          document.getElementById("hex-background").style.display = "none";
          document.getElementById("go-to-game").style.display = "none";
          document.getElementById("Player_map").style.display = "none";
        }
      })
    } else {
      location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
    }
  } else {
    location.href = "https://virtual-dotonbori.com/9d9PQL3/strong-elementary-meetup"
  };
  
  function get_cognito_data() {

    AWS.config.region = 'ap-northeast-1'; 
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-northeast-1:1a5b9f55-2ccb-494f-964f-6fda4d7f9eda',
    });

    const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

    var currentUserData = {}; 

    var ddb = new AWS.DynamoDB({
      apiVersion: '2012-08-10'
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    /*const poolData = {
      UserPoolId: "ap-northeast-1_OBc87MXYg",
      ClientId: "2a0a73brf9cnv2u7pbn3aa3e5r"
    };*/

    const poolData = {
      UserPoolId: "ap-northeast-1_RWH9txS1J",
      ClientId: "4h2qfcv13p4c6246q37bb4v9dk"
    };
    
    var cognitoUser_me2 = userPool.getCurrentUser(); 
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err)
      } else {
        cognitoUser_me2.getUserAttributes((err,result) => {
          if (err) {
            console.log(err)
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            };   
            return currentUserData["sub"];
          };
        });
      };
    });
    
  }

  if (isOAuthModal) {
    return;
  }

  await store.initProfile();

  const canvas = document.querySelector(".a-canvas");
  canvas.classList.add("a-hidden");

  if (platformUnsupported()) {
    return;
  }

  // HACK - it seems if we don't initialize the mic track up-front, voices can drop out on iOS
  // safari when initializing it later.
  if (isSafari()) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      remountUI({ showSafariMicDialog: true });
      return;
    }
  }

  const defaultRoomId = configs.feature("default_room_id");

  const hubId =
    qs.get("hub_id") ||
    (document.location.pathname === "/" && defaultRoomId
      ? defaultRoomId
      : document.location.pathname.substring(1).split("/")[0]);
  console.log(`Hub ID: ${hubId}`);

  if (!defaultRoomId) {
    // Default room won't work if account is required to access
    checkForAccountRequired();
  }

  const subscriptions = new Subscriptions(hubId);

  if (navigator.serviceWorker) {
    try {
      navigator.serviceWorker
        .register("/hub.service.js")
        .then(() => {
          navigator.serviceWorker.ready
            .then(registration => subscriptions.setRegistration(registration))
            .catch(() => subscriptions.setRegistrationFailed());
        })
        .catch(() => subscriptions.setRegistrationFailed());
    } catch (e) {
      subscriptions.setRegistrationFailed();
    }
  } else {
    subscriptions.setRegistrationFailed();
  }

  const scene = document.querySelector("a-scene");
  scene.renderer.debug.checkShaderErrors = false;

  // HACK - Trigger initial batch preparation with an invisible object
  scene
    .querySelector("#batch-prep")
    .setAttribute("media-image", { batch: true, src: initialBatchImage, contentType: "image/png" });

  const onSceneLoaded = () => {
    const physicsSystem = scene.systems["hubs-systems"].physicsSystem;
    physicsSystem.setDebug(isDebug || physicsSystem.debug);
    patchThreeAllocations();
  };

  if (scene.hasLoaded) {
    onSceneLoaded();
  } else {
    scene.addEventListener("loaded", onSceneLoaded, { once: true });
  }

  // If the stored avatar doesn't have a valid src, reset to a legacy avatar.
  const avatarSrc = await getAvatarSrc(store.state.profile.avatarId);
  if (!avatarSrc) {
    await store.resetToRandomDefaultAvatar();
  }

  const authChannel = new AuthChannel(store);
  const hubChannel = new HubChannel(store, hubId);
  const entryManager = new SceneEntryManager(hubChannel, authChannel, history);

  window.APP.scene = scene;
  const audioSystem = scene.systems["hubs-systems"].audioSystem;
  window.APP.mediaDevicesManager = new MediaDevicesManager(scene, store, audioSystem);
  window.APP.hubChannel = hubChannel;

  const performConditionalSignIn = async (predicate, action, signInMessage, onFailure) => {
    if (predicate()) return action();

    await handleExitTo2DInterstitial(true, () => remountUI({ showSignInDialog: false }));

    remountUI({
      showSignInDialog: true,
      signInMessage,
      onContinueAfterSignIn: async () => {
        remountUI({ showSignInDialog: false });
        let actionError = null;
        if (predicate()) {
          try {
            await action();
          } catch (e) {
            actionError = e;
          }
        } else {
          actionError = new Error("Predicate failed post sign-in");
        }

        if (actionError && onFailure) onFailure(actionError);
        exit2DInterstitialAndEnterVR();
      }
    });
  };

  window.addEventListener("action_create_avatar", () => {
    performConditionalSignIn(
      () => hubChannel.signedIn,
      () => pushHistoryState(history, "overlay", "avatar-editor"),
      SignInMessages.createAvatar
    );
  });

  scene.addEventListener("scene_media_selected", e => {
    const sceneInfo = e.detail;

    performConditionalSignIn(
      () => hubChannel.can("update_hub"),
      () => hubChannel.updateScene(sceneInfo),
      SignInMessages.changeScene
    );
  });

  remountUI({
    performConditionalSignIn,
    embed: isEmbed,
    showPreload: isEmbed
  });
  entryManager.performConditionalSignIn = performConditionalSignIn;
  entryManager.init();

  const linkChannel = new LinkChannel(store);
  window.dispatchEvent(new CustomEvent("hub_channel_ready"));

  const handleEarlyVRMode = () => {
    // If VR headset is activated, refreshing page will fire vrdisplayactivate
    // which puts A-Frame in VR mode, so exit VR mode whenever it is attempted
    // to be entered and we haven't entered the room yet.
    if (scene.is("vr-mode") && !scene.is("vr-entered") && !isMobileVR) {
      console.log("Pre-emptively exiting VR mode.");
      scene.exitVR();
      return true;
    }

    return false;
  };

  remountUI({ availableVREntryTypes: ONLY_SCREEN_AVAILABLE, checkingForDeviceAvailability: true });
  const availableVREntryTypesPromise = getAvailableVREntryTypes();
  scene.addEventListener("enter-vr", () => {
    if (handleEarlyVRMode()) return true;

    if (isMobileVR) {
      // Optimization, stop drawing UI if not visible
      remountUI({ hide: true });
    }

    document.body.classList.add("vr-mode");

    availableVREntryTypesPromise.then(availableVREntryTypes => {
      // Don't stretch canvas on cardboard, since that's drawing the actual VR view :)
      if ((!isMobile && !isMobileVR) || availableVREntryTypes.cardboard !== VR_DEVICE_AVAILABILITY.yes) {
        document.body.classList.add("vr-mode-stretch");
      }
    });
  });

  handleEarlyVRMode();

  // HACK A-Frame 0.9.0 seems to fail to wire up vrdisplaypresentchange early enough
  // to catch presentation state changes and recognize that an HMD is presenting on startup.
  window.addEventListener(
    "vrdisplaypresentchange",
    () => {
      if (scene.is("vr-entered")) return;
      if (scene.is("vr-mode")) return;

      const device = AFRAME.utils.device.getVRDisplay();

      if (device && device.isPresenting) {
        if (!scene.is("vr-mode")) {
          console.warn("Hit A-Frame bug where VR display is presenting but A-Frame has not entered VR mode.");
          scene.enterVR();
        }
      }
    },
    { once: true }
  );

  scene.addEventListener("exit-vr", () => {
    document.body.classList.remove("vr-mode");
    document.body.classList.remove("vr-mode-stretch");

    remountUI({ hide: false });

    // HACK: Oculus browser pauses videos when exiting VR mode, so we need to resume them after a timeout.
    if (/OculusBrowser/i.test(window.navigator.userAgent)) {
      document.querySelectorAll("[media-video]").forEach(m => {
        const videoComponent = m.components["media-video"];

        if (videoComponent) {
          videoComponent._ignorePauseStateChanges = true;

          setTimeout(() => {
            const video = videoComponent.video;

            if (video && video.paused && !videoComponent.data.videoPaused) {
              video.play();
            }

            videoComponent._ignorePauseStateChanges = false;
          }, 1000);
        }
      });
    }
  });

  registerNetworkSchemas();

  remountUI({
    authChannel,
    hubChannel,
    linkChannel,
    subscriptions,
    enterScene: entryManager.enterScene,
    exitScene: reason => {
      entryManager.exitScene();
      remountUI({ roomUnavailableReason: reason || ExitReason.exited });
    },
    initialIsSubscribed: subscriptions.isSubscribed()
  });

  scene.addEventListener("action_focus_chat", () => {
    const chatFocusTarget = document.querySelector(".chat-focus-target");
    chatFocusTarget && chatFocusTarget.focus();
  });

  scene.addEventListener("leave_room_requested", () => {
    entryManager.exitScene();
    remountUI({ roomUnavailableReason: ExitReason.left });
  });

  scene.addEventListener("hub_closed", () => {
    scene.exitVR();
    entryManager.exitScene();
    remountUI({ roomUnavailableReason: ExitReason.closed });
  });

  scene.addEventListener("action_camera_recording_started", () => hubChannel.beginRecording());
  scene.addEventListener("action_camera_recording_ended", () => hubChannel.endRecording());

  if (qs.get("required_version") && process.env.BUILD_VERSION) {
    const buildNumber = process.env.BUILD_VERSION.split(" ", 1)[0]; // e.g. "123 (abcd5678)"

    if (qs.get("required_version") !== buildNumber) {
      remountUI({ roomUnavailableReason: ExitReason.versionMismatch });
      setTimeout(() => document.location.reload(), 5000);
      entryManager.exitScene();
      return;
    }
  }

  getReticulumMeta().then(reticulumMeta => {
    console.log(`Reticulum @ ${reticulumMeta.phx_host}: v${reticulumMeta.version} on ${reticulumMeta.pool}`);

    if (
      qs.get("required_ret_version") &&
      (qs.get("required_ret_version") !== reticulumMeta.version || qs.get("required_ret_pool") !== reticulumMeta.pool)
    ) {
      remountUI({ roomUnavailableReason: ExitReason.versionMismatch });
      setTimeout(() => document.location.reload(), 5000);
      entryManager.exitScene();
      return;
    }
  });

  availableVREntryTypesPromise.then(async availableVREntryTypes => {
    if (isMobileVR) {
      remountUI({
        availableVREntryTypes,
        forcedVREntryType: qsVREntryType || "vr",
        checkingForDeviceAvailability: false
      });

      if (/Oculus/.test(navigator.userAgent) && "getVRDisplays" in navigator) {
        // HACK - The polyfill reports Cardboard as the primary VR display on startup out ahead of
        // Oculus Go on Oculus Browser 5.5.0 beta. This display is cached by A-Frame,
        // so we need to resolve that and get the real VRDisplay before entering as well.
        const displays = await navigator.getVRDisplays();
        const vrDisplay = displays.length && displays[0];
        AFRAME.utils.device.getVRDisplay = () => vrDisplay;
      }
    } else {
      const hasVREntryDevice =
        availableVREntryTypes.cardboard !== VR_DEVICE_AVAILABILITY.no ||
        availableVREntryTypes.generic !== VR_DEVICE_AVAILABILITY.no ||
        availableVREntryTypes.daydream !== VR_DEVICE_AVAILABILITY.no;

      remountUI({
        availableVREntryTypes,
        forcedVREntryType: qsVREntryType || (!hasVREntryDevice ? "2d" : null),
        checkingForDeviceAvailability: false
      });
    }
  });

  const environmentScene = document.querySelector("#environment-scene");

  const onFirstEnvironmentLoad = () => {
    // Replace renderer with a noop renderer to reduce bot resource usage.
    if (isBotMode) {
      runBotMode(scene, entryManager);
    }

    environmentScene.removeEventListener("model-loaded", onFirstEnvironmentLoad);
  };

  environmentScene.addEventListener("model-loaded", onFirstEnvironmentLoad);

  environmentScene.addEventListener("model-loaded", ({ detail: { model } }) => {
    if (!scene.is("entered")) {
      setupLobbyCamera();
    }

    // This will be run every time the environment is changed (including the first load.)
    remountUI({ environmentSceneLoaded: true });
    scene.emit("environment-scene-loaded", model);

    // Re-bind the teleporter controls collision meshes in case the scene changed.
    document.querySelectorAll("a-entity[teleporter]").forEach(x => x.components["teleporter"].queryCollisionEntities());

    for (const modelEl of environmentScene.children) {
      addAnimationComponents(modelEl);
    }
  });

  // Socket disconnects on refresh but we don't want to show exit scene in that scenario.
  let isReloading = false;
  window.addEventListener("beforeunload", () => (isReloading = true));

  const socket = await connectToReticulum(isDebug);

  socket.onClose(e => {
    /*text_chat_data.count();
    console.log(text_chat_data);
    var params = {
      TableName: 'Communication',
      Item:{
        PlayID: "dsagfawg",
        text_chat: text_chat_data
      }
    };
    docClient.put(params, function(err, data){
      if(err){
        console.log(err);
      }else{
        console.log(success);
      }
    });*/
    // We don't currently have an easy way to distinguish between being kicked (server closes socket)
    // and a variety of other network issues that seem to produce the 1000 closure code, but the
    // latter are probably more common. Either way, we just tell the user they got disconnected.
    const NORMAL_CLOSURE = 1000;

    if (e.code === NORMAL_CLOSURE && !isReloading) {
      entryManager.exitScene();
      remountUI({ roomUnavailableReason: ExitReason.disconnected });

      function exit_and_put(){
        return new Promise((resolve, reject) => {
          try {
            let params = {
              TableName: 'Communication',
              Item:{
                PlayID: "dsagfawg",
                text_chat: 5 //text_chat_data
              }
            };
            docClient.put(params, function(err, data){
              if(err){
                console.log("err");
              }else{
                console.log("success");
              }
            });
            resolve();
          } catch(e) {
            console.log("err");
            reject();
          }
        })
      };
  
      exit_and_put().then(() => {
        
      }).catch(e => {
        console.log("err")
      });
      //text_chat_data.count();
      //console.log(text_chat_data);
    }

    
  });

  // Reticulum global channel
  let retPhxChannel = socket.channel(`ret`, { hub_id: hubId });
  retPhxChannel
    .join()
    .receive("ok", async data => subscriptions.setVapidPublicKey(data.vapid_public_key))
    .receive("error", res => {
      subscriptions.setVapidPublicKey(null);
      console.error(res);
    });

  const pushSubscriptionEndpoint = await subscriptions.getCurrentEndpoint();

  const oauthFlowPermsToken = Cookies.get(OAUTH_FLOW_PERMS_TOKEN_KEY);

  if (oauthFlowPermsToken) {
    Cookies.remove(OAUTH_FLOW_PERMS_TOKEN_KEY);
  }

  const createHubChannelParams = permsToken => {
    let params = {
      profile: store.state.profile,
      push_subscription_endpoint: pushSubscriptionEndpoint,
      auth_token: null,
      perms_token: null,
      context: {
        mobile: isMobile || isMobileVR,
        embed: isEmbed
      },
      hub_invite_id: qs.get("hub_invite_id")
    };

    if (isMobileVR) {
      params.context.hmd = true;
    }

    if (permsToken) {
      params.perms_token = permsToken;
    }

    const { token } = store.state.credentials;
    if (token) {
      console.log(`Logged into account ${store.credentialsAccountId}`);
      params.auth_token = token;
    }

    return params;
  };

  const tryGetMatchingMeta = async ({ ret_pool, ret_version }, shouldAbandonMigration) => {
    const backoffMS = 5000;
    const randomMS = 15000;
    const maxAttempts = 10;
    let didMatchMeta = false;
    let attempt = 0;
    while (!didMatchMeta && attempt < maxAttempts && !shouldAbandonMigration()) {
      try {
        // Add randomness to the first request avoid flooding reticulum.
        const delayMS = attempt * backoffMS + (attempt === 0 ? Math.random() * randomMS : 0);
        console.log(
          `[reconnect] Getting reticulum meta in ${Math.ceil(delayMS / 1000)} seconds.${
            attempt ? ` (Attempt ${attempt + 1} of ${maxAttempts})` : ""
          }`
        );
        await sleep(delayMS);
        invalidateReticulumMeta();
        console.log(
          `[reconnect] Getting reticulum meta.${attempt ? ` (Attempt ${attempt + 1} of ${maxAttempts})` : ""}`
        );
        const { pool, version } = await getReticulumMeta();
        didMatchMeta = ret_pool === pool && ret_version === version;
      } catch {
        didMatchMeta = false;
      }

      attempt = attempt + 1;
    }
    return didMatchMeta;
  };

  const migrateToNewReticulumServer = async ({ ret_version, ret_pool }, shouldAbandonMigration) => {
    console.log(`[reconnect] Reticulum deploy detected v${ret_version} on ${ret_pool}.`);

    const didMatchMeta = await tryGetMatchingMeta({ ret_version, ret_pool }, shouldAbandonMigration);
    if (!didMatchMeta) {
      console.error(`[reconnect] Failed to reconnect. Did not get meta for v${ret_version} on ${ret_pool}.`);
      return;
    }

    console.log("[reconnect] Reconnect in progress. Updated reticulum meta.");
    const oldSocket = retPhxChannel.socket;
    const socket = await connectToReticulum(isDebug, oldSocket.params());
    retPhxChannel = await migrateChannelToSocket(retPhxChannel, socket);
    await hubChannel.migrateToSocket(socket, createHubChannelParams());
    authChannel.setSocket(socket);
    linkChannel.setSocket(socket);

    // Disconnect old socket after a delay to ensure this user is always registered in presence.
    await sleep(10000);
    oldSocket.teardown();
    console.log("[reconnect] Reconnection successful.");
  };

  const onRetDeploy = (function() {
    let pendingNotification = null;
    const hasPendingNotification = function() {
      return !!pendingNotification;
    };

    const handleNextMessage = (function() {
      let isLocked = false;
      return async function handleNextMessage() {
        if (isLocked || !pendingNotification) return;

        isLocked = true;
        const currentNotification = Object.assign({}, pendingNotification);
        pendingNotification = null;
        try {
          await migrateToNewReticulumServer(currentNotification, hasPendingNotification);
        } catch {
          console.error("Failed to migrate to new reticulum server after deploy.", currentNotification);
        } finally {
          isLocked = false;
          handleNextMessage();
        }
      };
    })();

    return function onRetDeploy(deployNotification) {
      // If for some reason we receive multiple deployNotifications, only the
      // most recent one matters. The rest can be overwritten.
      pendingNotification = deployNotification;
      handleNextMessage();
    };
  })();

  retPhxChannel.on("notice", data => {
    if (data.event === "ret-deploy") {
      onRetDeploy(data);
    }
  });

  const hubPhxChannel = socket.channel(`hub:${hubId}`, createHubChannelParams(oauthFlowPermsToken));

  const presenceLogEntries = [];

  
  const addToPresenceLog = entry => {
    entry.key = Date.now().toString();

    presenceLogEntries.push(entry);
    remountUI({ presenceLogEntries });
    if (entry.type === "chat" && scene.is("loaded")) {
      scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_CHAT_MESSAGE);
    }

    // Fade out and then remove
    setTimeout(() => {
      entry.expired = true;
      remountUI({ presenceLogEntries });

      setTimeout(() => {
        presenceLogEntries.splice(presenceLogEntries.indexOf(entry), 1);
        remountUI({ presenceLogEntries });
      }, 5000);
    }, 20000);
  };

  const messageDispatch = new MessageDispatch(
    scene,
    entryManager,
    hubChannel,
    addToPresenceLog,
    remountUI,
    mediaSearchStore
  );
  document.getElementById("avatar-rig").messageDispatch = messageDispatch;

  let isInitialJoin = true;

  // We need to be able to wait for initial presence syncs across reconnects and socket migrations,
  // so we create this object in the outer scope and assign it a new promise on channel join.
  const presenceSync = {
    promise: null,
    resolve: null
  };

  hubChannel.setPhoenixChannel(hubPhxChannel);

  

  hubPhxChannel
    .join()
    .receive("ok", async data => {
      socket.params().session_id = data.session_id;
      socket.params().session_token = data.session_token;

      const vrHudPresenceCount = document.querySelector("#hud-presence-count");

      presenceSync.promise = new Promise(resolve => {
        presenceSync.resolve = resolve;
      });

    

      if (isInitialJoin) {
        store.addEventListener("profilechanged", hubChannel.sendProfileUpdate.bind(hubChannel));

        const requestedOccupants = [];

        const requestOccupants = async (sessionIds, state) => {
          requestedOccupants.length = 0;
          for (let i = 0; i < sessionIds.length; i++) {
            const sessionId = sessionIds[i];
            if (sessionId !== NAF.clientId && state[sessionId].metas[0].presence === "room") {
              requestedOccupants.push(sessionId);
            }
          }

          while (!NAF.connection.isConnected()) await nextTick();
          NAF.connection.adapter.syncOccupants(requestedOccupants);
        };

        const presence = hubChannel.presence;
        const occupantCount = Object.getOwnPropertyNames(presence.state).length;
        //var my_entry_number = occupantCount - 1;
        //console.log(hubChannel.presence.state)

        hubChannel.presence.onSync(() => {
          const presence = hubChannel.presence;

          remountUI({
            sessionId: socket.params().session_id,
            presences: presence.state,
            entryDisallowed: !hubChannel.canEnterRoom(uiProps.hub)
          });

          const sessionIds = Object.getOwnPropertyNames(presence.state);
          const occupantCount = sessionIds.length;
          vrHudPresenceCount.setAttribute("text", "value", occupantCount.toString());

          //console.log(presence.state[socket.params().session_id].metas)
          //console.log(hubChannel.connect)

          if (occupantCount > 1) {
            scene.addState("copresent");
          } else {
            scene.removeState("copresent");
          }

          requestOccupants(sessionIds, presence.state);

          // HACK - Set a flag on the presence object indicating if the initial sync has completed,
          // which is used to determine if we should fire join/leave messages into the presence log.
          // This flag is required since we reuse these onJoin and onLeave handler functions on
          // socket migrations.
          presence.__hadInitialSync = true;

          presenceSync.resolve();

          //const naf_tree = Object.keys(NAF.connection.entities.entities)
          //console.log(naf_tree)
          //console.log(Object.getOwnPropertyNames(presence.state))
          //console.log(typeof Object.getOwnPropertyNames(presence.state))
          
          
          //let my_NAF_ID = "naf-" + naf_tree[naf_tree.length - 1];

          //console.log(sessionStorage.getItem("naf-mine"))

          //if(sessionStorage.getItem("naf-mine") == null || sessionStorage.getItem("naf-mine") == undefined || sessionStorage.getItem("naf-mine") == "naf-undefined"){
            //sessionStorage.setItem('naf-mine', my_NAF_ID)
          //}
          
          //console.log(my_NAF_ID);
          

          presence.onJoin((sessionId, current, info) => {
            // Ignore presence join/leaves if this Presence has not yet had its initial sync (o/w the user
            // will see join messages for every user.)
            if (!hubChannel.presence.__hadInitialSync) return

            const meta = info.metas[info.metas.length - 1];
            const occupantCount = Object.entries(hubChannel.presence.state).length;

            //const naf_tree = Object.keys(NAF.connection.entities.entities)
            //console.log(naf_tree)
            //console.log(Object.getOwnPropertyNames(presence.state))
            //console.log(typeof Object.getOwnPropertyNames(presence.state))
            
            
            //let my_NAF_ID = "naf-" + naf_tree[naf_tree.length - 1];

            //console.log(sessionStorage.getItem(socket.params().session_id))
            //console.log(socket.params().session_id)
            //console.log(hubChannel.channel.joinPush.receivedResp.response.session_id)

            //console.log(sessionStorage.getItem(hubChannel.channel.joinPush.receivedResp.response.session_id));

            //if(sessionStorage.getItem(hubChannel.channel.joinPush.receivedResp.response.session_id) == null || sessionStorage.getItem(hubChannel.channel.joinPush.receivedResp.response.session_id) == undefined || sessionStorage.getItem(hubChannel.channel.joinPush.receivedResp.response.session_id) == "naf-undefined"){
              //if(naf_tree.length >= occupantCount && meta.presence === "room"){
                //sessionStorage.setItem(hubChannel.channel.joinPush.receivedResp.response.session_id, my_NAF_ID)
              //}
            //}
            
            //console.log(my_NAF_ID);

            if (occupantCount <= NOISY_OCCUPANT_COUNT) {
              if (current) {
                // Change to existing presence
                const isSelf = sessionId === socket.params().session_id;
                const currentMeta = current.metas[0];

                //↓roomに入場する際の処理
                if (
                  !isSelf &&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room" &&
                  meta.profile.displayName
                ) {
                  messageDispatch.receive({
                    type: "entered",
                    presence: meta.presence,
                    name: meta.profile.displayName
                  });
                }

                if (
                  !isSelf &&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room" &&
                  meta.profile.displayName &&
                  room_name == "kooky-passionate-safari"
                ) {
                  const Red_Score = document.getElementById("red-score");
                  const Blue_Score = document.getElementById("blue-score");
                  var event3 = new Event('change');
                  var hit_target_container = document.getElementById("hit_target_container");
                  hit_target_container.value = "_Red:" + Number(Red_Score.innerText) + "_Blue:" + Number(Blue_Score.innerText);
                  hit_target_container.dispatchEvent(event3);
                  if (document.getElementById("score-display-top").innerText != "") {
                    hit_target_container.value = "_" + document.getElementById("score-display-top").innerText;
                    hit_target_container.dispatchEvent(event3);
                  }
                  hit_target_container.value = window.timeCount;
                  hit_target_container.dispatchEvent(event3);
                }

                if (
                  isSelf&&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room"
                ) {
                  Player_UI.style.display = "block"
                  const toolbar_under = document.getElementById("toolbar_under");
                  toolbar_under.style.display = "none";
                  const contentmenu_top = document.getElementById("contentmenu_top");
                  contentmenu_top.style.display = "none";
                  const Player_tips = document.getElementById("Player_tips");
                  Player_tips.style.display = "none";
                  const general_menu = document.getElementById("general_menu");
                  const general_menu_text = document.getElementById("general_menu_text");
                  general_menu.addEventListener("click", function(){
                    if (toolbar_under.style.display == "none" && Player_tips.style.display == "none") {
                      toolbar_under.style.display = "flex";
                      Player_tips.style.display = "block";
                      general_menu_text.innerText = "クリックして閉じる"
                    } else {
                      toolbar_under.style.display = "none";
                      Player_tips.style.display = "none";
                      general_menu_text.innerText = "クリックして開く"
                    }
                    
                  });
                  count_start();
                }

                if (
                  isSelf&&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room" &&
                  meta.profile.displayName &&
                  room_name == "kooky-passionate-safari"
                ) {
                  alert("ゲームワールドへようこそ!!\nこちらではシューティングゲームをお楽しみいただけます。\n25ポイントを先取したチームの勝利です。\n\n[操作方法]\n\n射撃モードに移行：Pキー\n\n射撃：射撃モードでクリック\n\n前に移動：Wキー\n後ろに移動：Sキー\n右に移動：Dキー\n左に移動：Aキー\n素早く移動：各移動キーとShiftキーを同時押し\n\n右を向く：Eキー\n左を向く：Qキー")
                  const naf_tree = Object.keys(NAF.connection.entities.entities)
                  let my_NAF_ID = "naf-" + naf_tree[naf_tree.length - 1];
                  
                  window.NAF_ID_for_SHOOTING = my_NAF_ID;
                  
                  const characterController = AFRAME.scenes[0].systems["hubs-systems"].characterController;
                  
                  setTimeout(() => {
                    if (window.RedSum >= window.BlueSum) {
                      team = "BlueTeam";
                      document.documentElement.style.setProperty('--team-color', 'rgb(0, 243, 235)');
                      document.documentElement.style.setProperty('--team-color-sub', 'rgba(0, 243, 235, 0.05)');
                      document.getElementById("score-display-top").innerText = team;
                      let respawn_point1 = new THREE.Vector3(10.5, 4.5, -31);
                      characterController.teleportTo(respawn_point1);
                      const nametagEl = document.querySelector(".nametag");
                      nametagEl.setAttribute("text", { color: "rgb(0, 243, 235)"});
                    } else {
                      team = "RedTeam";
                      document.documentElement.style.setProperty('--team-color', 'rgb(186, 7, 5)');
                      document.documentElement.style.setProperty('--team-color-sub', 'rgba(186, 7, 5, 0.05)');
                      document.getElementById("score-display-top").innerText = team;
                      let respawn_point2 = new THREE.Vector3(116.5, 1, -8);
                      characterController.teleportTo(respawn_point2);
                      const nametagEl = document.querySelector(".nametag");
                      nametagEl.setAttribute("text", { color: "rgb(186, 7, 5)"});
                    }
                    console.log("myteam:" + team);
                    console.log("Red:" + window.RedSum);
                    console.log("Blue:" + window.BlueSum);
                  }, 1000);
                  
                  //sessionStorage.setItem(hubChannel.channel.joinPush.receivedResp.response.session_id, my_NAF_ID)
                  /*let cognitoUser_me = userPool.getCurrentUser(); 
                  cognitoUser_me.getSession((err, session) => {
                    if (err) {
                      console.log(err)
                    } else {
                      cognitoUser_me.getUserAttributes((err,result) => {
                        if (err) {
                          console.log(err)
                        } else {
                          let i;
                          for (i = 0; i < result.length; i++) {
                            currentUserData[result[i].getName()] = result[i].getValue();
                          };   
                        };
                      });
                    };
                  });

                  var params = {
                    TableName: 'Matching-table',
                    Key:{//更新したい項目をプライマリキー(及びソートキー)によって１つ指定
                      URL: "kooky-passionate-safari"
                    },
                    ExpressionAttributeNames: {
                      '#P': 'player',
                      '#id': "id",
                      '#NAF': 'NAF'
                    },
                    ExpressionAttributeValues: {
                      ':myID':currentUserData['sub'],
                      ':newNAF': my_NAF_ID
                    },
                    UpdateExpression: 'SET #p = {myID:newNAF}'
                  };
                  docClient.update(params, function(err, data2){
                    if(err){
                      console.log('error')
                    }else{
                      console.log('success')
                    }
                  });*/
                
                }

                if (
                  isSelf&&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room" &&
                  meta.profile.displayName &&
                  room_name == "strong-elementary-meetup"
                ) {
                  alert("観光ワールドへようこそ!!\nこちらでは道頓堀の観光をお楽しみいただけます。\n\n[操作方法]\n\n前に移動：Wキー\n後ろに移動：Sキー\n右に移動：Dキー\n左に移動：Aキー\n素早く移動：各移動キーとShiftキーを同時押し\n\n右を向く：Eキー\n左を向く：Qキー")
                }

                if (
                  currentMeta.profile &&
                  meta.profile &&
                  currentMeta.profile.displayName !== meta.profile.displayName
                ) {
                  messageDispatch.receive({
                    type: "display_name_changed",
                    oldName: currentMeta.profile.displayName,
                    newName: meta.profile.displayName
                  });
                }
              } else if (info.metas.length === 1) {
                // New presence
                const meta = info.metas[0];

                if (meta.presence && meta.profile.displayName) {
                  messageDispatch.receive({
                    type: "join",
                    presence: meta.presence,
                    name: meta.profile.displayName
                  });
                }
              }
            }

            scene.emit("presence_updated", {
              sessionId,
              profile: meta.profile,
              roles: meta.roles,
              permissions: meta.permissions,
              streaming: meta.streaming,
              recording: meta.recording
            });
          });
      

          presence.onLeave((sessionId, current, info) => {
            // Ignore presence join/leaves if this Presence has not yet had its initial sync
            if (!hubChannel.presence.__hadInitialSync) return;

            if (current && current.metas.length > 0) return;
            const occupantCount = Object.entries(hubChannel.presence.state).length;
            if (occupantCount > NOISY_OCCUPANT_COUNT) return;

            const meta = info.metas[0];

            if (meta.profile.displayName) {
              messageDispatch.receive({
                type: "leave",
                name: meta.profile.displayName
              });
            }
          });
        });
      }

      isInitialJoin = false;

      const permsToken = oauthFlowPermsToken || data.perms_token;
      hubChannel.setPermissionsFromToken(permsToken);

      scene.addEventListener("adapter-ready", async ({ detail: adapter }) => {
        adapter.setClientId(socket.params().session_id);
        adapter.setJoinToken(data.perms_token);
        adapter.setServerParams(await window.APP.hubChannel.getHost());
        adapter.setReconnectionListeners(
          async () => {
            const { host, port } = await hubChannel.getHost();
            const newServerURL = `wss://${host}:${port}`;
            // If the Dialog server url has changed, the server has rolled over and we need to reconnect using an updated server URL.
            if (adapter.serverUrl !== newServerURL) {
              console.error(`The Dialog server has changed to ${newServerURL}, reconnecting with the new server...`);
              scene.setAttribute("networked-scene", { serverURL: newServerURL });
              adapter.setServerUrl(newServerURL);
              adapter.setServerParams(await window.APP.hubChannel.getHost());
              adapter.reconnect();
            }
            // Safety guard to show the connection error screen in case we can't reconnect after 30 seconds
            if (!connectionErrorTimeout) {
              connectionErrorTimeout = setTimeout(() => {
                adapter.disconnect();
                onConnectionError(entryManager, "Timeout trying to reconnect to the room");
              }, 30000);
            }
          },
          () => {
            clearTimeout(connectionErrorTimeout);
            connectionErrorTimeout = null;
          }
        );

        setupPeerConnectionConfig(adapter);

        hubChannel.addEventListener("permissions-refreshed", e => adapter.setJoinToken(e.detail.permsToken));
      });

      subscriptions.setHubChannel(hubChannel);
      subscriptions.setSubscribed(data.subscriptions.web_push);

      remountUI({
        hubIsBound: data.hub_requires_oauth,
        initialIsFavorited: data.subscriptions.favorites,
        initialIsSubscribed: subscriptions.isSubscribed()
      });

      await presenceSync.promise;

      handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data);
    })
    .receive("error", res => {
      if (res.reason === "closed") {
        entryManager.exitScene();
        remountUI({ roomUnavailableReason: ExitReason.closed });
      } else if (res.reason === "oauth_required") {
        entryManager.exitScene();
        remountUI({ oauthInfo: res.oauth_info, showOAuthScreen: true });
      } else if (res.reason === "join_denied") {
        entryManager.exitScene();
        remountUI({ roomUnavailableReason: ExitReason.denied });
      }

      console.error(res);
    });

  const handleIncomingNAF = data => {
    if (!NAF.connection.adapter) return;

    NAF.connection.adapter.onData(authorizeOrSanitizeMessage(data), PHOENIX_RELIABLE_NAF);
  };

  hubPhxChannel.on("naf", data => handleIncomingNAF(data));
  hubPhxChannel.on("nafr", ({ from_session_id, naf: unparsedData }) => {
    // Server optimization: server passes through unparsed NAF message, we must now parse it.
    const data = JSON.parse(unparsedData);
    data.from_session_id = from_session_id;
    handleIncomingNAF(data);
  });

  hubPhxChannel.on("message", ({ session_id, type, body, from }) => {
    function encode_text(text) {
      return text.replace(/</g, '').replace(/>/g, '');
    }

    body = encode_text(body);

    const getAuthor = () => {
      const userInfo = hubChannel.presence.state[session_id];
      if (from) {
        return from;
      } else if (userInfo) {
        return userInfo.metas[0].profile.displayName;
      } else {
        return "Mystery user";
      }
    };

    const name = getAuthor();
    const maySpawn = scene.is("entered");

    const incomingMessage = {
      name,
      type,
      body,
      maySpawn,
      sessionId: session_id,
      sent: session_id === socket.params().session_id
    };

    if (scene.is("vr-mode")) {
      createInWorldLogMessage(incomingMessage);
    }
    
    messageDispatch.receive(incomingMessage);
  
  });

  hubPhxChannel.on("hub_refresh", ({ session_id, hubs, stale_fields }) => {
    const hub = hubs[0];
    const userInfo = hubChannel.presence.state[session_id];
    const displayName = (userInfo && userInfo.metas[0].profile.displayName) || "API";

    window.APP.hub = hub;
    updateUIForHub(hub, hubChannel);

    if (
      stale_fields.includes("scene") ||
      stale_fields.includes("scene_listing") ||
      stale_fields.includes("default_environment_gltf_bundle_url")
    ) {
      const fader = document.getElementById("viewing-camera").components["fader"];

      fader.fadeOut().then(() => {
        scene.emit("reset_scene");
        updateEnvironmentForHub(hub, entryManager);
      });

      messageDispatch.receive({
        type: "scene_changed",
        name: displayName,
        sceneName: hub.scene ? hub.scene.name : "a custom URL"
      });
    }

    if (stale_fields.includes("member_permissions")) {
      hubChannel.fetchPermissions();
    }

    if (stale_fields.includes("name")) {
      const titleParts = document.title.split(" | "); // Assumes title has | trailing site name
      titleParts[0] = hub.name;
      document.title = titleParts.join(" | ");

      // Re-write the slug in the browser history
      const pathParts = history.location.pathname.split("/");
      const oldSlug = pathParts[1];
      const { search, state } = history.location;
      const pathname = history.location.pathname.replace(`/${oldSlug}`, `/${hub.slug}`);

      history.replace({ pathname, search, state });

      messageDispatch.receive({
        type: "hub_name_changed",
        name: displayName,
        hubName: hub.name
      });
    }

    if (hub.entry_mode === "deny") {
      scene.emit("hub_closed");
    }

    scene.emit("hub_updated", { hub });
  });

  hubPhxChannel.on("permissions_updated", () => hubChannel.fetchPermissions());

  hubPhxChannel.on("mute", ({ session_id }) => {
    if (session_id === NAF.clientId && !scene.is("muted")) {
      scene.emit("action_mute");
    }
  });

  authChannel.setSocket(socket);
  linkChannel.setSocket(socket);

  var Player_Respawn = document.getElementById("Player-Respawn");

  Player_Respawn.addEventListener("click", function(){
    Player_Respawn.style.display = "none";
    let HanabiAction = document.querySelector(".sanshakudama");//document.getElementById("HanabiContainer")
    HanabiAction.setAttribute("hanabi-animation", {action: "false"});
    if(document.getElementById("score-display-top").innerText == "BlueTeam") {
      let respawn_point1 = new THREE.Vector3(10.5, 4.5, -31);
      AFRAME.scenes[0].systems["hubs-systems"].characterController.teleportTo(respawn_point1);
    }

    if(document.getElementById("score-display-top").innerText == "RedTeam") {
      let respawn_point2 = new THREE.Vector3(116.5, 1, -8);
      AFRAME.scenes[0].systems["hubs-systems"].characterController.teleportTo(respawn_point2);
    }
  })

  const lifeBar = document.getElementById('life-background')         // ライフバー     // ライフの光部分
  let life = 100                                              // ライフ初期値
  lifeBar.style.width = "100%"                                // ライフ初期幅

  /*setInterval(() => {
  life = life + 10;
  if ( life > 100 ) {
      life = 100
  }
  lifeBar.style.width = life + "%"
  },1500);*/

  document.addEventListener('keydown', event => {
  if (event.ctrlKey && event.code === 'Slash') {
      life = life - 20;

      Player_UI.style.marginTop = "10px";
      Player_UI.style.marginleft = "10px";
      Player_UI.style.margintop = "0px";
      Player_UI.style.marginleft = "0px";

      if ( life <= 0 ){
      // 算出の結果 0 以下になった場合
      life = 0
      // 0.3秒後に光部分を非表示にする
      setTimeout(function(){
        Player_Respawn.style.display = "block";
        life = 100 ;
      }, 0)
      } else {
      // 算出の結果 100 を超過した場合
      if ( life > 100 ) {
          life = 100
      }
      }

      lifeBar.style.width = life + "%"
  }
  });

  var hit_target_container = document.getElementById("hit_target_container");

  hit_target_container.addEventListener('change', event => {
    var hit_target = hit_target_container.value;

    hubChannel.sendMessage(hit_target);
    hit_target_container.value = "";
  });

  document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code === 'Enter') {
      var hit_target = hit_target_container.value;
      console.log(hit_target);

      hubChannel.sendMessage(hit_target);
      hit_target_container.value = "";
    }
  });

  const main_contents1 = document.getElementById("main-contents1");
  const main_contents2 = document.getElementById("main-contents2");

  const attributeList = [];

  const createAccountBtn = document.getElementById("createAccount");
  createAccountBtn.addEventListener("click", () => {

    const email_signup = document.getElementById("email-signup").value;
    const name_signup = document.getElementById("name-signup").value;
    const password_signup = document.getElementById('password-signup').value;
    const age_signup = document.getElementById("age-signup").value;
    const sex_signup = document.getElementById("sex-signup").value;
    const location_signup = document.getElementById("location-signup").value;

    if (!email_signup | !name_signup | !password_signup | !age_signup | !sex_signup | !location_signup) {
      alert("未入力項目があります。");
      return false;
    }

    const dataName = {
      Name: "name",
      Value: name_signup
    };
    const attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataName
    );

    const dataEmail = {
      Name: "email",
      Value: email_signup
    };
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    attributeList.push(attributeName);
    attributeList.push(attributeEmail);

    userPool.signUp(name_signup, password_signup, attributeList, null, (err, data1) => {
      if (err) {
        alert(err.message);
      } else {
        alert(
          "登録したメールアドレスへアクティベーション用のリンクを送付しました。"
        );
      }; 
    });
  });
 
  document.getElementById("signinButton").addEventListener("click", () => {
    const email_signin = document.getElementById('email-signin').value;
    const password_signin = document.getElementById('password-signin').value;

    // 何か1つでも未入力の項目がある場合、メッセージを表示して処理を中断
    if (!email_signin | !password_signin) {
      alert("入力に不備があります。");
      return false;
    }

    // 認証データの作成
    const authenticationData = {
      Username: email_signin,
      Password: password_signin
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    const userData = {
      Username: email_signin,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    const cognitoUser2 = new myCognitouserclass(userData);

    
    
    // 認証処理
    cognitoUser2.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        //const idToken = result.getIdToken().getJwtToken(); // IDトークン
        //const accessToken = result.getAccessToken().getJwtToken(); // アクセストークン
        //const refreshToken = result.getRefreshToken().getToken(); // 更新トークン

        //cognitoUser2.cacheTokens();

        // サインイン成功の場合、次の画面へ遷移
        alert("ログインしました。");
      },

      onFailure: err => {
        // サインイン失敗の場合、エラーメッセージを画面に表示
        console.log(err);
        
        alert("ログインできません。");
      }
    });

    /*cognitoUser2.getDevice({
	    onSuccess: function (result) {
	        console.log('call result: ' + result);
	    },

      
	    onFailure: function(err) {
	        alert(err);
	    }
	  });*/
  });

  const signoutButton = document.getElementById("signoutButton");
  signoutButton.addEventListener("click", event => {
    let cognitoUser_me = userPool.getCurrentUser(); 
    if(cognitoUser_me){
      cognitoUser_me.getSession((err, session) => {
        if (err) {
          console.log(err)
        } else {      
          cognitoUser_me.signOut();
          alert("ログアウトしました。")
          };
      });
    }
  });
  
  document.getElementById("path-to-hubs").addEventListener("click", function() {
  
    const cognito_mine = userPool.getCurrentUser();
    if(cognito_mine == null){
      alert("ログインしてください。");
      return
    }
    if (cognito_mine != null){
      cognito_mine.getSession((err, session) => {
        if (err) {
          alert("ログインしてください。")
          return
        } else {
          document.getElementById("hex-background").style.display = "none";
        }
      })
    }
  })

  document.getElementById("path-to-VRChat").addEventListener("click", function() {
    location.href = "https://vrch.at/wrld_4432ea9b-729c-46e3-8eaf-846aa0a37fdd";
  })
  
  document.getElementById("go-to-game").addEventListener("click", function() {
    var matching_params = {
      TableName: 'Matching-table',
    };            
    docClient.scan(matching_params, function(err, data3){
      if(err){
        console.log(err);
      }else{
        data3.Items.sort((a, b) => b.Sum - a.Sum);
        var goal_url = "https://virtual-dotonbori.com/" + data3.Items[0].hubId + "/" + data3.Items[0].URL;
        if (confirm('マッチしました。対戦ワールドへ移動します。')) {
          location.href = goal_url;
        } else {
          alert('キャンセルしました。')
        }
      
      }
    });
  });

  document.getElementById('menu-button').addEventListener("click", function() {
    document.getElementById('menu-button').style.display ="none";
    document.getElementById("hex-grid").style.display = "grid";
    document.getElementById("grid-mc").style.display = "flex";
    setTimeout(() => {
      document.getElementById("grid-br").style.display = "flex";
    }, 100);
    setTimeout(() => {
      document.getElementById("grid-bl").style.display = "flex";
    }, 200);
    setTimeout(() => {
      document.getElementById("grid-ml").style.display = "flex";
    }, 300);
    setTimeout(() => {
      document.getElementById("grid-tl").style.display = "flex";
    }, 400);
    setTimeout(() => {
      document.getElementById("grid-tr").style.display = "flex";
    }, 500);
    setTimeout(() => {
      document.getElementById("grid-mr").style.display = "flex";
    }, 600);
    
  });

  document.documentElement.style.setProperty('--display1', 'block');

  document.getElementById('grid-tl').addEventListener("click", function() {
    document.documentElement.style.setProperty('--main-color', 'rgb(76, 183, 233)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(76, 183, 233, 0.3)');
    document.documentElement.style.setProperty('--display1', 'block');
    document.documentElement.style.setProperty('--display2', 'none');
    document.documentElement.style.setProperty('--display3', 'none');
    document.documentElement.style.setProperty('--display4', 'none');
    document.documentElement.style.setProperty('--display5', 'none');
    document.documentElement.style.setProperty('--display6', 'none');
  });

  document.getElementById('grid-tr').addEventListener("click", function(){
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 124, 124)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 124, 124, 0.3)');
    document.documentElement.style.setProperty('--display1', 'none');
    document.documentElement.style.setProperty('--display2', 'block');
    document.documentElement.style.setProperty('--display3', 'none');
    document.documentElement.style.setProperty('--display4', 'none');
    document.documentElement.style.setProperty('--display5', 'none');
    document.documentElement.style.setProperty('--display6', 'none');
  });

  document.getElementById('grid-ml').addEventListener("click", function() {
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 253, 108)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 253, 108, 0.3)');
    document.documentElement.style.setProperty('--display1', 'none');
    document.documentElement.style.setProperty('--display2', 'none');
    document.documentElement.style.setProperty('--display3', 'none');
    document.documentElement.style.setProperty('--display4', 'none');
    document.documentElement.style.setProperty('--display5', 'none');
    document.documentElement.style.setProperty('--display6', 'block');
  });

  document.getElementById('grid-mc').addEventListener("click", function() {
    document.getElementById('menu-button').style.display ="flex";
    document.getElementById("hex-grid").style.display = "none";
    document.getElementById("grid-tl").style.display = "none";
    document.getElementById("grid-tr").style.display = "none";
    document.getElementById("grid-ml").style.display = "none";
    document.getElementById("grid-mc").style.display = "none";
    document.getElementById("grid-mr").style.display = "none";
    document.getElementById("grid-bl").style.display = "none";
    document.getElementById("grid-br").style.display = "none";
  });

  document.getElementById('grid-mr').addEventListener("click", function() {
    document.documentElement.style.setProperty('--main-color', 'rgb(93, 255, 128)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(93, 255, 128, 0.3)');
    document.documentElement.style.setProperty('--display1', 'none');
    document.documentElement.style.setProperty('--display2', 'none');
    document.documentElement.style.setProperty('--display3', 'block');
    var cognitoUser_me2 = userPool.getCurrentUser(); 
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err)
      } else {
        cognitoUser_me2.getUserAttributes((err,result) => {
          if (err) {
            console.log(err)
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            };   
       
          };
        });
      };
    });
    document.getElementById("my_data").innerText = "あなたのIDは" + currentUserData["sub"] + "です。"
    document.documentElement.style.setProperty('--display4', 'none');
    document.documentElement.style.setProperty('--display5', 'none');
    document.documentElement.style.setProperty('--display6', 'none');
  });

  function generate_table() {
    var cognitoUser_me2 = userPool.getCurrentUser(); 
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err)
      } else {
        cognitoUser_me2.getUserAttributes((err,result) => {
          if (err) {
            console.log(err)
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            };   
            
            var coupon_params = {
              TableName: 'coupon',
              IndexName: 'User_ID-index',
              ExpressionAttributeNames:{'#U': 'User_ID'},
              ExpressionAttributeValues:{':val': currentUserData["sub"]},
              KeyConditionExpression: '#U = :val'
            };            
            docClient.query(coupon_params, function(err, coupon_data){
              if(err){
                console.log(err);
              }else{
                let coupon_available = document.getElementById("coupon-available");
                let coupon_used = document.getElementById("coupon-used");
        
                coupon_available.innerHTML = "";
                coupon_used.innerHTML = "";
        
                let coupon_list = coupon_data.Items
                let coupon_available_list = coupon_list.filter(x => x.available_or_used === 'available');
                let coupon_used_list = coupon_list.filter(x => x.available_or_used === 'used');
              
                // creates a <table> element and a <tbody> element
                var tbl = document.createElement("table");
                tbl.setAttribute("id", "coupon_table");
                var tblBody = document.createElement("tbody");
        
                var label_1 = document.createElement("tr");
        
                var label_1_number = document.createElement("th");
                label_1_number.classList.add("arrow_box")
                label_1_number.classList.add("styleme");
                label_1_number.setAttribute("data-augmented-ui", "tl-clip tr-clip-x br-clip both");
                var label_1_number_txt = document.createTextNode("対象店舗");
                label_1_number.appendChild(label_1_number_txt);
                label_1.appendChild(label_1_number)
        
                var label_1_content = document.createElement("td");
                var label_1_content_txt = document.createTextNode("クーポン内容");
                label_1_content.appendChild(label_1_content_txt);
                label_1.appendChild(label_1_content);
        
                var label_1_Date = document.createElement("td");
                var label_1_Date_txt = document.createTextNode("獲得日時");
                label_1_Date.appendChild(label_1_Date_txt);
                label_1.appendChild(label_1_Date);
        
                var label_1_margin = document.createElement("td");
                var label_1_margin_txt = document.createTextNode("");
                label_1_margin.appendChild(label_1_margin_txt);
                label_1.appendChild(label_1_margin);
        
                tblBody.appendChild(label_1);
              
                // creating all cells
                for (var i = 0; i < coupon_available_list.length; i++) {
                  // creates a table row
                  var row = document.createElement("tr");
              
                  var cell_1_1 = document.createElement("th");
                  cell_1_1.classList.add("arrow_box");
                  cell_1_1.classList.add("styleme");
                  cell_1_1.setAttribute("data-augmented-ui", "tl-clip tr-clip-x br-clip both");
                  var cellText_1_1 = document.createTextNode(coupon_available_list[i].shop);
                  cell_1_1.appendChild(cellText_1_1);
                  row.appendChild(cell_1_1);
        
                  var cell_1_2 = document.createElement("td");
                  var cellText_1_2 = document.createTextNode(coupon_available_list[i].content);
                  cell_1_2.appendChild(cellText_1_2);
                  row.appendChild(cell_1_2);
        
                  var cell_1_3 = document.createElement("td");
                  var cellText_1_3 = document.createTextNode(coupon_available_list[i].get_Date);
                  cell_1_3.appendChild(cellText_1_3);
                  row.appendChild(cell_1_3);
        
                  var Coupon_Number = i + 1;
                  var cell_1_4 = document.createElement("td");
                  cell_1_4.innerHTML = '<input class="use_Coupon" style="padding: 8px 15px" type="button" value="表示する">';
        
                  row.appendChild(cell_1_4);
                  
                  // add the row to the end of the table body
                  tblBody.appendChild(row);
                }
        
                // put the <tbody> in the <table>
                tbl.appendChild(tblBody);
                // appends <table> into <body>
                coupon_available.appendChild(tbl);
        
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
                // creates a <table> element and a <tbody> element
                var tbl2 = document.createElement("table");
                tbl2.setAttribute("id", "coupon_table2");
                var tblBody2 = document.createElement("tbody");
        
                var label_2 = document.createElement("tr");
        
                var label_2_number = document.createElement("th");
                label_2_number.classList.add("arrow_box");
                label_2_number.classList.add("styleme");
                label_2_number.setAttribute("data-augmented-ui", "tl-clip tr-clip-x br-clip both");
                var label_2_number_txt = document.createTextNode("対象店舗");
                label_2_number.appendChild(label_2_number_txt);
                label_2.appendChild(label_2_number)
        
                var label_2_content = document.createElement("td");
                var label_2_content_txt = document.createTextNode("クーポン内容");
                label_2_content.appendChild(label_2_content_txt);
                label_2.appendChild(label_2_content);
        
                var label_2_Date = document.createElement("td");
                var label_2_Date_txt = document.createTextNode("使用日時");
                label_2_Date.appendChild(label_2_Date_txt);
                label_2.appendChild(label_2_Date);
        
                var label_2_margin = document.createElement("td");
                var label_2_margin_txt = document.createTextNode("");
                label_2_margin.appendChild(label_2_margin_txt);
                label_2.appendChild(label_2_margin);
        
                tblBody2.appendChild(label_2);
              
                // creating all cells
                for (var i = 0; i < coupon_used_list.length; i++) {
                  // creates a table row
                  var row2 = document.createElement("tr");
              
                  var cell_2_1 = document.createElement("th");
                  cell_2_1.classList.add("arrow_box");
                  cell_2_1.classList.add("styleme");
                  cell_2_1.setAttribute("data-augmented-ui", "tl-clip tr-clip-x br-clip both");
                  var cellText_2_1 = document.createTextNode(coupon_used_list[i].shop);
                  cell_2_1.appendChild(cellText_2_1);
                  row2.appendChild(cell_2_1);
        
                  var cell_2_2 = document.createElement("td");
                  var cellText_2_2 = document.createTextNode(coupon_used_list[i].content);
                  cell_2_2.appendChild(cellText_2_2);
                  row2.appendChild(cell_2_2);
        
                  var cell_2_3 = document.createElement("td");
                  var cellText_2_3 = document.createTextNode(coupon_used_list[i].get_Date);
                  cell_2_3.appendChild(cellText_2_3);
                  row2.appendChild(cell_2_3);
        
                  var cell_2_4 = document.createElement("td");
                  var cellText_2_4 = document.createTextNode("ご利用いただきありがとうございます。");
                  cell_2_4.appendChild(cellText_2_4);
                  row2.appendChild(cell_2_4);
                  
                  // add the row to the end of the table body
                  tblBody2.appendChild(row2);
                
                }
                
                // put the <tbody> in the <table>
                tbl2.appendChild(tblBody2);
                // appends <table> into <body>
                coupon_used.appendChild(tbl2);
                
                tbl.setAttribute("border", "1");
                tbl2.setAttribute("border", "1");
        
        
                var trigger = document.querySelectorAll(".use_Coupon");

                
        
                trigger.forEach(function(target) {
                  target.addEventListener('click', function(event) {
                    const current_Date = get_current_Date();
                    const coupon_table = document.getElementById("coupon_table");
                    const modalElement = document.getElementById("coupon_modal");
                    const innerElement = document.getElementById("coupon_inner");
                    const span1 = document.getElementById("coupon_data_1");
                    const span2 = document.getElementById("coupon_data_2");
                    const span3 = document.getElementById("coupon_data_3");

                    modalElement.style.display = "block";
                    
                    // モーダルウィンドウと中身の要素を生成・クラスを付与
                    /*const modalElement = document.createElement('div');
                    modalElement.classList.add('modal');
                    const innerElement = document.createElement('div');
                    innerElement.classList.add('inner');
                    innerElement.classList.add('styleme');
                    innerElement.setAttribute("data-augmented-ui", "tl-clip-x br-clip border");*/

                    let coupon_logo;
                    let coupon_message;
                    if(target.parentNode.parentNode.children[0].innerText == "アンドリューのエッグタルト 大阪難波駅店") {
                      coupon_logo = "coupon_logo1"
                      coupon_message = "message_1";
                    } else if(target.parentNode.parentNode.children[0].innerText == "お好み焼き 千房 道頓堀支店") {
                      coupon_logo = "coupon_logo2";
                      coupon_message = "message_2";
                    } else if(target.parentNode.parentNode.children[0].innerText == "串カツだるま 道頓堀店") {
                      coupon_logo = "coupon_logo3";
                      coupon_message = "message_3";
                    } else if(target.parentNode.parentNode.children[0].innerText == "くれおーる 道頓堀店") {
                      coupon_logo = "coupon_logo4";
                      coupon_message = "message_4";
                    } else if(target.parentNode.parentNode.children[0].innerText == "道頓堀コナモンミュージアム") {
                      coupon_logo = "coupon_logo5";
                      coupon_message = "message_5";
                    } else if(target.parentNode.parentNode.children[0].innerText == "たこ八 道頓堀総本店") {
                      coupon_logo = "coupon_logo6";
                      coupon_message = "message_6";
                    } else if(target.parentNode.parentNode.children[0].innerText == "なにわ名物 いちびり庵 道頓堀店") {
                      coupon_logo = "coupon_logo7";
                      coupon_message = "message_7";
                    }

                    document.getElementById(coupon_logo).style.display = "block";
                    document.getElementById(coupon_message).style.display = "block";

                    span1.innerText = target.parentNode.parentNode.children[0].innerText;
                    span2.innerText = target.parentNode.parentNode.children[1].innerText;
                    span3.innerText = target.parentNode.parentNode.children[2].innerText;
        
                    // モーダルウィンドウに表示する要素を記述
                    /*innerElement.innerHTML = 
                      '<p style="background-color:yellow;text-align: center;padding: 5px 10px;">有効期限 2022年4月10日まで</p>' +
                      '<div style="display: flex;justify-content: center;padding: 20px 20px;flex-wrap: wrap;">' +
                      '<img id="coupon_logo" data-src="' + "assets/images/" + coupon_logo + '" src="" alt="ロゴ" style="width: 200px;margin: 10px auto; display:block">' +
                      '<h2 style="text-align: center;line-height: 1.5;padding: 0;font-weight: normal;font-size: 1.5rem;display: flex;flex-direction: column;justify-content: center;">' +
                      target.parentNode.parentNode.children[0].innerText + '<br>' +
                      '<span style="margin: 0 auto;width:80%;height: 1px; border-top: 1px solid #000000;"></span>' + 
                      target.parentNode.parentNode.children[1].innerText + '</h2>' + '</div>' +
                      '<p style="text-align: right; padding: 0;margin: 0 5px;font-size: 0.8rem;">獲得日時 ' + target.parentNode.parentNode.children[2].innerText + '</p>' +
                      '<p style="border-top: 2px dashed #000000;padding: 10px;">【注意事項】<br>※一度使用したクーポンは再度の取得および使用ができません。<br>※必ず店舗でご使用ください。</p>' +
                      '<div id="useCouponButtonContainer"><p style="width: 100%;">ここから下の操作は<br>・店員に「使用する」ボタンを押してもらう<br>・店員合意の元、使用者自身で「使用する」ボタンを押す<br>上記いずれかをお願いします。</p><input class="coupon_button" id="confirm_use_Coupon" type="button" value="使用する"><input class="coupon_button" id="cancel_use_Coupon" type="button" value="キャンセル"></div>'
                    ;
        
                    // モーダルウィンドウに中身を配置
                    modalElement.appendChild(innerElement);
                    
                    
                    
                    document.getElementById("hex-background").appendChild(modalElement);*/
        
                    function closeModal() {
                      //document.getElementById("hex-background").removeChild(modalElement);
                      modalElement.style.display = "none";
                      document.getElementById(coupon_logo).style.display = "none";
                      document.getElementById(coupon_message).style.display = "none";
                      event.preventDefault;
                    }
                    
        
                    // 中身をクリックしたらモーダルウィンドウを閉じる
                    innerElement.addEventListener('click', () => {
                      closeModal();
                    });
        
                    document.getElementById("confirm_use_Coupon").addEventListener('click', () => {
                      if(
                        span1.innerText != target.parentNode.parentNode.children[0].innerText ||
                        span2.innerText != target.parentNode.parentNode.children[1].innerText ||
                        span3.innerText != target.parentNode.parentNode.children[2].innerText) {
                        return false
                      }
                      var confirmed_coupon = {
                        TableName: 'coupon',
                        Key:{//更新したい項目をプライマリキー(及びソートキー)によって１つ指定
                          Play_ID: currentUserData["sub"] + ":" + span3.innerText + ":" + span1.innerText
                        },
                        ExpressionAttributeNames: {
                          '#available_or_used': "available_or_used",
                          '#used_Date' : 'used_Date'
                        },
                        ExpressionAttributeValues: {
                          ':used': "used",
                          ':used_Date' : current_Date
                        },
                        UpdateExpression: 'SET #available_or_used = :used, #used_Date = :used_Date'
                      };
                      docClient.update(confirmed_coupon, function(err, data2){
                        if(err){
                          console.log('error');
                        }else{
                          console.log('success');
                        }
                      });
                      //document.getElementById("hex-background").removeChild(modalElement);
                      modalElement.style.display = "none";
                      document.getElementById(coupon_logo).style.display = "none";
                      document.getElementById(coupon_message).style.display = "none";

                      tblBody.removeChild(target.parentNode.parentNode);
                      tblBody2.appendChild(target.parentNode.parentNode);
                      target.parentNode.parentNode.children[3].innerText = "ご利用いただきありがとうございます。";
                    });
                    
                  });
                });
        
        
                
              };
            });
          };
        });
      };
    });

    
    


  };

  document.getElementById('grid-bl').addEventListener("click", function() {
    generate_table();
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 93, 215)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 93, 215, 0.3)');
    document.documentElement.style.setProperty('--display1', 'none');
    document.documentElement.style.setProperty('--display2', 'none');
    document.documentElement.style.setProperty('--display3', 'none');
    document.documentElement.style.setProperty('--display4', 'none');
    document.documentElement.style.setProperty('--display5', 'block');
    document.documentElement.style.setProperty('--display6', 'none');
  });

  document.getElementById('grid-br').addEventListener("click", function(){
    document.documentElement.style.setProperty('--main-color', 'rgb(185, 185, 185)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(185, 185, 185, 0.3)');
    document.documentElement.style.setProperty('--display1', 'none');
    document.documentElement.style.setProperty('--display2', 'none');
    document.documentElement.style.setProperty('--display3', 'none');
    document.documentElement.style.setProperty('--display4', 'block');
    document.documentElement.style.setProperty('--display5', 'none');
    document.documentElement.style.setProperty('--display6', 'none');
  });

  /*export function Get_Coupon(){
    var cognitoUser_me2 = userPool.getCurrentUser(); 
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err)
      } else {
        cognitoUser_me2.getUserAttributes((err,result) => {
          if (err) {
            console.log(err)
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            };   
        
          };
        });
      };
    });
    const current_Date = get_current_Date();
    
    function getUniqueStr(myStrong){
      var strong = 1000;
      if (myStrong) strong = myStrong;
      return current_Date + Math.floor(strong*Math.random()).toString(16)
    }

    let Play_ID = getUniqueStr();


    if (!alert("○○のクーポンを獲得しました!!マイページで確認しましょう。")) {
      var coupon_params = {
        TableName: 'coupon',
        Item:{
          Play_ID: Play_ID,
          coupon_number: 1,
          content: "○○にて○○が○○パーセントオフ!",
          User_ID: currentUserData["sub"],
          available_or_used: "available",
          get_Date: current_Date
        }
      };

      docClient.put(coupon_params, function(err, data){
        if(err){
          console.log('error');
        }else{
          console.log('success');
        }
      });
    }
  }*/

  /*document.addEventListener('keyup', event => {
    if (event.code = "") {
      var cognitoUser_me2 = userPool.getCurrentUser(); 
      cognitoUser_me2.getSession((err, session) => {
        if (err) {
          console.log(err)
        } else {
          cognitoUser_me2.getUserAttributes((err,result) => {
            if (err) {
              console.log(err)
            } else {
              var i;
              for (i = 0; i < result.length; i++) {
                currentUserData[result[i].getName()] = result[i].getValue();
              };   
          
            };
          });
        };
      });
      const current_Date = get_current_Date();
      
      function getUniqueStr(myStrong){
        var strong = 1000;
        if (myStrong) strong = myStrong;
        return current_Date + Math.floor(strong*Math.random()).toString(16)
      }

      let Play_ID = getUniqueStr();


      if (!alert("○○のクーポンを獲得しました!!マイページで確認しましょう。")) {
        var coupon_params = {
          TableName: 'coupon',
          Item:{
            Play_ID: Play_ID,
            coupon_number: 1,
            content: "○○にて○○が○○パーセントオフ!",
            User_ID: currentUserData["sub"],
            available_or_used: "available",
            get_Date: current_Date
          }
        };
  
        docClient.put(coupon_params, function(err, data){
          if(err){
            console.log('error');
          }else{
            console.log('success');
          }
        });
      }
    };
  });*/

  document.addEventListener('keydown', event => {
    if (event.altKey && event.code === 'Slash') {
      var cognitoUser_me2 = userPool.getCurrentUser(); 
      cognitoUser_me2.getSession((err, session) => {
        if (err) {
          console.log(err)
        } else {
          cognitoUser_me2.getUserAttributes((err,result) => {
            if (err) {
              console.log(err)
            } else {
              console.log(result)
            };
          });
        };
      });
    }
    });
    
  /*function Use_Coupon(number) {
    console.log("aaa")
    const current_Date = get_current_Date();
    const coupon_table = document.getElementById("coupon_table");
    let interested_coupon = coupon_table.rows[number];
  
    // モーダルウィンドウと中身の要素を生成・クラスを付与
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal');
    const innerElement = document.createElement('div');
    innerElement.classList.add('inner');

    // モーダルウィンドウに表示する要素を記述
    innerElement.innerHTML = 
      "<h1>クーポン詳細</h1>" +
      "<p>獲得日時:" + interested_coupon.cells[2] + "</p>" + 
      "<p>クーポン内容:" + interested_coupon.cells[1] + "</p>" +
      '<input id="confirm_use_Coupon" type="button" value="使用する">' +
      '<input id="cancel_use_Coupon" type="button" value="キャンセル">'
    ;

    // モーダルウィンドウに中身を配置
    modalElement.appendChild(innerElement);
    document.body.appendChild(modalElement);

    // 中身をクリックしたらモーダルウィンドウを閉じる
    innerElement.addEventListener('click', () => {
      closeModal(modalElement);
    });

    function Confirm_Use_Coupon(number) {
      var confirmed_coupon = {
        TableName: 'coupon',
        Key:{//更新したい項目をプライマリキー(及びソートキー)によって１つ指定
          Play_ID: interested_coupon.cells[0]
        },
        ExpressionAttributeNames: {
          '#available_or_used': "available_or_used",
          '#used_Date' : 'used_Date'
        },
        ExpressionAttributeValues: {
          ':used': "used",
          ':used_Date' : current_Date
        },
        UpdateExpression: 'SET #available_or_used = :used, #used_Date = :used_Date'
      };
      docClient.update(confirmed_coupon, function(err, data2){
        if(err){
          console.log('error');
        }else{
          console.log('success');
        }
      });
    }
  }

  function closeModal(modalElement) {
    document.body.removeChild(modalElement);
  }*/

  const Game_Restart = document.getElementById("Game-Restart");
  const Game_Result = document.getElementById("Game-Result");
  const characterController = AFRAME.scenes[0].systems["hubs-systems"].characterController;
  Game_Restart.addEventListener("click", function(){
    Game_Result.style.display = "none";
    //const waypointSystem = scene.systems["hubs-systems"].waypointSystem;
    //waypointSystem.moveToSpawnPoint();
    //const Red_Progress = document.getElementById("Red-Container");
    //Red_Progress.value = 0;
    const gameSetTeam = document.getElementById("score-display-top").innerText;
    if (gameSetTeam = "BlueTeam") {
      let respawn_point1 = new THREE.Vector3(10.5, 4.5, -31);
      characterController.teleportTo(respawn_point1);
    } else {
      let respawn_point2 = new THREE.Vector3(116.5, 1, -8);
      characterController.teleportTo(respawn_point2);
    }
    scene.play();
  })
});
