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

const PHOENIX_RELIABLE_NAF = "phx-reliable";
NAF.options.firstSyncSource = PHOENIX_RELIABLE_NAF;
NAF.options.syncSource = PHOENIX_RELIABLE_NAF;

let isOAuthModal = false;


console.log(window.sessionStorage.length)


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

document.addEventListener("DOMContentLoaded", async () => {
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
    // We don't currently have an easy way to distinguish between being kicked (server closes socket)
    // and a variety of other network issues that seem to produce the 1000 closure code, but the
    // latter are probably more common. Either way, we just tell the user they got disconnected.
    const NORMAL_CLOSURE = 1000;

    if (e.code === NORMAL_CLOSURE && !isReloading) {
      entryManager.exitScene();
      remountUI({ roomUnavailableReason: ExitReason.disconnected });
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
    const params = {
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
            if (!hubChannel.presence.__hadInitialSync) return;

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
                  isSelf&&
                  currentMeta.presence !== meta.presence &&
                  meta.presence === "room" &&
                  meta.profile.displayName
                ) {
                  const naf_tree = Object.keys(NAF.connection.entities.entities)
                  let my_NAF_ID = "naf-" + naf_tree[naf_tree.length - 1];
                  sessionStorage.setItem(hubChannel.channel.joinPush.receivedResp.response.session_id, my_NAF_ID)
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
  })

  var Player_UI = document.getElementById("Player-UI");
 

  const lifeBar = document.getElementById('life-bar')         // ライフバー
  const lifeMark = document.getElementById('life-mark')       // ライフの光部分
  let life = 100                                              // ライフ初期値
  lifeBar.style.width = "100%"                                // ライフ初期幅

  setInterval(() => {
  life = life + 10;
  if ( life > 100 ) {
      life = 100
  }
  lifeBar.style.width = life + "%"
  },1500);

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
        lifeMark.style.visibility = 'hidden'
        Player_Respawn.style.display = "block";
        life = 100 ;
      }, 0)
      } else {
      // 算出の結果 100 を超過した場合
      if ( life > 100 ) {
          life = 100
      }
      // 光部分を表示する
      lifeMark.style.visibility = 'visible'
      }

      lifeBar.style.width = life + "%"
  }
  });

  ///////////////////////////
 var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.cipher.aes=function(a){this.s[0][0][0]||this.O();var b,c,d,e,f=this.s[0][4],g=this.s[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var a=this.s[0],b=this.s[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;0x100>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1)for(m=g^g<<1^g<<2^g<<3^g<<4,m=m>>8^m&255^99,c[f]=m,d[m]=f,n=h[e=h[l=h[f]]],p=0x1010101*n^0x10001*e^0x101*l^0x1010100*f,n=0x101*h[m]^0x1010100*m,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8;for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function t(a,b,c){if(4!==b.length)throw new sjcl.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,r=[0,0,0,0];h=a.s[c];a=h[0];var q=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],k=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],l=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=
0;4>m;m++)r[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return r}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.$(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.$(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},$:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},i:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(a,b,c){var d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f="",g=0,h=sjcl.codec.base32.B,k=0,l=sjcl.bitArray.bitLength(a);c&&(h=sjcl.codec.base32.X);for(c=0;f.length*d<l;)f+=h.charAt((k^a[c]>>>g)>>>e),g<d?(k=a[c]<<d-g,g+=e,c++):(k<<=d,g-=d);for(;f.length&7&&!b;)f+="=";return f},toBits:function(a,b){a=a.replace(/\s|=/g,"").toUpperCase();var c=sjcl.codec.base32.BITS,
d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f=[],g,h=0,k=sjcl.codec.base32.B,l=0,n,m="base32";b&&(k=sjcl.codec.base32.X,m="base32hex");for(g=0;g<a.length;g++){n=k.indexOf(a.charAt(g));if(0>n){if(!b)try{return sjcl.codec.base32hex.toBits(a)}catch(p){}throw new sjcl.exception.invalid("this isn't "+m+"!");}h>e?(h-=e,f.push(l^n>>>h),l=n<<c-h):(h+=d,l^=n<<c-h)}h&56&&f.push(sjcl.bitArray.partial(h&56,l,1));return f}};
sjcl.codec.base32hex={fromBits:function(a,b){return sjcl.codec.base32.fromBits(a,b,1)},toBits:function(a){return sjcl.codec.base32.toBits(a,1)}};
sjcl.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.B,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.B,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++){h=f.indexOf(a.charAt(d));
if(0>h)throw new sjcl.exception.invalid("this isn't base64!");26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e)}e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.O();a?(this.F=a.F.slice(0),this.A=a.A.slice(0),this.l=a.l):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.F=this.Y.slice(0);this.A=[];this.l=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.A=sjcl.bitArray.concat(this.A,a);b=this.l;a=this.l=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.A,c=this.F,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.l/0x100000000));for(b.push(this.l|0);b.length;)u(this,b.splice(0,16));this.reset();return c},Y:[],b:[],O:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}for(var b=0,c=2,d,e;64>b;c++){e=!0;for(d=2;d*d<=c;d++)if(0===c%d){e=
!1;break}e&&(8>b&&(this.Y[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};
function u(a,b){var c,d,e,f=a.F,g=a.b,h=f[0],k=f[1],l=f[2],n=f[3],m=f[4],p=f[5],r=f[6],q=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+q+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(r^m&(p^r))+g[c],q=r,r=p,p=m,m=n+d|0,n=l,l=k,k=h,h=d+(k&l^n&(k^l))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;f[0]=f[0]+h|0;f[1]=f[1]+k|0;f[2]=f[2]+l|0;f[3]=f[3]+n|0;f[4]=f[4]+m|0;f[5]=f[5]+p|0;f[6]=f[6]+r|0;f[7]=
f[7]+q|0}
sjcl.mode.ccm={name:"ccm",G:[],listenProgress:function(a){sjcl.mode.ccm.G.push(a)},unListenProgress:function(a){a=sjcl.mode.ccm.G.indexOf(a);-1<a&&sjcl.mode.ccm.G.splice(a,1)},fa:function(a){var b=sjcl.mode.ccm.G.slice(),c;for(c=0;c<b.length;c+=1)b[c](a)},encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];if(7>k)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,
8*(15-f));b=sjcl.mode.ccm.V(a,b,c,d,e,f);g=sjcl.mode.ccm.C(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,h-e),h=(h-e)/8;if(7>g)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl.mode.ccm.C(a,k,c,l,e,b);a=sjcl.mode.ccm.V(a,k.data,c,d,e,b);if(!f.equal(k.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");
return k.data},na:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,k=h.i;d=[h.partial(8,(b.length?64:0)|d-2<<2|f-1)];d=h.concat(d,c);d[3]|=e;d=a.encrypt(d);if(b.length)for(c=h.bitLength(b)/8,65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c])),g=h.concat(g,b),b=0;b<g.length;b+=4)d=a.encrypt(k(d,g.slice(b,b+4).concat([0,0,0])));return d},V:function(a,b,c,d,e,f){var g=sjcl.bitArray,h=g.i;e/=8;if(e%2||4>e||16<e)throw new sjcl.exception.invalid("ccm: invalid tag length");
if(0xffffffff<d.length||0xffffffff<b.length)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");c=sjcl.mode.ccm.na(a,d,c,e,g.bitLength(b)/8,f);for(d=0;d<b.length;d+=4)c=a.encrypt(h(c,b.slice(d,d+4).concat([0,0,0])));return g.clamp(c,8*e)},C:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.i;var k=b.length,l=h.bitLength(b),n=k/50,m=n;c=h.concat([h.partial(8,f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)g>n&&(sjcl.mode.ccm.fa(g/
k),n+=m),c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.S,k=sjcl.bitArray,l=k.i,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));
d.length&&(n=l(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.S,h=sjcl.bitArray,k=h.i,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,r=sjcl.bitArray.bitLength(b)-e,q=[];d=d||[];for(c=0;c+4<r/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),q=q.concat(m),n=g(n);p=r-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,
0,0]));l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl.mode.ocb2.pmac(a,d)));if(!h.equal(h.clamp(l,e),h.bitSlice(b,r)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return q.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.S,e=sjcl.bitArray,f=e.i,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);
return a.encrypt(f(d(f(h,d(h))),g))},S:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.C(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.C(!1,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return a.data},ka:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.i;e=[0,0,
0,0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.ka(b,a);return b},C:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,r,q=sjcl.bitArray;m=c.length;p=q.bitLength(c);r=q.bitLength(d);h=q.bitLength(e);
g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl.mode.gcm.j(g,[0,0,0,0],e),e=sjcl.mode.gcm.j(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.j(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.j(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=q.clamp(c,p);a&&(d=sjcl.mode.gcm.j(g,h,c));a=[Math.floor(r/0x100000000),r&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.j(g,d,a);k=b.encrypt(e);
d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.W=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.w=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.w[0].update(c[0]);this.w[1].update(c[1]);this.R=new b(this.w[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this.aa)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]);this.aa=!1};sjcl.misc.hmac.prototype.update=function(a){this.aa=!0;this.R.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.R.finalize(),a=(new this.W(this.w[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E4;if(0>d||0>c)throw new sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++)for(f=a.encrypt(f),h=0;h<f.length;h++)e[h]^=f[h];l=l.concat(e)}d&&(l=n.clamp(l,d));return l};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.m=[0];this.P=0;this.H={};this.N=0;this.U={};this.Z=this.f=this.o=this.ha=0;this.b=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.L=void 0;this.M=a;this.D=!1;this.K={progress:{},seeded:{}};this.u=this.ga=0;this.I=1;this.J=2;this.ca=0x10000;this.T=[0,48,64,96,128,192,0x100,384,512,768,1024];this.da=3E4;this.ba=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.u)throw new sjcl.exception.notReady("generator isn't seeded");if(d&this.J){d=!(d&this.I);e=[];var f=0,g;this.Z=e[0]=(new Date).valueOf()+this.da;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.m[g],this.m[g]=0,d||!(this.P&1<<g));g++);this.P>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.m.push(0));this.f-=f;f>this.o&&(this.o=
f);this.P++;this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.L=new sjcl.cipher.aes(this.b);for(d=0;4>d&&(this.h[d]=this.h[d]+1|0,!this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.ca&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=a},addEntropy:function(a,
b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.H[c],h=this.isReady(),k=0;d=this.U[c];void 0===d&&(d=this.U[c]=this.ha++);void 0===g&&(g=this.H[c]=0);this.H[c]=(this.H[c]+1)%this.c.length;switch(typeof a){case "number":void 0===b&&(b=1);this.c[g].update([d,this.N++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(k=1),c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&
(k=1);if(!k){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.N++,2,b,f,a.length].concat(a))}break;case "string":void 0===b&&(b=a.length);this.c[g].update([d,this.N++,3,b,f,a.length]);this.c[g].update(a);break;default:k=1}if(k)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.f+=b;h===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},
isReady:function(a){a=this.T[void 0!==a?a:this.M];return this.o&&this.o>=a?this.m[0]>this.ba&&(new Date).valueOf()>this.Z?this.J|this.I:this.I:this.f>=a?this.J|this.u:this.u},getProgress:function(a){a=this.T[a?a:this.M];return this.o>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.D){this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)};if(window.addEventListener)window.addEventListener("load",
this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl.exception.bug("can't attach event");
this.D=!0}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",
this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=!1)},addEventListener:function(a,b){this.K[a][this.ga++]=b},removeEventListener:function(a,b){var c,d,e=this.K[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},la:function(){C(this,1)},oa:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},qa:function(a){a=
a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},ma:function(){C(this,2)},ea:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};
function A(a,b){var c,d=sjcl.random.K[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy((new Date).valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.L=new sjcl.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.h[b]=a.h[b]+1|0,!a.h[b]);b++);return a.L.encrypt(a.h)}
function B(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var D,E,F,G;if(G="undefined"!==typeof module&&module.exports){var H;try{H=require("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array((new Uint8Array(D)).buffer),sjcl.random.addEntropy(D,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);
else break a;sjcl.random.addEntropy(F,1024,"crypto['getRandomValues']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}
sjcl.json={defaults:{v:1,iter:1E4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.g({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.g(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||
4<f.iv.length)throw new sjcl.exception.invalid("json encrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.g(d,f);d.key=a;f.ct="ccm"===f.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&
b instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.encrypt(g,b,f.iv,c,f.ts):sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,b,c,d){var e=sjcl.json,f=e.ja.apply(e,arguments);return e.encode(f)},ia:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.g(e.g(e.g({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===
typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)throw new sjcl.exception.invalid("json decrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f="ccm"===
b.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&b.ct instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.decrypt(g,b.ct,b.iv,b.tag,f,b.ts):sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.g(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.ia(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+
b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");
null!=d[3]?b[d[2]]=parseInt(d[3],10):null!=d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):null!=d[5]&&(b[d[2]]="true"===d[5])}return b},g:function(a,b,c){void 0===a&&(a={});if(void 0===b)return a;for(var d in b)if(b.hasOwnProperty(d)){if(c&&void 0!==a[d]&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},sa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ra:function(a,
b){var c={},d;for(d=0;d<b.length;d++)void 0!==a[b[d]]&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.pa={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.pa,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=void 0===b.salt?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)




  //////////////////////////

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


  document.getElementById('menu-button').addEventListener("click", function() {
    document.getElementById('menu-button').style.display ="none";
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

  document.getElementById('grid-tl').addEventListener("click", function() {
    main_contents1.classList.add("change_scene");
    main_contents2.classList.add("change_scene");
    document.documentElement.style.setProperty('--main-color', 'rgb(76, 183, 233)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(76, 183, 233, 0.3)');
    main_contents1.classList.remove("change_scene");
    main_contents2.classList.remove("change_scene");
  });

  document.getElementById('grid-tr').addEventListener("click", function(){
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 124, 124)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 124, 124, 0.3)');
  });

  document.getElementById('grid-ml').addEventListener("click", function() {
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 253, 108)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 253, 108, 0.3)');
  });

  document.getElementById('grid-mc').addEventListener("click", function() {
    document.getElementById('menu-button').style.display ="flex";
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
  });

  document.getElementById('grid-bl').addEventListener("click", function() {
    document.documentElement.style.setProperty('--main-color', 'rgb(255, 93, 215)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(255, 93, 215, 0.3)');
  });

  document.getElementById('grid-br').addEventListener("click", function(){
    document.documentElement.style.setProperty('--main-color', 'rgb(185, 185, 185)');
    document.documentElement.style.setProperty('--sub-color', 'rgb(185, 185, 185, 0.3)');
  });

  AWS.config.region = 'us-east-1'; // リージョン
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:3c01cde5-90e4-4518-b40f-1fc07ec39fa1',
  });

  var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
  });
  
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'demo-user',
    Key:{//取得したい項目をプライマリキー(及びソートキー)によって１つ指定
      username: "a"
    }
  };

  docClient.get(params, function(err, data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
    }
  });


  
  var region = 'us-east-1'; // 東京リージョン

  var IdentityPoolId = {
    AWS: 'us-east-1:3c01cde5-90e4-4518-b40f-1fc07ec39fa1', // <YOUR_IDENTITY_POOL_ID>
    AWSCognito: 'us-east-1_vARmK4mUU' // <YOUR_USER_POOL_ID>
  };

  var ClientId = '3mjhp0gn2hc39i9lrrfv953pam'; // アプリID

  ///////////////////

  var idp = ['cognito-idp', region, 'amazonaws', 'com'].join(".");
  var endpoint = [idp, IdentityPoolId.AWSCognito].join("/");

  // Initialize the Amazon Cognito credentials provider
  IdentityPoolId.AWS.config.region = region; // Region
  IdentityPoolId.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId.AWS
  });

  // Initialize the Amazon Cognito credentials provider
  AWSCognito.config.region = region; // Region
  AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId.AWSCognito
  });

  var data = {
    UserPoolId: IdentityPoolId.AWSCognito,
    ClientId: ClientId
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);

  var cognitoUser;

  function message(div, message_text, message_class) {
    div.text(message_text);
    div.addClass(message_class);
    div.show();
    setTimeout(function () {
      div.fadeOut();
      div.removeClass(message_class);
    }, 5000);
  }

  // Use case 1. Registering a user with the application.
  document.getElementById("user_add_btn").addEventListener("click", function() {
    var username = document.getElementById("inputUsername").value;
    var password = document.getElementById("inputPassword").value;

    var email = document.getElementById("inputEmail").value;
    var locale = document.getElementById("inputLocale").value;

    var attributeList = [];
    attributeList.push({Name: "email", Value: email});
    attributeList.push({Name: "locale", Value: locale});

    if (!username || !password) {
      return false;
    }

    userPool.signUp(username, password, attributeList, null, function (err, result) {
      if (err) {
        console.log(err);
        message(document.getElementById("message"), err, "alert-danger");
      } else {
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        var message_text = cognitoUser.getUsername() + "が作成されました";
        message(document.getElementById("message"), message_text, "alert-success");
      }
    });
  });
});
