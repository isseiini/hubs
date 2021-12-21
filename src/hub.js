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
  "use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
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

/*!
 * Copyright 2016 Amazon.com,
 * Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the
 * License. A copy of the License is located at
 * 
 *     http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, express or implied. See the License
 * for the specific language governing permissions and
 * limitations under the License. 
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("aws-sdk/global"),require("aws-sdk/clients/cognitoidentityserviceprovider")):"function"==typeof define&&define.amd?define(["aws-sdk/global","aws-sdk/clients/cognitoidentityserviceprovider"],t):"object"==typeof exports?exports.AmazonCognitoIdentity=t(require("aws-sdk/global"),require("aws-sdk/clients/cognitoidentityserviceprovider")):e.AmazonCognitoIdentity=t(e.AWSCognito,e.AWSCognito.CognitoIdentityServiceProvider)}(this,function(e,t){return function(e){function t(i){if(n[i])return n[i].exports;var s=n[i]={exports:{},id:i,loaded:!1};return e[i].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function s(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=n(17);Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var r=n(13),a=s(r),u=i(o);Object.keys(u).forEach(function(e){a.default[e]=u[e]})},function(t,n){t.exports=e},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(1),r=n(3),a=i(r),u="FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF",c="userAttributes.",l=function(){function e(t){s(this,e),this.N=new a.default(u,16),this.g=new a.default("2",16),this.k=new a.default(this.hexHash("00"+this.N.toString(16)+"0"+this.g.toString(16)),16),this.smallAValue=this.generateRandomSmallA(),this.getLargeAValue(function(){}),this.infoBits=new o.util.Buffer("Caldera Derived Key","utf8"),this.poolName=t}return e.prototype.getSmallAValue=function(){return this.smallAValue},e.prototype.getLargeAValue=function(e){var t=this;this.largeAValue?e(null,this.largeAValue):this.calculateA(this.smallAValue,function(n,i){n&&e(n,null),t.largeAValue=i,e(null,t.largeAValue)})},e.prototype.generateRandomSmallA=function(){var e=o.util.crypto.lib.randomBytes(128).toString("hex"),t=new a.default(e,16),n=t.mod(this.N);return n},e.prototype.generateRandomString=function(){return o.util.crypto.lib.randomBytes(40).toString("base64")},e.prototype.getRandomPassword=function(){return this.randomPassword},e.prototype.getSaltDevices=function(){return this.SaltToHashDevices},e.prototype.getVerifierDevices=function(){return this.verifierDevices},e.prototype.generateHashDevice=function(e,t,n){var i=this;this.randomPassword=this.generateRandomString();var s=""+e+t+":"+this.randomPassword,r=this.hash(s),u=o.util.crypto.lib.randomBytes(16).toString("hex");this.SaltToHashDevices=this.padHex(new a.default(u,16)),this.g.modPow(new a.default(this.hexHash(this.SaltToHashDevices+r),16),this.N,function(e,t){e&&n(e,null),i.verifierDevices=i.padHex(t),n(null,null)})},e.prototype.calculateA=function(e,t){var n=this;this.g.modPow(e,this.N,function(e,i){e&&t(e,null),i.mod(n.N).equals(a.default.ZERO)&&t(new Error("Illegal paramater. A mod N cannot be 0."),null),t(null,i)})},e.prototype.calculateU=function(e,t){this.UHexHash=this.hexHash(this.padHex(e)+this.padHex(t));var n=new a.default(this.UHexHash,16);return n},e.prototype.hash=function(e){var t=o.util.crypto.sha256(e,"hex");return new Array(64-t.length).join("0")+t},e.prototype.hexHash=function(e){return this.hash(new o.util.Buffer(e,"hex"))},e.prototype.computehkdf=function(e,t){var n=o.util.crypto.hmac(t,e,"buffer","sha256"),i=o.util.buffer.concat([this.infoBits,new o.util.Buffer(String.fromCharCode(1),"utf8")]),s=o.util.crypto.hmac(n,i,"buffer","sha256");return s.slice(0,16)},e.prototype.getPasswordAuthenticationKey=function(e,t,n,i,s){var r=this;if(n.mod(this.N).equals(a.default.ZERO))throw new Error("B cannot be zero.");if(this.UValue=this.calculateU(this.largeAValue,n),this.UValue.equals(a.default.ZERO))throw new Error("U cannot be zero.");var u=""+this.poolName+e+":"+t,c=this.hash(u),l=new a.default(this.hexHash(this.padHex(i)+c),16);this.calculateS(l,n,function(e,t){e&&s(e,null);var n=r.computehkdf(new o.util.Buffer(r.padHex(t),"hex"),new o.util.Buffer(r.padHex(r.UValue.toString(16)),"hex"));s(null,n)})},e.prototype.calculateS=function(e,t,n){var i=this;this.g.modPow(e,this.N,function(s,o){s&&n(s,null);var r=t.subtract(i.k.multiply(o));r.modPow(i.smallAValue.add(i.UValue.multiply(e)),i.N,function(e,t){e&&n(e,null),n(null,t.mod(i.N))})})},e.prototype.getNewPasswordRequiredChallengeUserAttributePrefix=function(){return c},e.prototype.padHex=function(e){var t=e.toString(16);return t.length%2===1?t="0"+t:"89ABCDEFabcdef".indexOf(t[0])!==-1&&(t="00"+t),t},e}();t.default=l},function(e,t){"use strict";function n(e,t){null!=e&&this.fromString(e,t)}function i(){return new n(null)}function s(e,t,n,i,s,o){for(;--o>=0;){var r=t*this[e++]+n[i]+s;s=Math.floor(r/67108864),n[i++]=67108863&r}return s}function o(e,t,n,i,s,o){for(var r=32767&t,a=t>>15;--o>=0;){var u=32767&this[e],c=this[e++]>>15,l=a*u+c*r;u=r*u+((32767&l)<<15)+n[i]+(1073741823&s),s=(u>>>30)+(l>>>15)+a*c+(s>>>30),n[i++]=1073741823&u}return s}function r(e,t,n,i,s,o){for(var r=16383&t,a=t>>14;--o>=0;){var u=16383&this[e],c=this[e++]>>14,l=a*u+c*r;u=r*u+((16383&l)<<14)+n[i]+s,s=(u>>28)+(l>>14)+a*c,n[i++]=268435455&u}return s}function a(e){return z.charAt(e)}function u(e,t){var n=Q[e.charCodeAt(t)];return null==n?-1:n}function c(e){for(var t=this.t-1;t>=0;--t)e[t]=this[t];e.t=this.t,e.s=this.s}function l(e){this.t=1,this.s=e<0?-1:0,e>0?this[0]=e:e<-1?this[0]=e+this.DV:this.t=0}function h(e){var t=i();return t.fromInt(e),t}function f(e,t){var i;if(16==t)i=4;else if(8==t)i=3;else if(2==t)i=1;else if(32==t)i=5;else{if(4!=t)throw new Error("Only radix 2, 4, 8, 16, 32 are supported");i=2}this.t=0,this.s=0;for(var s=e.length,o=!1,r=0;--s>=0;){var a=u(e,s);a<0?"-"==e.charAt(s)&&(o=!0):(o=!1,0==r?this[this.t++]=a:r+i>this.DB?(this[this.t-1]|=(a&(1<<this.DB-r)-1)<<r,this[this.t++]=a>>this.DB-r):this[this.t-1]|=a<<r,r+=i,r>=this.DB&&(r-=this.DB))}this.clamp(),o&&n.ZERO.subTo(this,this)}function d(){for(var e=this.s&this.DM;this.t>0&&this[this.t-1]==e;)--this.t}function p(e){if(this.s<0)return"-"+this.negate().toString();var t;if(16==e)t=4;else if(8==e)t=3;else if(2==e)t=1;else if(32==e)t=5;else{if(4!=e)throw new Error("Only radix 2, 4, 8, 16, 32 are supported");t=2}var n,i=(1<<t)-1,s=!1,o="",r=this.t,u=this.DB-r*this.DB%t;if(r-- >0)for(u<this.DB&&(n=this[r]>>u)>0&&(s=!0,o=a(n));r>=0;)u<t?(n=(this[r]&(1<<u)-1)<<t-u,n|=this[--r]>>(u+=this.DB-t)):(n=this[r]>>(u-=t)&i,u<=0&&(u+=this.DB,--r)),n>0&&(s=!0),s&&(o+=a(n));return s?o:"0"}function g(){var e=i();return n.ZERO.subTo(this,e),e}function v(){return this.s<0?this.negate():this}function S(e){var t=this.s-e.s;if(0!=t)return t;var n=this.t;if(t=n-e.t,0!=t)return this.s<0?-t:t;for(;--n>=0;)if(0!=(t=this[n]-e[n]))return t;return 0}function m(e){var t,n=1;return 0!=(t=e>>>16)&&(e=t,n+=16),0!=(t=e>>8)&&(e=t,n+=8),0!=(t=e>>4)&&(e=t,n+=4),0!=(t=e>>2)&&(e=t,n+=2),0!=(t=e>>1)&&(e=t,n+=1),n}function C(){return this.t<=0?0:this.DB*(this.t-1)+m(this[this.t-1]^this.s&this.DM)}function y(e,t){var n;for(n=this.t-1;n>=0;--n)t[n+e]=this[n];for(n=e-1;n>=0;--n)t[n]=0;t.t=this.t+e,t.s=this.s}function U(e,t){for(var n=e;n<this.t;++n)t[n-e]=this[n];t.t=Math.max(this.t-e,0),t.s=this.s}function A(e,t){var n,i=e%this.DB,s=this.DB-i,o=(1<<s)-1,r=Math.floor(e/this.DB),a=this.s<<i&this.DM;for(n=this.t-1;n>=0;--n)t[n+r+1]=this[n]>>s|a,a=(this[n]&o)<<i;for(n=r-1;n>=0;--n)t[n]=0;t[r]=a,t.t=this.t+r+1,t.s=this.s,t.clamp()}function w(e,t){t.s=this.s;var n=Math.floor(e/this.DB);if(n>=this.t)return void(t.t=0);var i=e%this.DB,s=this.DB-i,o=(1<<i)-1;t[0]=this[n]>>i;for(var r=n+1;r<this.t;++r)t[r-n-1]|=(this[r]&o)<<s,t[r-n]=this[r]>>i;i>0&&(t[this.t-n-1]|=(this.s&o)<<s),t.t=this.t-n,t.clamp()}function T(e,t){for(var n=0,i=0,s=Math.min(e.t,this.t);n<s;)i+=this[n]-e[n],t[n++]=i&this.DM,i>>=this.DB;if(e.t<this.t){for(i-=e.s;n<this.t;)i+=this[n],t[n++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;n<e.t;)i-=e[n],t[n++]=i&this.DM,i>>=this.DB;i-=e.s}t.s=i<0?-1:0,i<-1?t[n++]=this.DV+i:i>0&&(t[n++]=i),t.t=n,t.clamp()}function D(e,t){var i=this.abs(),s=e.abs(),o=i.t;for(t.t=o+s.t;--o>=0;)t[o]=0;for(o=0;o<s.t;++o)t[o+i.t]=i.am(0,s[o],t,o,0,i.t);t.s=0,t.clamp(),this.s!=e.s&&n.ZERO.subTo(t,t)}function E(e){for(var t=this.abs(),n=e.t=2*t.t;--n>=0;)e[n]=0;for(n=0;n<t.t-1;++n){var i=t.am(n,t[n],e,2*n,0,1);(e[n+t.t]+=t.am(n+1,2*t[n],e,2*n+1,i,t.t-n-1))>=t.DV&&(e[n+t.t]-=t.DV,e[n+t.t+1]=1)}e.t>0&&(e[e.t-1]+=t.am(n,t[n],e,2*n,0,1)),e.s=0,e.clamp()}function I(e,t,s){var o=e.abs();if(!(o.t<=0)){var r=this.abs();if(r.t<o.t)return null!=t&&t.fromInt(0),void(null!=s&&this.copyTo(s));null==s&&(s=i());var a=i(),u=this.s,c=e.s,l=this.DB-m(o[o.t-1]);l>0?(o.lShiftTo(l,a),r.lShiftTo(l,s)):(o.copyTo(a),r.copyTo(s));var h=a.t,f=a[h-1];if(0!=f){var d=f*(1<<this.F1)+(h>1?a[h-2]>>this.F2:0),p=this.FV/d,g=(1<<this.F1)/d,v=1<<this.F2,S=s.t,C=S-h,y=null==t?i():t;for(a.dlShiftTo(C,y),s.compareTo(y)>=0&&(s[s.t++]=1,s.subTo(y,s)),n.ONE.dlShiftTo(h,y),y.subTo(a,a);a.t<h;)a[a.t++]=0;for(;--C>=0;){var U=s[--S]==f?this.DM:Math.floor(s[S]*p+(s[S-1]+v)*g);if((s[S]+=a.am(0,U,s,C,0,h))<U)for(a.dlShiftTo(C,y),s.subTo(y,s);s[S]<--U;)s.subTo(y,s)}null!=t&&(s.drShiftTo(h,t),u!=c&&n.ZERO.subTo(t,t)),s.t=h,s.clamp(),l>0&&s.rShiftTo(l,s),u<0&&n.ZERO.subTo(s,s)}}}function k(e){var t=i();return this.abs().divRemTo(e,null,t),this.s<0&&t.compareTo(n.ZERO)>0&&e.subTo(t,t),t}function R(){if(this.t<1)return 0;var e=this[0];if(0==(1&e))return 0;var t=3&e;return t=t*(2-(15&e)*t)&15,t=t*(2-(255&e)*t)&255,t=t*(2-((65535&e)*t&65535))&65535,t=t*(2-e*t%this.DV)%this.DV,t>0?this.DV-t:-t}function F(e){return 0==this.compareTo(e)}function P(e,t){for(var n=0,i=0,s=Math.min(e.t,this.t);n<s;)i+=this[n]+e[n],t[n++]=i&this.DM,i>>=this.DB;if(e.t<this.t){for(i+=e.s;n<this.t;)i+=this[n],t[n++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;n<e.t;)i+=e[n],t[n++]=i&this.DM,i>>=this.DB;i+=e.s}t.s=i<0?-1:0,i>0?t[n++]=i:i<-1&&(t[n++]=this.DV+i),t.t=n,t.clamp()}function b(e){var t=i();return this.addTo(e,t),t}function _(e){var t=i();return this.subTo(e,t),t}function M(e){var t=i();return this.multiplyTo(e,t),t}function x(e){var t=i();return this.divRemTo(e,t,null),t}function N(e){this.m=e,this.mp=e.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<e.DB-15)-1,this.mt2=2*e.t}function B(e){var t=i();return e.abs().dlShiftTo(this.m.t,t),t.divRemTo(this.m,null,t),e.s<0&&t.compareTo(n.ZERO)>0&&this.m.subTo(t,t),t}function O(e){var t=i();return e.copyTo(t),this.reduce(t),t}function V(e){for(;e.t<=this.mt2;)e[e.t++]=0;for(var t=0;t<this.m.t;++t){var n=32767&e[t],i=n*this.mpl+((n*this.mph+(e[t]>>15)*this.mpl&this.um)<<15)&e.DM;for(n=t+this.m.t,e[n]+=this.m.am(0,i,e,t,0,this.m.t);e[n]>=e.DV;)e[n]-=e.DV,e[++n]++}e.clamp(),e.drShiftTo(this.m.t,e),e.compareTo(this.m)>=0&&e.subTo(this.m,e)}function K(e,t){e.squareTo(t),this.reduce(t)}function q(e,t,n){e.multiplyTo(t,n),this.reduce(n)}function j(e,t,n){var s,o=e.bitLength(),r=h(1),a=new N(t);if(o<=0)return r;s=o<18?1:o<48?3:o<144?4:o<768?5:6;var u=new Array,c=3,l=s-1,f=(1<<s)-1;if(u[1]=a.convert(this),s>1){var d=i();for(a.sqrTo(u[1],d);c<=f;)u[c]=i(),a.mulTo(d,u[c-2],u[c]),c+=2}var p,g,v=e.t-1,S=!0,C=i();for(o=m(e[v])-1;v>=0;){for(o>=l?p=e[v]>>o-l&f:(p=(e[v]&(1<<o+1)-1)<<l-o,v>0&&(p|=e[v-1]>>this.DB+o-l)),c=s;0==(1&p);)p>>=1,--c;if((o-=c)<0&&(o+=this.DB,--v),S)u[p].copyTo(r),S=!1;else{for(;c>1;)a.sqrTo(r,C),a.sqrTo(C,r),c-=2;c>0?a.sqrTo(r,C):(g=r,r=C,C=g),a.mulTo(C,u[p],r)}for(;v>=0&&0==(e[v]&1<<o);)a.sqrTo(r,C),g=r,r=C,C=g,--o<0&&(o=this.DB-1,--v)}var y=a.revert(r);return n(null,y),y}t.__esModule=!0,t.default=n;var H,J=0xdeadbeefcafe,L=15715070==(16777215&J),W="undefined"!=typeof navigator;W&&L&&"Microsoft Internet Explorer"==navigator.appName?(n.prototype.am=o,H=30):W&&L&&"Netscape"!=navigator.appName?(n.prototype.am=s,H=26):(n.prototype.am=r,H=28),n.prototype.DB=H,n.prototype.DM=(1<<H)-1,n.prototype.DV=1<<H;var G=52;n.prototype.FV=Math.pow(2,G),n.prototype.F1=G-H,n.prototype.F2=2*H-G;var Z,Y,z="0123456789abcdefghijklmnopqrstuvwxyz",Q=new Array;for(Z="0".charCodeAt(0),Y=0;Y<=9;++Y)Q[Z++]=Y;for(Z="a".charCodeAt(0),Y=10;Y<36;++Y)Q[Z++]=Y;for(Z="A".charCodeAt(0),Y=10;Y<36;++Y)Q[Z++]=Y;N.prototype.convert=B,N.prototype.revert=O,N.prototype.reduce=V,N.prototype.mulTo=q,N.prototype.sqrTo=K,n.prototype.copyTo=c,n.prototype.fromInt=l,n.prototype.fromString=f,n.prototype.clamp=d,n.prototype.dlShiftTo=y,n.prototype.drShiftTo=U,n.prototype.lShiftTo=A,n.prototype.rShiftTo=w,n.prototype.subTo=T,n.prototype.multiplyTo=D,n.prototype.squareTo=E,n.prototype.divRemTo=I,n.prototype.invDigit=R,n.prototype.addTo=P,n.prototype.toString=p,n.prototype.negate=g,n.prototype.abs=v,n.prototype.compareTo=S,n.prototype.bitLength=C,n.prototype.mod=k,n.prototype.equals=F,n.prototype.add=b,n.prototype.subtract=_,n.prototype.multiply=M,n.prototype.divide=x,n.prototype.modPow=j,n.ZERO=h(0),n.ONE=h(1)},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var a=n(6),u=i(a),c=function(e){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=n.AccessToken;return s(this,t),o(this,e.call(this,i||""))}return r(t,e),t}(u.default);t.default=c},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var a=n(6),u=i(a),c=function(e){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=n.IdToken;return s(this,t),o(this,e.call(this,i||""))}return r(t,e),t}(u.default);t.default=c},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s=n(1),o=function(){function e(t){i(this,e),this.jwtToken=t||"",this.payload=this.decodePayload()}return e.prototype.getJwtToken=function(){return this.jwtToken},e.prototype.getExpiration=function(){return this.payload.exp},e.prototype.getIssuedAt=function(){return this.payload.iat},e.prototype.decodePayload=function(){var e=this.jwtToken.split(".")[1];try{return JSON.parse(s.util.base64.decode(e).toString("utf8"))}catch(e){return{}}},e}();t.default=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=t.RefreshToken;n(this,e),this.token=i||""}return e.prototype.getToken=function(){return this.token},e}();t.default=i},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(1),r=n(3),a=i(r),u=n(2),c=i(u),l=n(4),h=i(l),f=n(5),d=i(f),p=n(7),g=i(p),v=n(10),S=i(v),m=n(11),C=i(m),y=n(9),U=i(y),A=n(12),w=i(A),T=function(){function e(t){if(s(this,e),null==t||null==t.Username||null==t.Pool)throw new Error("Username and pool information are required.");this.username=t.Username||"",this.pool=t.Pool,this.Session=null,this.client=t.Pool.client,this.signInUserSession=null,this.authenticationFlowType="USER_SRP_AUTH",this.storage=t.Storage||(new w.default).getStorage()}return e.prototype.setSignInUserSession=function(e){this.clearCachedTokens(),this.signInUserSession=e,this.cacheTokens()},e.prototype.getSignInUserSession=function(){return this.signInUserSession},e.prototype.getUsername=function(){return this.username},e.prototype.getAuthenticationFlowType=function(){return this.authenticationFlowType},e.prototype.setAuthenticationFlowType=function(e){this.authenticationFlowType=e},e.prototype.initiateAuth=function(e,t){var n=this,i=e.getAuthParameters();i.USERNAME=this.username;var s={AuthFlow:"CUSTOM_AUTH",ClientId:this.pool.getClientId(),AuthParameters:i,ClientMetadata:e.getValidationData()};this.getUserContextData()&&(s.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("initiateAuth",s,function(e,i){if(e)return t.onFailure(e);var s=i.ChallengeName,o=i.ChallengeParameters;return"CUSTOM_CHALLENGE"===s?(n.Session=i.Session,t.customChallenge(o)):(n.signInUserSession=n.getCognitoUserSession(i.AuthenticationResult),n.cacheTokens(),t.onSuccess(n.signInUserSession))})},e.prototype.authenticateUser=function(e,t){var n=this,i=new c.default(this.pool.getUserPoolId().split("_")[1]),s=new C.default,r=void 0,u=void 0,l={};null!=this.deviceKey&&(l.DEVICE_KEY=this.deviceKey),l.USERNAME=this.username,i.getLargeAValue(function(c,h){c&&t.onFailure(c),l.SRP_A=h.toString(16),"CUSTOM_AUTH"===n.authenticationFlowType&&(l.CHALLENGE_NAME="SRP_A");var f={AuthFlow:n.authenticationFlowType,ClientId:n.pool.getClientId(),AuthParameters:l,ClientMetadata:e.getValidationData()};n.getUserContextData(n.username)&&(f.UserContextData=n.getUserContextData(n.username)),n.client.makeUnauthenticatedRequest("initiateAuth",f,function(c,l){if(c)return t.onFailure(c);var h=l.ChallengeParameters;n.username=h.USER_ID_FOR_SRP,r=new a.default(h.SRP_B,16),u=new a.default(h.SALT,16),n.getCachedDeviceKeyAndPassword(),i.getPasswordAuthenticationKey(n.username,e.getPassword(),r,u,function(e,r){e&&t.onFailure(e);var a=s.getNowString(),u=o.util.crypto.hmac(r,o.util.buffer.concat([new o.util.Buffer(n.pool.getUserPoolId().split("_")[1],"utf8"),new o.util.Buffer(n.username,"utf8"),new o.util.Buffer(h.SECRET_BLOCK,"base64"),new o.util.Buffer(a,"utf8")]),"base64","sha256"),c={};c.USERNAME=n.username,c.PASSWORD_CLAIM_SECRET_BLOCK=h.SECRET_BLOCK,c.TIMESTAMP=a,c.PASSWORD_CLAIM_SIGNATURE=u,null!=n.deviceKey&&(c.DEVICE_KEY=n.deviceKey);var f=function e(t,i){return n.client.makeUnauthenticatedRequest("respondToAuthChallenge",t,function(s,o){return s&&"ResourceNotFoundException"===s.code&&s.message.toLowerCase().indexOf("device")!==-1?(c.DEVICE_KEY=null,n.deviceKey=null,n.randomPassword=null,n.deviceGroupKey=null,n.clearCachedDeviceKeyAndPassword(),e(t,i)):i(s,o)})},d={ChallengeName:"PASSWORD_VERIFIER",ClientId:n.pool.getClientId(),ChallengeResponses:c,Session:l.Session};n.getUserContextData()&&(d.UserContextData=n.getUserContextData()),f(d,function(e,s){if(e)return t.onFailure(e);var o=s.ChallengeName;if("NEW_PASSWORD_REQUIRED"===o){n.Session=s.Session;var r=null,a=null,u=[],c=i.getNewPasswordRequiredChallengeUserAttributePrefix();if(s.ChallengeParameters&&(r=JSON.parse(s.ChallengeParameters.userAttributes),a=JSON.parse(s.ChallengeParameters.requiredAttributes)),a)for(var l=0;l<a.length;l++)u[l]=a[l].substr(c.length);return t.newPasswordRequired(r,u)}return n.authenticateUserInternal(s,i,t)})})})})},e.prototype.authenticateUserInternal=function(e,t,n){var i=this,s=e.ChallengeName,r=e.ChallengeParameters;if("SMS_MFA"===s)return this.Session=e.Session,n.mfaRequired(s,r);if("SELECT_MFA_TYPE"===s)return this.Session=e.Session,n.selectMFAType(s,r);if("MFA_SETUP"===s)return this.Session=e.Session,n.mfaSetup(s,r);if("SOFTWARE_TOKEN_MFA"===s)return this.Session=e.Session,n.totpRequired(s,r);if("CUSTOM_CHALLENGE"===s)return this.Session=e.Session,n.customChallenge(r);if("DEVICE_SRP_AUTH"===s)return void this.getDeviceResponse(n);this.signInUserSession=this.getCognitoUserSession(e.AuthenticationResult),this.cacheTokens();var a=e.AuthenticationResult.NewDeviceMetadata;return null==a?n.onSuccess(this.signInUserSession):void t.generateHashDevice(e.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey,e.AuthenticationResult.NewDeviceMetadata.DeviceKey,function(s){if(s)return n.onFailure(s);var r={Salt:new o.util.Buffer(t.getSaltDevices(),"hex").toString("base64"),PasswordVerifier:new o.util.Buffer(t.getVerifierDevices(),"hex").toString("base64")};i.verifierDevices=r.PasswordVerifier,i.deviceGroupKey=a.DeviceGroupKey,i.randomPassword=t.getRandomPassword(),i.client.makeUnauthenticatedRequest("confirmDevice",{DeviceKey:a.DeviceKey,AccessToken:i.signInUserSession.getAccessToken().getJwtToken(),DeviceSecretVerifierConfig:r,DeviceName:navigator.userAgent},function(t,s){return t?n.onFailure(t):(i.deviceKey=e.AuthenticationResult.NewDeviceMetadata.DeviceKey,i.cacheDeviceKeyAndPassword(),s.UserConfirmationNecessary===!0?n.onSuccess(i.signInUserSession,s.UserConfirmationNecessary):n.onSuccess(i.signInUserSession))})})},e.prototype.completeNewPasswordChallenge=function(e,t,n){var i=this;if(!e)return n.onFailure(new Error("New password is required."));var s=new c.default(this.pool.getUserPoolId().split("_")[1]),o=s.getNewPasswordRequiredChallengeUserAttributePrefix(),r={};t&&Object.keys(t).forEach(function(e){r[o+e]=t[e]}),r.NEW_PASSWORD=e,r.USERNAME=this.username;var a={ChallengeName:"NEW_PASSWORD_REQUIRED",ClientId:this.pool.getClientId(),ChallengeResponses:r,Session:this.Session};this.getUserContextData()&&(a.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("respondToAuthChallenge",a,function(e,t){return e?n.onFailure(e):i.authenticateUserInternal(t,s,n)})},e.prototype.getDeviceResponse=function(e){var t=this,n=new c.default(this.deviceGroupKey),i=new C.default,s={};s.USERNAME=this.username,s.DEVICE_KEY=this.deviceKey,n.getLargeAValue(function(r,u){r&&e.onFailure(r),s.SRP_A=u.toString(16);var c={ChallengeName:"DEVICE_SRP_AUTH",ClientId:t.pool.getClientId(),ChallengeResponses:s};t.getUserContextData()&&(c.UserContextData=t.getUserContextData()),t.client.makeUnauthenticatedRequest("respondToAuthChallenge",c,function(s,r){if(s)return e.onFailure(s);var u=r.ChallengeParameters,c=new a.default(u.SRP_B,16),l=new a.default(u.SALT,16);n.getPasswordAuthenticationKey(t.deviceKey,t.randomPassword,c,l,function(n,s){if(n)return e.onFailure(n);var a=i.getNowString(),c=o.util.crypto.hmac(s,o.util.buffer.concat([new o.util.Buffer(t.deviceGroupKey,"utf8"),new o.util.Buffer(t.deviceKey,"utf8"),new o.util.Buffer(u.SECRET_BLOCK,"base64"),new o.util.Buffer(a,"utf8")]),"base64","sha256"),l={};l.USERNAME=t.username,l.PASSWORD_CLAIM_SECRET_BLOCK=u.SECRET_BLOCK,l.TIMESTAMP=a,l.PASSWORD_CLAIM_SIGNATURE=c,l.DEVICE_KEY=t.deviceKey;var h={ChallengeName:"DEVICE_PASSWORD_VERIFIER",ClientId:t.pool.getClientId(),ChallengeResponses:l,Session:r.Session};t.getUserContextData()&&(h.UserContextData=t.getUserContextData()),t.client.makeUnauthenticatedRequest("respondToAuthChallenge",h,function(n,i){return n?e.onFailure(n):(t.signInUserSession=t.getCognitoUserSession(i.AuthenticationResult),t.cacheTokens(),e.onSuccess(t.signInUserSession))})})})})},e.prototype.confirmRegistration=function(e,t,n){var i={ClientId:this.pool.getClientId(),ConfirmationCode:e,Username:this.username,ForceAliasCreation:t};this.getUserContextData()&&(i.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("confirmSignUp",i,function(e){return e?n(e,null):n(null,"SUCCESS")})},e.prototype.sendCustomChallengeAnswer=function(e,t){var n=this,i={};i.USERNAME=this.username,i.ANSWER=e;var s=new c.default(this.pool.getUserPoolId().split("_")[1]);this.getCachedDeviceKeyAndPassword(),null!=this.deviceKey&&(i.DEVICE_KEY=this.deviceKey);var o={ChallengeName:"CUSTOM_CHALLENGE",ChallengeResponses:i,ClientId:this.pool.getClientId(),Session:this.Session};this.getUserContextData()&&(o.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("respondToAuthChallenge",o,function(e,i){return e?t.onFailure(e):n.authenticateUserInternal(i,s,t)})},e.prototype.sendMFACode=function(e,t,n){var i=this,s={};s.USERNAME=this.username,s.SMS_MFA_CODE=e;var r=n||"SMS_MFA";"SOFTWARE_TOKEN_MFA"===r&&(s.SOFTWARE_TOKEN_MFA_CODE=e),null!=this.deviceKey&&(s.DEVICE_KEY=this.deviceKey);var a={ChallengeName:r,ChallengeResponses:s,ClientId:this.pool.getClientId(),Session:this.Session};this.getUserContextData()&&(a.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("respondToAuthChallenge",a,function(e,n){if(e)return t.onFailure(e);var s=n.ChallengeName;if("DEVICE_SRP_AUTH"===s)return void i.getDeviceResponse(t);if(i.signInUserSession=i.getCognitoUserSession(n.AuthenticationResult),i.cacheTokens(),null==n.AuthenticationResult.NewDeviceMetadata)return t.onSuccess(i.signInUserSession);var r=new c.default(i.pool.getUserPoolId().split("_")[1]);r.generateHashDevice(n.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey,n.AuthenticationResult.NewDeviceMetadata.DeviceKey,function(e){if(e)return t.onFailure(e);var s={Salt:new o.util.Buffer(r.getSaltDevices(),"hex").toString("base64"),PasswordVerifier:new o.util.Buffer(r.getVerifierDevices(),"hex").toString("base64")};i.verifierDevices=s.PasswordVerifier,i.deviceGroupKey=n.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey,i.randomPassword=r.getRandomPassword(),i.client.makeUnauthenticatedRequest("confirmDevice",{DeviceKey:n.AuthenticationResult.NewDeviceMetadata.DeviceKey,AccessToken:i.signInUserSession.getAccessToken().getJwtToken(),DeviceSecretVerifierConfig:s,DeviceName:navigator.userAgent},function(e,s){return e?t.onFailure(e):(i.deviceKey=n.AuthenticationResult.NewDeviceMetadata.DeviceKey,i.cacheDeviceKeyAndPassword(),s.UserConfirmationNecessary===!0?t.onSuccess(i.signInUserSession,s.UserConfirmationNecessary):t.onSuccess(i.signInUserSession))})})})},e.prototype.changePassword=function(e,t,n){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("changePassword",{PreviousPassword:e,ProposedPassword:t,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(e){return e?n(e,null):n(null,"SUCCESS")}):n(new Error("User is not authenticated"),null)},e.prototype.enableMFA=function(e){if(null==this.signInUserSession||!this.signInUserSession.isValid())return e(new Error("User is not authenticated"),null);var t=[],n={DeliveryMedium:"SMS",AttributeName:"phone_number"};t.push(n),this.client.makeUnauthenticatedRequest("setUserSettings",{MFAOptions:t,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(t){return t?e(t,null):e(null,"SUCCESS")})},e.prototype.setUserMfaPreference=function(e,t,n){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("setUserMFAPreference",{SMSMfaSettings:e,SoftwareTokenMfaSettings:t,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(e){return e?n(e,null):n(null,"SUCCESS")}):n(new Error("User is not authenticated"),null)},e.prototype.disableMFA=function(e){if(null==this.signInUserSession||!this.signInUserSession.isValid())return e(new Error("User is not authenticated"),null);var t=[];this.client.makeUnauthenticatedRequest("setUserSettings",{MFAOptions:t,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(t){return t?e(t,null):e(null,"SUCCESS")})},e.prototype.deleteUser=function(e){var t=this;return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("deleteUser",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(n){return n?e(n,null):(t.clearCachedTokens(),e(null,"SUCCESS"))}):e(new Error("User is not authenticated"),null)},e.prototype.updateAttributes=function(e,t){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("updateUserAttributes",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),UserAttributes:e},function(e){return e?t(e,null):t(null,"SUCCESS")}):t(new Error("User is not authenticated"),null)},e.prototype.getUserAttributes=function(e){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("getUser",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(t,n){if(t)return e(t,null);for(var i=[],s=0;s<n.UserAttributes.length;s++){var o={Name:n.UserAttributes[s].Name,Value:n.UserAttributes[s].Value},r=new U.default(o);i.push(r)}return e(null,i)}):e(new Error("User is not authenticated"),null)},e.prototype.getMFAOptions=function(e){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("getUser",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(t,n){return t?e(t,null):e(null,n.MFAOptions)}):e(new Error("User is not authenticated"),null)},e.prototype.deleteAttributes=function(e,t){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("deleteUserAttributes",{UserAttributeNames:e,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(e){return e?t(e,null):t(null,"SUCCESS")}):t(new Error("User is not authenticated"),null)},e.prototype.resendConfirmationCode=function(e){var t={ClientId:this.pool.getClientId(),Username:this.username};this.client.makeUnauthenticatedRequest("resendConfirmationCode",t,function(t,n){return t?e(t,null):e(null,n)})},e.prototype.getSession=function(e){if(null==this.username)return e(new Error("Username is null. Cannot retrieve a new session"),null);if(null!=this.signInUserSession&&this.signInUserSession.isValid())return e(null,this.signInUserSession);var t="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username,n=t+".idToken",i=t+".accessToken",s=t+".refreshToken",o=t+".clockDrift";if(this.storage.getItem(n)){var r=new d.default({IdToken:this.storage.getItem(n)}),a=new h.default({AccessToken:this.storage.getItem(i)}),u=new g.default({RefreshToken:this.storage.getItem(s)}),c=parseInt(this.storage.getItem(o),0)||0,l={IdToken:r,AccessToken:a,RefreshToken:u,ClockDrift:c},f=new S.default(l);if(f.isValid())return this.signInUserSession=f,e(null,this.signInUserSession);if(null==u.getToken())return e(new Error("Cannot retrieve a new session. Please authenticate."),null);this.refreshSession(u,e)}else e(new Error("Local storage is missing an ID Token, Please authenticate"),null)},e.prototype.refreshSession=function(e,t){var n=this,i={};i.REFRESH_TOKEN=e.getToken();var s="CognitoIdentityServiceProvider."+this.pool.getClientId(),o=s+".LastAuthUser";if(this.storage.getItem(o)){this.username=this.storage.getItem(o);var r=s+"."+this.username+".deviceKey";this.deviceKey=this.storage.getItem(r),i.DEVICE_KEY=this.deviceKey}var a={ClientId:this.pool.getClientId(),AuthFlow:"REFRESH_TOKEN_AUTH",AuthParameters:i};this.getUserContextData()&&(a.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("initiateAuth",a,function(i,s){if(i)return"NotAuthorizedException"===i.code&&n.clearCachedTokens(),t(i,null);if(s){var o=s.AuthenticationResult;return Object.prototype.hasOwnProperty.call(o,"RefreshToken")||(o.RefreshToken=e.getToken()),n.signInUserSession=n.getCognitoUserSession(o),n.cacheTokens(),t(null,n.signInUserSession)}})},e.prototype.cacheTokens=function(){var e="CognitoIdentityServiceProvider."+this.pool.getClientId(),t=e+"."+this.username+".idToken",n=e+"."+this.username+".accessToken",i=e+"."+this.username+".refreshToken",s=e+"."+this.username+".clockDrift",o=e+".LastAuthUser";this.storage.setItem(t,this.signInUserSession.getIdToken().getJwtToken()),this.storage.setItem(n,this.signInUserSession.getAccessToken().getJwtToken()),this.storage.setItem(i,this.signInUserSession.getRefreshToken().getToken()),this.storage.setItem(s,""+this.signInUserSession.getClockDrift()),this.storage.setItem(o,this.username)},e.prototype.cacheDeviceKeyAndPassword=function(){var e="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username,t=e+".deviceKey",n=e+".randomPasswordKey",i=e+".deviceGroupKey";this.storage.setItem(t,this.deviceKey),this.storage.setItem(n,this.randomPassword),this.storage.setItem(i,this.deviceGroupKey)},e.prototype.getCachedDeviceKeyAndPassword=function(){var e="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username,t=e+".deviceKey",n=e+".randomPasswordKey",i=e+".deviceGroupKey";this.storage.getItem(t)&&(this.deviceKey=this.storage.getItem(t),this.randomPassword=this.storage.getItem(n),this.deviceGroupKey=this.storage.getItem(i))},e.prototype.clearCachedDeviceKeyAndPassword=function(){var e="CognitoIdentityServiceProvider."+this.pool.getClientId()+"."+this.username,t=e+".deviceKey",n=e+".randomPasswordKey",i=e+".deviceGroupKey";this.storage.removeItem(t),this.storage.removeItem(n),this.storage.removeItem(i)},e.prototype.clearCachedTokens=function(){var e="CognitoIdentityServiceProvider."+this.pool.getClientId(),t=e+"."+this.username+".idToken",n=e+"."+this.username+".accessToken",i=e+"."+this.username+".refreshToken",s=e+".LastAuthUser";this.storage.removeItem(t),this.storage.removeItem(n),this.storage.removeItem(i),this.storage.removeItem(s)},e.prototype.getCognitoUserSession=function(e){var t=new d.default(e),n=new h.default(e),i=new g.default(e),s={IdToken:t,AccessToken:n,RefreshToken:i};return new S.default(s)},e.prototype.forgotPassword=function(e){var t={ClientId:this.pool.getClientId(),Username:this.username};this.getUserContextData()&&(t.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("forgotPassword",t,function(t,n){return t?e.onFailure(t):"function"==typeof e.inputVerificationCode?e.inputVerificationCode(n):e.onSuccess(n)})},e.prototype.confirmPassword=function(e,t,n){var i={ClientId:this.pool.getClientId(),Username:this.username,ConfirmationCode:e,Password:t};this.getUserContextData()&&(i.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("confirmForgotPassword",i,function(e){return e?n.onFailure(e):n.onSuccess()})},e.prototype.getAttributeVerificationCode=function(e,t){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("getUserAttributeVerificationCode",{AttributeName:e,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(e,n){return e?t.onFailure(e):"function"==typeof t.inputVerificationCode?t.inputVerificationCode(n):t.onSuccess()}):t.onFailure(new Error("User is not authenticated"))},e.prototype.verifyAttribute=function(e,t,n){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("verifyUserAttribute",{AttributeName:e,Code:t,AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(e){return e?n.onFailure(e):n.onSuccess("SUCCESS")}):n.onFailure(new Error("User is not authenticated"))},e.prototype.getDevice=function(e){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("getDevice",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),DeviceKey:this.deviceKey},function(t,n){return t?e.onFailure(t):e.onSuccess(n)}):e.onFailure(new Error("User is not authenticated"))},e.prototype.forgetSpecificDevice=function(e,t){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("forgetDevice",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),DeviceKey:e},function(e){return e?t.onFailure(e):t.onSuccess("SUCCESS")}):t.onFailure(new Error("User is not authenticated"))},e.prototype.forgetDevice=function(e){var t=this;this.forgetSpecificDevice(this.deviceKey,{onFailure:e.onFailure,onSuccess:function(n){return t.deviceKey=null,t.deviceGroupKey=null,t.randomPassword=null,t.clearCachedDeviceKeyAndPassword(),e.onSuccess(n)}})},e.prototype.setDeviceStatusRemembered=function(e){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("updateDeviceStatus",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),DeviceKey:this.deviceKey,DeviceRememberedStatus:"remembered"},function(t){return t?e.onFailure(t):e.onSuccess("SUCCESS")}):e.onFailure(new Error("User is not authenticated"))},e.prototype.setDeviceStatusNotRemembered=function(e){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("updateDeviceStatus",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),DeviceKey:this.deviceKey,DeviceRememberedStatus:"not_remembered"},function(t){return t?e.onFailure(t):e.onSuccess("SUCCESS")}):e.onFailure(new Error("User is not authenticated"))},e.prototype.listDevices=function(e,t,n){return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("listDevices",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),Limit:e,PaginationToken:t},function(e,t){return e?n.onFailure(e):n.onSuccess(t)}):n.onFailure(new Error("User is not authenticated"))},e.prototype.globalSignOut=function(e){var t=this;return null!=this.signInUserSession&&this.signInUserSession.isValid()?void this.client.makeUnauthenticatedRequest("globalSignOut",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(n){return n?e.onFailure(n):(t.clearCachedTokens(),e.onSuccess("SUCCESS"))}):e.onFailure(new Error("User is not authenticated"))},e.prototype.signOut=function(){this.signInUserSession=null,this.clearCachedTokens()},e.prototype.sendMFASelectionAnswer=function(e,t){var n=this,i={};i.USERNAME=this.username,i.ANSWER=e;var s={ChallengeName:"SELECT_MFA_TYPE",ChallengeResponses:i,ClientId:this.pool.getClientId(),Session:this.Session};this.getUserContextData()&&(s.UserContextData=this.getUserContextData()),this.client.makeUnauthenticatedRequest("respondToAuthChallenge",s,function(i,s){return i?t.onFailure(i):(n.Session=s.Session,"SMS_MFA"===e?t.mfaRequired(s.challengeName,s.challengeParameters):"SOFTWARE_TOKEN_MFA"===e?t.totpRequired(s.challengeName,s.challengeParameters):void 0)})},e.prototype.getUserContextData=function(){var e=this.pool;return e.getUserContextData(this.username)},e.prototype.associateSoftwareToken=function(e){var t=this;null!=this.signInUserSession&&this.signInUserSession.isValid()?this.client.makeUnauthenticatedRequest("associateSoftwareToken",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken()},function(t,n){return t?e.onFailure(t):e.associateSecretCode(n.SecretCode)}):this.client.makeUnauthenticatedRequest("associateSoftwareToken",{Session:this.Session},function(n,i){return n?e.onFailure(n):(t.Session=i.Session,e.associateSecretCode(i.SecretCode))})},e.prototype.verifySoftwareToken=function(e,t,n){var i=this;null!=this.signInUserSession&&this.signInUserSession.isValid()?this.client.makeUnauthenticatedRequest("verifySoftwareToken",{AccessToken:this.signInUserSession.getAccessToken().getJwtToken(),UserCode:e,FriendlyDeviceName:t},function(e,t){return e?n.onFailure(e):n(null,t)}):this.client.makeUnauthenticatedRequest("verifySoftwareToken",{Session:this.Session,UserCode:e,FriendlyDeviceName:t},function(e,t){if(e)return n.onFailure(e);i.Session=t.Session;var s={};s.USERNAME=i.username;var o={ChallengeName:"MFA_SETUP",ClientId:i.pool.getClientId(),ChallengeResponses:s,Session:i.Session};i.getUserContextData()&&(o.UserContextData=i.getUserContextData()),i.client.makeUnauthenticatedRequest("respondToAuthChallenge",o,function(e,t){return e?n.onFailure(e):(i.signInUserSession=i.getCognitoUserSession(t.AuthenticationResult),i.cacheTokens(),n.onSuccess(i.signInUserSession))})})},e}();t.default=T},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=t.Name,s=t.Value;n(this,e),this.Name=i||"",this.Value=s||""}return e.prototype.getValue=function(){return this.Value},e.prototype.setValue=function(e){return this.Value=e,this},e.prototype.getName=function(){return this.Name},e.prototype.setName=function(e){return this.Name=e,this},e.prototype.toString=function(){return JSON.stringify(this)},e.prototype.toJSON=function(){return{Name:this.Name,Value:this.Value}},e}();t.default=i},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=t.IdToken,s=t.RefreshToken,o=t.AccessToken,r=t.ClockDrift;if(n(this,e),null==o||null==i)throw new Error("Id token and Access Token must be present.");this.idToken=i,this.refreshToken=s,this.accessToken=o,this.clockDrift=void 0===r?this.calculateClockDrift():r}return e.prototype.getIdToken=function(){return this.idToken},e.prototype.getRefreshToken=function(){return this.refreshToken},e.prototype.getAccessToken=function(){return this.accessToken},e.prototype.getClockDrift=function(){return this.clockDrift},e.prototype.calculateClockDrift=function(){var e=Math.floor(new Date/1e3),t=Math.min(this.accessToken.getIssuedAt(),this.idToken.getIssuedAt());return e-t},e.prototype.isValid=function(){var e=Math.floor(new Date/1e3),t=e-this.clockDrift;return t<this.accessToken.getExpiration()&&t<this.idToken.getExpiration()},e}();t.default=i},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],o=function(){function e(){n(this,e)}return e.prototype.getNowString=function(){var e=new Date,t=s[e.getUTCDay()],n=i[e.getUTCMonth()],o=e.getUTCDate(),r=e.getUTCHours();r<10&&(r="0"+r);var a=e.getUTCMinutes();a<10&&(a="0"+a);var u=e.getUTCSeconds();u<10&&(u="0"+u);var c=e.getUTCFullYear(),l=t+" "+n+" "+o+" "+r+":"+a+":"+u+" UTC "+c;return l},e}();t.default=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i={},s=function(){function e(){n(this,e)}return e.setItem=function(e,t){return i[e]=t,i[e]},e.getItem=function(e){return Object.prototype.hasOwnProperty.call(i,e)?i[e]:void 0},e.removeItem=function(e){return delete i[e]},e.clear=function(){return i={}},e}(),o=function(){function e(){n(this,e);try{this.storageWindow=window.localStorage,this.storageWindow.setItem("aws.cognito.test-ls",1),this.storageWindow.removeItem("aws.cognito.test-ls")}catch(e){this.storageWindow=s}}return e.prototype.getStorage=function(){return this.storageWindow},e}();t.default=o},function(e,n){e.exports=t},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */
var i=function(){function e(t){n(this,e);var i=t||{},s=i.ValidationData,o=i.Username,r=i.Password,a=i.AuthParameters;this.validationData=s||[],this.authParameters=a||[],this.username=o,this.password=r}return e.prototype.getUsername=function(){return this.username},e.prototype.getPassword=function(){return this.password},e.prototype.getValidationData=function(){return this.validationData},e.prototype.getAuthParameters=function(){return this.authParameters},e}();t.default=i},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(13),r=i(o),a=n(8),u=i(a),c=n(12),l=i(c),h=function(){function e(t){s(this,e);var n=t||{},i=n.UserPoolId,o=n.ClientId,a=n.endpoint,u=n.AdvancedSecurityDataCollectionFlag;if(!i||!o)throw new Error("Both UserPoolId and ClientId are required.");if(!/^[\w-]+_.+$/.test(i))throw new Error("Invalid UserPoolId format.");var c=i.split("_")[0];this.userPoolId=i,this.clientId=o,this.client=new r.default({apiVersion:"2016-04-19",region:c,endpoint:a}),this.advancedSecurityDataCollectionFlag=u!==!1,this.storage=t.Storage||(new l.default).getStorage()}return e.prototype.getUserPoolId=function(){return this.userPoolId},e.prototype.getClientId=function(){return this.clientId},e.prototype.signUp=function(e,t,n,i,s){var o=this,r={ClientId:this.clientId,Username:e,Password:t,UserAttributes:n,ValidationData:i};this.getUserContextData(e)&&(r.UserContextData=this.getUserContextData(e)),this.client.makeUnauthenticatedRequest("signUp",r,function(t,n){if(t)return s(t,null);var i={Username:e,Pool:o,Storage:o.storage},r={user:new u.default(i),userConfirmed:n.UserConfirmed,userSub:n.UserSub};return s(null,r)})},e.prototype.getCurrentUser=function(){var e="CognitoIdentityServiceProvider."+this.clientId+".LastAuthUser",t=this.storage.getItem(e);if(t){var n={Username:t,Pool:this,Storage:this.storage};return new u.default(n)}return null},e.prototype.getUserContextData=function(e){if("undefined"!=typeof AmazonCognitoAdvancedSecurityData){var t=AmazonCognitoAdvancedSecurityData;if(this.advancedSecurityDataCollectionFlag){var n=t.getData(e,this.userPoolId,this.clientId);if(n){var i={EncodedData:n};return i}}return{}}},e}();t.default=h},function(e,t,n){"use strict";function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=n(18),r=i(o),a=function(){function e(t){s(this,e),this.domain=t.domain,t.path?this.path=t.path:this.path="/",Object.prototype.hasOwnProperty.call(t,"expires")?this.expires=t.expires:this.expires=365,Object.prototype.hasOwnProperty.call(t,"secure")?this.secure=t.secure:this.secure=!0}return e.prototype.setItem=function(e,t){return r.set(e,t,{path:this.path,expires:this.expires,domain:this.domain,secure:this.secure}),r.get(e)},e.prototype.getItem=function(e){return r.get(e)},e.prototype.removeItem=function(e){return r.remove(e,{path:this.path,domain:this.domain,secure:this.secure})},e.prototype.clear=function(){var e=r.get(),t=void 0;for(t=0;t<e.length;++t)r.remove(e[t]);return{}},e}();t.default=a},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=n(14);Object.defineProperty(t,"AuthenticationDetails",{enumerable:!0,get:function(){return i(s).default}});var o=n(2);Object.defineProperty(t,"AuthenticationHelper",{enumerable:!0,get:function(){return i(o).default}});var r=n(4);Object.defineProperty(t,"CognitoAccessToken",{enumerable:!0,get:function(){return i(r).default}});var a=n(5);Object.defineProperty(t,"CognitoIdToken",{enumerable:!0,get:function(){return i(a).default}});var u=n(7);Object.defineProperty(t,"CognitoRefreshToken",{enumerable:!0,get:function(){return i(u).default}});var c=n(8);Object.defineProperty(t,"CognitoUser",{enumerable:!0,get:function(){return i(c).default}});var l=n(9);Object.defineProperty(t,"CognitoUserAttribute",{enumerable:!0,get:function(){return i(l).default}});var h=n(15);Object.defineProperty(t,"CognitoUserPool",{enumerable:!0,get:function(){return i(h).default}});var f=n(10);Object.defineProperty(t,"CognitoUserSession",{enumerable:!0,get:function(){return i(f).default}});var d=n(16);Object.defineProperty(t,"CookieStorage",{enumerable:!0,get:function(){return i(d).default}});var p=n(11);Object.defineProperty(t,"DateHelper",{enumerable:!0,get:function(){return i(p).default}}),"undefined"!=typeof window&&!window.crypto&&window.msCrypto&&(window.crypto=window.msCrypto)},function(e,t,n){var i,s;!function(o){var r=!1;if(i=o,s="function"==typeof i?i.call(t,n,t,e):i,!(void 0!==s&&(e.exports=s)),r=!0,e.exports=o(),r=!0,!r){var a=window.Cookies,u=window.Cookies=o();u.noConflict=function(){return window.Cookies=a,u}}}(function(){function e(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var i in n)t[i]=n[i]}return t}function t(n){function i(t,s,o){var r;if("undefined"!=typeof document){if(arguments.length>1){if(o=e({path:"/"},i.defaults,o),"number"==typeof o.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*o.expires),o.expires=a}o.expires=o.expires?o.expires.toUTCString():"";try{r=JSON.stringify(s),/^[\{\[]/.test(r)&&(s=r)}catch(e){}s=n.write?n.write(s,t):encodeURIComponent(String(s)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)),t=t.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),t=t.replace(/[\(\)]/g,escape);var u="";for(var c in o)o[c]&&(u+="; "+c,o[c]!==!0&&(u+="="+o[c]));return document.cookie=t+"="+s+u}t||(r={});for(var l=document.cookie?document.cookie.split("; "):[],h=/(%[0-9A-Z]{2})+/g,f=0;f<l.length;f++){var d=l[f].split("="),p=d.slice(1).join("=");this.json||'"'!==p.charAt(0)||(p=p.slice(1,-1));try{var g=d[0].replace(h,decodeURIComponent);if(p=n.read?n.read(p,g):n(p,g)||p.replace(h,decodeURIComponent),this.json)try{p=JSON.parse(p)}catch(e){}if(t===g){r=p;break}t||(r[g]=p)}catch(e){}}return r}}return i.set=i,i.get=function(e){return i.call(i,e)},i.getJSON=function(){return i.apply({json:!0},[].slice.call(arguments))},i.defaults={},i.remove=function(t,n){i(t,"",e(n,{expires:-1}))},i.withConverter=t,i}return t(function(){})})}])});
//# sourceMappingURL=amazon-cognito-identity.min.js.map

/**
 * Copyright 2016 Amazon.com,
 * Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the
 * License. A copy of the License is located at
 * 
 *     http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, express or implied. See the License
 * for the specific language governing permissions and
 * limitations under the License. 
 */


 !function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){b.exports={version:"2.0",metadata:{apiVersion:"2014-06-30",endpointPrefix:"cognito-identity",jsonVersion:"1.1",protocol:"json",serviceFullName:"Amazon Cognito Identity",signatureVersion:"v4",targetPrefix:"AWSCognitoIdentityService"},operations:{CreateIdentityPool:{input:{type:"structure",required:["IdentityPoolName","AllowUnauthenticatedIdentities"],members:{IdentityPoolName:{},AllowUnauthenticatedIdentities:{type:"boolean"},SupportedLoginProviders:{shape:"S4"},DeveloperProviderName:{},OpenIdConnectProviderARNs:{shape:"S8"},CognitoIdentityProviders:{shape:"Sa"},SamlProviderARNs:{shape:"Se"}}},output:{shape:"Sf"}},DeleteIdentities:{input:{type:"structure",required:["IdentityIdsToDelete"],members:{IdentityIdsToDelete:{type:"list",member:{}}}},output:{type:"structure",members:{UnprocessedIdentityIds:{type:"list",member:{type:"structure",members:{IdentityId:{},ErrorCode:{}}}}}}},DeleteIdentityPool:{input:{type:"structure",required:["IdentityPoolId"],members:{IdentityPoolId:{}}}},DescribeIdentity:{input:{type:"structure",required:["IdentityId"],members:{IdentityId:{}}},output:{shape:"Sq"}},DescribeIdentityPool:{input:{type:"structure",required:["IdentityPoolId"],members:{IdentityPoolId:{}}},output:{shape:"Sf"}},GetCredentialsForIdentity:{input:{type:"structure",required:["IdentityId"],members:{IdentityId:{},Logins:{shape:"Sv"},CustomRoleArn:{}}},output:{type:"structure",members:{IdentityId:{},Credentials:{type:"structure",members:{AccessKeyId:{},SecretKey:{},SessionToken:{},Expiration:{type:"timestamp"}}}}}},GetId:{input:{type:"structure",required:["IdentityPoolId"],members:{AccountId:{},IdentityPoolId:{},Logins:{shape:"Sv"}}},output:{type:"structure",members:{IdentityId:{}}}},GetIdentityPoolRoles:{input:{type:"structure",required:["IdentityPoolId"],members:{IdentityPoolId:{}}},output:{type:"structure",members:{IdentityPoolId:{},Roles:{shape:"S17"}}}},GetOpenIdToken:{input:{type:"structure",required:["IdentityId"],members:{IdentityId:{},Logins:{shape:"Sv"}}},output:{type:"structure",members:{IdentityId:{},Token:{}}}},GetOpenIdTokenForDeveloperIdentity:{input:{type:"structure",required:["IdentityPoolId","Logins"],members:{IdentityPoolId:{},IdentityId:{},Logins:{shape:"Sv"},TokenDuration:{type:"long"}}},output:{type:"structure",members:{IdentityId:{},Token:{}}}},ListIdentities:{input:{type:"structure",required:["IdentityPoolId","MaxResults"],members:{IdentityPoolId:{},MaxResults:{type:"integer"},NextToken:{},HideDisabled:{type:"boolean"}}},output:{type:"structure",members:{IdentityPoolId:{},Identities:{type:"list",member:{shape:"Sq"}},NextToken:{}}}},ListIdentityPools:{input:{type:"structure",required:["MaxResults"],members:{MaxResults:{type:"integer"},NextToken:{}}},output:{type:"structure",members:{IdentityPools:{type:"list",member:{type:"structure",members:{IdentityPoolId:{},IdentityPoolName:{}}}},NextToken:{}}}},LookupDeveloperIdentity:{input:{type:"structure",required:["IdentityPoolId"],members:{IdentityPoolId:{},IdentityId:{},DeveloperUserIdentifier:{},MaxResults:{type:"integer"},NextToken:{}}},output:{type:"structure",members:{IdentityId:{},DeveloperUserIdentifierList:{type:"list",member:{}},NextToken:{}}}},MergeDeveloperIdentities:{input:{type:"structure",required:["SourceUserIdentifier","DestinationUserIdentifier","DeveloperProviderName","IdentityPoolId"],members:{SourceUserIdentifier:{},DestinationUserIdentifier:{},DeveloperProviderName:{},IdentityPoolId:{}}},output:{type:"structure",members:{IdentityId:{}}}},SetIdentityPoolRoles:{input:{type:"structure",required:["IdentityPoolId","Roles"],members:{IdentityPoolId:{},Roles:{shape:"S17"}}}},UnlinkDeveloperIdentity:{input:{type:"structure",required:["IdentityId","IdentityPoolId","DeveloperProviderName","DeveloperUserIdentifier"],members:{IdentityId:{},IdentityPoolId:{},DeveloperProviderName:{},DeveloperUserIdentifier:{}}}},UnlinkIdentity:{input:{type:"structure",required:["IdentityId","Logins","LoginsToRemove"],members:{IdentityId:{},Logins:{shape:"Sv"},LoginsToRemove:{shape:"Sr"}}}},UpdateIdentityPool:{input:{shape:"Sf"},output:{shape:"Sf"}}},shapes:{S4:{type:"map",key:{},value:{}},S8:{type:"list",member:{}},Sa:{type:"list",member:{type:"structure",members:{ProviderName:{},ClientId:{}}}},Se:{type:"list",member:{}},Sf:{type:"structure",required:["IdentityPoolId","IdentityPoolName","AllowUnauthenticatedIdentities"],members:{IdentityPoolId:{},IdentityPoolName:{},AllowUnauthenticatedIdentities:{type:"boolean"},SupportedLoginProviders:{shape:"S4"},DeveloperProviderName:{},OpenIdConnectProviderARNs:{shape:"S8"},CognitoIdentityProviders:{shape:"Sa"},SamlProviderARNs:{shape:"Se"}}},Sq:{type:"structure",members:{IdentityId:{},Logins:{shape:"Sr"},CreationDate:{type:"timestamp"},LastModifiedDate:{type:"timestamp"}}},Sr:{type:"list",member:{}},Sv:{type:"map",key:{},value:{}},S17:{type:"map",key:{},value:{}}}}},{}],2:[function(a,b,c){b.exports={version:"2.0",metadata:{apiVersion:"2016-04-18",endpointPrefix:"cognito-idp",jsonVersion:"1.1",protocol:"json",serviceFullName:"Amazon Cognito Identity Provider",signatureVersion:"v4",targetPrefix:"AWSCognitoIdentityProviderService"},operations:{AddCustomAttributes:{name:"AddCustomAttributes",http:{method:"POST",requestUri:"/"},input:{shape:"AddCustomAttributesRequest"},output:{shape:"AddCustomAttributesResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserImportInProgressException"},{shape:"InternalErrorException"}],documentation:"<p>Adds additional user attributes to the user pool schema.</p>"},AdminAddUserToGroup:{name:"AdminAddUserToGroup",http:{method:"POST",requestUri:"/"},input:{shape:"AdminAddUserToGroupRequest"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Adds the specified user to the specified group.</p> <p>Requires developer credentials.</p>"},AdminConfirmSignUp:{name:"AdminConfirmSignUp",http:{method:"POST",requestUri:"/"},input:{shape:"AdminConfirmSignUpRequest"},output:{shape:"AdminConfirmSignUpResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"TooManyFailedAttemptsException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Confirms user registration as an admin without using a confirmation code. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminCreateUser:{name:"AdminCreateUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminCreateUserRequest"},output:{shape:"AdminCreateUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UserNotFoundException"},{shape:"UsernameExistsException"},{shape:"InvalidPasswordException"},{shape:"CodeDeliveryFailureException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"PreconditionNotMetException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UnsupportedUserStateException"},{shape:"InternalErrorException"}],documentation:"<p>Creates a new user in the specified user pool and sends a welcome message via email or phone (SMS). This message is based on a template that you configured in your call to CreateUserPool or UpdateUserPool. This template includes your custom sign-up instructions and placeholders for user name and temporary password.</p> <p>Requires developer credentials.</p>"},AdminDeleteUser:{name:"AdminDeleteUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminDeleteUserRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Deletes a user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminDeleteUserAttributes:{name:"AdminDeleteUserAttributes",http:{method:"POST",requestUri:"/"},input:{shape:"AdminDeleteUserAttributesRequest"},output:{shape:"AdminDeleteUserAttributesResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Deletes the user attributes in a user pool as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminDisableProviderForUser:{name:"AdminDisableProviderForUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminDisableProviderForUserRequest"},output:{shape:"AdminDisableProviderForUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"AliasExistsException"},{shape:"InternalErrorException"}]},AdminDisableUser:{name:"AdminDisableUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminDisableUserRequest"},output:{shape:"AdminDisableUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Disables the specified user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminEnableUser:{name:"AdminEnableUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminEnableUserRequest"},output:{shape:"AdminEnableUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Enables the specified user as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminForgetDevice:{name:"AdminForgetDevice",http:{method:"POST",requestUri:"/"},input:{shape:"AdminForgetDeviceRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Forgets the device, as an administrator.</p> <p>Requires developer credentials.</p>"},AdminGetDevice:{name:"AdminGetDevice",http:{method:"POST",requestUri:"/"},input:{shape:"AdminGetDeviceRequest"},output:{shape:"AdminGetDeviceResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"NotAuthorizedException"}],documentation:"<p>Gets the device, as an administrator.</p> <p>Requires developer credentials.</p>"},AdminGetUser:{name:"AdminGetUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminGetUserRequest"},output:{shape:"AdminGetUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the specified user by user name in a user pool as an administrator. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminInitiateAuth:{name:"AdminInitiateAuth",http:{method:"POST",requestUri:"/"},input:{shape:"AdminInitiateAuthRequest"},output:{shape:"AdminInitiateAuthResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"UnexpectedLambdaException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"MFAMethodNotFoundException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"}],documentation:"<p>Initiates the authentication flow, as an administrator.</p> <p>Requires developer credentials.</p>"},AdminLinkProviderForUser:{name:"AdminLinkProviderForUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminLinkProviderForUserRequest"},output:{shape:"AdminLinkProviderForUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"AliasExistsException"},{shape:"InternalErrorException"}]},AdminListDevices:{name:"AdminListDevices",http:{method:"POST",requestUri:"/"},input:{shape:"AdminListDevicesRequest"},output:{shape:"AdminListDevicesResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"NotAuthorizedException"}],documentation:"<p>Lists devices, as an administrator.</p> <p>Requires developer credentials.</p>"},AdminListGroupsForUser:{name:"AdminListGroupsForUser",http:{method:"POST",requestUri:"/"},input:{shape:"AdminListGroupsForUserRequest"},output:{shape:"AdminListGroupsForUserResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the groups that the user belongs to.</p> <p>Requires developer credentials.</p>"},AdminListUserAuthEvents:{name:"AdminListUserAuthEvents",http:{method:"POST",requestUri:"/"},input:{shape:"AdminListUserAuthEventsRequest"},output:{shape:"AdminListUserAuthEventsResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"UserPoolAddOnNotEnabledException"},{shape:"InternalErrorException"}]},AdminRemoveUserFromGroup:{name:"AdminRemoveUserFromGroup",http:{method:"POST",requestUri:"/"},input:{shape:"AdminRemoveUserFromGroupRequest"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Removes the specified user from the specified group.</p> <p>Requires developer credentials.</p>"},AdminResetUserPassword:{name:"AdminResetUserPassword",http:{method:"POST",requestUri:"/"},input:{shape:"AdminResetUserPasswordRequest"},output:{shape:"AdminResetUserPasswordResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"UserNotFoundException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InternalErrorException"}],documentation:"<p>Resets the specified user's password in a user pool as an administrator. Works on any user.</p> <p>When a developer calls this API, the current password is invalidated, so it must be changed. If a user tries to sign in after the API is called, the app will get a PasswordResetRequiredException exception back and should direct the user down the flow to reset the password, which is the same as the forgot password flow. In addition, if the user pool has phone verification selected and a verified phone number exists for the user, or if email verification is selected and a verified email exists for the user, calling this API will also result in sending a message to the end user with the code to change their password.</p> <p>Requires developer credentials.</p>"},AdminRespondToAuthChallenge:{name:"AdminRespondToAuthChallenge",http:{method:"POST",requestUri:"/"},input:{shape:"AdminRespondToAuthChallengeRequest"},output:{shape:"AdminRespondToAuthChallengeResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"UnexpectedLambdaException"},{shape:"InvalidPasswordException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"InternalErrorException"},{shape:"MFAMethodNotFoundException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"AliasExistsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"SoftwareTokenMFANotFoundException"}],documentation:"<p>Responds to an authentication challenge, as an administrator.</p> <p>Requires developer credentials.</p>"},AdminSetUserMFAPreference:{name:"AdminSetUserMFAPreference",http:{method:"POST",requestUri:"/"},input:{shape:"AdminSetUserMFAPreferenceRequest"},output:{shape:"AdminSetUserMFAPreferenceResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}]},AdminSetUserSettings:{name:"AdminSetUserSettings",http:{method:"POST",requestUri:"/"},input:{shape:"AdminSetUserSettingsRequest"},output:{shape:"AdminSetUserSettingsResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Sets all the user settings for a specified user name. Works on any user.</p> <p>Requires developer credentials.</p>"},AdminUpdateAuthEventFeedback:{name:"AdminUpdateAuthEventFeedback",http:{method:"POST",requestUri:"/"},input:{shape:"AdminUpdateAuthEventFeedbackRequest"},output:{shape:"AdminUpdateAuthEventFeedbackResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"UserPoolAddOnNotEnabledException"},{shape:"InternalErrorException"}]},AdminUpdateDeviceStatus:{name:"AdminUpdateDeviceStatus",http:{method:"POST",requestUri:"/"},input:{shape:"AdminUpdateDeviceStatusRequest"},output:{shape:"AdminUpdateDeviceStatusResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Updates the device status as an administrator.</p> <p>Requires developer credentials.</p>"},AdminUpdateUserAttributes:{name:"AdminUpdateUserAttributes",http:{method:"POST",requestUri:"/"},input:{shape:"AdminUpdateUserAttributesRequest"},output:{shape:"AdminUpdateUserAttributesResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"AliasExistsException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Updates the specified user's attributes, including developer attributes, as an administrator. Works on any user.</p> <p>In addition to updating user attributes, this API can also be used to mark phone and email as verified.</p> <p>Requires developer credentials.</p>"},AdminUserGlobalSignOut:{name:"AdminUserGlobalSignOut",http:{method:"POST",requestUri:"/"},input:{shape:"AdminUserGlobalSignOutRequest"},output:{shape:"AdminUserGlobalSignOutResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Signs out users from all devices, as an administrator.</p> <p>Requires developer credentials.</p>"},AssociateSoftwareToken:{name:"AssociateSoftwareToken",http:{method:"POST",requestUri:"/"},input:{shape:"AssociateSoftwareTokenRequest"},output:{shape:"AssociateSoftwareTokenResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InternalErrorException"},{shape:"SoftwareTokenMFANotFoundException"}]},Authenticate:{name:"Authenticate",http:{method:"POST",requestUri:"/"},input:{shape:"AuthenticateRequest"},output:{shape:"AuthenticateResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"MFAMethodNotFoundException"},{shape:"TooManyRequestsException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"PasswordResetRequiredException"},{shape:"InternalErrorException"}],documentation:'<p>The second step in the authentication flow of Secure Remote Password protocol (SRP) for authenticating a user to get ID, access and refresh tokens. To learn more about the first step, see <a href="API_GetAuthenticationDetails.html">GetAuthenticationDetails</a>.</p>',authtype:"none"},ChangePassword:{name:"ChangePassword",http:{method:"POST",requestUri:"/"},input:{shape:"ChangePasswordRequest"},output:{shape:"ChangePasswordResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"InvalidPasswordException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Changes the password for a specified user in a user pool.</p>",authtype:"none"},ConfirmDevice:{name:"ConfirmDevice",http:{method:"POST",requestUri:"/"},input:{shape:"ConfirmDeviceRequest"},output:{shape:"ConfirmDeviceResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"InvalidPasswordException"},{shape:"InvalidLambdaResponseException"},{shape:"UsernameExistsException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Confirms tracking of the device. This API call is the call that begins device tracking.</p>"},ConfirmForgotPassword:{name:"ConfirmForgotPassword",http:{method:"POST",requestUri:"/"},input:{shape:"ConfirmForgotPasswordRequest"},output:{shape:"ConfirmForgotPasswordResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidParameterException"},{shape:"InvalidPasswordException"},{shape:"NotAuthorizedException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"TooManyFailedAttemptsException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Allows a user to enter a confirmation code to reset a forgotten password.</p>",authtype:"none"},ConfirmSignUp:{name:"ConfirmSignUp",http:{method:"POST",requestUri:"/"},input:{shape:"ConfirmSignUpRequest"},output:{shape:"ConfirmSignUpResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"TooManyFailedAttemptsException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"InvalidLambdaResponseException"},{shape:"AliasExistsException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Confirms registration of a user and handles the existing alias from a previous user.</p>",authtype:"none"},CreateGroup:{name:"CreateGroup",http:{method:"POST",requestUri:"/"},input:{shape:"CreateGroupRequest"},output:{shape:"CreateGroupResponse"},errors:[{shape:"InvalidParameterException"},{shape:"GroupExistsException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Creates a new group in the specified user pool.</p> <p>Requires developer credentials.</p>"},CreateIdentityProvider:{name:"CreateIdentityProvider",http:{method:"POST",requestUri:"/"},input:{shape:"CreateIdentityProviderRequest"},output:{shape:"CreateIdentityProviderResponse"},errors:[{shape:"InvalidParameterException"},{shape:"DuplicateProviderException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"InternalErrorException"}]},CreateResourceServer:{name:"CreateResourceServer",http:{method:"POST",requestUri:"/"},input:{shape:"CreateResourceServerRequest"},output:{shape:"CreateResourceServerResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"InternalErrorException"}]},CreateUserImportJob:{name:"CreateUserImportJob",http:{method:"POST",requestUri:"/"},input:{shape:"CreateUserImportJobRequest"},output:{shape:"CreateUserImportJobResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"PreconditionNotMetException"},{shape:"NotAuthorizedException"},{shape:"LimitExceededException"},{shape:"InternalErrorException"}],documentation:"<p>Creates the user import job.</p>"},CreateUserPool:{name:"CreateUserPool",http:{method:"POST",requestUri:"/"},input:{shape:"CreateUserPoolRequest"},output:{shape:"CreateUserPoolResponse"},errors:[{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"NotAuthorizedException"},{shape:"UserPoolTaggingException"},{shape:"InternalErrorException"}],documentation:"<p>Creates a new Amazon Cognito user pool and sets the password policy for the pool.</p>"},CreateUserPoolClient:{name:"CreateUserPoolClient",http:{method:"POST",requestUri:"/"},input:{shape:"CreateUserPoolClientRequest"},output:{shape:"CreateUserPoolClientResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"NotAuthorizedException"},{shape:"ScopeDoesNotExistException"},{shape:"InvalidOAuthFlowException"},{shape:"InternalErrorException"}],documentation:"<p>Creates the user pool client.</p>"},CreateUserPoolDomain:{name:"CreateUserPoolDomain",http:{method:"POST",requestUri:"/"},input:{shape:"CreateUserPoolDomainRequest"},output:{shape:"CreateUserPoolDomainResponse"},errors:[{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"ResourceNotFoundException"},{shape:"InternalErrorException"}]},DeleteGroup:{name:"DeleteGroup",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteGroupRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Deletes a group. Currently only groups with no members can be deleted.</p> <p>Requires developer credentials.</p>"},DeleteIdentityProvider:{name:"DeleteIdentityProvider",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteIdentityProviderRequest"},errors:[{shape:"InvalidParameterException"},{shape:"UnsupportedIdentityProviderException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},DeleteResourceServer:{name:"DeleteResourceServer",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteResourceServerRequest"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},DeleteUser:{name:"DeleteUser",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteUserRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Allows a user to delete one's self.</p>",authtype:"none"},DeleteUserAttributes:{name:"DeleteUserAttributes",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteUserAttributesRequest"},output:{shape:"DeleteUserAttributesResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Deletes the attributes for a user.</p>",authtype:"none"},DeleteUserPool:{name:"DeleteUserPool",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteUserPoolRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserImportInProgressException"},{shape:"InternalErrorException"}],documentation:"<p>Deletes the specified Amazon Cognito user pool.</p>"},DeleteUserPoolClient:{name:"DeleteUserPoolClient",http:{method:"POST",requestUri:"/"},input:{shape:"DeleteUserPoolClientRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Allows the developer to delete the user pool client.</p>"},DeleteUserPoolDomain:{name:"DeleteUserPoolDomain",http:{method:"POST",requestUri:"/"
},input:{shape:"DeleteUserPoolDomainRequest"},output:{shape:"DeleteUserPoolDomainResponse"},errors:[{shape:"NotAuthorizedException"},{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InternalErrorException"}]},DescribeIdentityProvider:{name:"DescribeIdentityProvider",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeIdentityProviderRequest"},output:{shape:"DescribeIdentityProviderResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},DescribeResourceServer:{name:"DescribeResourceServer",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeResourceServerRequest"},output:{shape:"DescribeResourceServerResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},DescribeRiskConfiguration:{name:"DescribeRiskConfiguration",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeRiskConfigurationRequest"},output:{shape:"DescribeRiskConfigurationResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserPoolAddOnNotEnabledException"},{shape:"InternalErrorException"}]},DescribeUserImportJob:{name:"DescribeUserImportJob",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeUserImportJobRequest"},output:{shape:"DescribeUserImportJobResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Describes the user import job.</p>"},DescribeUserPool:{name:"DescribeUserPool",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeUserPoolRequest"},output:{shape:"DescribeUserPoolResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserPoolTaggingException"},{shape:"InternalErrorException"}],documentation:"<p>Returns the configuration information and metadata of the specified user pool.</p>"},DescribeUserPoolClient:{name:"DescribeUserPoolClient",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeUserPoolClientRequest"},output:{shape:"DescribeUserPoolClientResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Client method for returning the configuration information and metadata of the specified user pool client.</p>"},DescribeUserPoolDomain:{name:"DescribeUserPoolDomain",http:{method:"POST",requestUri:"/"},input:{shape:"DescribeUserPoolDomainRequest"},output:{shape:"DescribeUserPoolDomainResponse"},errors:[{shape:"NotAuthorizedException"},{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InternalErrorException"}]},EnhanceAuth:{name:"EnhanceAuth",http:{method:"POST",requestUri:"/"},input:{shape:"EnhanceAuthRequest"},output:{shape:"EnhanceAuthResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"PasswordResetRequiredException"},{shape:"InternalErrorException"}],documentation:"<p>Grants the ability to supply a multi-factor authentication (MFA) token for an MFA-enabled user to get the ID, access, and refresh tokens.</p>",authtype:"none"},ForgetDevice:{name:"ForgetDevice",http:{method:"POST",requestUri:"/"},input:{shape:"ForgetDeviceRequest"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Forgets the specified device.</p>"},ForgotPassword:{name:"ForgotPassword",http:{method:"POST",requestUri:"/"},input:{shape:"ForgotPasswordRequest"},output:{shape:"ForgotPasswordResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:'<p>Calling this API causes a message to be sent to the end user with a confirmation code that is required to change the user\'s password. For the <code>Username</code> parameter, you can use the username or user alias. If a verified phone number exists for the user, the confirmation code is sent to the phone number. Otherwise, if a verified email exists, the confirmation code is sent to the email. If neither a verified phone number nor a verified email exists, <code>InvalidParameterException</code> is thrown. To use the confirmation code for resetting the password, call <a href="API_ConfirmForgotPassword.html">ConfirmForgotPassword</a>.</p>',authtype:"none"},GetAuthenticationDetails:{name:"GetAuthenticationDetails",http:{method:"POST",requestUri:"/"},input:{shape:"GetAuthenticationDetailsRequest"},output:{shape:"GetAuthenticationDetailsResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:'<p>First step of the Secure Remote Password protocol (SRP) auth flow to authenticate a user. To learn about the second step, see <a href="API_Authenticate.html">Authenticate</a>.</p>',authtype:"none"},GetCSVHeader:{name:"GetCSVHeader",http:{method:"POST",requestUri:"/"},input:{shape:"GetCSVHeaderRequest"},output:{shape:"GetCSVHeaderResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the header information for the .csv file to be used as input for the user import job.</p>"},GetDevice:{name:"GetDevice",http:{method:"POST",requestUri:"/"},input:{shape:"GetDeviceRequest"},output:{shape:"GetDeviceResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the device.</p>"},GetGroup:{name:"GetGroup",http:{method:"POST",requestUri:"/"},input:{shape:"GetGroupRequest"},output:{shape:"GetGroupResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Gets a group.</p> <p>Requires developer credentials.</p>"},GetIdentityProviderByIdentifier:{name:"GetIdentityProviderByIdentifier",http:{method:"POST",requestUri:"/"},input:{shape:"GetIdentityProviderByIdentifierRequest"},output:{shape:"GetIdentityProviderByIdentifierResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},GetJWKS:{name:"GetJWKS",http:{method:"POST",requestUri:"/"},input:{shape:"GetJWKSRequest"},output:{shape:"GetJWKSResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"InvalidParameterException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the JSON Web keys for the specified user pool.</p>",authtype:"none"},GetOpenIdConfiguration:{name:"GetOpenIdConfiguration",http:{method:"POST",requestUri:"/"},input:{shape:"GetOpenIdConfigurationRequest"},output:{shape:"GetOpenIdConfigurationResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"InvalidParameterException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the OpenId configuration information for the specified user pool.</p>",authtype:"none"},GetSigningCertificate:{name:"GetSigningCertificate",http:{method:"POST",requestUri:"/"},input:{shape:"GetSigningCertificateRequest"},output:{shape:"GetSigningCertificateResponse"},errors:[{shape:"InternalErrorException"},{shape:"ResourceNotFoundException"}]},GetUICustomization:{name:"GetUICustomization",http:{method:"POST",requestUri:"/"},input:{shape:"GetUICustomizationRequest"},output:{shape:"GetUICustomizationResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},GetUser:{name:"GetUser",http:{method:"POST",requestUri:"/"},input:{shape:"GetUserRequest"},output:{shape:"GetUserResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the user attributes and metadata for a user.</p>",authtype:"none"},GetUserAttributeVerificationCode:{name:"GetUserAttributeVerificationCode",http:{method:"POST",requestUri:"/"},input:{shape:"GetUserAttributeVerificationCodeRequest"},output:{shape:"GetUserAttributeVerificationCodeResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"},{shape:"LimitExceededException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Gets the user attribute verification code for the specified attribute name.</p>",authtype:"none"},GetUserPoolMfaConfig:{name:"GetUserPoolMfaConfig",http:{method:"POST",requestUri:"/"},input:{shape:"GetUserPoolMfaConfigRequest"},output:{shape:"GetUserPoolMfaConfigResponse"},errors:[{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}]},GetUserPoolUIConfiguration:{name:"GetUserPoolUIConfiguration",http:{method:"POST",requestUri:"/"},input:{shape:"GetUserPoolUIConfigurationRequest"},output:{shape:"GetUserPoolUIConfigurationResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},GlobalSignOut:{name:"GlobalSignOut",http:{method:"POST",requestUri:"/"},input:{shape:"GlobalSignOutRequest"},output:{shape:"GlobalSignOutResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Signs out users from all devices.</p>"},InitiateAuth:{name:"InitiateAuth",http:{method:"POST",requestUri:"/"},input:{shape:"InitiateAuthRequest"},output:{shape:"InitiateAuthResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"UnexpectedLambdaException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Initiates the authentication flow.</p>"},ListDevices:{name:"ListDevices",http:{method:"POST",requestUri:"/"},input:{shape:"ListDevicesRequest"},output:{shape:"ListDevicesResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the devices.</p>"},ListGroups:{name:"ListGroups",http:{method:"POST",requestUri:"/"},input:{shape:"ListGroupsRequest"},output:{shape:"ListGroupsResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the groups associated with a user pool.</p> <p>Requires developer credentials.</p>"},ListIdentityProviders:{name:"ListIdentityProviders",http:{method:"POST",requestUri:"/"},input:{shape:"ListIdentityProvidersRequest"},output:{shape:"ListIdentityProvidersResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},ListResourceServers:{name:"ListResourceServers",http:{method:"POST",requestUri:"/"},input:{shape:"ListResourceServersRequest"},output:{shape:"ListResourceServersResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},ListUserImportJobs:{name:"ListUserImportJobs",http:{method:"POST",requestUri:"/"},input:{shape:"ListUserImportJobsRequest"},output:{shape:"ListUserImportJobsResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the user import jobs.</p>"},ListUserPoolClients:{name:"ListUserPoolClients",http:{method:"POST",requestUri:"/"},input:{shape:"ListUserPoolClientsRequest"},output:{shape:"ListUserPoolClientsResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the clients that have been created for the specified user pool.</p>"},ListUserPools:{name:"ListUserPools",http:{method:"POST",requestUri:"/"},input:{shape:"ListUserPoolsRequest"},output:{shape:"ListUserPoolsResponse"},errors:[{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the user pools associated with an AWS account.</p>"},ListUsers:{name:"ListUsers",http:{method:"POST",requestUri:"/"},input:{shape:"ListUsersRequest"},output:{shape:"ListUsersResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the users in the Amazon Cognito user pool.</p>"},ListUsersInGroup:{name:"ListUsersInGroup",http:{method:"POST",requestUri:"/"},input:{shape:"ListUsersInGroupRequest"},output:{shape:"ListUsersInGroupResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Lists the users in the specified group.</p> <p>Requires developer credentials.</p>"},RefreshTokens:{name:"RefreshTokens",http:{method:"POST",requestUri:"/"},input:{shape:"RefreshTokensRequest"},output:{shape:"RefreshTokensResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"InternalErrorException"}],documentation:"<p>Refreshes the tokens for the specified client ID.</p>",authtype:"none"},ResendConfirmationCode:{name:"ResendConfirmationCode",http:{method:"POST",requestUri:"/"},input:{shape:"ResendConfirmationCodeRequest"},output:{shape:"ResendConfirmationCodeResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"},{shape:"UserNotFoundException"},{shape:"InternalErrorException"}],documentation:"<p>Resends the confirmation (for confirmation of registration) to a specific user in the user pool.</p>",authtype:"none"},RespondToAuthChallenge:{name:"RespondToAuthChallenge",http:{method:"POST",requestUri:"/"},input:{shape:"RespondToAuthChallengeRequest"},output:{shape:"RespondToAuthChallengeResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidPasswordException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"MFAMethodNotFoundException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"AliasExistsException"},{shape:"InternalErrorException"},{shape:"SoftwareTokenMFANotFoundException"}],documentation:"<p>Responds to the authentication challenge.</p>"},SetRiskConfiguration:{name:"SetRiskConfiguration",http:{method:"POST",requestUri:"/"},input:{shape:"SetRiskConfigurationRequest"},output:{shape:"SetRiskConfigurationResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserPoolAddOnNotEnabledException"},{shape:"InternalErrorException"}]},SetUICustomization:{name:"SetUICustomization",http:{method:"POST",requestUri:"/"},input:{shape:"SetUICustomizationRequest"},output:{shape:"SetUICustomizationResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},SetUserMFAPreference:{name:"SetUserMFAPreference",http:{method:"POST",requestUri:"/"},input:{shape:"SetUserMFAPreferenceRequest"},output:{shape:"SetUserMFAPreferenceResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}]},SetUserPoolMfaConfig:{name:"SetUserPoolMfaConfig",http:{method:"POST",requestUri:"/"},input:{shape:"SetUserPoolMfaConfigRequest"},output:{shape:"SetUserPoolMfaConfigResponse"},errors:[{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"ResourceNotFoundException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}]},SetUserPoolUIConfiguration:{name:"SetUserPoolUIConfiguration",http:{method:"POST",requestUri:"/"},input:{shape:"SetUserPoolUIConfigurationRequest"},output:{shape:"SetUserPoolUIConfigurationResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},SetUserSettings:{name:"SetUserSettings",http:{method:"POST",requestUri:"/"},input:{shape:"SetUserSettingsRequest"},output:{shape:"SetUserSettingsResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"NotAuthorizedException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Sets the user settings like multi-factor authentication (MFA). If MFA is to be removed for a particular attribute pass the attribute with code delivery as null. If null list is passed, all MFA options are removed.</p>",authtype:"none"},SignUp:{name:"SignUp",http:{method:"POST",requestUri:"/"},input:{shape:"SignUpRequest"},output:{shape:"SignUpResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"NotAuthorizedException"},{shape:"InvalidPasswordException"},{shape:"InvalidLambdaResponseException"},{shape:"UsernameExistsException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"}],documentation:"<p>Registers the user in the specified user pool and creates a user name, password, and user attributes.</p>",authtype:"none"},StartUserImportJob:{name:"StartUserImportJob",http:{method:"POST",requestUri:"/"},input:{shape:"StartUserImportJobRequest"},output:{shape:"StartUserImportJobResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"PreconditionNotMetException"},{shape:"NotAuthorizedException"}],documentation:"<p>Starts the user import.</p>"},StopUserImportJob:{name:"StopUserImportJob",http:{method:"POST",requestUri:"/"},input:{shape:"StopUserImportJobRequest"},output:{shape:"StopUserImportJobResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"},{shape:"PreconditionNotMetException"},{shape:"NotAuthorizedException"}],documentation:"<p>Stops the user import job.</p>"},UpdateAuthEventFeedback:{name:"UpdateAuthEventFeedback",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateAuthEventFeedbackRequest"},output:{shape:"UpdateAuthEventFeedbackResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserNotFoundException"},{shape:"UserPoolAddOnNotEnabledException"},{shape:"InternalErrorException"}]},UpdateDeviceStatus:{name:"UpdateDeviceStatus",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateDeviceStatusRequest"},output:{shape:"UpdateDeviceStatusResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Updates the device status.</p>"},UpdateGroup:{name:"UpdateGroup",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateGroupRequest"},output:{shape:"UpdateGroupResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"InternalErrorException"}],documentation:"<p>Updates the specified group with the specified attributes.</p> <p>Requires developer credentials.</p>"},UpdateIdentityProvider:{name:"UpdateIdentityProvider",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateIdentityProviderRequest"},output:{shape:"UpdateIdentityProviderResponse"},errors:[{shape:"InvalidParameterException"},{shape:"UnsupportedIdentityProviderException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},UpdateResourceServer:{name:"UpdateResourceServer",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateResourceServerRequest"},output:{shape:"UpdateResourceServerResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"InternalErrorException"}]},UpdateUserAttributes:{name:"UpdateUserAttributes",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateUserAttributesRequest"},output:{shape:"UpdateUserAttributesResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"NotAuthorizedException"},{shape:"UnexpectedLambdaException"},{shape:"UserLambdaValidationException"},{shape:"InvalidLambdaResponseException"},{shape:"TooManyRequestsException"},{shape:"AliasExistsException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"InvalidEmailRoleAccessPolicyException"},{shape:"CodeDeliveryFailureException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Allows a user to update a specific attribute (one at a time).</p>",authtype:"none"},UpdateUserPool:{name:"UpdateUserPool",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateUserPoolRequest"},output:{shape:"UpdateUserPoolResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"ConcurrentModificationException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"UserImportInProgressException"},{shape:"InternalErrorException"},{shape:"InvalidSmsRoleAccessPolicyException"},{shape:"InvalidSmsRoleTrustRelationshipException"},{shape:"UserPoolTaggingException"},{shape:"InvalidEmailRoleAccessPolicyException"}],documentation:"<p>Updates the specified user pool with the specified attributes.</p>"},UpdateUserPoolClient:{name:"UpdateUserPoolClient",http:{method:"POST",requestUri:"/"},input:{shape:"UpdateUserPoolClientRequest"},output:{shape:"UpdateUserPoolClientResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"TooManyRequestsException"},{shape:"NotAuthorizedException"},{shape:"ScopeDoesNotExistException"},{shape:"InvalidOAuthFlowException"},{shape:"InternalErrorException"}],documentation:"<p>Allows the developer to update the specified user pool client and password policy.</p>"},VerifySoftwareToken:{name:"VerifySoftwareToken",http:{method:"POST",requestUri:"/"},input:{shape:"VerifySoftwareTokenRequest"},output:{shape:"VerifySoftwareTokenResponse"},errors:[{shape:"InvalidParameterException"},{shape:"ResourceNotFoundException"},{shape:"InvalidUserPoolConfigurationException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"},{shape:"EnableSoftwareTokenMFAException"},{shape:"SoftwareTokenMFANotFoundException"},{shape:"CodeMismatchException"}]},VerifyUserAttribute:{name:"VerifyUserAttribute",http:{method:"POST",requestUri:"/"},input:{shape:"VerifyUserAttributeRequest"},output:{shape:"VerifyUserAttributeResponse"},errors:[{shape:"ResourceNotFoundException"},{shape:"InvalidParameterException"},{shape:"CodeMismatchException"},{shape:"ExpiredCodeException"},{shape:"NotAuthorizedException"},{shape:"TooManyRequestsException"},{shape:"LimitExceededException"},{shape:"PasswordResetRequiredException"},{shape:"UserNotFoundException"},{shape:"UserNotConfirmedException"},{shape:"InternalErrorException"}],documentation:"<p>Verifies the specified user attributes in the user pool.</p>",authtype:"none"}},shapes:{AValueHexStringType:{type:"string",max:1024,min:1,pattern:"^[0-9a-fA-F]+$"},AWSAccountIdType:{type:"string"},AccountTakeoverActionNotifyType:{type:"boolean"},AccountTakeoverActionType:{type:"structure",required:["Notify","EventAction"],members:{Notify:{shape:"AccountTakeoverActionNotifyType"},EventAction:{shape:"AccountTakeoverEventActionType"}}},AccountTakeoverActionsType:{type:"structure",members:{LowAction:{shape:"AccountTakeoverActionType"},MediumAction:{shape:"AccountTakeoverActionType"},HighAction:{shape:"AccountTakeoverActionType"}}},AccountTakeoverEventActionType:{type:"string",enum:["BLOCK","MFA_IF_CONFIGURED","MFA_REQUIRED","NO_ACTION"]},AccountTakeoverRiskConfigurationType:{type:"structure",required:["Actions"],members:{NotifyConfiguration:{shape:"NotifyConfigurationType"},Actions:{shape:"AccountTakeoverActionsType"}}},AddCustomAttributesRequest:{type:"structure",required:["UserPoolId","CustomAttributes"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to add custom attributes.</p>"},CustomAttributes:{shape:"CustomAttributesListType",documentation:"<p>An array of custom attributes, such as Mutable and Name.</p>"}},documentation:"<p>Represents the request to add custom attributes.</p>"},AddCustomAttributesResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server for the request to add custom attributes.</p>"},AdminAddUserToGroupRequest:{type:"structure",required:["UserPoolId","Username","GroupName"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Username:{shape:"UsernameType",documentation:"<p>The username for the user.</p>"},GroupName:{shape:"GroupNameType",documentation:"<p>The group name.</p>"}}},AdminConfirmSignUpRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for which you want to confirm user registration.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name for which you want to confirm user registration.</p>"}},documentation:"<p>Represents the request to confirm user registration.</p>"},AdminConfirmSignUpResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server for the request to confirm registration.</p>"},AdminCreateUserConfigType:{type:"structure",members:{AllowAdminCreateUserOnly:{shape:"BooleanType",documentation:"<p>Set to True if only the administrator is allowed to create user profiles. Set to False if users can sign themselves up via an app.</p>"
},UnusedAccountValidityDays:{shape:"AdminCreateUserUnusedAccountValidityDaysType",documentation:'<p>The user account expiration limit, in days, after which the account is no longer usable. To reset the account after that time limit, you must call AdminCreateUser again, specifying "RESEND" for the MessageAction parameter. The default value for this parameter is 7.</p>'},InviteMessageTemplate:{shape:"MessageTemplateType",documentation:"<p>The message template to be used for the welcome message to new users.</p>"}},documentation:"<p>The type of configuration for creating a new user profile.</p>"},AdminCreateUserRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where the user will be created.</p>"},Username:{shape:"UsernameType",documentation:"<p>The username for the user. Must be unique within the user pool. Must be a UTF-8 string between 1 and 128 characters. After the user is created, the username cannot be changed.</p>"},UserAttributes:{shape:"AttributeListType",documentation:'<p>An array of name-value pairs that contain user attributes and attribute values to be set for the user to be created. You can create a user without specifying any attributes other than Username. However, any attributes that you specify as required (in CreateUserPool or in the <b>Attributes</b> tab of the console) must be supplied either by you (in your call to AdminCreateUser) or by the user (when he or she signs up in response to your welcome message).</p> <p>To send a message inviting the user to sign up, you must specify the user\'s email address or phone number. This can be done in your call to AdminCreateUser or in the <b>Users</b> tab of the Amazon Cognito console for managing your user pools.</p> <p>In your call to AdminCreateUser, you can set the email_verified attribute to True, and you can set the phone_number_verified attribute to True. (You also do this by calling <a href="API_AdminUpdateUserAttributes.html">AdminUpdateUserAttributes</a>.)</p> <ul> <li> <p> <b>email</b>: The email address of the user to whom the message that contains the code and username will be sent. Required if the email_verified attribute is set to True, or if "EMAIL" is specified in the DesiredDeliveryMediums parameter.</p> </li> <li> <p> <b>phone_number</b>: The phone number of the user to whom the message that contains the code and username will be sent. Required if the phone_number_verified attribute is set to True, or if "SMS" is specified in the DesiredDeliveryMediums parameter.</p> </li> </ul>'},ValidationData:{shape:"AttributeListType",documentation:"<p>The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain.</p> <p>To configure custom validation, you must create a Pre Sign-up Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process.</p> <p>The user's validation data is not persisted.</p>"},TemporaryPassword:{shape:"PasswordType",documentation:'<p>The user\'s temporary password. This password must conform to the password policy that you specified when you created the user pool.</p> <p>The temporary password is valid only once. To complete the Admin Create User flow, the user must enter the temporary password in the sign-in page along with a new password to be used in all future sign-ins.</p> <p>This parameter is not required. If you do not specify a value, Amazon Cognito generates one for you.</p> <p>The temporary password can only be used until the user account expiration limit that you specified when you created the user pool. To reset the account after that time limit, you must call AdminCreateUser again, specifying "RESEND" for the MessageAction parameter.</p>'},ForceAliasCreation:{shape:"ForceAliasCreation",documentation:"<p>This parameter is only used if the phone_number_verified or email_verified attribute is set to True. Otherwise, it is ignored.</p> <p>If this parameter is set to True and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias.</p> <p>If this parameter is set to False, the API throws an AliasExistsException error if the alias already exists. The default value is False.</p>"},MessageAction:{shape:"MessageActionType",documentation:'<p>Set to "RESEND" to resend the invitation message to a user that already exists and reset the expiration limit on the user\'s account. Set to "SUPPRESS" to suppress sending the message. Only one value can be specified.</p>'},DesiredDeliveryMediums:{shape:"DeliveryMediumListType",documentation:'<p>Specify "EMAIL" if email will be used to send the welcome message. Specify "SMS" if the phone number will be used. The default value is "SMS". More than one value can be specified.</p>'}},documentation:"<p>Represents the request to create a user in the specified user pool.</p>"},AdminCreateUserResponse:{type:"structure",members:{User:{shape:"UserType",documentation:"<p>The user returned in the request to create a new user.</p>"}},documentation:"<p>Represents the response from the server to the request to create the user.</p>"},AdminCreateUserUnusedAccountValidityDaysType:{type:"integer",max:365,min:0},AdminDeleteUserAttributesRequest:{type:"structure",required:["UserPoolId","Username","UserAttributeNames"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to delete user attributes.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user from which you would like to delete attributes.</p>"},UserAttributeNames:{shape:"AttributeNameListType",documentation:"<p>An array of strings representing the user attribute names you wish to delete.</p>"}},documentation:"<p>Represents the request to delete user attributes as an administrator.</p>"},AdminDeleteUserAttributesResponse:{type:"structure",members:{},documentation:"<p>Represents the response received from the server for a request to delete user attributes.</p>"},AdminDeleteUserRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to delete the user.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to delete.</p>"}},documentation:"<p>Represents the request to delete a user as an administrator.</p>"},AdminDisableProviderForUserRequest:{type:"structure",required:["UserPoolId","User"],members:{UserPoolId:{shape:"StringType"},User:{shape:"ProviderUserIdentifierType"}}},AdminDisableProviderForUserResponse:{type:"structure",members:{}},AdminDisableUserRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to disable the user.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to disable.</p>"}},documentation:"<p>Represents the request to disable any user as an administrator.</p>"},AdminDisableUserResponse:{type:"structure",members:{},documentation:"<p>Represents the response received from the server to disable the user as an administrator.</p>"},AdminEnableUserRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to enable the user.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to enable.</p>"}},documentation:"<p>Represents the request that enables the user as an administrator.</p>"},AdminEnableUserResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server for the request to enable a user as an administrator.</p>"},AdminForgetDeviceRequest:{type:"structure",required:["UserPoolId","Username","DeviceKey"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name.</p>"},DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"}},documentation:"<p>Sends the forgot device request, as an administrator.</p>"},AdminGetDeviceRequest:{type:"structure",required:["DeviceKey","UserPoolId","Username"],members:{DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name.</p>"}},documentation:"<p>Represents the request to get the device, as an administrator.</p>"},AdminGetDeviceResponse:{type:"structure",required:["Device"],members:{Device:{shape:"DeviceType",documentation:"<p>The device.</p>"}},documentation:"<p>Gets the device response, as an administrator.</p>"},AdminGetUserRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to get information about the user.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to retrieve.</p>"}},documentation:"<p>Represents the request to get the specified user as an administrator.</p>"},AdminGetUserResponse:{type:"structure",required:["Username"],members:{Username:{shape:"UsernameType",documentation:"<p>The user name of the user about whom you are receiving information.</p>"},UserAttributes:{shape:"AttributeListType",documentation:"<p>An array of name-value pairs representing user attributes.</p>"},UserCreateDate:{shape:"DateType",documentation:"<p>The date the user was created.</p>"},UserLastModifiedDate:{shape:"DateType",documentation:"<p>The date the user was last modified.</p>"},Enabled:{shape:"BooleanType",documentation:"<p>Indicates that the status is enabled.</p>"},UserStatus:{shape:"UserStatusType",documentation:"<p>The user status. Can be one of the following:</p> <ul> <li> <p>UNCONFIRMED - User has been created but not confirmed.</p> </li> <li> <p>CONFIRMED - User has been confirmed.</p> </li> <li> <p>ARCHIVED - User is no longer active.</p> </li> <li> <p>COMPROMISED - User is disabled due to a potential security threat.</p> </li> <li> <p>UNKNOWN - User status is not known.</p> </li> </ul>"},MFAOptions:{shape:"MFAOptionListType",documentation:"<p>Specifies the options for MFA (e.g., email or phone number).</p>"}},documentation:"<p>Represents the response from the server from the request to get the specified user as an administrator.</p>"},AdminInitiateAuthRequest:{type:"structure",required:["UserPoolId","ClientId","AuthFlow"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The ID of the Amazon Cognito user pool.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The app client ID.</p>"},AuthFlow:{shape:"AuthFlowType",documentation:"<p>The authentication flow for this call to execute. The API action will depend on this value. For example:</p> <ul> <li> <p> <code>REFRESH_TOKEN_AUTH</code> will take in a valid refresh token and return new tokens.</p> </li> <li> <p> <code>USER_SRP_AUTH</code> will take in <code>USERNAME</code> and <code>SRPA</code> and return the SRP variables to be used for next challenge execution.</p> </li> </ul> <p>Valid values include:</p> <ul> <li> <p> <code>USER_SRP_AUTH</code>: Authentication flow for the Secure Remote Password (SRP) protocol.</p> </li> <li> <p> <code>REFRESH_TOKEN_AUTH</code>/<code>REFRESH_TOKEN</code>: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.</p> </li> <li> <p> <code>CUSTOM_AUTH</code>: Custom authentication flow.</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: Non-SRP authentication flow; you can pass in the USERNAME and PASSWORD directly if the flow is enabled for calling the app client.</p> </li> </ul>"},AuthParameters:{shape:"AuthParametersType",documentation:"<p>The authentication parameters. These are inputs corresponding to the <code>AuthFlow</code> that you are invoking. The required values depend on the value of <code>AuthFlow</code>:</p> <ul> <li> <p>For <code>USER_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SRPA</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>REFRESH_TOKEN_AUTH/REFRESH_TOKEN</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>REFRESH_TOKEN</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>ADMIN_NO_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>PASSWORD</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>CUSTOM_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>DEVICE_KEY</code> </p> </li> </ul>"},ClientMetadata:{shape:"ClientMetadataType",documentation:"<p>This is a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},ContextData:{shape:"ContextDataType"}},documentation:"<p>Initiates the authorization request, as an administrator.</p>"},AdminInitiateAuthResponse:{type:"structure",members:{ChallengeName:{shape:"ChallengeNameType",documentation:"<p>The name of the challenge which you are responding to with this call. This is returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge.</p> <ul> <li> <p> <code>SMS_MFA</code>: Next challenge is to supply an <code>SMS_MFA_CODE</code>, delivered via SMS.</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: Next challenge is to supply <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, and <code>TIMESTAMP</code> after the client-side SRP calculations.</p> </li> <li> <p> <code>CUSTOM_CHALLENGE</code>: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.</p> </li> <li> <p> <code>DEVICE_SRP_AUTH</code>: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.</p> </li> <li> <p> <code>DEVICE_PASSWORD_VERIFIER</code>: Similar to <code>PASSWORD_VERIFIER</code>, but for devices only.</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: This is returned if you need to authenticate with <code>USERNAME</code> and <code>PASSWORD</code> directly. An app client must be enabled to use this flow.</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: For users which are required to change their passwords after successful first login. This challenge should be passed with <code>NEW_PASSWORD</code> and any other required attributes.</p> </li> </ul>"},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>AdminInitiateAuth</code> or <code>AdminRespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>AdminRespondToAuthChallenge</code> API call.</p>"},ChallengeParameters:{shape:"ChallengeParametersType",documentation:"<p>The challenge parameters. These are returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (<code>AdminRespondToAuthChallenge</code>). </p> <p>All challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable).</p> <p>The value of the <code>USER_IF_FOR_SRP</code> attribute will be the user's actual username, not an alias (such as email address or phone number), even if you specified an alias in your call to <code>AdminInitiateAuth</code>. This is because, in the <code>AdminRespondToAuthChallenge</code> API <code>ChallengeResponses</code>, the <code>USERNAME</code> attribute cannot be an alias.</p>"},AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, <code>ChallengeName</code>, <code>ChallengeParameters</code>, and <code>Session</code> are returned.</p>"}},documentation:"<p>Initiates the authentication response, as an administrator.</p>"},AdminLinkProviderForUserRequest:{type:"structure",required:["UserPoolId","DestinationUser","SourceUser"],members:{UserPoolId:{shape:"StringType"},DestinationUser:{shape:"ProviderUserIdentifierType"},SourceUser:{shape:"ProviderUserIdentifierType"}}},AdminLinkProviderForUserResponse:{type:"structure",members:{}},AdminListDevicesRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>The limit of the devices request.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>The pagination token.</p>"}},documentation:"<p>Represents the request to list devices, as an administrator.</p>"},AdminListDevicesResponse:{type:"structure",members:{Devices:{shape:"DeviceListType",documentation:"<p>The devices in the list of devices response.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>The pagination token.</p>"}},documentation:"<p>Lists the device's response, as an administrator.</p>"},AdminListGroupsForUserRequest:{type:"structure",required:["Username","UserPoolId"],members:{Username:{shape:"UsernameType",documentation:"<p>The username for the user.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>The limit of the request to list groups.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},AdminListGroupsForUserResponse:{type:"structure",members:{Groups:{shape:"GroupListType",documentation:"<p>The groups that the user belongs to.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},AdminListUserAuthEventsRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType"},Username:{shape:"UsernameType"},MaxResults:{shape:"QueryLimitType"},NextToken:{shape:"PaginationKey"}}},AdminListUserAuthEventsResponse:{type:"structure",members:{AuthEvents:{shape:"AuthEventsType"},NextToken:{shape:"PaginationKey"}}},AdminRemoveUserFromGroupRequest:{type:"structure",required:["UserPoolId","Username","GroupName"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Username:{shape:"UsernameType",documentation:"<p>The username for the user.</p>"},GroupName:{shape:"GroupNameType",documentation:"<p>The group name.</p>"}}},AdminResetUserPasswordRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to reset the user's password.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user whose password you wish to reset.</p>"}},documentation:"<p>Represents the request to reset a user's password as an administrator.</p>"},AdminResetUserPasswordResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server to reset a user password as an administrator.</p>"},AdminRespondToAuthChallengeRequest:{type:"structure",required:["UserPoolId","ClientId","ChallengeName"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The ID of the Amazon Cognito user pool.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The app client ID.</p>"},ChallengeName:{shape:"ChallengeNameType",documentation:'<p>The challenge name. For more information, see <a href="API_AdminInitiateAuth.html">AdminInitiateAuth</a>.</p>'},ChallengeResponses:{shape:"ChallengeResponsesType",documentation:"<p>The challenge responses. These are inputs corresponding to the value of <code>ChallengeName</code>, for example:</p> <ul> <li> <p> <code>SMS_MFA</code>: <code>SMS_MFA_CODE</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, <code>TIMESTAMP</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>ADMIN_NO_SRP_AUTH</code>: <code>PASSWORD</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: <code>NEW_PASSWORD</code>, any other required attributes, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> </ul> <p>The value of the <code>USERNAME</code> attribute must be the user's actual username, not an alias (such as email address or phone number). To make this easier, the <code>AdminInitiateAuth</code> response includes the actual username value in the <code>USERNAMEUSER_ID_FOR_SRP</code> attribute, even if you specified an alias in your call to <code>AdminInitiateAuth</code>.</p>"},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},ContextData:{shape:"ContextDataType"}},documentation:"<p>The request to respond to the authentication challenge, as an administrator.</p>"},AdminRespondToAuthChallengeResponse:{type:"structure",members:{ChallengeName:{shape:"ChallengeNameType",documentation:'<p>The name of the challenge. For more information, see <a href="API_AdminInitiateAuth.html">AdminInitiateAuth</a>.</p>'},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"},ChallengeParameters:{shape:"ChallengeParametersType",documentation:'<p>The challenge parameters. For more information, see <a href="API_AdminInitiateAuth.html">AdminInitiateAuth</a>.</p>'},AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The result returned by the server in response to the authentication request.</p>"}},documentation:"<p>Responds to the authentication challenge, as an administrator.</p>"},AdminSetUserMFAPreferenceRequest:{type:"structure",required:["Username","UserPoolId"],members:{SMSMfaSettings:{shape:"SMSMfaSettingsType"},SoftwareTokenMfaSettings:{shape:"SoftwareTokenMfaSettingsType"},Username:{shape:"UsernameType"},UserPoolId:{shape:"UserPoolIdType"}}},AdminSetUserMFAPreferenceResponse:{type:"structure",members:{}},AdminSetUserSettingsRequest:{type:"structure",required:["UserPoolId","Username","MFAOptions"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to set the user's settings, such as MFA options.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you wish to set user settings.</p>"},MFAOptions:{shape:"MFAOptionListType",documentation:"<p>Specifies the options for MFA (e.g., email or phone number).</p>"}},documentation:"<p>Represents the request to set user settings as an administrator.</p>"},AdminSetUserSettingsResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server to set user settings as an administrator.</p>"},AdminUpdateAuthEventFeedbackRequest:{type:"structure",required:["UserPoolId","Username","EventId","FeedbackValue"],members:{UserPoolId:{shape:"UserPoolIdType"},Username:{shape:"UsernameType"},EventId:{shape:"EventIdType"},FeedbackValue:{shape:"FeedbackValueType"}}},AdminUpdateAuthEventFeedbackResponse:{type:"structure",members:{}},AdminUpdateDeviceStatusRequest:{type:"structure",required:["UserPoolId","Username","DeviceKey"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID&gt;</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name.</p>"},DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},DeviceRememberedStatus:{shape:"DeviceRememberedStatusType",documentation:"<p>The status indicating whether a device has been remembered or not.</p>"}},documentation:"<p>The request to update the device status, as an administrator.</p>"},AdminUpdateDeviceStatusResponse:{type:"structure",members:{},documentation:"<p>The status response from the request to update the device, as an administrator.</p>"},AdminUpdateUserAttributesRequest:{type:"structure",required:["UserPoolId","Username","UserAttributes"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to update user attributes.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you want to update user attributes.</p>"},UserAttributes:{shape:"AttributeListType",documentation:"<p>An array of name-value pairs representing user attributes.</p>"}},documentation:"<p>Represents the request to update the user's attributes as an administrator.</p>"},AdminUpdateUserAttributesResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server for the request to update user attributes as an administrator.</p>"},AdminUserGlobalSignOutRequest:{type:"structure",required:["UserPoolId","Username"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name.</p>"}},documentation:"<p>The request to sign out of all devices, as an administrator.</p>"},AdminUserGlobalSignOutResponse:{type:"structure",members:{},documentation:"<p>The global sign-out response, as an administrator.</p>"},AdvancedSecurityModeType:{type:"string",enum:["OFF","AUDIT","ENFORCED"]},AliasAttributeType:{type:"string",enum:["phone_number","email","preferred_username"]},AliasAttributesListType:{type:"list",member:{shape:"AliasAttributeType"}},AliasExistsException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message sent to the user when an alias exists.</p>"}},documentation:"<p>This exception is thrown when a user tries to confirm the account with an email or phone number that has already been supplied as an alias from a different account. This exception tells user that an account with this email or phone already exists.</p>",exception:!0},AnalyticsConfigurationType:{type:"structure",required:["ApplicationId","RoleArn","ExternalId"],members:{ApplicationId:{shape:"HexStringType"},RoleArn:{shape:"ArnType"},ExternalId:{shape:"StringType"},UserDataShared:{shape:"BooleanType"}}},AnalyticsMetadataType:{type:"structure",members:{AnalyticsEndpointId:{shape:"StringType"}}},ArnType:{type:"string",max:2048,min:20,pattern:"arn:[\\w+=/,.@-]+:[\\w+=/,.@-]+:([\\w+=/,.@-]*)?:[0-9]+:[\\w+=/,.@-]+(:[\\w+=/,.@-]+)?(:[\\w+=/,.@-]+)?"},AssociateSoftwareTokenRequest:{type:"structure",members:{AccessToken:{shape:"TokenModelType"},Session:{shape:"SessionType"}}},AssociateSoftwareTokenResponse:{type:"structure",members:{SecretCode:{shape:"SecretCodeType"},Session:{shape:"SessionType"}}},AttributeDataType:{type:"string",enum:["String","Number","DateTime","Boolean"]},AttributeListType:{type:"list",member:{shape:"AttributeType"}},AttributeMappingKeyType:{type:"string",max:32,min:1},AttributeMappingType:{type:"map",key:{shape:"AttributeMappingKeyType"},value:{shape:"StringType"}},AttributeNameListType:{type:"list",member:{shape:"AttributeNameType"}},AttributeNameType:{type:"string",max:32,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},AttributeType:{type:"structure",required:["Name"],members:{Name:{shape:"AttributeNameType",documentation:"<p>The name of the attribute.</p>"},Value:{shape:"AttributeValueType",documentation:"<p>The value of the attribute.</p>"}},documentation:"<p>Specifies whether the attribute is standard or custom.</p>"},AttributeValueType:{type:"string",max:2048,sensitive:!0},AuthEventType:{type:"structure",members:{EventId:{shape:"StringType"},EventType:{shape:"EventType"},CreationDate:{shape:"DateType"},EventResponse:{shape:"EventResponseType"},EventRisk:{shape:"EventRiskType"},ChallengeResponses:{shape:"ChallengeResponseListType"},EventContextData:{shape:"EventContextDataType"},EventFeedback:{shape:"EventFeedbackType"}}},AuthEventsType:{type:"list",member:{shape:"AuthEventType"}},AuthFlowType:{type:"string",enum:["USER_SRP_AUTH","REFRESH_TOKEN_AUTH","REFRESH_TOKEN","CUSTOM_AUTH","ADMIN_NO_SRP_AUTH"]},AuthParametersType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},AuthStateType:{type:"string",pattern:"[A-Za-z0-9-_+/=]+",sensitive:!0},AuthenticateRequest:{type:"structure",required:["ClientId","Username","PasswordClaim"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to authenticate.</p>"},PasswordClaim:{shape:"PasswordClaimType",documentation:"<p>The password claim of the authentication request.</p>"},Timestamp:{shape:"DateType",documentation:"<p>The timestamp of the authentication request.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the request to authenticate.</p>"},AuthenticateResponse:{type:"structure",members:{AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The result of the authentication response.</p>"},AuthState:{shape:"AuthStateType",documentation:"<p>The authorization state of the authentication response.</p>"},CodeDeliveryDetails:{shape:"CodeDeliveryDetailsType",documentation:"<p>The code delivery details returned by the server in the response to the authentication request.</p>"}},documentation:"<p>Represents the authentication response.</p>"},AuthenticationResultType:{type:"structure",members:{
AccessToken:{shape:"TokenModelType",documentation:"<p>The access token of the authentication result.</p>"},ExpiresIn:{shape:"IntegerType",documentation:"<p>The expiration period of the authentication result.</p>"},TokenType:{shape:"StringType",documentation:"<p>The token type of the authentication result.</p>"},RefreshToken:{shape:"TokenModelType",documentation:"<p>The refresh token of the authentication result.</p>"},IdToken:{shape:"TokenModelType",documentation:"<p>The ID token of the authentication result.</p>"},NewDeviceMetadata:{shape:"NewDeviceMetadataType",documentation:"<p>The new device metadata from an authentication result.</p>"}},documentation:"<p>The result type of the authentication result.</p>"},BlobType:{type:"blob"},BlockedIPRangeListType:{type:"list",member:{shape:"StringType"},max:20},BooleanType:{type:"boolean"},BotActionType:{type:"structure",required:["EventAction"],members:{EventAction:{shape:"BotEventActionType"}}},BotActionsType:{type:"structure",members:{LowAction:{shape:"BotActionType"},MediumAction:{shape:"BotActionType"},HighAction:{shape:"BotActionType"}}},BotEventActionType:{type:"string",enum:["BLOCK","NO_ACTION"]},BotRiskConfigurationType:{type:"structure",required:["Actions"],members:{EventFilter:{shape:"EventFiltersType"},Actions:{shape:"BotActionsType"}}},CSSType:{type:"string"},CSSVersionType:{type:"string"},CallbackURLsListType:{type:"list",member:{shape:"RedirectUrlType"},max:100,min:0},ChallengeName:{type:"string",enum:["Password","Mfa"]},ChallengeNameType:{type:"string",enum:["SMS_MFA","SOFTWARE_TOKEN_MFA","SELECT_MFA_TYPE","MFA_SETUP","PASSWORD_VERIFIER","CUSTOM_CHALLENGE","DEVICE_SRP_AUTH","DEVICE_PASSWORD_VERIFIER","ADMIN_NO_SRP_AUTH","NEW_PASSWORD_REQUIRED"]},ChallengeParametersType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},ChallengeResponse:{type:"string",enum:["Success","Failure"]},ChallengeResponseListType:{type:"list",member:{shape:"ChallengeResponseType"}},ChallengeResponseType:{type:"structure",members:{ChallengeName:{shape:"ChallengeName"},ChallengeResponse:{shape:"ChallengeResponse"}}},ChallengeResponsesType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},ChangePasswordRequest:{type:"structure",required:["PreviousPassword","ProposedPassword","AccessToken"],members:{PreviousPassword:{shape:"PasswordType",documentation:"<p>The old password in the change password request.</p>"},ProposedPassword:{shape:"PasswordType",documentation:"<p>The new password in the change password request.</p>"},AccessToken:{shape:"TokenModelType",documentation:"<p>The access token in the change password request.</p>"}},documentation:"<p>Represents the request to change a user password.</p>"},ChangePasswordResponse:{type:"structure",members:{},documentation:"<p>The response from the server to the change password request.</p>"},ClientIdType:{type:"string",max:128,min:1,pattern:"[\\w+]+",sensitive:!0},ClientMetadataType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},ClientNameType:{type:"string",max:128,min:1,pattern:"[\\w\\s+=,.@-]+"},ClientPermissionListType:{type:"list",member:{shape:"ClientPermissionType"}},ClientPermissionType:{type:"string",max:2048,min:1},ClientSecretType:{type:"string",max:64,min:1,pattern:"[\\w+]+",sensitive:!0},CodeDeliveryDetailsListType:{type:"list",member:{shape:"CodeDeliveryDetailsType"}},CodeDeliveryDetailsType:{type:"structure",members:{Destination:{shape:"StringType",documentation:"<p>The destination for the code delivery details.</p>"},DeliveryMedium:{shape:"DeliveryMediumType",documentation:"<p>The delivery medium (email message or phone number).</p>"},AttributeName:{shape:"AttributeNameType",documentation:"<p>The name of the attribute in the code delivery details type.</p>"}},documentation:"<p>The type of code delivery details being returned from the server.</p>"},CodeDeliveryFailureException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message sent when a verification code fails to deliver successfully.</p>"}},documentation:"<p>This exception is thrown when a verification code fails to deliver successfully.</p>",exception:!0},CodeMismatchException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message provided when the code mismatch exception is thrown.</p>"}},documentation:"<p>This exception is thrown if the provided code does not match what the server was expecting.</p>",exception:!0},CompletionMessageType:{type:"string",max:128,min:1,pattern:"[\\w]+"},CompromisedCredentialsActionsType:{type:"structure",required:["EventAction"],members:{EventAction:{shape:"CompromisedCredentialsEventActionType"}}},CompromisedCredentialsEventActionType:{type:"string",enum:["BLOCK","NO_ACTION"]},CompromisedCredentialsRiskConfigurationType:{type:"structure",required:["Actions"],members:{EventFilter:{shape:"EventFiltersType"},Actions:{shape:"CompromisedCredentialsActionsType"}}},ConcurrentModificationException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message provided when the concurrent exception is thrown.</p>"}},documentation:"<p>This exception is thrown if two or more modifications are happening concurrently.</p>",exception:!0},ConfirmDeviceRequest:{type:"structure",required:["AccessToken","DeviceKey"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token.</p>"},DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},DeviceSecretVerifierConfig:{shape:"DeviceSecretVerifierConfigType",documentation:"<p>The configuration of the device secret verifier.</p>"},DeviceName:{shape:"DeviceNameType",documentation:"<p>The device name.</p>"}},documentation:"<p>Confirms the device request.</p>"},ConfirmDeviceResponse:{type:"structure",members:{UserConfirmationNecessary:{shape:"BooleanType",documentation:"<p>Indicates whether the user confirmation is necessary to confirm the device response.</p>"}},documentation:"<p>Confirms the device response.</p>"},ConfirmForgotPasswordRequest:{type:"structure",required:["ClientId","Username","ConfirmationCode","Password"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you want to enter a code to retrieve a forgotten password.</p>"},ConfirmationCode:{shape:"ConfirmationCodeType",documentation:'<p>The confirmation code sent by a user\'s request to retrieve a forgotten password. For more information, see <a href="API_ForgotPassword.html">ForgotPassword</a> </p>'},Password:{shape:"PasswordType",documentation:"<p>The password sent by a user's request to retrieve a forgotten password.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},UserContextData:{shape:"UserContextDataType"}},documentation:"<p>The request representing the confirmation for a password reset.</p>"},ConfirmForgotPasswordResponse:{type:"structure",members:{},documentation:"<p>The response from the server that results from a user's request to retrieve a forgotten password.</p>"},ConfirmSignUpRequest:{type:"structure",required:["ClientId","Username","ConfirmationCode"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user whose registration you wish to confirm.</p>"},ConfirmationCode:{shape:"ConfirmationCodeType",documentation:"<p>The confirmation code sent by a user's request to confirm registration.</p>"},ForceAliasCreation:{shape:"ForceAliasCreation",documentation:"<p>Boolean to be specified to force user confirmation irrespective of existing alias. By default set to False. If this parameter is set to True and the phone number/email used for sign up confirmation already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user being confirmed. If set to False, the API will throw an <b>AliasExistsException</b> error.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},UserContextData:{shape:"UserContextDataType"}},documentation:"<p>Represents the request to confirm registration of a user.</p>"},ConfirmSignUpResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server for the registration confirmation.</p>"},ConfirmationCodeType:{type:"string",max:2048,min:1,pattern:"[\\S]+"},ContextDataType:{type:"structure",required:["IpAddress","ServerName","ServerPath","HttpHeaders","EncodedData"],members:{IpAddress:{shape:"StringType"},ServerName:{shape:"StringType"},ServerPath:{shape:"StringType"},HttpHeaders:{shape:"HttpHeaderList"},EncodedData:{shape:"StringType"}}},CreateGroupRequest:{type:"structure",required:["GroupName","UserPoolId"],members:{GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group. Must be unique.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Description:{shape:"DescriptionType",documentation:"<p>A string containing the description of the group.</p>"},RoleArn:{shape:"ArnType",documentation:"<p>The role ARN for the group.</p>"},Precedence:{shape:"PrecedenceType",documentation:"<p>A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower <code>Precedence</code> values take precedence over groups with higher or null <code>Precedence</code> values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN will be used in the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the user's tokens.</p> <p>Two groups can have the same <code>Precedence</code> value. If this happens, neither group takes precedence over the other. If two groups with the same <code>Precedence</code> have the same role ARN, that role is used in the <code>cognito:preferred_role</code> claim in tokens for users in each group. If the two groups have different role ARNs, the <code>cognito:preferred_role</code> claim is not set in users' tokens.</p> <p>The default <code>Precedence</code> value is null.</p>"}}},CreateGroupResponse:{type:"structure",members:{Group:{shape:"GroupType",documentation:"<p>The group object for the group.</p>"}}},CreateIdentityProviderRequest:{type:"structure",required:["UserPoolId","ProviderName","ProviderType","ProviderDetails"],members:{UserPoolId:{shape:"UserPoolIdType"},ProviderName:{shape:"ProviderNameTypeV1"},ProviderType:{shape:"IdentityProviderTypeType"},ProviderDetails:{shape:"ProviderDetailsType"},AttributeMapping:{shape:"AttributeMappingType"},IdpIdentifiers:{shape:"IdpIdentifiersListType"}}},CreateIdentityProviderResponse:{type:"structure",required:["IdentityProvider"],members:{IdentityProvider:{shape:"IdentityProviderType"}}},CreateResourceServerRequest:{type:"structure",required:["UserPoolId","Identifier","Name"],members:{UserPoolId:{shape:"UserPoolIdType"},Identifier:{shape:"ResourceServerIdentifierType"},Name:{shape:"ResourceServerNameType"},Scopes:{shape:"ResourceServerScopeListType"}}},CreateResourceServerResponse:{type:"structure",required:["ResourceServer"],members:{ResourceServer:{shape:"ResourceServerType"}}},CreateUserImportJobRequest:{type:"structure",required:["JobName","UserPoolId","CloudWatchLogsRoleArn"],members:{JobName:{shape:"UserImportJobNameType",documentation:"<p>The job name for the user import job.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},CloudWatchLogsRoleArn:{shape:"ArnType",documentation:"<p>The role ARN for the Amazon CloudWatch Logging role for the user import job.</p>"}},documentation:"<p>Represents the request to create the user import job.</p>"},CreateUserImportJobResponse:{type:"structure",members:{UserImportJob:{shape:"UserImportJobType",documentation:"<p>The job object that represents the user import job.</p>"}},documentation:"<p>Represents the response from the server to the request to create the user import job.</p>"},CreateUserPoolClientRequest:{type:"structure",required:["UserPoolId","ClientName"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to create a user pool client.</p>"},ClientName:{shape:"ClientNameType",documentation:"<p>The client name for the user pool client you would like to create.</p>"},GenerateSecret:{shape:"GenerateSecret",documentation:"<p>Boolean to specify whether you want to generate a secret for the user pool client being created.</p>"},RefreshTokenValidity:{shape:"RefreshTokenValidityType",documentation:"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"},ReadAttributes:{shape:"ClientPermissionListType",documentation:"<p>The read attributes.</p>"},WriteAttributes:{shape:"ClientPermissionListType",documentation:"<p>The write attributes.</p>"},ExplicitAuthFlows:{shape:"ExplicitAuthFlowsListType",documentation:"<p>The explicit authentication flows.</p>"},SupportedIdentityProviders:{shape:"SupportedIdentityProvidersListType"},CallbackURLs:{shape:"CallbackURLsListType"},LogoutURLs:{shape:"LogoutURLsListType"},DefaultRedirectURI:{shape:"RedirectUrlType"},AllowedOAuthFlows:{shape:"OAuthFlowsType"},AllowedOAuthScopes:{shape:"ScopeListType"},AllowedOAuthFlowsUserPoolClient:{shape:"BooleanType"},AnalyticsConfiguration:{shape:"AnalyticsConfigurationType"}},documentation:"<p>Represents the request to create a user pool client.</p>"},CreateUserPoolClientResponse:{type:"structure",members:{UserPoolClient:{shape:"UserPoolClientType",documentation:"<p>The user pool client that was just created.</p>"}},documentation:"<p>Represents the response from the server to create a user pool client.</p>"},CreateUserPoolDomainRequest:{type:"structure",required:["Domain","UserPoolId"],members:{Domain:{shape:"DomainType"},UserPoolId:{shape:"UserPoolIdType"}}},CreateUserPoolDomainResponse:{type:"structure",members:{}},CreateUserPoolRequest:{type:"structure",required:["PoolName"],members:{PoolName:{shape:"UserPoolNameType",documentation:"<p>A string used to name the user pool.</p>"},Policies:{shape:"UserPoolPolicyType",documentation:"<p>The policies associated with the new user pool.</p>"},LambdaConfig:{shape:"LambdaConfigType",documentation:"<p>The Lambda trigger configuration information for the new user pool.</p>"},AutoVerifiedAttributes:{shape:"VerifiedAttributesListType",documentation:"<p>The attributes to be auto-verified. Possible values: <b>email</b>, <b>phone_number</b>.</p>"},AliasAttributes:{shape:"AliasAttributesListType",documentation:"<p>Attributes supported as an alias for this user pool. Possible values: <b>phone_number</b>, <b>email</b>, or <b>preferred_username</b>.</p>"},UsernameAttributes:{shape:"UsernameAttributesListType"},SmsVerificationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>A string representing the SMS verification message.</p>"},EmailVerificationMessage:{shape:"EmailVerificationMessageType",documentation:"<p>A string representing the email verification message.</p>"},EmailVerificationSubject:{shape:"EmailVerificationSubjectType",documentation:"<p>A string representing the email verification subject.</p>"},VerificationMessageTemplate:{shape:"VerificationMessageTemplateType"},SmsAuthenticationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>A string representing the SMS authentication message.</p>"},MfaConfiguration:{shape:"UserPoolMfaType",documentation:"<p>Specifies MFA configuration details.</p>"},DeviceConfiguration:{shape:"DeviceConfigurationType",documentation:"<p>The device configuration.</p>"},EmailConfiguration:{shape:"EmailConfigurationType",documentation:"<p>The email configuration.</p>"},SmsConfiguration:{shape:"SmsConfigurationType",documentation:"<p>The SMS configuration.</p>"},UserPoolTags:{shape:"UserPoolTagsType",documentation:'<p>The cost allocation tags for the user pool. For more information, see <a href="http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html">Adding Cost Allocation Tags to Your User Pool</a> </p>'},AdminCreateUserConfig:{shape:"AdminCreateUserConfigType",documentation:"<p>The configuration for AdminCreateUser requests.</p>"},Schema:{shape:"SchemaAttributesListType",documentation:"<p>An array of schema attributes for the new user pool. These attributes can be standard or custom attributes.</p>"},UserPoolAddOns:{shape:"UserPoolAddOnsType"}},documentation:"<p>Represents the request to create a user pool.</p>"},CreateUserPoolResponse:{type:"structure",members:{UserPool:{shape:"UserPoolType",documentation:"<p>A container for the user pool details.</p>"}},documentation:"<p>Represents the response from the server for the request to create a user pool.</p>"},CustomAttributeNameType:{type:"string",max:20,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},CustomAttributesListType:{type:"list",member:{shape:"SchemaAttributeType"},max:25,min:1},DateType:{type:"timestamp"},DefaultEmailOptionType:{type:"string",enum:["CONFIRM_WITH_LINK","CONFIRM_WITH_CODE"]},DeleteGroupRequest:{type:"structure",required:["GroupName","UserPoolId"],members:{GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"}}},DeleteIdentityProviderRequest:{type:"structure",required:["UserPoolId","ProviderName"],members:{UserPoolId:{shape:"UserPoolIdType"},ProviderName:{shape:"ProviderNameType"}}},DeleteResourceServerRequest:{type:"structure",required:["UserPoolId","Identifier"],members:{UserPoolId:{shape:"UserPoolIdType"},Identifier:{shape:"ResourceServerIdentifierType"}}},DeleteUserAttributesRequest:{type:"structure",required:["UserAttributeNames","AccessToken"],members:{UserAttributeNames:{shape:"AttributeNameListType",documentation:"<p>An array of strings representing the user attribute names you wish to delete.</p>"},AccessToken:{shape:"TokenModelType",documentation:"<p>The access token used in the request to delete user attributes.</p>"}},documentation:"<p>Represents the request to delete user attributes.</p>"},DeleteUserAttributesResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server to delete user attributes.</p>"},DeleteUserPoolClientRequest:{type:"structure",required:["UserPoolId","ClientId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to delete the client.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"}},documentation:"<p>Represents the request to delete a user pool client.</p>"},DeleteUserPoolDomainRequest:{type:"structure",required:["Domain","UserPoolId"],members:{Domain:{shape:"DomainType"},UserPoolId:{shape:"UserPoolIdType"}}},DeleteUserPoolDomainResponse:{type:"structure",members:{}},DeleteUserPoolRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool you want to delete.</p>"}},documentation:"<p>Represents the request to delete a user pool.</p>"},DeleteUserRequest:{type:"structure",required:["AccessToken"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token from a request to delete a user.</p>"}},documentation:"<p>Represents the request to delete a user.</p>"},DeliveryMediumListType:{type:"list",member:{shape:"DeliveryMediumType"}},DeliveryMediumType:{type:"string",enum:["SMS","EMAIL"]},DescribeIdentityProviderRequest:{type:"structure",required:["UserPoolId","ProviderName"],members:{UserPoolId:{shape:"UserPoolIdType"},ProviderName:{shape:"ProviderNameType"}}},DescribeIdentityProviderResponse:{type:"structure",required:["IdentityProvider"],members:{IdentityProvider:{shape:"IdentityProviderType"}}},DescribeResourceServerRequest:{type:"structure",required:["UserPoolId","Identifier"],members:{UserPoolId:{shape:"UserPoolIdType"},Identifier:{shape:"ResourceServerIdentifierType"}}},DescribeResourceServerResponse:{type:"structure",required:["ResourceServer"],members:{ResourceServer:{shape:"ResourceServerType"}}},DescribeRiskConfigurationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"}}},DescribeRiskConfigurationResponse:{type:"structure",required:["RiskConfiguration"],members:{RiskConfiguration:{shape:"RiskConfigurationType"}}},DescribeUserImportJobRequest:{type:"structure",required:["UserPoolId","JobId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},JobId:{shape:"UserImportJobIdType",documentation:"<p>The job ID for the user import job.</p>"}},documentation:"<p>Represents the request to describe the user import job.</p>"},DescribeUserImportJobResponse:{type:"structure",members:{UserImportJob:{shape:"UserImportJobType",documentation:"<p>The job object that represents the user import job.</p>"}},documentation:"<p>Represents the response from the server to the request to describe the user import job.</p>"},DescribeUserPoolClientRequest:{type:"structure",required:["UserPoolId","ClientId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool you want to describe.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"}},documentation:"<p>Represents the request to describe a user pool client.</p>"},DescribeUserPoolClientResponse:{type:"structure",members:{UserPoolClient:{shape:"UserPoolClientType",documentation:"<p>The user pool client from a server response to describe the user pool client.</p>"}},documentation:"<p>Represents the response from the server from a request to describe the user pool client.</p>"},DescribeUserPoolDomainRequest:{type:"structure",required:["Domain"],members:{Domain:{shape:"DomainType"}}},DescribeUserPoolDomainResponse:{type:"structure",members:{DomainDescription:{shape:"DomainDescriptionType"}}},DescribeUserPoolRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool you want to describe.</p>"}},documentation:"<p>Represents the request to describe the user pool.</p>"},DescribeUserPoolResponse:{type:"structure",members:{UserPool:{shape:"UserPoolType",documentation:"<p>The container of metadata returned by the server to describe the pool.</p>"}},documentation:"<p>Represents the response to describe the user pool.</p>"},DescriptionType:{type:"string",max:2048},DeviceConfigurationType:{type:"structure",members:{ChallengeRequiredOnNewDevice:{shape:"BooleanType",documentation:"<p>Indicates whether a challenge is required on a new device. Only applicable to a new device.</p>"},DeviceOnlyRememberedOnUserPrompt:{shape:"BooleanType",documentation:"<p>If true, a device is only remembered on user prompt.</p>"}},documentation:"<p>The type of configuration for the user pool's device tracking.</p>"},DeviceKeyType:{type:"string",max:55,min:1,pattern:"[\\w-]+_[0-9a-f-]+"},DeviceListType:{type:"list",member:{shape:"DeviceType"}},DeviceNameType:{type:"string",max:1024,min:1},DeviceRememberedStatusType:{type:"string",enum:["remembered","not_remembered"]},DeviceSecretVerifierConfigType:{type:"structure",members:{PasswordVerifier:{shape:"StringType",documentation:"<p>The password verifier.</p>"},Salt:{shape:"StringType",documentation:"<p>The salt.</p>"}},documentation:"<p>The device verifier against which it will be authenticated.</p>"},DeviceType:{type:"structure",members:{DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},DeviceAttributes:{shape:"AttributeListType",documentation:"<p>The device attributes.</p>"},DeviceCreateDate:{shape:"DateType",documentation:"<p>The creation date of the device.</p>"},DeviceLastModifiedDate:{shape:"DateType",documentation:"<p>The last modified date of the device.</p>"},DeviceLastAuthenticatedDate:{shape:"DateType",documentation:"<p>The date in which the device was last authenticated.</p>"}},documentation:"<p>The device type.</p>"},DomainDescriptionType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},AWSAccountId:{shape:"AWSAccountIdType"},Domain:{shape:"DomainType"},S3Bucket:{shape:"S3BucketType"},CloudFrontDistribution:{shape:"ArnType"},Version:{shape:"DomainVersionType"},Status:{shape:"DomainStatusType"}}},DomainStatusType:{type:"string",enum:["CREATING","DELETING","UPDATING","ACTIVE","FAILED"]},DomainType:{type:"string",max:63,min:1,pattern:"^[a-z0-9](?:[a-z0-9\\-]{0,61}[a-z0-9])?$"},DomainVersionType:{type:"string",max:20,min:1},DuplicateProviderException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},EmailAddressType:{type:"string",pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+@[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},EmailConfigurationType:{type:"structure",members:{SourceArn:{shape:"ArnType",documentation:"<p>The Amazon Resource Name (ARN) of the email source.</p>"},ReplyToEmailAddress:{shape:"EmailAddressType",documentation:"<p>The REPLY-TO email address.</p>"}},documentation:"<p>The email configuration type.</p>"},EmailNotificationBodyType:{type:"string",max:2e4,min:6,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]+"},EmailNotificationSubjectType:{type:"string",max:140,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"},EmailVerificationMessageByLinkType:{type:"string",max:2e4,min:6,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*\\{##[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*##\\}[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*"},EmailVerificationMessageType:{type:"string",max:2e4,min:6,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*\\{####\\}[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s*]*"},EmailVerificationSubjectByLinkType:{type:"string",max:140,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"},EmailVerificationSubjectType:{type:"string",max:140,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}\\s]+"},EnableSoftwareTokenMFAException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},EnhanceAuthRequest:{type:"structure",required:["ClientId","Username","AuthState","Code"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you wish to enhance authentication.</p>"},AuthState:{shape:"AuthStateType",documentation:"<p>The authentication state.</p>"},Code:{shape:"StringType",documentation:"<p>The code returned from the enhanced authentication request.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the request by the developer to enhance the authentication on a user pool.</p>"},EnhanceAuthResponse:{type:"structure",members:{AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The authentication result from the enhanced authentication response.</p>"}},documentation:"<p>Represents the response from the enhanced authentication request.</p>"},EventContextDataType:{type:"structure",members:{IpAddress:{shape:"StringType"},DeviceName:{shape:"StringType"},Timezone:{shape:"StringType"},City:{shape:"StringType"},Country:{shape:"StringType"}}},EventFeedbackType:{type:"structure",required:["FeedbackValue","Provider"],members:{FeedbackValue:{shape:"FeedbackValueType"},Provider:{shape:"StringType"},FeedbackDate:{shape:"DateType"}}},EventFilterType:{type:"string",enum:["SIGN_IN","FORGOT_PASSWORD","ALL"]},EventFiltersType:{type:"list",member:{shape:"EventFilterType"}},EventIdType:{type:"string",max:50,min:1,pattern:"[\\w+-]+"},EventResponseType:{type:"string",enum:["Success","Failure"]},EventRiskType:{type:"structure",members:{RiskDecision:{shape:"RiskDecisionType"},RiskLevel:{shape:"RiskLevelType"}}},EventType:{type:"string",enum:["SignIn","SignUp","ForgotPassword"]},ExpiredCodeException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the expired code exception is thrown.</p>"}},documentation:"<p>This exception is thrown if a code has expired.</p>",exception:!0},ExplicitAuthFlowsListType:{type:"list",member:{shape:"ExplicitAuthFlowsType"}},ExplicitAuthFlowsType:{type:"string",enum:["ADMIN_NO_SRP_AUTH","CUSTOM_AUTH_FLOW_ONLY"]},FeedbackValueType:{type:"string",enum:["Bad","Good"]},ForceAliasCreation:{type:"boolean"},ForgetDeviceRequest:{type:"structure",required:["DeviceKey"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token for the forgotten device request.</p>"},DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"}},documentation:"<p>Represents the request to forget the device.</p>"},ForgotPasswordRequest:{type:"structure",required:["ClientId","Username"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},UserContextData:{shape:"UserContextDataType"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you want to enter a code to reset a forgotten password.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the request to reset a user's password.</p>"},ForgotPasswordResponse:{type:"structure",members:{CodeDeliveryDetails:{shape:"CodeDeliveryDetailsType",documentation:"<p>The code delivery details returned by the server in response to the request to reset a password.</p>"}},documentation:"<p>Respresents the response from the server regarding the request to reset a password.</p>"},GenerateSecret:{type:"boolean"},GetAuthenticationDetailsRequest:{type:"structure",required:["ClientId","Username","SrpA"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user for whom you wish to retrieve authentication details.</p>"},SrpA:{shape:"AValueHexStringType",documentation:'<p>The Secure Remote Password protocol (SRP) key. For more information, see <a href="https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol">Secure Remote Password Protocol</a>.</p>'},ValidationData:{shape:"AttributeListType",documentation:"<p>The validation data of the request to get authentication details.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the user's request to get authentication details.</p>"},GetAuthenticationDetailsResponse:{type:"structure",required:["Salt","SrpB","SecretBlock"],members:{Salt:{shape:"HexStringType",documentation:'<p>A salt that gets returned by the response from the server to get authentication details. For more information, see <a href="https://en.wikipedia.org/wiki/Salt_%28cryptography%29">Salt cryptography</a>.</p>'
},SrpB:{shape:"HexStringType",documentation:'<p>The Secure Remote Password protocol (SRP) key. For more information, see <a href="https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol">Secure Remote Password Protocol</a>.</p>'},SecretBlock:{shape:"BlobType",documentation:"<p>A blob that blocks the secret hash in the get authentication details response.</p>"},Username:{shape:"UsernameType",documentation:"<p>The resolved username for a possible alias in the input username parameter.</p>"}},documentation:"<p>Represents the response from the server to get authentication details.</p>"},GetCSVHeaderRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are to be imported into.</p>"}},documentation:"<p>Represents the request to get the header information for the .csv file for the user import job.</p>"},GetCSVHeaderResponse:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are to be imported into.</p>"},CSVHeader:{shape:"ListOfStringTypes",documentation:"<p>The header information for the .csv file for the user import job.</p>"}},documentation:"<p>Represents the response from the server to the request to get the header information for the .csv file for the user import job.</p>"},GetDeviceRequest:{type:"structure",required:["DeviceKey"],members:{DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},AccessToken:{shape:"TokenModelType",documentation:"<p>The access token.</p>"}},documentation:"<p>Represents the request to get the device.</p>"},GetDeviceResponse:{type:"structure",required:["Device"],members:{Device:{shape:"DeviceType",documentation:"<p>The device.</p>"}},documentation:"<p>Gets the device response.</p>"},GetGroupRequest:{type:"structure",required:["GroupName","UserPoolId"],members:{GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"}}},GetGroupResponse:{type:"structure",members:{Group:{shape:"GroupType",documentation:"<p>The group object for the group.</p>"}}},GetIdentityProviderByIdentifierRequest:{type:"structure",required:["UserPoolId","IdpIdentifier"],members:{UserPoolId:{shape:"UserPoolIdType"},IdpIdentifier:{shape:"IdpIdentifierType"}}},GetIdentityProviderByIdentifierResponse:{type:"structure",required:["IdentityProvider"],members:{IdentityProvider:{shape:"IdentityProviderType"}}},GetJWKSRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to get JSON Web keys.</p>"}},documentation:"<p>Represents the request to get JSON Web keys.</p>"},GetJWKSResponse:{type:"structure",members:{keys:{shape:"KeyListType",documentation:"<p>The keys in a get JSON Web keys response.</p>"},cacheControl:{shape:"StringType",documentation:'<p>The value of the <code>Cache-Control</code> HTTP header field for the JSON Web keys response. For more information on <code>cacheControl</code>, see <a href="https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9">https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9</a>.</p>'}},documentation:"<p>Represents the response from the server to get JSON Web keys.</p>"},GetOpenIdConfigurationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to get Open ID configuration information.</p>"}},documentation:"<p>Represents the request to get the Open ID configuration.</p>"},GetOpenIdConfigurationResponse:{type:"structure",members:{issuer:{shape:"openIdUrlType",documentation:"<p>The issuer of the Open ID configuration response.</p>"},jwks_uri:{shape:"openIdUrlType",documentation:"<p>The URI of the JSON Web keys in the server response to get Open ID configuration information.</p>"},authorization_endpoint:{shape:"openIdUrlType",documentation:"<p>The authorization endpoint returned by the server response to get the Open ID configuration information.</p>"},subject_types_supported:{shape:"openIdListType",documentation:"<p>The subject types supported returned by the server response to get the Open ID configuration information.</p>"},response_types_supported:{shape:"openIdListType",documentation:"<p>The response types supported returned by the server response to get the Open ID configuration information.</p>"},id_token_signing_alg_values_supported:{shape:"openIdListType",documentation:"<p>The token-signing algorithm values supported returned by the server response to get the Open ID configuration information.</p>"}},documentation:"<p>Represents the response from the server to get the Open ID configuration information.</p>"},GetSigningCertificateRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"}}},GetSigningCertificateResponse:{type:"structure",members:{Certificate:{shape:"StringType"}}},GetUICustomizationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"}}},GetUICustomizationResponse:{type:"structure",required:["UICustomization"],members:{UICustomization:{shape:"UICustomizationType"}}},GetUserAttributeVerificationCodeRequest:{type:"structure",required:["AccessToken","AttributeName"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token returned by the server response to get the user attribute verification code.</p>"},AttributeName:{shape:"AttributeNameType",documentation:"<p>The attribute name returned by the server response to get the user attribute verification code.</p>"}},documentation:"<p>Represents the request to get user attribute verification.</p>"},GetUserAttributeVerificationCodeResponse:{type:"structure",members:{CodeDeliveryDetails:{shape:"CodeDeliveryDetailsType",documentation:"<p>The code delivery details returned by the server in response to the request to get the user attribute verification code.</p>"}},documentation:"<p>The verification code response returned by the server response to get the user attribute verification code.</p>"},GetUserPoolMfaConfigRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"}}},GetUserPoolMfaConfigResponse:{type:"structure",members:{SmsMfaConfiguration:{shape:"SmsMfaConfigType"},SoftwareTokenMfaConfiguration:{shape:"SoftwareTokenMfaConfigType"},MfaConfiguration:{shape:"UserPoolMfaType"}}},GetUserPoolUIConfigurationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"}}},GetUserPoolUIConfigurationResponse:{type:"structure",required:["UserPoolUIConfiguration"],members:{UserPoolUIConfiguration:{shape:"UserPoolUIConfigurationType"}}},GetUserRequest:{type:"structure",required:["AccessToken"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token returned by the server response to get information about the user.</p>"}},documentation:"<p>Represents the request to get information about the user.</p>"},GetUserResponse:{type:"structure",required:["Username","UserAttributes"],members:{Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to retrieve from the get user request.</p>"},UserAttributes:{shape:"AttributeListType",documentation:"<p>An array of name-value pairs representing user attributes.</p>"},MFAOptions:{shape:"MFAOptionListType",documentation:"<p>Specifies the options for MFA (e.g., email or phone number).</p>"}},documentation:"<p>Represents the response from the server from the request to get information about the user.</p>"},GlobalSignOutRequest:{type:"structure",required:["AccessToken"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token.</p>"}},documentation:"<p>Represents the request to sign out all devices.</p>"},GlobalSignOutResponse:{type:"structure",members:{},documentation:"<p>The response to the request to sign out all devices.</p>"},GroupExistsException:{type:"structure",members:{message:{shape:"MessageType"}},documentation:"<p>This exception is thrown when Amazon Cognito encounters a group that already exists in the user pool.</p>",exception:!0},GroupListType:{type:"list",member:{shape:"GroupType"}},GroupNameType:{type:"string",max:128,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},GroupType:{type:"structure",members:{GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Description:{shape:"DescriptionType",documentation:"<p>A string containing the description of the group.</p>"},RoleArn:{shape:"ArnType",documentation:"<p>The role ARN for the group.</p>"},Precedence:{shape:"PrecedenceType",documentation:"<p>A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. If a user belongs to two or more groups, it is the group with the highest precedence whose role ARN will be used in the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the user's tokens. Groups with higher <code>Precedence</code> values take precedence over groups with lower <code>Precedence</code> values or with null <code>Precedence</code> values.</p> <p>Two groups can have the same <code>Precedence</code> value. If this happens, neither group takes precedence over the other. If two groups with the same <code>Precedence</code> have the same role ARN, that role is used in the <code>cognito:preferred_role</code> claim in tokens for users in each group. If the two groups have different role ARNs, the <code>cognito:preferred_role</code> claim is not set in users' tokens.</p> <p>The default <code>Precedence</code> value is null.</p>"},LastModifiedDate:{shape:"DateType",documentation:"<p>The date the group was last modified.</p>"},CreationDate:{shape:"DateType",documentation:"<p>The date the group was created.</p>"}},documentation:"<p>The group type.</p>"},HexStringType:{type:"string",pattern:"^[0-9a-fA-F]+$"},HttpHeader:{type:"structure",members:{headerName:{shape:"StringType"},headerValue:{shape:"StringType"}}},HttpHeaderList:{type:"list",member:{shape:"HttpHeader"}},IdentityProviderType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},ProviderName:{shape:"ProviderNameType"},ProviderType:{shape:"IdentityProviderTypeType"},ProviderDetails:{shape:"ProviderDetailsType"},AttributeMapping:{shape:"AttributeMappingType"},IdpIdentifiers:{shape:"IdpIdentifiersListType"},LastModifiedDate:{shape:"DateType"},CreationDate:{shape:"DateType"}}},IdentityProviderTypeType:{type:"string",enum:["SAML","Facebook","Google","LoginWithAmazon","ActiveDirectory"]},IdpIdentifierType:{type:"string",max:40,min:1,pattern:"[\\w\\s+=.@-]+"},IdpIdentifiersListType:{type:"list",member:{shape:"IdpIdentifierType"},max:50,min:0},ImageFileType:{type:"blob"},ImageUrlType:{type:"string"},InitiateAuthRequest:{type:"structure",required:["AuthFlow","ClientId"],members:{AuthFlow:{shape:"AuthFlowType",documentation:"<p>The authentication flow for this call to execute. The API action will depend on this value. For example: </p> <ul> <li> <p> <code>REFRESH_TOKEN_AUTH</code> will take in a valid refresh token and return new tokens.</p> </li> <li> <p> <code>USER_SRP_AUTH</code> will take in USERNAME and SRPA and return the SRP variables to be used for next challenge execution.</p> </li> </ul> <p>Valid values include:</p> <ul> <li> <p> <code>USER_SRP_AUTH</code>: Authentication flow for the Secure Remote Password (SRP) protocol.</p> </li> <li> <p> <code>REFRESH_TOKEN_AUTH</code>/<code>REFRESH_TOKEN</code>: Authentication flow for refreshing the access token and ID token by supplying a valid refresh token.</p> </li> <li> <p> <code>CUSTOM_AUTH</code>: Custom authentication flow.</p> </li> </ul> <p> <code>ADMIN_NO_SRP_AUTH</code> is not a valid value.</p>"},AuthParameters:{shape:"AuthParametersType",documentation:"<p>The authentication parameters. These are inputs corresponding to the <code>AuthFlow</code> that you are invoking. The required values depend on the value of <code>AuthFlow</code>:</p> <ul> <li> <p>For <code>USER_SRP_AUTH</code>: <code>USERNAME</code> (required), <code>SRPA</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>REFRESH_TOKEN_AUTH/REFRESH_TOKEN</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (required if the app client is configured with a client secret), <code>REFRESH_TOKEN</code> (required), <code>DEVICE_KEY</code> </p> </li> <li> <p>For <code>CUSTOM_AUTH</code>: <code>USERNAME</code> (required), <code>SECRET_HASH</code> (if app client is configured with client secret), <code>DEVICE_KEY</code> </p> </li> </ul>"},ClientMetadata:{shape:"ClientMetadataType",documentation:"<p>This is a random key-value pair map which can contain any key and will be passed to your PreAuthentication Lambda trigger as-is. It can be used to implement additional validations around authentication.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The app client ID.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},UserContextData:{shape:"UserContextDataType"}},documentation:"<p>Initiates the authentication request.</p>"},InitiateAuthResponse:{type:"structure",members:{ChallengeName:{shape:"ChallengeNameType",documentation:"<p>The name of the challenge which you are responding to with this call. This is returned to you in the <code>AdminInitiateAuth</code> response if you need to pass another challenge.</p> <p>Valid values include the following. Note that all of these challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable) in the parameters.</p> <ul> <li> <p> <code>SMS_MFA</code>: Next challenge is to supply an <code>SMS_MFA_CODE</code>, delivered via SMS.</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: Next challenge is to supply <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, and <code>TIMESTAMP</code> after the client-side SRP calculations.</p> </li> <li> <p> <code>CUSTOM_CHALLENGE</code>: This is returned if your custom authentication flow determines that the user should pass another challenge before tokens are issued.</p> </li> <li> <p> <code>DEVICE_SRP_AUTH</code>: If device tracking was enabled on your user pool and the previous challenges were passed, this challenge is returned so that Amazon Cognito can start tracking this device.</p> </li> <li> <p> <code>DEVICE_PASSWORD_VERIFIER</code>: Similar to <code>PASSWORD_VERIFIER</code>, but for devices only.</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: For users which are required to change their passwords after successful first login. This challenge should be passed with <code>NEW_PASSWORD</code> and any other required attributes.</p> </li> </ul>"},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"},ChallengeParameters:{shape:"ChallengeParametersType",documentation:"<p>The challenge parameters. These are returned to you in the <code>InitiateAuth</code> response if you need to pass another challenge. The responses in this parameter should be used to compute inputs to the next call (<code>RespondToAuthChallenge</code>). </p> <p>All challenges require <code>USERNAME</code> and <code>SECRET_HASH</code> (if applicable).</p>"},AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The result of the authentication response. This is only returned if the caller does not need to pass another challenge. If the caller does need to pass another challenge before it gets tokens, <code>ChallengeName</code>, <code>ChallengeParameters</code>, and <code>Session</code> are returned.</p>"}},documentation:"<p>Initiates the authentication response.</p>"},IntegerType:{type:"integer"},InternalErrorException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when Amazon Cognito throws an internal error exception.</p>"}},documentation:"<p>This exception is thrown when Amazon Cognito encounters an internal error.</p>",exception:!0,fault:!0},InvalidEmailRoleAccessPolicyException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when you have an unverified email address or the identity policy is not set on an email address that Amazon Cognito can access.</p>"}},documentation:"<p>This exception is thrown when Amazon Cognito is not allowed to use your email identity. HTTP status code: 400.</p>",exception:!0},InvalidLambdaResponseException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service throws an invalid AWS Lambda response exception.</p>"}},documentation:"<p>This exception is thrown when the Amazon Cognito service encounters an invalid AWS Lambda response.</p>",exception:!0},InvalidOAuthFlowException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},InvalidParameterException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service throws an invalid parameter exception.</p>"}},documentation:"<p>This exception is thrown when the Amazon Cognito service encounters an invalid parameter.</p>",exception:!0},InvalidPasswordException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service throws an invalid user password exception.</p>"}},documentation:"<p>This exception is thrown when the Amazon Cognito service encounters an invalid password.</p>",exception:!0},InvalidSmsRoleAccessPolicyException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message retuned when the invalid SMS role access policy exception is thrown.</p>"}},documentation:"<p>This exception is returned when the role provided for SMS configuration does not have permission to publish using Amazon SNS.</p>",exception:!0},InvalidSmsRoleTrustRelationshipException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the role trust relationship for the SMS message is invalid.</p>"}},documentation:"<p>This exception is thrown when the trust relationship is invalid for the role provided for SMS configuration. This can happen if you do not trust <b>cognito-idp.amazonaws.com</b> or the external ID provided in the role does not match what is provided in the SMS configuration for the user pool.</p>",exception:!0},InvalidUserPoolConfigurationException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the user pool configuration is invalid.</p>"}},documentation:"<p>This exception is thrown when the user pool configuration is invalid.</p>",exception:!0},KeyListType:{type:"list",member:{shape:"KeyType"}},KeyType:{type:"structure",members:{kty:{shape:"StringType",documentation:'<p>A "kty" key type parameter. For more information, see <a href="http://self-issued.info/docs/draft-ietf-jose-json-web-key.html">JSON Web Key (JWK) Format</a>.</p>'},alg:{shape:"StringType",documentation:'<p>A "kty" (Key Type) parameter. For more information, see <a href="http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#ktyDef">"kty" (Key Type) Parameter</a>.</p>'},use:{shape:"StringType",documentation:'<p>A "use" (Public Key Use) parameter. For more information, see <a href="http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#useDef">"use" (Public Key Use) Parameter</a>.</p>'},kid:{shape:"StringType",documentation:'<p>A "kid" (Key ID) parameter. For more information, see <a href="http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#kidDef">"kid" (Key ID) Parameter</a>.</p>'},n:{shape:"StringType",documentation:'<p>An "n" parameter.</p>'},e:{shape:"StringType",documentation:'<p>An "e" parameter.</p>'}},documentation:'<p>A JSON Web Key key type in <a href="http://self-issued.info/docs/draft-ietf-jose-json-web-key.html#rfc.section.4">JSON Web Key (JWK) Format</a>.</p>'},LambdaConfigType:{type:"structure",members:{PreSignUp:{shape:"ArnType",documentation:"<p>A pre-registration AWS Lambda trigger.</p>"},CustomMessage:{shape:"ArnType",documentation:"<p>A custom Message AWS Lambda trigger.</p>"},PostConfirmation:{shape:"ArnType",documentation:"<p>A post-confirmation AWS Lambda trigger.</p>"},PreAuthentication:{shape:"ArnType",documentation:"<p>A pre-authentication AWS Lambda trigger.</p>"},PostAuthentication:{shape:"ArnType",documentation:"<p>A post-authentication AWS Lambda trigger.</p>"},DefineAuthChallenge:{shape:"ArnType",documentation:"<p>Defines the authentication challenge.</p>"},CreateAuthChallenge:{shape:"ArnType",documentation:"<p>Creates an authentication challenge.</p>"},VerifyAuthChallengeResponse:{shape:"ArnType",documentation:"<p>Verifies the authentication challenge response.</p>"},PreTokenGeneration:{shape:"ArnType"}},documentation:"<p>Specifies the type of configuration for AWS Lambda triggers.</p>"},LimitExceededException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when Amazon Cognito throws a limit exceeded exception.</p>"}},documentation:"<p>This exception is thrown when a user exceeds the limit for a requested AWS resource.</p>",exception:!0},ListDevicesRequest:{type:"structure",required:["AccessToken"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access tokens for the request to list devices.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>The limit of the device request.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>The pagination token for the list request.</p>"}},documentation:"<p>Represents the request to list the devices.</p>"},ListDevicesResponse:{type:"structure",members:{Devices:{shape:"DeviceListType",documentation:"<p>The devices returned in the list devices response.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>The pagination token for the list device response.</p>"}},documentation:"<p>Represents the response to list devices.</p>"},ListGroupsRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>The limit of the request to list groups.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},ListGroupsResponse:{type:"structure",members:{Groups:{shape:"GroupListType",documentation:"<p>The group objects for the groups.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},ListIdentityProvidersRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},MaxResults:{shape:"ListProvidersLimitType"},NextToken:{shape:"PaginationKeyType"}}},ListIdentityProvidersResponse:{type:"structure",required:["Providers"],members:{Providers:{shape:"ProvidersListType"},NextToken:{shape:"PaginationKeyType"}}},ListOfStringTypes:{type:"list",member:{shape:"StringType"}},ListProvidersLimitType:{type:"integer",max:60,min:1},ListResourceServersLimitType:{type:"integer",max:50,min:1},ListResourceServersRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},MaxResults:{shape:"ListResourceServersLimitType"},NextToken:{shape:"PaginationKeyType"}}},ListResourceServersResponse:{type:"structure",required:["ResourceServers"],members:{ResourceServers:{shape:"ResourceServersListType"},NextToken:{shape:"PaginationKeyType"}}},ListUserImportJobsRequest:{type:"structure",required:["UserPoolId","MaxResults"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},MaxResults:{shape:"PoolQueryLimitType",documentation:"<p>The maximum number of import jobs you want the request to return.</p>"},PaginationToken:{shape:"PaginationKeyType",documentation:"<p>An identifier that was returned from the previous call to ListUserImportJobs, which can be used to return the next set of import jobs in the list.</p>"}},documentation:"<p>Represents the request to list the user import jobs.</p>"},ListUserImportJobsResponse:{type:"structure",members:{UserImportJobs:{shape:"UserImportJobsListType",documentation:"<p>The user import jobs.</p>"},PaginationToken:{shape:"PaginationKeyType",documentation:"<p>An identifier that can be used to return the next set of user import jobs in the list.</p>"}},documentation:"<p>Represents the response from the server to the request to list the user import jobs.</p>"},ListUserPoolClientsRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to list user pool clients.</p>"},MaxResults:{shape:"QueryLimit",documentation:"<p>The maximum number of results you want the request to return when listing the user pool clients.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}},documentation:"<p>Represents the request to list the user pool clients.</p>"},ListUserPoolClientsResponse:{type:"structure",members:{UserPoolClients:{shape:"UserPoolClientListType",documentation:"<p>The user pool clients in the response that lists user pool clients.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}},documentation:"<p>Represents the response from the server that lists user pool clients.</p>"},ListUserPoolsRequest:{type:"structure",required:["MaxResults"],members:{NextToken:{shape:"PaginationKeyType",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"},MaxResults:{shape:"PoolQueryLimitType",documentation:"<p>The maximum number of results you want the request to return when listing the user pools.</p>"}},documentation:"<p>Represents the request to list user pools.</p>"},ListUserPoolsResponse:{type:"structure",members:{UserPools:{shape:"UserPoolListType",documentation:"<p>The user pools from the response to list users.</p>"},NextToken:{shape:"PaginationKeyType",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}},documentation:"<p>Represents the response to list user pools.</p>"},ListUsersInGroupRequest:{type:"structure",required:["UserPoolId","GroupName"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>The limit of the request to list users.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},ListUsersInGroupResponse:{type:"structure",members:{Users:{shape:"UsersListType",documentation:"<p>The users returned in the request to list users.</p>"},NextToken:{shape:"PaginationKey",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}}},ListUsersRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool on which the search should be performed.</p>"},AttributesToGet:{shape:"SearchedAttributeNamesListType",documentation:"<p>An array of strings, where each string is the name of a user attribute to be returned for each user in the search results. If the array is empty, all attributes are returned.</p>"},Limit:{shape:"QueryLimitType",documentation:"<p>Maximum number of users to be returned.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"},Filter:{shape:"UserFilterType",documentation:'<p>A filter string of the form "<i>AttributeName</i> <i>Filter-Type</i> "<i>AttributeValue</i>"". Quotation marks within the filter string must be escaped using the backslash (\\) character. For example, "<code>family_name</code> = \\"Reddy\\"".</p> <ul> <li> <p> <i>AttributeName</i>: The name of the attribute to search for. You can only search for one attribute at a time.</p> </li> <li> <p> <i>Filter-Type</i>: For an exact match, use =, for example, "<code>given_name</code> = \\"Jon\\"". For a prefix ("starts with") match, use ^=, for example, "<code>given_name</code> ^= \\"Jon\\"". </p> </li> <li> <p> <i>AttributeValue</i>: The attribute value that must be matched for each user.</p> </li> </ul> <p>If the filter string is empty, <code>ListUsers</code> returns all users in the user pool.</p> <p>You can only search for the following standard attributes:</p> <ul> <li> <p> <code>username</code> (case-sensitive)</p> </li> <li> <p> <code>email</code> </p> </li> <li> <p> <code>phone_number</code> </p> </li> <li> <p> <code>name</code> </p> </li> <li> <p> <code>given_name</code> </p> </li> <li> <p> <code>family_name</code> </p> </li> <li> <p> <code>preferred_username</code> </p> </li> <li> <p> <code>cognito:user_status</code> (called <b>Enabled</b> in the Console) (case-sensitive)</p> </li> <li> <p> <code>status</code> (case-insensitive)</p> </li> </ul> <p>Custom attributes are not searchable.</p> <p>For more information, see <a href="http://docs.aws.amazon.com/cognito/latest/developerguide/how-to-manage-user-accounts.html#cognito-user-pools-searching-for-users-using-listusers-api">Searching for Users Using the ListUsers API</a> and <a href="http://docs.aws.amazon.com/cognito/latest/developerguide/how-to-manage-user-accounts.html#cognito-user-pools-searching-for-users-listusers-api-examples">Examples of Using the ListUsers API</a> in the <i>Amazon Cognito Developer Guide</i>.</p>'}},documentation:"<p>Represents the request to list users.</p>"},ListUsersResponse:{type:"structure",members:{Users:{shape:"UsersListType",documentation:"<p>The users returned in the request to list users.</p>"},PaginationToken:{shape:"SearchPaginationTokenType",documentation:"<p>An identifier that was returned from the previous call to this operation, which can be used to return the next set of items in the list.</p>"}},documentation:"<p>The response from the request to list users.</p>"},LogoutURLsListType:{type:"list",member:{shape:"RedirectUrlType"},max:100,min:0},LongType:{type:"long"},MFAMethodNotFoundException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when Amazon Cognito throws an MFA method not found exception.</p>"}},documentation:"<p>This exception is thrown when Amazon Cognito cannot find a multi-factor authentication (MFA) method.</p>",
exception:!0},MFAOptionListType:{type:"list",member:{shape:"MFAOptionType"}},MFAOptionType:{type:"structure",members:{DeliveryMedium:{shape:"DeliveryMediumType",documentation:"<p>The delivery medium (email message or SMS message) to send the MFA code.</p>"},AttributeName:{shape:"AttributeNameType",documentation:"<p>The attribute name of the MFA option type.</p>"}},documentation:"<p>Specifies the different settings for multi-factor authentication (MFA).</p>"},MessageActionType:{type:"string",enum:["RESEND","SUPPRESS"]},MessageTemplateType:{type:"structure",members:{SMSMessage:{shape:"SmsVerificationMessageType",documentation:"<p>The message template for SMS messages.</p>"},EmailMessage:{shape:"EmailVerificationMessageType",documentation:"<p>The message template for email messages.</p>"},EmailSubject:{shape:"EmailVerificationSubjectType",documentation:"<p>The subject line for email messages.</p>"}},documentation:"<p>The message template structure.</p>"},MessageType:{type:"string"},NewDeviceMetadataType:{type:"structure",members:{DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},DeviceGroupKey:{shape:"StringType",documentation:"<p>The device group key.</p>"}},documentation:"<p>The new device metadata type.</p>"},NotAuthorizedException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns a not authorized exception.</p>"}},documentation:"<p>This exception gets thrown when a user is not authorized.</p>",exception:!0},NotifyConfigurationType:{type:"structure",required:["SourceArn"],members:{From:{shape:"StringType"},ReplyTo:{shape:"StringType"},SourceArn:{shape:"ArnType"},BlockEmail:{shape:"NotifyEmailType"},NoActionEmail:{shape:"NotifyEmailType"},MfaEmail:{shape:"NotifyEmailType"}}},NotifyEmailType:{type:"structure",required:["Subject"],members:{Subject:{shape:"EmailNotificationSubjectType"},HtmlBody:{shape:"EmailNotificationBodyType"},TextBody:{shape:"EmailNotificationBodyType"}}},NumberAttributeConstraintsType:{type:"structure",members:{MinValue:{shape:"StringType",documentation:"<p>The minimum value of an attribute that is of the number data type.</p>"},MaxValue:{shape:"StringType",documentation:"<p>The maximum value of an attribute that is of the number data type.</p>"}},documentation:"<p>The minimum and maximum value of an attribute that is of the number data type.</p>"},OAuthFlowType:{type:"string",enum:["code","implicit","client_credentials"]},OAuthFlowsType:{type:"list",member:{shape:"OAuthFlowType"},max:3,min:0},PaginationKey:{type:"string",min:1,pattern:"[\\S]+"},PaginationKeyType:{type:"string",min:1,pattern:"[\\S]+"},PasswordClaimType:{type:"structure",members:{SecretBlock:{shape:"BlobType",documentation:"<p>A secret block claim type for a password.</p>"},Signature:{shape:"BlobType",documentation:"<p>A signature claim type for a password.</p>"}},documentation:"<p>The claim type of a password.</p>",sensitive:!0},PasswordPolicyMinLengthType:{type:"integer",max:99,min:6},PasswordPolicyType:{type:"structure",members:{MinimumLength:{shape:"PasswordPolicyMinLengthType",documentation:"<p>The minimum length of the password policy that you have set. Cannot be less than 6.</p>"},RequireUppercase:{shape:"BooleanType",documentation:"<p>In the password policy that you have set, refers to whether you have required users to use at least one uppercase letter in their password.</p>"},RequireLowercase:{shape:"BooleanType",documentation:"<p>In the password policy that you have set, refers to whether you have required users to use at least one lowercase letter in their password.</p>"},RequireNumbers:{shape:"BooleanType",documentation:"<p>In the password policy that you have set, refers to whether you have required users to use at least one number in their password.</p>"},RequireSymbols:{shape:"BooleanType",documentation:"<p>In the password policy that you have set, refers to whether you have required users to use at least one symbol in their password.</p>"}},documentation:"<p>The password policy type.</p>"},PasswordResetRequiredException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when a password reset is required.</p>"}},documentation:"<p>This exception is thrown when a password reset is required.</p>",exception:!0},PasswordType:{type:"string",max:256,min:6,pattern:"[\\S]+",sensitive:!0},PoolQueryLimitType:{type:"integer",max:60,min:1},PreSignedUrlType:{type:"string",max:2048,min:0},PrecedenceType:{type:"integer",min:0},PreconditionNotMetException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when a precondition is not met.</p>"}},documentation:"<p>This exception is thrown when a precondition is not met.</p>",exception:!0},ProviderDescription:{type:"structure",members:{ProviderName:{shape:"ProviderNameType"},ProviderType:{shape:"IdentityProviderTypeType"},LastModifiedDate:{shape:"DateType"},CreationDate:{shape:"DateType"}}},ProviderDetailsType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},ProviderNameType:{type:"string",max:32,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},ProviderNameTypeV1:{type:"string",max:32,min:1,pattern:"[^_][\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}][^_]+"},ProviderUserIdentifierType:{type:"structure",members:{ProviderName:{shape:"ProviderNameType"},ProviderAttributeName:{shape:"StringType"},ProviderAttributeValue:{shape:"StringType"}}},ProvidersListType:{type:"list",member:{shape:"ProviderDescription"},max:50,min:0},QueryLimit:{type:"integer",max:60,min:1},QueryLimitType:{type:"integer",max:60,min:0},RedirectUrlType:{type:"string",max:1024,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+"},RefreshTokenValidityType:{type:"integer",max:3650,min:0},RefreshTokensRequest:{type:"structure",required:["ClientId","RefreshToken"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},ClientSecret:{shape:"ClientSecretType",documentation:"<p>The client secret for a user's request to refresh tokens.</p>"},RefreshToken:{shape:"TokenModelType",documentation:"<p>The refresh token for a user's request to refresh tokens.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the request to refresh tokens.</p>"},RefreshTokensResponse:{type:"structure",members:{AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The authentication result from the server's response to the request to refresh tokens.</p>"}},documentation:"<p>Represents the response from the server when the user wants to refresh tokens.</p>"},ResendConfirmationCodeRequest:{type:"structure",required:["ClientId","Username"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},UserContextData:{shape:"UserContextDataType"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user to whom you wish to resend a confirmation code.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"}},documentation:"<p>Represents the request to resend the confirmation code.</p>"},ResendConfirmationCodeResponse:{type:"structure",members:{CodeDeliveryDetails:{shape:"CodeDeliveryDetailsType",documentation:"<p>The code delivery details returned by the server in response to the request to resend the confirmation code.</p>"}},documentation:"<p>The response from the server when the Amazon Cognito Your User Pools service makes the request to resend a confirmation code.</p>"},ResourceNotFoundException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns a resource not found exception.</p>"}},documentation:"<p>This exception is thrown when the Amazon Cognito service cannot find the requested resource.</p>",exception:!0},ResourceServerIdentifierType:{type:"string",max:256,min:1,pattern:"[\\x21\\x23-\\x5B\\x5D-\\x7E]+"},ResourceServerNameType:{type:"string",max:256,min:1,pattern:"[\\w\\s+=,.@-]+"},ResourceServerScopeDescriptionType:{type:"string",max:256,min:1},ResourceServerScopeListType:{type:"list",member:{shape:"ResourceServerScopeType"},max:25},ResourceServerScopeNameType:{type:"string",max:256,min:1,pattern:"[\\x21\\x23-\\x2E\\x30-\\x5B\\x5D-\\x7E]+"},ResourceServerScopeType:{type:"structure",required:["ScopeName","ScopeDescription"],members:{ScopeName:{shape:"ResourceServerScopeNameType"},ScopeDescription:{shape:"ResourceServerScopeDescriptionType"}}},ResourceServerType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},Identifier:{shape:"ResourceServerIdentifierType"},Name:{shape:"ResourceServerNameType"},Scopes:{shape:"ResourceServerScopeListType"}}},ResourceServersListType:{type:"list",member:{shape:"ResourceServerType"}},RespondToAuthChallengeRequest:{type:"structure",required:["ClientId","ChallengeName"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The app client ID.</p>"},ChallengeName:{shape:"ChallengeNameType",documentation:'<p>The challenge name. For more information, see <a href="API_InitiateAuth.html">InitiateAuth</a>.</p> <p> <code>ADMIN_NO_SRP_AUTH</code> is not a valid value.</p>'},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"},ChallengeResponses:{shape:"ChallengeResponsesType",documentation:"<p>The challenge responses. These are inputs corresponding to the value of <code>ChallengeName</code>, for example:</p> <ul> <li> <p> <code>SMS_MFA</code>: <code>SMS_MFA_CODE</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>PASSWORD_VERIFIER</code>: <code>PASSWORD_CLAIM_SIGNATURE</code>, <code>PASSWORD_CLAIM_SECRET_BLOCK</code>, <code>TIMESTAMP</code>, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret).</p> </li> <li> <p> <code>NEW_PASSWORD_REQUIRED</code>: <code>NEW_PASSWORD</code>, any other required attributes, <code>USERNAME</code>, <code>SECRET_HASH</code> (if app client is configured with client secret). </p> </li> </ul>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},UserContextData:{shape:"UserContextDataType"}},documentation:"<p>The request to respond to an authentication challenge.</p>"},RespondToAuthChallengeResponse:{type:"structure",members:{ChallengeName:{shape:"ChallengeNameType",documentation:'<p>The challenge name. For more information, see <a href="API_InitiateAuth.html">InitiateAuth</a>.</p>'},Session:{shape:"SessionType",documentation:"<p>The session which should be passed both ways in challenge-response calls to the service. If <code>InitiateAuth</code> or <code>RespondToAuthChallenge</code> API call determines that the caller needs to go through another challenge, they return a session with other challenge parameters. This session should be passed as it is to the next <code>RespondToAuthChallenge</code> API call.</p>"},ChallengeParameters:{shape:"ChallengeParametersType",documentation:'<p>The challenge parameters. For more information, see <a href="API_InitiateAuth.html">InitiateAuth</a>.</p>'},AuthenticationResult:{shape:"AuthenticationResultType",documentation:"<p>The result returned by the server in response to the request to respond to the authentication challenge.</p>"}},documentation:"<p>The response to respond to the authentication challenge.</p>"},RiskConfigurationType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"},CompromisedCredentialsRiskConfiguration:{shape:"CompromisedCredentialsRiskConfigurationType"},BotRiskConfiguration:{shape:"BotRiskConfigurationType"},AccountTakeoverRiskConfiguration:{shape:"AccountTakeoverRiskConfigurationType"},RiskExceptionConfiguration:{shape:"RiskExceptionConfigurationType"},LastModifiedDate:{shape:"DateType"}}},RiskDecisionType:{type:"string",enum:["NoRisk","Bot","AccountTakeover"]},RiskExceptionConfigurationType:{type:"structure",members:{BlockedIPRangeList:{shape:"BlockedIPRangeListType"},SkippedIPRangeList:{shape:"SkippedIPRangeListType"}}},RiskLevelType:{type:"string",enum:["Low","Medium","High"]},S3BucketType:{type:"string",max:1024,min:3,pattern:"^[0-9A-Za-z\\.\\-_]*(?<!\\.)$"},SMSMfaSettingsType:{type:"structure",members:{Enabled:{shape:"BooleanType"},PreferredMfa:{shape:"BooleanType"}}},SchemaAttributeType:{type:"structure",members:{Name:{shape:"CustomAttributeNameType",documentation:"<p>A schema attribute of the name type.</p>"},AttributeDataType:{shape:"AttributeDataType",documentation:"<p>The attribute data type.</p>"},DeveloperOnlyAttribute:{shape:"BooleanType",documentation:"<p>Specifies whether the attribute type is developer only.</p>",box:!0},Mutable:{shape:"BooleanType",documentation:"<p>Specifies whether the attribute can be changed once it has been created.</p>",box:!0},Required:{shape:"BooleanType",documentation:"<p>Specifies whether a user pool attribute is required. If the attribute is required and the user does not provide a value, registration or sign-in will fail.</p>",box:!0},NumberAttributeConstraints:{shape:"NumberAttributeConstraintsType",documentation:"<p>Specifies the constraints for an attribute of the number type.</p>"},StringAttributeConstraints:{shape:"StringAttributeConstraintsType",documentation:"<p>Specifies the constraints for an attribute of the string type.</p>"}},documentation:"<p>Contains information about the schema attribute.</p>"},SchemaAttributesListType:{type:"list",member:{shape:"SchemaAttributeType"},max:50,min:1},ScopeDoesNotExistException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},ScopeListType:{type:"list",member:{shape:"ScopeType"},max:25},ScopeType:{type:"string",max:256,min:1,pattern:"[\\x21\\x23-\\x5B\\x5D-\\x7E]+"},SearchPaginationTokenType:{type:"string",min:1,pattern:"[\\S]+"},SearchedAttributeNamesListType:{type:"list",member:{shape:"AttributeNameType"}},SecretCodeType:{type:"string",min:16,pattern:"[A-Za-z0-9]+",sensitive:!0},SecretHashType:{type:"string",max:128,min:1,pattern:"[\\w+=/]+",sensitive:!0},SessionType:{type:"string",max:2048,min:20},SetRiskConfigurationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"},CompromisedCredentialsRiskConfiguration:{shape:"CompromisedCredentialsRiskConfigurationType"},BotRiskConfiguration:{shape:"BotRiskConfigurationType"},AccountTakeoverRiskConfiguration:{shape:"AccountTakeoverRiskConfigurationType"},RiskExceptionConfiguration:{shape:"RiskExceptionConfigurationType"}}},SetRiskConfigurationResponse:{type:"structure",required:["RiskConfiguration"],members:{RiskConfiguration:{shape:"RiskConfigurationType"}}},SetUICustomizationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"},CSS:{shape:"CSSType"},ImageFile:{shape:"ImageFileType"}}},SetUICustomizationResponse:{type:"structure",required:["UICustomization"],members:{UICustomization:{shape:"UICustomizationType"}}},SetUserMFAPreferenceRequest:{type:"structure",required:["AccessToken"],members:{SMSMfaSettings:{shape:"SMSMfaSettingsType"},SoftwareTokenMfaSettings:{shape:"SoftwareTokenMfaSettingsType"},AccessToken:{shape:"TokenModelType"}}},SetUserMFAPreferenceResponse:{type:"structure",members:{}},SetUserPoolMfaConfigRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},SmsMfaConfiguration:{shape:"SmsMfaConfigType"},SoftwareTokenMfaConfiguration:{shape:"SoftwareTokenMfaConfigType"},MfaConfiguration:{shape:"UserPoolMfaType"}}},SetUserPoolMfaConfigResponse:{type:"structure",members:{SmsMfaConfiguration:{shape:"SmsMfaConfigType"},SoftwareTokenMfaConfiguration:{shape:"SoftwareTokenMfaConfigType"},MfaConfiguration:{shape:"UserPoolMfaType"}}},SetUserPoolUIConfigurationRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType"},Details:{shape:"UIDetailsMapType"}}},SetUserPoolUIConfigurationResponse:{type:"structure",required:["UserPoolUIConfiguration"],members:{UserPoolUIConfiguration:{shape:"UserPoolUIConfigurationType"}}},SetUserSettingsRequest:{type:"structure",required:["AccessToken","MFAOptions"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token for the set user settings request.</p>"},MFAOptions:{shape:"MFAOptionListType",documentation:"<p>Specifies the options for MFA (e.g., email or phone number).</p>"}},documentation:"<p>Represents the request to set user settings.</p>"},SetUserSettingsResponse:{type:"structure",members:{},documentation:"<p>The response from the server for a set user settings request.</p>"},SignUpRequest:{type:"structure",required:["ClientId","Username","Password"],members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},SecretHash:{shape:"SecretHashType",documentation:"<p>A keyed-hash message authentication code (HMAC) calculated using the secret key of a user pool client and username plus the client ID in the message.</p>"},Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to register.</p>"},Password:{shape:"PasswordType",documentation:"<p>The password of the user you wish to register.</p>"},UserAttributes:{shape:"AttributeListType",documentation:"<p>An array of name-value pairs representing user attributes.</p>"},ValidationData:{shape:"AttributeListType",documentation:"<p>The validation data in the request to register a user.</p>"},AnalyticsMetadata:{shape:"AnalyticsMetadataType"},UserContextData:{shape:"UserContextDataType"}},documentation:"<p>Represents the request to register a user.</p>"},SignUpResponse:{type:"structure",required:["UserConfirmed","UserSub"],members:{UserConfirmed:{shape:"BooleanType",documentation:"<p>A response from the server indicating that a user registration has been confirmed.</p>"},CodeDeliveryDetails:{shape:"CodeDeliveryDetailsType",documentation:"<p>The code delivery details returned by the server response to the user registration request.</p>"},UserSub:{shape:"StringType"}},documentation:"<p>The response from the server for a registration request.</p>"},SkippedIPRangeListType:{type:"list",member:{shape:"StringType"},max:20},SmsConfigurationType:{type:"structure",required:["SnsCallerArn"],members:{SnsCallerArn:{shape:"ArnType",documentation:"<p>The Amazon Resource Name (ARN) of the Amazon Simple Notification Service (SNS) caller.</p>"},ExternalId:{shape:"StringType",documentation:"<p>The external ID.</p>"}},documentation:"<p>The SMS configuration type.</p>"},SmsMfaConfigType:{type:"structure",members:{SmsAuthenticationMessage:{shape:"SmsVerificationMessageType"},SmsConfiguration:{shape:"SmsConfigurationType"}}},SmsVerificationMessageType:{type:"string",max:140,min:6,pattern:".*\\{####\\}.*"},SoftwareTokenMFANotFoundException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},SoftwareTokenMFAUserCodeType:{type:"string",max:6,min:6,pattern:"[0-9]+"},SoftwareTokenMfaConfigType:{type:"structure",members:{Enabled:{shape:"BooleanType"}}},SoftwareTokenMfaSettingsType:{type:"structure",members:{Enabled:{shape:"BooleanType"},PreferredMfa:{shape:"BooleanType"}}},StartUserImportJobRequest:{type:"structure",required:["UserPoolId","JobId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},JobId:{shape:"UserImportJobIdType",documentation:"<p>The job ID for the user import job.</p>"}},documentation:"<p>Represents the request to start the user import job.</p>"},StartUserImportJobResponse:{type:"structure",members:{UserImportJob:{shape:"UserImportJobType",documentation:"<p>The job object that represents the user import job.</p>"}},documentation:"<p>Represents the response from the server to the request to start the user import job.</p>"},StatusType:{type:"string",enum:["Enabled","Disabled"]},StopUserImportJobRequest:{type:"structure",required:["UserPoolId","JobId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},JobId:{shape:"UserImportJobIdType",documentation:"<p>The job ID for the user import job.</p>"}},documentation:"<p>Represents the request to stop the user import job.</p>"},StopUserImportJobResponse:{type:"structure",members:{UserImportJob:{shape:"UserImportJobType",documentation:"<p>The job object that represents the user import job.</p>"}},documentation:"<p>Represents the response from the server to the request to stop the user import job.</p>"},StringAttributeConstraintsType:{type:"structure",members:{MinLength:{shape:"StringType",documentation:"<p>The minimum length of an attribute value of the string type.</p>"},MaxLength:{shape:"StringType",documentation:"<p>The maximum length of an attribute value of the string type.</p>"}},documentation:"<p>The type of constraints associated with an attribute of the string type.</p>"},StringType:{type:"string"},SupportedIdentityProvidersListType:{type:"list",member:{shape:"ProviderNameType"}},TokenModelType:{type:"string",pattern:"[A-Za-z0-9-_=.]+",sensitive:!0},TooManyFailedAttemptsException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns a too many failed attempts exception.</p>"}},documentation:"<p>This exception gets thrown when the user has made too many failed attempts for a given action (e.g., sign in).</p>",exception:!0},TooManyRequestsException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns a too many requests exception.</p>"}},documentation:"<p>This exception gets thrown when the user has made too many requests for a given operation.</p>",exception:!0},UICustomizationType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},ClientId:{shape:"ClientIdType"},ImageUrl:{shape:"ImageUrlType"},CSS:{shape:"CSSType"},CSSVersion:{shape:"CSSVersionType"},LastModifiedDate:{shape:"DateType"},CreationDate:{shape:"DateType"}}},UIDetailsMapType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},UnexpectedLambdaException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns an unexpected AWS Lambda exception.</p>"}},documentation:"<p>This exception gets thrown when the Amazon Cognito service encounters an unexpected exception with the AWS Lambda service.</p>",exception:!0},UnsupportedIdentityProviderException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},UnsupportedUserStateException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the user is in an unsupported state.</p>"}},documentation:"<p>The request failed because the user is in an unsupported state.</p>",exception:!0},UpdateAuthEventFeedbackRequest:{type:"structure",required:["UserPoolId","Username","EventId","FeedbackToken","FeedbackValue"],members:{UserPoolId:{shape:"UserPoolIdType"},Username:{shape:"UsernameType"},EventId:{shape:"EventIdType"},FeedbackToken:{shape:"TokenModelType"},FeedbackValue:{shape:"FeedbackValueType"}}},UpdateAuthEventFeedbackResponse:{type:"structure",members:{}},UpdateDeviceStatusRequest:{type:"structure",required:["AccessToken","DeviceKey"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>The access token.</p>"},DeviceKey:{shape:"DeviceKeyType",documentation:"<p>The device key.</p>"},DeviceRememberedStatus:{shape:"DeviceRememberedStatusType",documentation:"<p>The status of whether a device is remembered.</p>"}},documentation:"<p>Represents the request to update the device status.</p>"},UpdateDeviceStatusResponse:{type:"structure",members:{},documentation:"<p>The response to the request to update the device status.</p>"},UpdateGroupRequest:{type:"structure",required:["GroupName","UserPoolId"],members:{GroupName:{shape:"GroupNameType",documentation:"<p>The name of the group.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool.</p>"},Description:{shape:"DescriptionType",documentation:"<p>A string containing the new description of the group.</p>"},RoleArn:{shape:"ArnType",documentation:"<p>The new role ARN for the group. This is used for setting the <code>cognito:roles</code> and <code>cognito:preferred_role</code> claims in the token.</p>"},Precedence:{shape:"PrecedenceType",documentation:'<p>The new precedence value for the group. For more information about this parameter, see <a href="API_CreateGroup.html">CreateGroup</a>.</p>'}}},UpdateGroupResponse:{type:"structure",members:{Group:{shape:"GroupType",documentation:"<p>The group object for the group.</p>"}}},UpdateIdentityProviderRequest:{type:"structure",required:["UserPoolId","ProviderName"],members:{UserPoolId:{shape:"UserPoolIdType"},ProviderName:{shape:"ProviderNameType"},ProviderDetails:{shape:"ProviderDetailsType"},AttributeMapping:{shape:"AttributeMappingType"},IdpIdentifiers:{shape:"IdpIdentifiersListType"}}},UpdateIdentityProviderResponse:{type:"structure",required:["IdentityProvider"],members:{IdentityProvider:{shape:"IdentityProviderType"}}},UpdateResourceServerRequest:{type:"structure",required:["UserPoolId","Identifier","Name"],members:{UserPoolId:{shape:"UserPoolIdType"},Identifier:{shape:"ResourceServerIdentifierType"},Name:{shape:"ResourceServerNameType"},Scopes:{shape:"ResourceServerScopeListType"}}},UpdateResourceServerResponse:{type:"structure",required:["ResourceServer"],members:{ResourceServer:{shape:"ResourceServerType"}}},UpdateUserAttributesRequest:{type:"structure",required:["UserAttributes","AccessToken"],members:{UserAttributes:{shape:"AttributeListType",documentation:"<p>An array of name-value pairs representing user attributes.</p>"},AccessToken:{shape:"TokenModelType",documentation:"<p>The access token for the request to update user attributes.</p>"}},documentation:"<p>Represents the request to update user attributes.</p>"},UpdateUserAttributesResponse:{type:"structure",members:{CodeDeliveryDetailsList:{shape:"CodeDeliveryDetailsListType",documentation:"<p>The code delivery details list from the server for the request to update user attributes.</p>"}},documentation:"<p>Represents the response from the server for the request to update user attributes.</p>"},UpdateUserPoolClientRequest:{type:"structure",required:["UserPoolId","ClientId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to update the user pool client.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},ClientName:{shape:"ClientNameType",documentation:"<p>The client name from the update user pool client request.</p>"},RefreshTokenValidity:{shape:"RefreshTokenValidityType",documentation:"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"},ReadAttributes:{shape:"ClientPermissionListType",documentation:"<p>The read-only attributes of the user pool.</p>"},WriteAttributes:{shape:"ClientPermissionListType",documentation:"<p>The writeable attributes of the user pool.</p>"},ExplicitAuthFlows:{shape:"ExplicitAuthFlowsListType",documentation:"<p>Explicit authentication flows.</p>"},SupportedIdentityProviders:{shape:"SupportedIdentityProvidersListType"},CallbackURLs:{shape:"CallbackURLsListType"},LogoutURLs:{shape:"LogoutURLsListType"},DefaultRedirectURI:{shape:"RedirectUrlType"},AllowedOAuthFlows:{shape:"OAuthFlowsType"},AllowedOAuthScopes:{shape:"ScopeListType"},AllowedOAuthFlowsUserPoolClient:{shape:"BooleanType"},AnalyticsConfiguration:{shape:"AnalyticsConfigurationType"}},documentation:"<p>Represents the request to update the user pool client.</p>"},UpdateUserPoolClientResponse:{type:"structure",members:{UserPoolClient:{shape:"UserPoolClientType",documentation:"<p>The user pool client value from the response from the server when an update user pool client request is made.</p>"}},documentation:"<p>Represents the response from the server to the request to update the user pool client.</p>"},UpdateUserPoolRequest:{type:"structure",required:["UserPoolId"],members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool you want to update.</p>"},Policies:{shape:"UserPoolPolicyType",documentation:"<p>A container with the policies you wish to update in a user pool.</p>"},LambdaConfig:{shape:"LambdaConfigType",documentation:"<p>The AWS Lambda configuration information from the request to update the user pool.</p>"},AutoVerifiedAttributes:{shape:"VerifiedAttributesListType",documentation:"<p>The attributes that are automatically verified when the Amazon Cognito service makes a request to update user pools.</p>"},SmsVerificationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>A container with information about the SMS verification message.</p>"},EmailVerificationMessage:{shape:"EmailVerificationMessageType",documentation:"<p>The contents of the email verification message.</p>"},EmailVerificationSubject:{shape:"EmailVerificationSubjectType",documentation:"<p>The subject of the email verification message.</p>"},VerificationMessageTemplate:{shape:"VerificationMessageTemplateType"},SmsAuthenticationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>The contents of the SMS authentication message.</p>"},MfaConfiguration:{shape:"UserPoolMfaType",documentation:"<p>Can be one of the following values:</p> <ul> <li> <p> <code>OFF</code> - MFA tokens are not required and cannot be specified during user registration.</p> </li> <li> <p> <code>ON</code> - MFA tokens are required for all user registrations. You can only specify required when you are initially creating a user pool.</p> </li> <li> <p> <code>OPTIONAL</code> - Users have the option when registering to create an MFA token.</p> </li> </ul>"},DeviceConfiguration:{shape:"DeviceConfigurationType",documentation:"<p>Device configuration.</p>"},EmailConfiguration:{shape:"EmailConfigurationType",documentation:"<p>Email configuration.</p>"},SmsConfiguration:{shape:"SmsConfigurationType",documentation:"<p>SMS configuration.</p>"},UserPoolTags:{shape:"UserPoolTagsType",documentation:'<p>The cost allocation tags for the user pool. For more information, see <a href="http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html">Adding Cost Allocation Tags to Your User Pool</a> </p>'},AdminCreateUserConfig:{shape:"AdminCreateUserConfigType",documentation:"<p>The configuration for AdminCreateUser requests.</p>"},UserPoolAddOns:{shape:"UserPoolAddOnsType"}},documentation:"<p>Represents the request to update the user pool.</p>"},UpdateUserPoolResponse:{type:"structure",members:{},documentation:"<p>Represents the response from the server when you make a request to update the user pool.</p>"},UserContextDataType:{type:"structure",members:{encodedData:{shape:"StringType"}}},UserFilterType:{type:"string",max:256},UserImportInProgressException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the user pool has an import job running.</p>"}},documentation:"<p>This exception is thrown when you are trying to modify a user pool while a user import job is in progress for that pool.</p>",
exception:!0},UserImportJobIdType:{type:"string",max:55,min:1,pattern:"import-[0-9a-zA-Z-]+"},UserImportJobNameType:{type:"string",max:128,min:1,pattern:"[\\w\\s+=,.@-]+"},UserImportJobStatusType:{type:"string",enum:["Created","Pending","InProgress","Stopping","Expired","Stopped","Failed","Succeeded"]},UserImportJobType:{type:"structure",members:{JobName:{shape:"UserImportJobNameType",documentation:"<p>The job name for the user import job.</p>"},JobId:{shape:"UserImportJobIdType",documentation:"<p>The job ID for the user import job.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool that the users are being imported into.</p>"},PreSignedUrl:{shape:"PreSignedUrlType",documentation:"<p>The pre-signed URL to be used to upload the .csv file.</p>"},CreationDate:{shape:"DateType",documentation:"<p>The date when the user import job was created.</p>"},StartDate:{shape:"DateType",documentation:"<p>The date when the user import job was started.</p>"},CompletionDate:{shape:"DateType",documentation:"<p>The date when the user import job was completed.</p>"},Status:{shape:"UserImportJobStatusType",documentation:"<p>The status of the user import job. One of the following:</p> <ul> <li> <p>Created - The job was created but not started.</p> </li> <li> <p>Pending - A transition state. You have started the job, but it has not begun importing users yet.</p> </li> <li> <p>InProgress - The job has started, and users are being imported.</p> </li> <li> <p>Stopping - You have stopped the job, but the job has not stopped importing users yet.</p> </li> <li> <p>Stopped - You have stopped the job, and the job has stopped importing users.</p> </li> <li> <p>Succeeded - The job has completed successfully.</p> </li> <li> <p>Failed - The job has stopped due to an error.</p> </li> <li> <p>Expired - You created a job, but did not start the job within 24-48 hours. All data associated with the job was deleted, and the job cannot be started.</p> </li> </ul>"},CloudWatchLogsRoleArn:{shape:"ArnType",documentation:'<p>The role ARN for the Amazon CloudWatch Logging role for the user import job. For more information, see "Creating the CloudWatch Logs IAM Role" in the Amazon Cognito Developer Guide.</p>'},ImportedUsers:{shape:"LongType",documentation:"<p>The number of users that were successfully imported.</p>"},SkippedUsers:{shape:"LongType",documentation:"<p>The number of users that were skipped.</p>"},FailedUsers:{shape:"LongType",documentation:"<p>The number of users that could not be imported.</p>"},CompletionMessage:{shape:"CompletionMessageType",documentation:"<p>The message returned when the user import job is completed.</p>"}},documentation:"<p>The user import job type.</p>"},UserImportJobsListType:{type:"list",member:{shape:"UserImportJobType"},max:50,min:1},UserLambdaValidationException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when the Amazon Cognito service returns a user validation exception with the AWS Lambda service.</p>"}},documentation:"<p>This exception gets thrown when the Amazon Cognito service encounters a user validation exception with the AWS Lambda service.</p>",exception:!0},UserNotConfirmedException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when a user is not confirmed successfully.</p>"}},documentation:"<p>This exception is thrown when a user is not confirmed successfully.</p>",exception:!0},UserNotFoundException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when a user is not found.</p>"}},documentation:"<p>This exception is thrown when a user is not found.</p>",exception:!0},UserPoolAddOnNotEnabledException:{type:"structure",members:{message:{shape:"MessageType"}},exception:!0},UserPoolAddOnsType:{type:"structure",required:["AdvancedSecurityMode"],members:{AdvancedSecurityMode:{shape:"AdvancedSecurityModeType"}}},UserPoolClientDescription:{type:"structure",members:{ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool where you want to describe the user pool client.</p>"},ClientName:{shape:"ClientNameType",documentation:"<p>The client name from the user pool client description.</p>"}},documentation:"<p>The description of the user pool client.</p>"},UserPoolClientListType:{type:"list",member:{shape:"UserPoolClientDescription"}},UserPoolClientType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType",documentation:"<p>The user pool ID for the user pool client.</p>"},ClientName:{shape:"ClientNameType",documentation:"<p>The client name from the user pool request of the client type.</p>"},ClientId:{shape:"ClientIdType",documentation:"<p>The ID of the client associated with the user pool.</p>"},ClientSecret:{shape:"ClientSecretType",documentation:"<p>The client secret from the user pool request of the client type.</p>"},LastModifiedDate:{shape:"DateType",documentation:"<p>The last modified date from the user pool request of the client type.</p>"},CreationDate:{shape:"DateType",documentation:"<p>The creation date from the user pool request of the client type.</p>"},RefreshTokenValidity:{shape:"RefreshTokenValidityType",documentation:"<p>The time limit, in days, after which the refresh token is no longer valid and cannot be used.</p>"},ReadAttributes:{shape:"ClientPermissionListType",documentation:"<p>The Read-only attributes.</p>"},WriteAttributes:{shape:"ClientPermissionListType",documentation:"<p>The writeable attributes.</p>"},ExplicitAuthFlows:{shape:"ExplicitAuthFlowsListType",documentation:"<p>The explicit authentication flows.</p>"},SupportedIdentityProviders:{shape:"SupportedIdentityProvidersListType"},CallbackURLs:{shape:"CallbackURLsListType"},LogoutURLs:{shape:"LogoutURLsListType"},DefaultRedirectURI:{shape:"RedirectUrlType"},AllowedOAuthFlows:{shape:"OAuthFlowsType"},AllowedOAuthScopes:{shape:"ScopeListType"},AllowedOAuthFlowsUserPoolClient:{shape:"BooleanType",box:!0},AnalyticsConfiguration:{shape:"AnalyticsConfigurationType"}},documentation:"<p>A user pool of the client type.</p>"},UserPoolDescriptionType:{type:"structure",members:{Id:{shape:"UserPoolIdType",documentation:"<p>The ID in a user pool description.</p>"},Name:{shape:"UserPoolNameType",documentation:"<p>The name in a user pool description.</p>"},LambdaConfig:{shape:"LambdaConfigType",documentation:"<p>The AWS Lambda configuration information in a user pool description.</p>"},Status:{shape:"StatusType",documentation:"<p>The user pool status in a user pool description.</p>"},LastModifiedDate:{shape:"DateType",documentation:"<p>The last modified date in a user pool description.</p>"},CreationDate:{shape:"DateType",documentation:"<p>The creation date in a user pool description.</p>"}},documentation:"<p>A user pool description.</p>"},UserPoolIdType:{type:"string",max:55,min:1,pattern:"[\\w-]+_[0-9a-zA-Z]+"},UserPoolListType:{type:"list",member:{shape:"UserPoolDescriptionType"}},UserPoolMfaType:{type:"string",enum:["OFF","ON","OPTIONAL"]},UserPoolNameType:{type:"string",max:128,min:1,pattern:"[\\w\\s+=,.@-]+"},UserPoolPolicyType:{type:"structure",members:{PasswordPolicy:{shape:"PasswordPolicyType",documentation:"<p>A container with information about the user pool password policy.</p>"}},documentation:"<p>The type of policy in a user pool.</p>"},UserPoolTaggingException:{type:"structure",members:{message:{shape:"MessageType"}},documentation:"<p>This exception gets thrown when a user pool tag cannot be set or updated.</p>",exception:!0},UserPoolTagsType:{type:"map",key:{shape:"StringType"},value:{shape:"StringType"}},UserPoolType:{type:"structure",members:{Id:{shape:"UserPoolIdType",documentation:"<p>The ID of the user pool.</p>"},Name:{shape:"UserPoolNameType",documentation:"<p>The name of the user pool.</p>"},Policies:{shape:"UserPoolPolicyType",documentation:"<p>A container describing the policies associated with a user pool.</p>"},LambdaConfig:{shape:"LambdaConfigType",documentation:"<p>A container describing the AWS Lambda triggers associated with a user pool.</p>"},Status:{shape:"StatusType",documentation:"<p>The status of a user pool.</p>"},LastModifiedDate:{shape:"DateType",documentation:"<p>The last modified date of a user pool.</p>"},CreationDate:{shape:"DateType",documentation:"<p>The creation date of a user pool.</p>"},SchemaAttributes:{shape:"SchemaAttributesListType",documentation:"<p>A container with the schema attributes of a user pool.</p>"},AutoVerifiedAttributes:{shape:"VerifiedAttributesListType",documentation:"<p>Specifies the attributes that are auto-verified in a user pool.</p>"},AliasAttributes:{shape:"AliasAttributesListType",documentation:"<p>Specifies the attributes that are aliased in a user pool.</p>"},UsernameAttributes:{shape:"UsernameAttributesListType"},SmsVerificationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>The contents of the SMS verification message.</p>"},EmailVerificationMessage:{shape:"EmailVerificationMessageType",documentation:"<p>The contents of the email verification message.</p>"},EmailVerificationSubject:{shape:"EmailVerificationSubjectType",documentation:"<p>The subject of the email verification message.</p>"},VerificationMessageTemplate:{shape:"VerificationMessageTemplateType"},SmsAuthenticationMessage:{shape:"SmsVerificationMessageType",documentation:"<p>The contents of the SMS authentication message.</p>"},MfaConfiguration:{shape:"UserPoolMfaType",documentation:"<p>Can be one of the following values:</p> <ul> <li> <p> <code>OFF</code> - MFA tokens are not required and cannot be specified during user registration.</p> </li> <li> <p> <code>ON</code> - MFA tokens are required for all user registrations. You can only specify required when you are initially creating a user pool.</p> </li> <li> <p> <code>OPTIONAL</code> - Users have the option when registering to create an MFA token.</p> </li> </ul>"},DeviceConfiguration:{shape:"DeviceConfigurationType",documentation:"<p>The device configuration.</p>"},EstimatedNumberOfUsers:{shape:"IntegerType",documentation:"<p>A number estimating the size of the user pool.</p>"},EmailConfiguration:{shape:"EmailConfigurationType",documentation:"<p>The email configuration.</p>"},SmsConfiguration:{shape:"SmsConfigurationType",documentation:"<p>The SMS configuration.</p>"},UserPoolTags:{shape:"UserPoolTagsType",documentation:'<p>The cost allocation tags for the user pool. For more information, see <a href="http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-cost-allocation-tagging.html">Adding Cost Allocation Tags to Your User Pool</a> </p>'},SmsConfigurationFailure:{shape:"StringType",documentation:"<p>The reason why the SMS configuration cannot send the message(s) to your users.</p>"},EmailConfigurationFailure:{shape:"StringType",documentation:"<p>The reason why the email configuration cannot send the messages to your users.</p>"},AdminCreateUserConfig:{shape:"AdminCreateUserConfigType",documentation:"<p>The configuration for AdminCreateUser requests.</p>"},UserPoolAddOns:{shape:"UserPoolAddOnsType"}},documentation:"<p>A container with information about the user pool type.</p>"},UserPoolUIConfigurationType:{type:"structure",members:{UserPoolId:{shape:"UserPoolIdType"},Details:{shape:"UserPoolUIDetailsType"},LastModifiedDate:{shape:"DateType"},CreationDate:{shape:"DateType"}}},UserPoolUIDetailsType:{type:"map",key:{shape:"StringType"},value:{shape:"UIDetailsMapType"}},UserStatusType:{type:"string",enum:["UNCONFIRMED","CONFIRMED","ARCHIVED","COMPROMISED","UNKNOWN","RESET_REQUIRED","FORCE_CHANGE_PASSWORD"]},UserType:{type:"structure",members:{Username:{shape:"UsernameType",documentation:"<p>The user name of the user you wish to describe.</p>"},Attributes:{shape:"AttributeListType",documentation:"<p>A container with information about the user type attributes.</p>"},UserCreateDate:{shape:"DateType",documentation:"<p>The creation date of the user.</p>"},UserLastModifiedDate:{shape:"DateType",documentation:"<p>The last modified date of the user.</p>"},Enabled:{shape:"BooleanType",documentation:"<p>Specifies whether the user is enabled.</p>"},UserStatus:{shape:"UserStatusType",documentation:"<p>The user status. Can be one of the following:</p> <ul> <li> <p>UNCONFIRMED - User has been created but not confirmed.</p> </li> <li> <p>CONFIRMED - User has been confirmed.</p> </li> <li> <p>ARCHIVED - User is no longer active.</p> </li> <li> <p>COMPROMISED - User is disabled due to a potential security threat.</p> </li> <li> <p>UNKNOWN - User status is not known.</p> </li> </ul>"},MFAOptions:{shape:"MFAOptionListType",documentation:"<p>The MFA options for the user.</p>"}},documentation:"<p>The user type.</p>"},UsernameAttributeType:{type:"string",enum:["phone_number","email"]},UsernameAttributesListType:{type:"list",member:{shape:"UsernameAttributeType"}},UsernameExistsException:{type:"structure",members:{message:{shape:"MessageType",documentation:"<p>The message returned when Amazon Cognito throws a user name exists exception.</p>"}},documentation:"<p>This exception is thrown when Amazon Cognito encounters a user name that already exists in the user pool.</p>",exception:!0},UsernameType:{type:"string",max:128,min:1,pattern:"[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",sensitive:!0},UsersListType:{type:"list",member:{shape:"UserType"}},VerificationMessageTemplateType:{type:"structure",members:{SmsMessage:{shape:"SmsVerificationMessageType"},EmailMessage:{shape:"EmailVerificationMessageType"},EmailSubject:{shape:"EmailVerificationSubjectType"},EmailMessageByLink:{shape:"EmailVerificationMessageByLinkType"},EmailSubjectByLink:{shape:"EmailVerificationSubjectByLinkType"},DefaultEmailOption:{shape:"DefaultEmailOptionType"}}},VerifiedAttributeType:{type:"string",enum:["phone_number","email"]},VerifiedAttributesListType:{type:"list",member:{shape:"VerifiedAttributeType"}},VerifySoftwareTokenRequest:{type:"structure",required:["UserCode"],members:{AccessToken:{shape:"TokenModelType"},Session:{shape:"SessionType"},UserCode:{shape:"SoftwareTokenMFAUserCodeType"},FriendlyDeviceName:{shape:"StringType"}}},VerifySoftwareTokenResponse:{type:"structure",members:{Status:{shape:"VerifySoftwareTokenResponseType"},Session:{shape:"SessionType"}}},VerifySoftwareTokenResponseType:{type:"string",enum:["SUCCESS","ERROR"]},VerifyUserAttributeRequest:{type:"structure",required:["AccessToken","AttributeName","Code"],members:{AccessToken:{shape:"TokenModelType",documentation:"<p>Represents the access token of the request to verify user attributes.</p>"},AttributeName:{shape:"AttributeNameType",documentation:"<p>The attribute name in the request to verify user attributes.</p>"},Code:{shape:"ConfirmationCodeType",documentation:"<p>The verification code in the request to verify user attributes.</p>"}},documentation:"<p>Represents the request to verify user attributes.</p>"},VerifyUserAttributeResponse:{type:"structure",members:{},documentation:"<p>A container representing the response from the server from the request to verify user attributes.</p>"},openIdListType:{type:"list",member:{shape:"StringType"}},openIdUrlType:{type:"string",max:150,min:1,pattern:"https://cognito-idp\\.amazonaws\\.com/[\\w\\._/-]"}},documentation:"<p>Using the Amazon Cognito Your User Pools API, you can create a user pool to manage directories and users. You can authenticate a user to obtain tokens related to user identity and access policies.</p> <p>This API reference provides information about user pools in Amazon Cognito Your User Pools.</p> <p>For more information, see the Amazon Cognito Documentation.</p>"}},{}],3:[function(a,b,c){b.exports={acm:{name:"ACM",cors:!0},apigateway:{name:"APIGateway",cors:!0},applicationautoscaling:{prefix:"application-autoscaling",name:"ApplicationAutoScaling",cors:!0},autoscaling:{name:"AutoScaling",cors:!0},cloudformation:{name:"CloudFormation",cors:!0},cloudfront:{name:"CloudFront",versions:["2013-05-12*","2013-11-11*","2014-05-31*","2014-10-21*","2014-11-06*","2015-04-17*","2015-07-27*","2015-09-17*","2016-01-13*","2016-01-28*","2016-08-01*","2016-08-20*"],cors:!0},cloudhsm:{name:"CloudHSM",cors:!0},cloudsearch:{name:"CloudSearch"},cloudsearchdomain:{name:"CloudSearchDomain"},cloudtrail:{name:"CloudTrail",cors:!0},cloudwatch:{prefix:"monitoring",name:"CloudWatch",cors:!0},cloudwatchevents:{prefix:"events",name:"CloudWatchEvents",versions:["2014-02-03*"],cors:!0},cloudwatchlogs:{prefix:"logs",name:"CloudWatchLogs",cors:!0},codecommit:{name:"CodeCommit",cors:!0},codedeploy:{name:"CodeDeploy",cors:!0},codepipeline:{name:"CodePipeline",cors:!0},cognitoidentity:{prefix:"cognito-identity",name:"CognitoIdentity",cors:!0},cognitoidentityserviceprovider:{prefix:"cognito-idp",name:"CognitoIdentityServiceProvider",cors:!0},cognitosync:{prefix:"cognito-sync",name:"CognitoSync",cors:!0},configservice:{prefix:"config",name:"ConfigService",cors:!0},datapipeline:{name:"DataPipeline"},devicefarm:{name:"DeviceFarm",cors:!0},directconnect:{name:"DirectConnect",cors:!0},directoryservice:{prefix:"ds",name:"DirectoryService"},discovery:{name:"Discovery"},dms:{name:"DMS"},dynamodb:{name:"DynamoDB",cors:!0},dynamodbstreams:{prefix:"streams.dynamodb",name:"DynamoDBStreams",cors:!0},ec2:{name:"EC2",versions:["2013-06-15*","2013-10-15*","2014-02-01*","2014-05-01*","2014-06-15*","2014-09-01*","2014-10-01*","2015-03-01*","2015-04-15*","2015-10-01*"],cors:!0},ecr:{name:"ECR",cors:!0},ecs:{name:"ECS",cors:!0},efs:{prefix:"elasticfilesystem",name:"EFS"},elasticache:{name:"ElastiCache",versions:["2012-11-15*","2014-03-24*","2014-07-15*","2014-09-30*"],cors:!0},elasticbeanstalk:{name:"ElasticBeanstalk",cors:!0},elb:{prefix:"elasticloadbalancing",name:"ELB",cors:!0},elbv2:{prefix:"elasticloadbalancingv2",name:"ELBv2",cors:!0},emr:{prefix:"elasticmapreduce",name:"EMR",cors:!0},es:{name:"ES"},elastictranscoder:{name:"ElasticTranscoder",cors:!0},firehose:{name:"Firehose",cors:!0},gamelift:{name:"GameLift",cors:!0},glacier:{name:"Glacier"},iam:{name:"IAM"},importexport:{name:"ImportExport"},inspector:{name:"Inspector",versions:["2015-08-18*"],cors:!0},iot:{name:"Iot",cors:!0},iotdata:{prefix:"iot-data",name:"IotData",cors:!0},kinesis:{name:"Kinesis",cors:!0},kinesisanalytics:{name:"KinesisAnalytics"},kms:{name:"KMS",cors:!0},lambda:{name:"Lambda",cors:!0},machinelearning:{name:"MachineLearning",cors:!0},marketplacecommerceanalytics:{name:"MarketplaceCommerceAnalytics",cors:!0},marketplacemetering:{prefix:"meteringmarketplace",name:"MarketplaceMetering"},mobileanalytics:{name:"MobileAnalytics",cors:!0},opsworks:{name:"OpsWorks",cors:!0},rds:{name:"RDS",versions:["2014-09-01*"],cors:!0},redshift:{name:"Redshift",cors:!0},route53:{name:"Route53",cors:!0},route53domains:{name:"Route53Domains",cors:!0},s3:{name:"S3",dualstackAvailable:!0,cors:!0},servicecatalog:{name:"ServiceCatalog",cors:!0},ses:{prefix:"email",name:"SES",cors:!0},simpledb:{prefix:"sdb",name:"SimpleDB"},snowball:{name:"Snowball"},sns:{name:"SNS",cors:!0},sqs:{name:"SQS",cors:!0},ssm:{name:"SSM",cors:!0},storagegateway:{name:"StorageGateway",cors:!0},sts:{name:"STS",cors:!0},support:{name:"Support"},swf:{name:"SWF"},waf:{name:"WAF",cors:!0},workspaces:{name:"WorkSpaces"}}},{}],4:[function(a,b,c){b.exports={version:"2.0",metadata:{apiVersion:"2011-06-15",endpointPrefix:"sts",globalEndpoint:"sts.amazonaws.com",protocol:"query",serviceAbbreviation:"AWS STS",serviceFullName:"AWS Security Token Service",signatureVersion:"v4",xmlNamespace:"https://sts.amazonaws.com/doc/2011-06-15/"},operations:{AssumeRole:{input:{type:"structure",required:["RoleArn","RoleSessionName"],members:{RoleArn:{},RoleSessionName:{},Policy:{},DurationSeconds:{type:"integer"},ExternalId:{},SerialNumber:{},TokenCode:{}}},output:{resultWrapper:"AssumeRoleResult",type:"structure",members:{Credentials:{shape:"Sa"},AssumedRoleUser:{shape:"Sf"},PackedPolicySize:{type:"integer"}}}},AssumeRoleWithSAML:{input:{type:"structure",required:["RoleArn","PrincipalArn","SAMLAssertion"],members:{RoleArn:{},PrincipalArn:{},SAMLAssertion:{},Policy:{},DurationSeconds:{type:"integer"}}},output:{resultWrapper:"AssumeRoleWithSAMLResult",type:"structure",members:{Credentials:{shape:"Sa"},AssumedRoleUser:{shape:"Sf"},PackedPolicySize:{type:"integer"},Subject:{},SubjectType:{},Issuer:{},Audience:{},NameQualifier:{}}}},AssumeRoleWithWebIdentity:{input:{type:"structure",required:["RoleArn","RoleSessionName","WebIdentityToken"],members:{RoleArn:{},RoleSessionName:{},WebIdentityToken:{},ProviderId:{},Policy:{},DurationSeconds:{type:"integer"}}},output:{resultWrapper:"AssumeRoleWithWebIdentityResult",type:"structure",members:{Credentials:{shape:"Sa"},SubjectFromWebIdentityToken:{},AssumedRoleUser:{shape:"Sf"},PackedPolicySize:{type:"integer"},Provider:{},Audience:{}}}},DecodeAuthorizationMessage:{input:{type:"structure",required:["EncodedMessage"],members:{EncodedMessage:{}}},output:{resultWrapper:"DecodeAuthorizationMessageResult",type:"structure",members:{DecodedMessage:{}}}},GetCallerIdentity:{input:{type:"structure",members:{}},output:{resultWrapper:"GetCallerIdentityResult",type:"structure",members:{UserId:{},Account:{},Arn:{}}}},GetFederationToken:{input:{type:"structure",required:["Name"],members:{Name:{},Policy:{},DurationSeconds:{type:"integer"}}},output:{resultWrapper:"GetFederationTokenResult",type:"structure",members:{Credentials:{shape:"Sa"},FederatedUser:{type:"structure",required:["FederatedUserId","Arn"],members:{FederatedUserId:{},Arn:{}}},PackedPolicySize:{type:"integer"}}}},GetSessionToken:{input:{type:"structure",members:{DurationSeconds:{type:"integer"},SerialNumber:{},TokenCode:{}}},output:{resultWrapper:"GetSessionTokenResult",type:"structure",members:{Credentials:{shape:"Sa"}}}}},shapes:{Sa:{type:"structure",required:["AccessKeyId","SecretAccessKey","SessionToken","Expiration"],members:{AccessKeyId:{},SecretAccessKey:{},SessionToken:{},Expiration:{type:"timestamp"}}},Sf:{type:"structure",required:["AssumedRoleId","Arn"],members:{AssumedRoleId:{},Arn:{}}}}}},{}],5:[function(a,b,c){a("../lib/node_loader");var d=a("../lib/core"),e=a("../lib/service"),f=a("../lib/api_loader");f.services.cognitoidentity={},d.CognitoIdentity=e.defineService("cognitoidentity",["2014-06-30"]),a("../lib/services/cognitoidentity"),Object.defineProperty(f.services.cognitoidentity,"2014-06-30",{get:function(){var b=a("../apis/cognito-identity-2014-06-30.min.json");return b},enumerable:!0,configurable:!0}),b.exports=d.CognitoIdentity},{"../apis/cognito-identity-2014-06-30.min.json":1,"../lib/api_loader":7,"../lib/core":11,"../lib/node_loader":9,"../lib/service":42,"../lib/services/cognitoidentity":43}],6:[function(a,b,c){a("../lib/node_loader");var d=a("../lib/core"),e=a("../lib/service"),f=a("../lib/api_loader");f.services.sts={},d.STS=e.defineService("sts",["2011-06-15"]),a("../lib/services/sts"),Object.defineProperty(f.services.sts,"2011-06-15",{get:function(){var b=a("../apis/sts-2011-06-15.min.json");return b},enumerable:!0,configurable:!0}),b.exports=d.STS},{"../apis/sts-2011-06-15.min.json":4,"../lib/api_loader":7,"../lib/core":11,"../lib/node_loader":9,"../lib/service":42,"../lib/services/sts":44}],7:[function(a,b,c){var d=a("./core");d.apiLoader=function(a,b){if(!d.apiLoader.services.hasOwnProperty(a))throw new Error("InvalidService: Failed to load api for "+a);return d.apiLoader.services[a][b]},d.apiLoader.services={},b.exports=d.apiLoader},{"./core":11}],8:[function(a,b,c){a("./browser_loader");var d=a("./core");"undefined"!=typeof window&&(window.AWSCognito=d),"undefined"!=typeof b&&(b.exports=d),"undefined"!=typeof self&&(self.AWSCognito=d),Object.prototype.hasOwnProperty.call(d,"CognitoIdentityServiceProvider")||(d.apiLoader.services.cognitoidentityserviceprovider={},d.CognitoIdentityServiceProvider=d.Service.defineService("cognitoidentityserviceprovider",["2016-04-18"])),d.apiLoader.services.cognitoidentityserviceprovider["2016-04-18"]=a("../apis/cognito-idp-2016-04-18.min"),Object.prototype.hasOwnProperty.call(d,"STS")||(d.apiLoader.services.sts={},d.STS=d.Service.defineService("sts",["2011-06-15"]),a("./services/sts")),d.apiLoader.services.sts["2011-06-15"]=a("../apis/sts-2011-06-15.min")},{"../apis/cognito-idp-2016-04-18.min":2,"../apis/sts-2011-06-15.min":4,"./browser_loader":9,"./core":11,"./services/sts":44}],9:[function(a,b,c){(function(b){var c=a("./util");c.crypto.lib=a("crypto-browserify"),c.Buffer=a("buffer/").Buffer,c.url=a("url/"),c.querystring=a("querystring/");var d=a("./core");a("./api_loader"),d.XML.Parser=a("./xml/browser_parser"),a("./http/xhr"),"undefined"==typeof b&&(b={browser:!0})}).call(this,a("FWaASH"))},{"./api_loader":7,"./core":11,"./http/xhr":20,"./util":53,"./xml/browser_parser":54,FWaASH:62,"buffer/":69,"crypto-browserify":74,"querystring/":82,"url/":83}],10:[function(a,b,c){var d=a("./core");a("./credentials"),a("./credentials/credential_provider_chain"),d.Config=d.util.inherit({constructor:function(a){void 0===a&&(a={}),a=this.extractCredentials(a),d.util.each.call(this,this.keys,function(b,c){this.set(b,a[b],c)})},getCredentials:function(a){function b(b){a(b,b?null:g.credentials)}function c(a,b){return new d.util.error(b||new Error,{code:"CredentialsError",message:a})}function e(){g.credentials.get(function(a){if(a){var d="Could not load credentials from "+g.credentials.constructor.name;a=c(d,a)}b(a)})}function f(){var a=null;g.credentials.accessKeyId&&g.credentials.secretAccessKey||(a=c("Missing credentials")),b(a)}var g=this;g.credentials?"function"==typeof g.credentials.get?e():f():g.credentialProvider?g.credentialProvider.resolve(function(a,d){a&&(a=c("Could not load credentials from any providers",a)),g.credentials=d,b(a)}):b(c("No credentials to load"))},update:function(a,b){b=b||!1,a=this.extractCredentials(a),d.util.each.call(this,a,function(a,c){(b||Object.prototype.hasOwnProperty.call(this.keys,a)||d.Service.hasService(a))&&this.set(a,c)})},loadFromPath:function(a){this.clear();var b=JSON.parse(d.util.readFileSync(a)),c=new d.FileSystemCredentials(a),e=new d.CredentialProviderChain;return e.providers.unshift(c),e.resolve(function(a,c){if(a)throw a;b.credentials=c}),this.constructor(b),this},clear:function(){d.util.each.call(this,this.keys,function(a){delete this[a]}),this.set("credentials",void 0),this.set("credentialProvider",void 0)},set:function(a,b,c){void 0===b?(void 0===c&&(c=this.keys[a]),"function"==typeof c?this[a]=c.call(this):this[a]=c):"httpOptions"===a&&this[a]?this[a]=d.util.merge(this[a],b):this[a]=b},keys:{credentials:null,credentialProvider:null,region:null,logger:null,apiVersions:{},apiVersion:null,endpoint:void 0,httpOptions:{timeout:12e4},maxRetries:void 0,maxRedirects:10,paramValidation:!0,sslEnabled:!0,s3ForcePathStyle:!1,s3BucketEndpoint:!1,s3DisableBodySigning:!0,computeChecksums:!0,convertResponseTypes:!0,correctClockSkew:!1,customUserAgent:null,dynamoDbCrc32:!0,systemClockOffset:0,signatureVersion:null,signatureCache:!0,retryDelayOptions:{base:100},useAccelerateEndpoint:!1},extractCredentials:function(a){return a.accessKeyId&&a.secretAccessKey&&(a=d.util.copy(a),a.credentials=new d.Credentials(a)),a},setPromisesDependency:function(a){d.util.addPromisesToRequests(d.Request,a)}}),d.config=new d.Config},{"./core":11,"./credentials":12,"./credentials/credential_provider_chain":14}],11:[function(a,b,c){var d={util:a("./util")},e={};e.toString(),b.exports=d,d.util.update(d,{VERSION:"2.6.4",Signers:{},Protocol:{Json:a("./protocol/json"),Query:a("./protocol/query"),Rest:a("./protocol/rest"),RestJson:a("./protocol/rest_json"),RestXml:a("./protocol/rest_xml")},XML:{Builder:a("./xml/builder"),Parser:null},JSON:{Builder:a("./json/builder"),Parser:a("./json/parser")},Model:{Api:a("./model/api"),Operation:a("./model/operation"),Shape:a("./model/shape"),Paginator:a("./model/paginator"),ResourceWaiter:a("./model/resource_waiter")},util:a("./util"),apiLoader:function(){throw new Error("No API loader set")}}),a("./service"),a("./credentials"),a("./credentials/credential_provider_chain"),a("./credentials/temporary_credentials"),a("./credentials/web_identity_credentials"),a("./credentials/cognito_identity_credentials"),a("./credentials/saml_credentials"),a("./config"),a("./http"),a("./sequential_executor"),a("./event_listeners"),a("./request"),a("./response"),a("./resource_waiter"),a("./signers/request_signer"),a("./param_validator"),d.events=new d.SequentialExecutor},{"./config":10,"./credentials":12,"./credentials/cognito_identity_credentials":13,"./credentials/credential_provider_chain":14,"./credentials/saml_credentials":15,"./credentials/temporary_credentials":16,"./credentials/web_identity_credentials":17,"./event_listeners":18,"./http":19,"./json/builder":21,"./json/parser":22,"./model/api":23,"./model/operation":25,"./model/paginator":26,"./model/resource_waiter":27,"./model/shape":28,"./param_validator":29,"./protocol/json":30,"./protocol/query":31,"./protocol/rest":32,"./protocol/rest_json":33,"./protocol/rest_xml":34,"./request":38,"./resource_waiter":39,"./response":40,"./sequential_executor":41,"./service":42,"./signers/request_signer":46,"./util":53,"./xml/builder":55}],12:[function(a,b,c){var d=a("./core");d.Credentials=d.util.inherit({constructor:function(){if(d.util.hideProperties(this,["secretAccessKey"]),this.expired=!1,this.expireTime=null,1===arguments.length&&"object"==typeof arguments[0]){var a=arguments[0].credentials||arguments[0];this.accessKeyId=a.accessKeyId,this.secretAccessKey=a.secretAccessKey,this.sessionToken=a.sessionToken}else this.accessKeyId=arguments[0],this.secretAccessKey=arguments[1],this.sessionToken=arguments[2]},expiryWindow:15,needsRefresh:function(){var a=d.util.date.getDate().getTime(),b=new Date(a+1e3*this.expiryWindow);return!!(this.expireTime&&b>this.expireTime)||(this.expired||!this.accessKeyId||!this.secretAccessKey)},get:function(a){var b=this;this.needsRefresh()?this.refresh(function(c){c||(b.expired=!1),a&&a(c)}):a&&a()},refresh:function(a){this.expired=!1,a()}})},{"./core":11}],13:[function(a,b,c){var d=a("../core"),e=a("../../clients/cognitoidentity"),f=a("../../clients/sts");d.CognitoIdentityCredentials=d.util.inherit(d.Credentials,{localStorageKey:{id:"aws.cognito.identity-id.",providers:"aws.cognito.identity-providers."},constructor:function(a){d.Credentials.call(this),this.expired=!0,this.params=a,this.data=null,this.identityId=null,this.loadCachedId()},refresh:function(a){var b=this;b.createClients(),b.data=null,b.identityId=null,b.getId(function(c){c?(b.clearIdOnNotAuthorized(c),a(c)):b.params.RoleArn?b.getCredentialsFromSTS(a):b.getCredentialsForIdentity(a)})},clearCachedId:function(){this.identityId=null,delete this.params.IdentityId;var a=this.params.IdentityPoolId,b=this.params.LoginId||"";delete this.storage[this.localStorageKey.id+a+b],delete this.storage[this.localStorageKey.providers+a+b]},clearIdOnNotAuthorized:function(a){var b=this;"NotAuthorizedException"==a.code&&b.clearCachedId()},getId:function(a){var b=this;return"string"==typeof b.params.IdentityId?a(null,b.params.IdentityId):void b.cognito.getId(function(c,d){!c&&d.IdentityId?(b.params.IdentityId=d.IdentityId,a(null,d.IdentityId)):a(c)})},loadCredentials:function(a,b){a&&b&&(b.expired=!1,b.accessKeyId=a.Credentials.AccessKeyId,b.secretAccessKey=a.Credentials.SecretKey,b.sessionToken=a.Credentials.SessionToken,b.expireTime=a.Credentials.Expiration)},getCredentialsForIdentity:function(a){var b=this;b.cognito.getCredentialsForIdentity(function(c,d){c?b.clearIdOnNotAuthorized(c):(b.cacheId(d),b.data=d,b.loadCredentials(b.data,b)),a(c)})},getCredentialsFromSTS:function(a){var b=this;b.cognito.getOpenIdToken(function(c,d){c?(b.clearIdOnNotAuthorized(c),a(c)):(b.cacheId(d),b.params.WebIdentityToken=d.Token,b.webIdentityCredentials.refresh(function(c){c||(b.data=b.webIdentityCredentials.data,b.sts.credentialsFrom(b.data,b)),a(c)}))})},loadCachedId:function(){var a=this;if(d.util.isBrowser()&&!a.params.IdentityId){
var b=a.getStorage("id");if(b&&a.params.Logins){var c=Object.keys(a.params.Logins),e=(a.getStorage("providers")||"").split(","),f=e.filter(function(a){return c.indexOf(a)!==-1});0!==f.length&&(a.params.IdentityId=b)}else b&&(a.params.IdentityId=b)}},createClients:function(){this.webIdentityCredentials=this.webIdentityCredentials||new d.WebIdentityCredentials(this.params),this.cognito=this.cognito||new e({params:this.params}),this.sts=this.sts||new f},cacheId:function(a){this.identityId=a.IdentityId,this.params.IdentityId=this.identityId,d.util.isBrowser()&&(this.setStorage("id",a.IdentityId),this.params.Logins&&this.setStorage("providers",Object.keys(this.params.Logins).join(",")))},getStorage:function(a){return this.storage[this.localStorageKey[a]+this.params.IdentityPoolId+(this.params.LoginId||"")]},setStorage:function(a,b){try{this.storage[this.localStorageKey[a]+this.params.IdentityPoolId+(this.params.LoginId||"")]=b}catch(a){}},storage:function(){try{return window.localStorage.setItem("aws.test-storage","foobar"),window.localStorage.removeItem("aws.test-storage"),d.util.isBrowser()?window.localStorage:{}}catch(a){return{}}}()})},{"../../clients/cognitoidentity":5,"../../clients/sts":6,"../core":11}],14:[function(a,b,c){var d=a("../core");d.CredentialProviderChain=d.util.inherit(d.Credentials,{constructor:function(a){a?this.providers=a:this.providers=d.CredentialProviderChain.defaultProviders.slice(0)},resolve:function(a){function b(e,f){if(!e&&f||c===d.length)return void a(e,f);var g=d[c++];f="function"==typeof g?g.call():g,f.get?f.get(function(a){b(a,a?null:f)}):b(null,f)}if(0===this.providers.length)return a(new Error("No providers")),this;var c=0,d=this.providers.slice(0);return b(),this}}),d.CredentialProviderChain.defaultProviders=[]},{"../core":11}],15:[function(a,b,c){var d=a("../core"),e=a("../../clients/sts");d.SAMLCredentials=d.util.inherit(d.Credentials,{constructor:function(a){d.Credentials.call(this),this.expired=!0,this.params=a},refresh:function(a){var b=this;b.createClients(),a||(a=function(a){if(a)throw a}),b.service.assumeRoleWithSAML(function(c,d){c||b.service.credentialsFrom(d,b),a(c)})},createClients:function(){this.service=this.service||new e({params:this.params})}})},{"../../clients/sts":6,"../core":11}],16:[function(a,b,c){var d=a("../core"),e=a("../../clients/sts");d.TemporaryCredentials=d.util.inherit(d.Credentials,{constructor:function(a){d.Credentials.call(this),this.loadMasterCredentials(),this.expired=!0,this.params=a||{},this.params.RoleArn&&(this.params.RoleSessionName=this.params.RoleSessionName||"temporary-credentials")},refresh:function(a){var b=this;b.createClients(),a||(a=function(a){if(a)throw a}),b.service.config.credentials=b.masterCredentials;var c=b.params.RoleArn?b.service.assumeRole:b.service.getSessionToken;c.call(b.service,function(c,d){c||b.service.credentialsFrom(d,b),a(c)})},loadMasterCredentials:function(){for(this.masterCredentials=d.config.credentials;this.masterCredentials.masterCredentials;)this.masterCredentials=this.masterCredentials.masterCredentials},createClients:function(){this.service=this.service||new e({params:this.params})}})},{"../../clients/sts":6,"../core":11}],17:[function(a,b,c){var d=a("../core"),e=a("../../clients/sts");d.WebIdentityCredentials=d.util.inherit(d.Credentials,{constructor:function(a){d.Credentials.call(this),this.expired=!0,this.params=a,this.params.RoleSessionName=this.params.RoleSessionName||"web-identity",this.data=null},refresh:function(a){var b=this;b.createClients(),a||(a=function(a){if(a)throw a}),b.service.assumeRoleWithWebIdentity(function(c,d){b.data=null,c||(b.data=d,b.service.credentialsFrom(d,b)),a(c)})},createClients:function(){this.service=this.service||new e({params:this.params})}})},{"../../clients/sts":6,"../core":11}],18:[function(a,b,c){var d=a("./core"),e=a("./sequential_executor");d.EventListeners={Core:{}},d.EventListeners={Core:(new e).addNamedListeners(function(a,b){b("VALIDATE_CREDENTIALS","validate",function(a,b){return a.service.api.signatureVersion?void a.service.config.getCredentials(function(c){c&&(a.response.error=d.util.error(c,{code:"CredentialsError",message:"Missing credentials in config"})),b()}):b()}),a("VALIDATE_REGION","validate",function(a){a.service.config.region||a.service.isGlobalEndpoint||(a.response.error=d.util.error(new Error,{code:"ConfigError",message:"Missing region in config"}))}),a("VALIDATE_PARAMETERS","validate",function(a){var b=a.service.api.operations[a.operation].input,c=a.service.config.paramValidation;new d.ParamValidator(c).validate(b,a.params)}),b("COMPUTE_SHA256","afterBuild",function(a,b){if(a.haltHandlersOnError(),!a.service.api.signatureVersion)return b();if(a.service.getSignerClass(a)===d.Signers.V4){var c=a.httpRequest.body||"";d.util.computeSha256(c,function(c,d){c?b(c):(a.httpRequest.headers["X-Amz-Content-Sha256"]=d,b())})}else b()}),a("SET_CONTENT_LENGTH","afterBuild",function(a){if(void 0===a.httpRequest.headers["Content-Length"]){var b=d.util.string.byteLength(a.httpRequest.body);a.httpRequest.headers["Content-Length"]=b}}),a("SET_HTTP_HOST","afterBuild",function(a){a.httpRequest.headers.Host=a.httpRequest.endpoint.host}),a("RESTART","restart",function(){var a=this.response.error;a&&a.retryable&&(this.httpRequest=new d.HttpRequest(this.service.endpoint,this.service.region),this.response.retryCount<this.service.config.maxRetries?this.response.retryCount++:this.response.error=null)}),b("SIGN","sign",function(a,b){var c=a.service;return c.api.signatureVersion?void c.config.getCredentials(function(e,f){if(e)return a.response.error=e,b();try{var g=d.util.date.getDate(),h=c.getSignerClass(a),i=new h(a.httpRequest,c.api.signingName||c.api.endpointPrefix,c.config.signatureCache);i.setServiceClientId(c._clientId),delete a.httpRequest.headers.Authorization,delete a.httpRequest.headers.Date,delete a.httpRequest.headers["X-Amz-Date"],i.addAuthorization(f,g),a.signedAt=g}catch(b){a.response.error=b}b()}):b()}),a("VALIDATE_RESPONSE","validateResponse",function(a){this.service.successfulResponse(a,this)?(a.data={},a.error=null):(a.data=null,a.error=d.util.error(new Error,{code:"UnknownError",message:"An unknown error occurred."}))}),b("SEND","send",function(a,b){function c(c){a.httpResponse.stream=c,c.on("headers",function(b,e){a.request.emit("httpHeaders",[b,e,a]),a.httpResponse.streaming||(2===d.HttpClient.streamsApiVersion?c.on("readable",function(){var b=c.read();null!==b&&a.request.emit("httpData",[b,a])}):c.on("data",function(b){a.request.emit("httpData",[b,a])}))}),c.on("end",function(){a.request.emit("httpDone"),b()})}function e(b){b.on("sendProgress",function(b){a.request.emit("httpUploadProgress",[b,a])}),b.on("receiveProgress",function(b){a.request.emit("httpDownloadProgress",[b,a])})}function f(c){a.error=d.util.error(c,{code:"NetworkingError",region:a.request.httpRequest.region,hostname:a.request.httpRequest.endpoint.hostname,retryable:!0}),a.request.emit("httpError",[a.error,a],function(){b()})}function g(){var b=d.HttpClient.getInstance(),g=a.request.service.config.httpOptions||{};try{var h=b.handleRequest(a.request.httpRequest,g,c,f);e(h)}catch(a){f(a)}}a.httpResponse._abortCallback=b,a.error=null,a.data=null;var h=(d.util.date.getDate()-this.signedAt)/1e3;h>=600?this.emit("sign",[this],function(a){a?b(a):g()}):g()}),a("HTTP_HEADERS","httpHeaders",function(a,b,c){c.httpResponse.statusCode=a,c.httpResponse.headers=b,c.httpResponse.body=new d.util.Buffer(""),c.httpResponse.buffers=[],c.httpResponse.numBytes=0;var e=b.date||b.Date;if(e){var f=Date.parse(e);c.request.service.config.correctClockSkew&&d.util.isClockSkewed(f)&&d.util.applyClockOffset(f)}}),a("HTTP_DATA","httpData",function(a,b){if(a){if(d.util.isNode()){b.httpResponse.numBytes+=a.length;var c=b.httpResponse.headers["content-length"],e={loaded:b.httpResponse.numBytes,total:c};b.request.emit("httpDownloadProgress",[e,b])}b.httpResponse.buffers.push(new d.util.Buffer(a))}}),a("HTTP_DONE","httpDone",function(a){if(a.httpResponse.buffers&&a.httpResponse.buffers.length>0){var b=d.util.buffer.concat(a.httpResponse.buffers);a.httpResponse.body=b}delete a.httpResponse.numBytes,delete a.httpResponse.buffers}),a("FINALIZE_ERROR","retry",function(a){a.httpResponse.statusCode&&(a.error.statusCode=a.httpResponse.statusCode,void 0===a.error.retryable&&(a.error.retryable=this.service.retryableError(a.error,this)))}),a("INVALIDATE_CREDENTIALS","retry",function(a){if(a.error)switch(a.error.code){case"RequestExpired":case"ExpiredTokenException":case"ExpiredToken":a.error.retryable=!0,a.request.service.config.credentials.expired=!0}}),a("EXPIRED_SIGNATURE","retry",function(a){var b=a.error;b&&"string"==typeof b.code&&"string"==typeof b.message&&b.code.match(/Signature/)&&b.message.match(/expired/)&&(a.error.retryable=!0)}),a("CLOCK_SKEWED","retry",function(a){a.error&&this.service.clockSkewError(a.error)&&this.service.config.correctClockSkew&&d.config.isClockSkewed&&(a.error.retryable=!0)}),a("REDIRECT","retry",function(a){a.error&&a.error.statusCode>=300&&a.error.statusCode<400&&a.httpResponse.headers.location&&(this.httpRequest.endpoint=new d.Endpoint(a.httpResponse.headers.location),this.httpRequest.headers.Host=this.httpRequest.endpoint.host,a.error.redirect=!0,a.error.retryable=!0)}),a("RETRY_CHECK","retry",function(a){a.error&&(a.error.redirect&&a.redirectCount<a.maxRedirects?a.error.retryDelay=0:a.retryCount<a.maxRetries&&(a.error.retryDelay=this.service.retryDelays(a.retryCount)||0))}),b("RESET_RETRY_STATE","afterRetry",function(a,b){var c,d=!1;a.error&&(c=a.error.retryDelay||0,a.error.retryable&&a.retryCount<a.maxRetries?(a.retryCount++,d=!0):a.error.redirect&&a.redirectCount<a.maxRedirects&&(a.redirectCount++,d=!0)),d?(a.error=null,setTimeout(b,c)):b()})}),CorePost:(new e).addNamedListeners(function(a){a("EXTRACT_REQUEST_ID","extractData",d.util.extractRequestId),a("EXTRACT_REQUEST_ID","extractError",d.util.extractRequestId),a("ENOTFOUND_ERROR","httpError",function(a){if("NetworkingError"===a.code&&"ENOTFOUND"===a.errno){var b="Inaccessible host: `"+a.hostname+"'. This service may not be available in the `"+a.region+"' region.";this.response.error=d.util.error(new Error(b),{code:"UnknownEndpoint",region:a.region,hostname:a.hostname,retryable:!0,originalError:a})}})}),Logger:(new e).addNamedListeners(function(b){b("LOG_REQUEST","complete",function(b){function c(){var c=d.util.date.getDate().getTime(),g=(c-e.startTime.getTime())/1e3,h=!!f.isTTY,i=b.httpResponse.statusCode,j=a("util").inspect(e.params,!0,null),k="";return h&&(k+="[33m"),k+="[AWS "+e.service.serviceIdentifier+" "+i,k+=" "+g.toString()+"s "+b.retryCount+" retries]",h&&(k+="[0;1m"),k+=" "+d.util.string.lowerFirst(e.operation),k+="("+j+")",h&&(k+="[0m"),k}var e=b.request,f=e.service.config.logger;if(f){var g=c();"function"==typeof f.log?f.log(g):"function"==typeof f.write&&f.write(g+"\n")}})}),Json:(new e).addNamedListeners(function(b){var c=a("./protocol/json");b("BUILD","build",c.buildRequest),b("EXTRACT_DATA","extractData",c.extractData),b("EXTRACT_ERROR","extractError",c.extractError)}),Rest:(new e).addNamedListeners(function(b){var c=a("./protocol/rest");b("BUILD","build",c.buildRequest),b("EXTRACT_DATA","extractData",c.extractData),b("EXTRACT_ERROR","extractError",c.extractError)}),RestJson:(new e).addNamedListeners(function(b){var c=a("./protocol/rest_json");b("BUILD","build",c.buildRequest),b("EXTRACT_DATA","extractData",c.extractData),b("EXTRACT_ERROR","extractError",c.extractError)}),RestXml:(new e).addNamedListeners(function(b){var c=a("./protocol/rest_xml");b("BUILD","build",c.buildRequest),b("EXTRACT_DATA","extractData",c.extractData),b("EXTRACT_ERROR","extractError",c.extractError)}),Query:(new e).addNamedListeners(function(b){var c=a("./protocol/query");b("BUILD","build",c.buildRequest),b("EXTRACT_DATA","extractData",c.extractData),b("EXTRACT_ERROR","extractError",c.extractError)})}},{"./core":11,"./protocol/json":30,"./protocol/query":31,"./protocol/rest":32,"./protocol/rest_json":33,"./protocol/rest_xml":34,"./sequential_executor":41,util:68}],19:[function(a,b,c){var d=a("./core"),e=d.util.inherit;d.Endpoint=e({constructor:function(a,b){if(d.util.hideProperties(this,["slashes","auth","hash","search","query"]),"undefined"==typeof a||null===a)throw new Error("Invalid endpoint: "+a);if("string"!=typeof a)return d.util.copy(a);if(!a.match(/^http/)){var c=b&&void 0!==b.sslEnabled?b.sslEnabled:d.config.sslEnabled;a=(c?"https":"http")+"://"+a}d.util.update(this,d.util.urlParse(a)),this.port?this.port=parseInt(this.port,10):this.port="https:"===this.protocol?443:80}}),d.HttpRequest=e({constructor:function(a,b,c){a=new d.Endpoint(a),this.method="POST",this.path=a.path||"/",this.headers={},this.body="",this.endpoint=a,this.region=b,this.setUserAgent(c)},setUserAgent:function(a){var b=d.util.isBrowser()?"X-Amz-":"",c="";"string"==typeof a&&a&&(c+=" "+a),this.headers[b+"User-Agent"]=d.util.userAgent()+c},pathname:function(){return this.path.split("?",1)[0]},search:function(){var a=this.path.split("?",2)[1];return a?(a=d.util.queryStringParse(a),d.util.queryParamsToString(a)):""}}),d.HttpResponse=e({constructor:function(){this.statusCode=void 0,this.headers={},this.body=void 0,this.streaming=!1,this.stream=null},createUnbufferedStream:function(){return this.streaming=!0,this.stream}}),d.HttpClient=e({}),d.HttpClient.getInstance=function(){return void 0===this.singleton&&(this.singleton=new this),this.singleton}},{"./core":11}],20:[function(a,b,c){var d=a("../core"),e=a("events").EventEmitter;a("../http"),d.XHRClient=d.util.inherit({handleRequest:function(a,b,c,f){var g=this,h=a.endpoint,i=new e,j=h.protocol+"//"+h.hostname;80!==h.port&&443!==h.port&&(j+=":"+h.port),j+=a.path;var k=new XMLHttpRequest,l=!1;a.stream=k,k.addEventListener("readystatechange",function(){try{if(0===k.status)return}catch(a){return}if(this.readyState>=this.HEADERS_RECEIVED&&!l){try{k.responseType="arraybuffer"}catch(a){}i.statusCode=k.status,i.headers=g.parseHeaders(k.getAllResponseHeaders()),i.emit("headers",i.statusCode,i.headers),l=!0}this.readyState===this.DONE&&g.finishRequest(k,i)},!1),k.upload.addEventListener("progress",function(a){i.emit("sendProgress",a)}),k.addEventListener("progress",function(a){i.emit("receiveProgress",a)},!1),k.addEventListener("timeout",function(){f(d.util.error(new Error("Timeout"),{code:"TimeoutError"}))},!1),k.addEventListener("error",function(){f(d.util.error(new Error("Network Failure"),{code:"NetworkingError"}))},!1),c(i),k.open(a.method,j,b.xhrAsync!==!1),d.util.each(a.headers,function(a,b){"Content-Length"!==a&&"User-Agent"!==a&&"Host"!==a&&k.setRequestHeader(a,b)}),b.timeout&&b.xhrAsync!==!1&&(k.timeout=b.timeout),b.xhrWithCredentials&&(k.withCredentials=!0);try{k.send(a.body)}catch(b){if(!a.body||"object"!=typeof a.body.buffer)throw b;k.send(a.body.buffer)}return i},parseHeaders:function(a){var b={};return d.util.arrayEach(a.split(/\r?\n/),function(a){var c=a.split(":",1)[0],d=a.substring(c.length+2);c.length>0&&(b[c.toLowerCase()]=d)}),b},finishRequest:function(a,b){var c;if("arraybuffer"===a.responseType&&a.response){var e=a.response;c=new d.util.Buffer(e.byteLength);for(var f=new Uint8Array(e),g=0;g<c.length;++g)c[g]=f[g]}try{c||"string"!=typeof a.responseText||(c=new d.util.Buffer(a.responseText))}catch(a){}c&&b.emit("data",c),b.emit("end")}}),d.HttpClient.prototype=d.XHRClient.prototype,d.HttpClient.streamsApiVersion=1},{"../core":11,"../http":19,events:60}],21:[function(a,b,c){function d(){}function e(a,b){if(b&&void 0!==a&&null!==a)switch(b.type){case"structure":return f(a,b);case"map":return h(a,b);case"list":return g(a,b);default:return i(a,b)}}function f(a,b){var c={};return j.each(a,function(a,d){var f=b.members[a];if(f){if("body"!==f.location)return;var g=f.isLocationName?f.name:a,h=e(d,f);void 0!==h&&(c[g]=h)}}),c}function g(a,b){var c=[];return j.arrayEach(a,function(a){var d=e(a,b.member);void 0!==d&&c.push(d)}),c}function h(a,b){var c={};return j.each(a,function(a,d){var f=e(d,b.value);void 0!==f&&(c[a]=f)}),c}function i(a,b){return b.toWireFormat(a)}var j=a("../util");d.prototype.build=function(a,b){return JSON.stringify(e(a,b))},b.exports=d},{"../util":53}],22:[function(a,b,c){function d(){}function e(a,b){if(b&&void 0!==a)switch(b.type){case"structure":return f(a,b);case"map":return h(a,b);case"list":return g(a,b);default:return i(a,b)}}function f(a,b){if(null!=a){var c={},d=b.members;return j.each(d,function(b,d){var f=d.isLocationName?d.name:b;if(Object.prototype.hasOwnProperty.call(a,f)){var g=a[f],h=e(g,d);void 0!==h&&(c[b]=h)}}),c}}function g(a,b){if(null!=a){var c=[];return j.arrayEach(a,function(a){var d=e(a,b.member);void 0===d?c.push(null):c.push(d)}),c}}function h(a,b){if(null!=a){var c={};return j.each(a,function(a,d){var f=e(d,b.value);void 0===f?c[a]=null:c[a]=f}),c}}function i(a,b){return b.toType(a)}var j=a("../util");d.prototype.parse=function(a,b){return e(JSON.parse(a),b)},b.exports=d},{"../util":53}],23:[function(a,b,c){function d(a,b){a=a||{},b=b||{},b.api=this,a.metadata=a.metadata||{},k(this,"isApi",!0,!1),k(this,"apiVersion",a.metadata.apiVersion),k(this,"endpointPrefix",a.metadata.endpointPrefix),k(this,"signingName",a.metadata.signingName),k(this,"globalEndpoint",a.metadata.globalEndpoint),k(this,"signatureVersion",a.metadata.signatureVersion),k(this,"jsonVersion",a.metadata.jsonVersion),k(this,"targetPrefix",a.metadata.targetPrefix),k(this,"protocol",a.metadata.protocol),k(this,"timestampFormat",a.metadata.timestampFormat),k(this,"xmlNamespaceUri",a.metadata.xmlNamespace),k(this,"abbreviation",a.metadata.serviceAbbreviation),k(this,"fullName",a.metadata.serviceFullName),l(this,"className",function(){var b=a.metadata.serviceAbbreviation||a.metadata.serviceFullName;return b?(b=b.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g,""),"ElasticLoadBalancing"===b&&(b="ELB"),b):null}),k(this,"operations",new e(a.operations,b,function(a,c){return new f(a,c,b)},j.string.lowerFirst)),k(this,"shapes",new e(a.shapes,b,function(a,c){return g.create(c,b)})),k(this,"paginators",new e(a.paginators,b,function(a,c){return new h(a,c,b)})),k(this,"waiters",new e(a.waiters,b,function(a,c){return new i(a,c,b)},j.string.lowerFirst)),b.documentation&&(k(this,"documentation",a.documentation),k(this,"documentationUrl",a.documentationUrl))}var e=a("./collection"),f=a("./operation"),g=a("./shape"),h=a("./paginator"),i=a("./resource_waiter"),j=a("../util"),k=j.property,l=j.memoizedProperty;b.exports=d},{"../util":53,"./collection":24,"./operation":25,"./paginator":26,"./resource_waiter":27,"./shape":28}],24:[function(a,b,c){function d(a,b,c,d){f(this,d(a),function(){return c(a,b)})}function e(a,b,c,e){e=e||String;var f=this;for(var g in a)Object.prototype.hasOwnProperty.call(a,g)&&d.call(f,g,a[g],c,e)}var f=a("../util").memoizedProperty;b.exports=e},{"../util":53}],25:[function(a,b,c){function d(a,b,c){c=c||{},g(this,"name",b.name||a),g(this,"api",c.api,!1),b.http=b.http||{},g(this,"httpMethod",b.http.method||"POST"),g(this,"httpPath",b.http.requestUri||"/"),g(this,"authtype",b.authtype||""),h(this,"input",function(){return b.input?e.create(b.input,c):new e.create({type:"structure"},c)}),h(this,"output",function(){return b.output?e.create(b.output,c):new e.create({type:"structure"},c)}),h(this,"errors",function(){var a=[];if(!b.errors)return null;for(var d=0;d<b.errors.length;d++)a.push(e.create(b.errors[d],c));return a}),h(this,"paginator",function(){return c.api.paginators[a]}),c.documentation&&(g(this,"documentation",b.documentation),g(this,"documentationUrl",b.documentationUrl))}var e=a("./shape"),f=a("../util"),g=f.property,h=f.memoizedProperty;b.exports=d},{"../util":53,"./shape":28}],26:[function(a,b,c){function d(a,b){e(this,"inputToken",b.input_token),e(this,"limitKey",b.limit_key),e(this,"moreResults",b.more_results),e(this,"outputToken",b.output_token),e(this,"resultKey",b.result_key)}var e=a("../util").property;b.exports=d},{"../util":53}],27:[function(a,b,c){function d(a,b,c){c=c||{},f(this,"name",a),f(this,"api",c.api,!1),b.operation&&f(this,"operation",e.string.lowerFirst(b.operation));var d=this,g=["type","description","delay","maxAttempts","acceptors"];g.forEach(function(a){var c=b[a];c&&f(d,a,c)})}var e=a("../util"),f=e.property;b.exports=d},{"../util":53}],28:[function(a,b,c){function d(a,b,c){null!==c&&void 0!==c&&s.property.apply(this,arguments)}function e(a,b){a.constructor.prototype[b]||s.memoizedProperty.apply(this,arguments)}function f(a,b,c){b=b||{},d(this,"shape",a.shape),d(this,"api",b.api,!1),d(this,"type",a.type),d(this,"enum",a.enum),d(this,"min",a.min),d(this,"max",a.max),d(this,"pattern",a.pattern),d(this,"location",a.location||this.location||"body"),d(this,"name",this.name||a.xmlName||a.queryName||a.locationName||c),d(this,"isStreaming",a.streaming||this.isStreaming||!1),d(this,"isComposite",a.isComposite||!1),d(this,"isShape",!0,!1),d(this,"isQueryName",!!a.queryName,!1),d(this,"isLocationName",!!a.locationName,!1),b.documentation&&(d(this,"documentation",a.documentation),d(this,"documentationUrl",a.documentationUrl)),a.xmlAttribute&&d(this,"isXmlAttribute",a.xmlAttribute||!1),d(this,"defaultValue",null),this.toWireFormat=function(a){return null===a||void 0===a?"":a},this.toType=function(a){return a}}function g(a){f.apply(this,arguments),d(this,"isComposite",!0),a.flattened&&d(this,"flattened",a.flattened||!1)}function h(a,b){var c=null,h=!this.isShape;g.apply(this,arguments),h&&(d(this,"defaultValue",function(){return{}}),d(this,"members",{}),d(this,"memberNames",[]),d(this,"required",[]),d(this,"isRequired",function(){return!1})),a.members&&(d(this,"members",new r(a.members,b,function(a,c){return f.create(c,b,a)})),e(this,"memberNames",function(){return a.xmlOrder||Object.keys(a.members)})),a.required&&(d(this,"required",a.required),d(this,"isRequired",function(b){if(!c){c={};for(var d=0;d<a.required.length;d++)c[a.required[d]]=!0}return c[b]},!1,!0)),d(this,"resultWrapper",a.resultWrapper||null),a.payload&&d(this,"payload",a.payload),"string"==typeof a.xmlNamespace?d(this,"xmlNamespaceUri",a.xmlNamespace):"object"==typeof a.xmlNamespace&&(d(this,"xmlNamespacePrefix",a.xmlNamespace.prefix),d(this,"xmlNamespaceUri",a.xmlNamespace.uri))}function i(a,b){var c=this,h=!this.isShape;if(g.apply(this,arguments),h&&d(this,"defaultValue",function(){return[]}),a.member&&e(this,"member",function(){return f.create(a.member,b)}),this.flattened){var i=this.name;e(this,"name",function(){return c.member.name||i})}}function j(a,b){var c=!this.isShape;g.apply(this,arguments),c&&(d(this,"defaultValue",function(){return{}}),d(this,"key",f.create({type:"string"},b)),d(this,"value",f.create({type:"string"},b))),a.key&&e(this,"key",function(){return f.create(a.key,b)}),a.value&&e(this,"value",function(){return f.create(a.value,b)})}function k(a){var b=this;if(f.apply(this,arguments),"header"===this.location)d(this,"timestampFormat","rfc822");else if(a.timestampFormat)d(this,"timestampFormat",a.timestampFormat);else if(this.api)if(this.api.timestampFormat)d(this,"timestampFormat",this.api.timestampFormat);else switch(this.api.protocol){case"json":case"rest-json":d(this,"timestampFormat","unixTimestamp");break;case"rest-xml":case"query":case"ec2":d(this,"timestampFormat","iso8601")}this.toType=function(a){return null===a||void 0===a?null:"function"==typeof a.toUTCString?a:"string"==typeof a||"number"==typeof a?s.date.parseTimestamp(a):null},this.toWireFormat=function(a){return s.date.format(a,b.timestampFormat)}}function l(){if(f.apply(this,arguments),this.api)switch(this.api.protocol){case"rest-xml":case"query":case"ec2":this.toType=function(a){return a||""}}}function m(){f.apply(this,arguments),this.toType=function(a){return null===a||void 0===a?null:parseFloat(a)},this.toWireFormat=this.toType}function n(){f.apply(this,arguments),this.toType=function(a){return null===a||void 0===a?null:parseInt(a,10)},this.toWireFormat=this.toType}function o(){f.apply(this,arguments),this.toType=s.base64.decode,this.toWireFormat=s.base64.encode}function p(){o.apply(this,arguments)}function q(){f.apply(this,arguments),this.toType=function(a){return"boolean"==typeof a?a:null===a||void 0===a?null:"true"===a}}var r=a("./collection"),s=a("../util");f.normalizedTypes={character:"string",double:"float",long:"integer",short:"integer",biginteger:"integer",bigdecimal:"float",blob:"binary"},f.types={structure:h,list:i,map:j,boolean:q,timestamp:k,float:m,integer:n,string:l,base64:p,binary:o},f.resolve=function(a,b){if(a.shape){var c=b.api.shapes[a.shape];if(!c)throw new Error("Cannot find shape reference: "+a.shape);return c}return null},f.create=function(a,b,c){if(a.isShape)return a;var d=f.resolve(a,b);if(d){var e=Object.keys(a);if(b.documentation||(e=e.filter(function(a){return!a.match(/documentation/)})),e===["shape"])return d;var g=function(){d.constructor.call(this,a,b,c)};return g.prototype=d,new g}a.type||(a.members?a.type="structure":a.member?a.type="list":a.key?a.type="map":a.type="string");var h=a.type;if(f.normalizedTypes[a.type]&&(a.type=f.normalizedTypes[a.type]),f.types[a.type])return new f.types[a.type](a,b,c);throw new Error("Unrecognized shape type: "+h)},f.shapes={StructureShape:h,ListShape:i,MapShape:j,StringShape:l,BooleanShape:q,Base64Shape:p},b.exports=f},{"../util":53,"./collection":24}],29:[function(a,b,c){var d=a("./core");d.ParamValidator=d.util.inherit({constructor:function(a){a!==!0&&void 0!==a||(a={min:!0}),this.validation=a},validate:function(a,b,c){if(this.errors=[],this.validateMember(a,b||{},c||"params"),this.errors.length>1){var e=this.errors.join("\n* ");throw e="There were "+this.errors.length+" validation errors:\n* "+e,d.util.error(new Error(e),{code:"MultipleValidationErrors",errors:this.errors})}if(1===this.errors.length)throw this.errors[0];return!0},fail:function(a,b){this.errors.push(d.util.error(new Error(b),{code:a}))},validateStructure:function(a,b,c){this.validateType(b,c,["object"],"structure");for(var d,e=0;a.required&&e<a.required.length;e++){d=a.required[e];var f=b[d];void 0!==f&&null!==f||this.fail("MissingRequiredParameter","Missing required key '"+d+"' in "+c)}for(d in b)if(Object.prototype.hasOwnProperty.call(b,d)){var g=b[d],h=a.members[d];if(void 0!==h){var i=[c,d].join(".");this.validateMember(h,g,i)}else this.fail("UnexpectedParameter","Unexpected key '"+d+"' found in "+c)}return!0},validateMember:function(a,b,c){switch(a.type){case"structure":return this.validateStructure(a,b,c);case"list":return this.validateList(a,b,c);case"map":return this.validateMap(a,b,c);default:return this.validateScalar(a,b,c)}},validateList:function(a,b,c){if(this.validateType(b,c,[Array])){this.validateRange(a,b.length,c,"list member count");for(var d=0;d<b.length;d++)this.validateMember(a.member,b[d],c+"["+d+"]")}},validateMap:function(a,b,c){if(this.validateType(b,c,["object"],"map")){var d=0;for(var e in b)Object.prototype.hasOwnProperty.call(b,e)&&(this.validateMember(a.key,e,c+"[key='"+e+"']"),this.validateMember(a.value,b[e],c+"['"+e+"']"),d++);this.validateRange(a,d,c,"map member count")}},validateScalar:function(a,b,c){switch(a.type){case null:case void 0:case"string":return this.validateString(a,b,c);case"base64":case"binary":return this.validatePayload(b,c);case"integer":case"float":return this.validateNumber(a,b,c);case"boolean":return this.validateType(b,c,["boolean"]);case"timestamp":return this.validateType(b,c,[Date,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,"number"],"Date object, ISO-8601 string, or a UNIX timestamp");default:return this.fail("UnkownType","Unhandled type "+a.type+" for "+c)}},validateString:function(a,b,c){this.validateType(b,c,["string"])&&(this.validateEnum(a,b,c),this.validateRange(a,b.length,c,"string length"),this.validatePattern(a,b,c))},validatePattern:function(a,b,c){this.validation.pattern&&void 0!==a.pattern&&(new RegExp(a.pattern).test(b)||this.fail("PatternMatchError",'Provided value "'+b+'" does not match regex pattern /'+a.pattern+"/ for "+c))},validateRange:function(a,b,c,d){this.validation.min&&void 0!==a.min&&b<a.min&&this.fail("MinRangeError","Expected "+d+" >= "+a.min+", but found "+b+" for "+c),this.validation.max&&void 0!==a.max&&b>a.max&&this.fail("MaxRangeError","Expected "+d+" <= "+a.max+", but found "+b+" for "+c)},validateEnum:function(a,b,c){this.validation.enum&&void 0!==a.enum&&a.enum.indexOf(b)===-1&&this.fail("EnumError","Found string value of "+b+", but expected "+a.enum.join("|")+" for "+c)},validateType:function(a,b,c,e){if(null===a||void 0===a)return!1;for(var f=!1,g=0;g<c.length;g++){if("string"==typeof c[g]){if(typeof a===c[g])return!0}else if(c[g]instanceof RegExp){if((a||"").toString().match(c[g]))return!0}else{if(a instanceof c[g])return!0;if(d.util.isType(a,c[g]))return!0;e||f||(c=c.slice()),c[g]=d.util.typeName(c[g])}f=!0}var h=e;h||(h=c.join(", ").replace(/,([^,]+)$/,", or$1"));var i=h.match(/^[aeiou]/i)?"n":"";return this.fail("InvalidParameterType","Expected "+b+" to be a"+i+" "+h),!1},validateNumber:function(a,b,c){if(null!==b&&void 0!==b){if("string"==typeof b){var d=parseFloat(b);d.toString()===b&&(b=d)}this.validateType(b,c,["number"])&&this.validateRange(a,b,c,"numeric value")}},validatePayload:function(a,b){if(null!==a&&void 0!==a&&"string"!=typeof a&&(!a||"number"!=typeof a.byteLength)){if(d.util.isNode()){var c=d.util.stream.Stream;if(d.util.Buffer.isBuffer(a)||a instanceof c)return}var e=["Buffer","Stream","File","Blob","ArrayBuffer","DataView"];if(a)for(var f=0;f<e.length;f++){if(d.util.isType(a,e[f]))return;if(d.util.typeName(a.constructor)===e[f])return}this.fail("InvalidParameterType","Expected "+b+" to be a string, Buffer, Stream, Blob, or typed array object")}}})},{"./core":11}],30:[function(a,b,c){function d(a){var b=a.httpRequest,c=a.service.api,d=c.targetPrefix+"."+c.operations[a.operation].name,e=c.jsonVersion||"1.0",f=c.operations[a.operation].input,g=new h;1===e&&(e="1.0"),b.body=g.build(a.params||{},f),b.headers["Content-Type"]="application/x-amz-json-"+e,b.headers["X-Amz-Target"]=d}function e(a){var b={},c=a.httpResponse;if(b.code=c.headers["x-amzn-errortype"]||"UnknownError","string"==typeof b.code&&(b.code=b.code.split(":")[0]),c.body.length>0){var d=JSON.parse(c.body.toString());(d.__type||d.code)&&(b.code=(d.__type||d.code).split("#").pop()),"RequestEntityTooLarge"===b.code?b.message="Request body must be less than 1 MB":b.message=d.message||d.Message||null}else b.statusCode=c.statusCode,b.message=c.statusCode.toString();a.error=g.error(new Error,b)}function f(a){var b=a.httpResponse.body.toString()||"{}";if(a.request.service.config.convertResponseTypes===!1)a.data=JSON.parse(b);else{var c=a.request.service.api.operations[a.request.operation],d=c.output||{},e=new i;a.data=e.parse(b,d)}}var g=a("../util"),h=a("../json/builder"),i=a("../json/parser");b.exports={buildRequest:d,extractError:e,extractData:f}},{"../json/builder":21,"../json/parser":22,"../util":53}],31:[function(a,b,c){function d(a){var b=a.service.api.operations[a.operation],c=a.httpRequest;c.headers["Content-Type"]="application/x-www-form-urlencoded; charset=utf-8",c.params={Version:a.service.api.apiVersion,Action:b.name};var d=new i;d.serialize(a.params,b.input,function(a,b){c.params[a]=b}),c.body=h.queryParamsToString(c.params)}function e(a){var b,c=a.httpResponse.body.toString();b=c.match("<UnknownOperationException")?{Code:"UnknownOperation",Message:"Unknown operation "+a.request.operation}:(new g.XML.Parser).parse(c),b.requestId&&!a.requestId&&(a.requestId=b.requestId),b.Errors&&(b=b.Errors),b.Error&&(b=b.Error),b.Code?a.error=h.error(new Error,{code:b.Code,message:b.Message}):a.error=h.error(new Error,{code:a.httpResponse.statusCode,message:null})}function f(a){var b=a.request,c=b.service.api.operations[b.operation],d=c.output||{},e=d;if(e.resultWrapper){var f=j.create({type:"structure"});f.members[e.resultWrapper]=d,f.memberNames=[e.resultWrapper],h.property(d,"name",d.resultWrapper),d=f}var i=new g.XML.Parser;if(d&&d.members&&!d.members._XAMZRequestId){var k=j.create({type:"string"
},{api:{protocol:"query"}},"requestId");d.members._XAMZRequestId=k}var l=i.parse(a.httpResponse.body.toString(),d);a.requestId=l._XAMZRequestId||l.requestId,l._XAMZRequestId&&delete l._XAMZRequestId,e.resultWrapper&&l[e.resultWrapper]&&(h.update(l,l[e.resultWrapper]),delete l[e.resultWrapper]),a.data=l}var g=a("../core"),h=a("../util"),i=a("../query/query_param_serializer"),j=a("../model/shape");b.exports={buildRequest:d,extractError:e,extractData:f}},{"../core":11,"../model/shape":28,"../query/query_param_serializer":35,"../util":53}],32:[function(a,b,c){function d(a){a.httpRequest.method=a.service.api.operations[a.operation].httpMethod}function e(a){var b=a.service.api.operations[a.operation],c=b.input,d=[a.httpRequest.endpoint.path,b.httpPath].join("/");d=d.replace(/\/+/g,"/");var e={},f=!1;if(j.each(c.members,function(b,c){var g=a.params[b];if(null!==g&&void 0!==g)if("uri"===c.location){var h=new RegExp("\\{"+c.name+"(\\+)?\\}");d=d.replace(h,function(a,b){var c=b?j.uriEscapePath:j.uriEscape;return c(String(g))})}else"querystring"===c.location&&(f=!0,"list"===c.type?e[c.name]=g.map(function(a){return j.uriEscape(String(a))}):"map"===c.type?j.each(g,function(a,b){Array.isArray(b)?e[a]=b.map(function(a){return j.uriEscape(String(a))}):e[a]=j.uriEscape(String(b))}):e[c.name]=j.uriEscape(String(g)))}),f){d+=d.indexOf("?")>=0?"&":"?";var g=[];j.arrayEach(Object.keys(e).sort(),function(a){Array.isArray(e[a])||(e[a]=[e[a]]);for(var b=0;b<e[a].length;b++)g.push(j.uriEscape(String(a))+"="+e[a][b])}),d+=g.join("&")}a.httpRequest.path=d}function f(a){var b=a.service.api.operations[a.operation];j.each(b.input.members,function(b,c){var d=a.params[b];null!==d&&void 0!==d&&("headers"===c.location&&"map"===c.type?j.each(d,function(b,d){a.httpRequest.headers[c.name+b]=d}):"header"===c.location&&(d=c.toWireFormat(d).toString(),a.httpRequest.headers[c.name]=d))})}function g(a){d(a),e(a),f(a)}function h(){}function i(a){var b=a.request,c={},d=a.httpResponse,e=b.service.api.operations[b.operation],f=e.output,g={};j.each(d.headers,function(a,b){g[a.toLowerCase()]=b}),j.each(f.members,function(a,b){var e=(b.name||a).toLowerCase();if("headers"===b.location&&"map"===b.type){c[a]={};var f=b.isLocationName?b.name:"",h=new RegExp("^"+f+"(.+)","i");j.each(d.headers,function(b,d){var e=b.match(h);null!==e&&(c[a][e[1]]=d)})}else"header"===b.location?void 0!==g[e]&&(c[a]=g[e]):"statusCode"===b.location&&(c[a]=parseInt(d.statusCode,10))}),a.data=c}var j=a("../util");b.exports={buildRequest:g,extractError:h,extractData:i}},{"../util":53}],33:[function(a,b,c){function d(a){var b=new k,c=a.service.api.operations[a.operation].input;if(c.payload){var d={},e=c.members[c.payload];if(d=a.params[c.payload],void 0===d)return;"structure"===e.type?a.httpRequest.body=b.build(d,e):a.httpRequest.body=d}else a.httpRequest.body=b.build(a.params,c)}function e(a){i.buildRequest(a),["GET","HEAD","DELETE"].indexOf(a.httpRequest.method)<0&&d(a)}function f(a){j.extractError(a)}function g(a){i.extractData(a);var b=a.request,c=b.service.api.operations[b.operation].output||{};if(c.payload){var d=c.members[c.payload],e=a.httpResponse.body;if(d.isStreaming)a.data[c.payload]=e;else if("structure"===d.type||"list"===d.type){var f=new l;a.data[c.payload]=f.parse(e,d)}else a.data[c.payload]=e.toString()}else{var g=a.data;j.extractData(a),a.data=h.merge(g,a.data)}}var h=a("../util"),i=a("./rest"),j=a("./json"),k=a("../json/builder"),l=a("../json/parser");b.exports={buildRequest:e,extractError:f,extractData:g}},{"../json/builder":21,"../json/parser":22,"../util":53,"./json":30,"./rest":32}],34:[function(a,b,c){function d(a){var b=a.service.api.operations[a.operation].input,c=new h.XML.Builder,d=a.params,e=b.payload;if(e){var f=b.members[e];if(d=d[e],void 0===d)return;if("structure"===f.type){var g=f.name;a.httpRequest.body=c.toXML(d,f,g,!0)}else a.httpRequest.body=d}else a.httpRequest.body=c.toXML(d,b,b.name||b.shape||i.string.upperFirst(a.operation)+"Request")}function e(a){j.buildRequest(a),["GET","HEAD"].indexOf(a.httpRequest.method)<0&&d(a)}function f(a){j.extractError(a);var b=(new h.XML.Parser).parse(a.httpResponse.body.toString());b.Errors&&(b=b.Errors),b.Error&&(b=b.Error),b.Code?a.error=i.error(new Error,{code:b.Code,message:b.Message}):a.error=i.error(new Error,{code:a.httpResponse.statusCode,message:null})}function g(a){j.extractData(a);var b,c=a.request,d=a.httpResponse.body,e=c.service.api.operations[c.operation],f=e.output,g=f.payload;if(g){var k=f.members[g];k.isStreaming?a.data[g]=d:"structure"===k.type?(b=new h.XML.Parser,a.data[g]=b.parse(d.toString(),k)):a.data[g]=d.toString()}else if(d.length>0){b=new h.XML.Parser;var l=b.parse(d.toString(),f);i.update(a.data,l)}}var h=a("../core"),i=a("../util"),j=a("./rest");b.exports={buildRequest:e,extractError:f,extractData:g}},{"../core":11,"../util":53,"./rest":32}],35:[function(a,b,c){function d(){}function e(a){return a.isQueryName||"ec2"!==a.api.protocol?a.name:a.name[0].toUpperCase()+a.name.substr(1)}function f(a,b,c,d){j.each(c.members,function(c,f){var g=b[c];if(null!==g&&void 0!==g){var h=e(f);h=a?a+"."+h:h,i(h,g,f,d)}})}function g(a,b,c,d){var e=1;j.each(b,function(b,f){var g=c.flattened?".":".entry.",h=g+e++ +".",j=h+(c.key.name||"key"),k=h+(c.value.name||"value");i(a+j,b,c.key,d),i(a+k,f,c.value,d)})}function h(a,b,c,d){var f=c.member||{};return 0===b.length?void d.call(this,a,null):void j.arrayEach(b,function(b,g){var h="."+(g+1);if("ec2"===c.api.protocol)h+="";else if(c.flattened){if(f.name){var j=a.split(".");j.pop(),j.push(e(f)),a=j.join(".")}}else h=".member"+h;i(a+h,b,f,d)})}function i(a,b,c,d){null!==b&&void 0!==b&&("structure"===c.type?f(a,b,c,d):"list"===c.type?h(a,b,c,d):"map"===c.type?g(a,b,c,d):d(a,c.toWireFormat(b).toString()))}var j=a("../util");d.prototype.serialize=function(a,b,c){f("",a,b,c)},b.exports=d},{"../util":53}],36:[function(a,b,c){function d(a){if(!a)return null;var b=a.split("-");return b.length<3?null:b.slice(0,b.length-2).join("-")+"-*"}function e(a){var b=a.config.region,c=d(b),e=a.api.endpointPrefix;return[[b,e],[c,e],[b,"*"],[c,"*"],["*",e],["*","*"]].map(function(a){return a[0]&&a[1]?a.join("/"):null})}function f(a,b){h.each(b,function(b,c){"globalEndpoint"!==b&&(void 0!==a.config[b]&&null!==a.config[b]||(a.config[b]=c))})}function g(a){for(var b=e(a),c=0;c<b.length;c++){var d=b[c];if(d&&Object.prototype.hasOwnProperty.call(i.rules,d)){var g=i.rules[d];return"string"==typeof g&&(g=i.patterns[g]),a.config.useDualstack&&h.isDualstackAvailable(a)&&(g=h.copy(g),g.endpoint="{service}.dualstack.{region}.amazonaws.com"),a.isGlobalEndpoint=!!g.globalEndpoint,g.signatureVersion||(g.signatureVersion="v4"),void f(a,g)}}}var h=a("./util"),i=a("./region_config.json");b.exports=g},{"./region_config.json":37,"./util":53}],37:[function(a,b,c){b.exports={rules:{"*/*":{endpoint:"{service}.{region}.amazonaws.com"},"cn-*/*":{endpoint:"{service}.{region}.amazonaws.com.cn"},"*/cloudfront":"globalSSL","*/iam":"globalSSL","*/sts":"globalSSL","*/importexport":{endpoint:"{service}.amazonaws.com",signatureVersion:"v2",globalEndpoint:!0},"*/route53":{endpoint:"https://{service}.amazonaws.com",signatureVersion:"v3https",globalEndpoint:!0},"*/waf":"globalSSL","us-gov-*/iam":"globalGovCloud","us-gov-*/sts":{endpoint:"{service}.{region}.amazonaws.com"},"us-gov-west-1/s3":"s3dash","us-west-1/s3":"s3dash","us-west-2/s3":"s3dash","eu-west-1/s3":"s3dash","ap-southeast-1/s3":"s3dash","ap-southeast-2/s3":"s3dash","ap-northeast-1/s3":"s3dash","sa-east-1/s3":"s3dash","us-east-1/s3":{endpoint:"{service}.amazonaws.com",signatureVersion:"s3"},"us-east-1/sdb":{endpoint:"{service}.amazonaws.com",signatureVersion:"v2"},"*/sdb":{endpoint:"{service}.{region}.amazonaws.com",signatureVersion:"v2"}},patterns:{globalSSL:{endpoint:"https://{service}.amazonaws.com",globalEndpoint:!0},globalGovCloud:{endpoint:"{service}.us-gov.amazonaws.com"},s3dash:{endpoint:"{service}-{region}.amazonaws.com",signatureVersion:"s3"}}}},{}],38:[function(a,b,c){(function(b){function c(a){return Object.prototype.hasOwnProperty.call(i,a._asm.currentState)}var d=a("./core"),e=a("./state_machine"),f=d.util.inherit,g=d.util.domain,h=a("jmespath"),i={success:1,error:1,complete:1},j=new e;j.setupStates=function(){var a=function(a,b){var d=this;d._haltHandlersOnError=!1,d.emit(d._asm.currentState,function(a){if(a)if(c(d)){if(!(g&&d.domain instanceof g.Domain))throw a;a.domainEmitter=d,a.domain=d.domain,a.domainThrown=!1,d.domain.emit("error",a)}else d.response.error=a,b(a);else b(d.response.error)})};this.addState("validate","build","error",a),this.addState("build","afterBuild","restart",a),this.addState("afterBuild","sign","restart",a),this.addState("sign","send","retry",a),this.addState("retry","afterRetry","afterRetry",a),this.addState("afterRetry","sign","error",a),this.addState("send","validateResponse","retry",a),this.addState("validateResponse","extractData","extractError",a),this.addState("extractError","extractData","retry",a),this.addState("extractData","success","retry",a),this.addState("restart","build","error",a),this.addState("success","complete","complete",a),this.addState("error","complete","complete",a),this.addState("complete",null,null,a)},j.setupStates(),d.Request=f({constructor:function(a,b,c){var f=a.endpoint,h=a.config.region,i=a.config.customUserAgent;a.isGlobalEndpoint&&(h="us-east-1"),this.domain=g&&g.active,this.service=a,this.operation=b,this.params=c||{},this.httpRequest=new d.HttpRequest(f,h,i),this.startTime=d.util.date.getDate(),this.response=new d.Response(this),this._asm=new e(j.states,"validate"),this._haltHandlersOnError=!1,d.SequentialExecutor.call(this),this.emit=this.emitEvent},send:function(a){return a&&this.on("complete",function(b){a.call(b,b.error,b.data)}),this.runTo(),this.response},build:function(a){return this.runTo("send",a)},runTo:function(a,b){return this._asm.runTo(a,b,this),this},abort:function(){return this.removeAllListeners("validateResponse"),this.removeAllListeners("extractError"),this.on("validateResponse",function(a){a.error=d.util.error(new Error("Request aborted by user"),{code:"RequestAbortedError",retryable:!1})}),this.httpRequest.stream&&(this.httpRequest.stream.abort(),this.httpRequest._abortCallback?this.httpRequest._abortCallback():this.removeAllListeners("send")),this},eachPage:function(a){function b(c){a.call(c,c.error,c.data,function(e){e!==!1&&(c.hasNextPage()?c.nextPage().on("complete",b).send():a.call(c,null,null,d.util.fn.noop))})}a=d.util.fn.makeAsync(a,3),this.on("complete",b).send()},eachItem:function(a){function b(b,e){if(b)return a(b,null);if(null===e)return a(null,null);var f=c.service.paginationConfig(c.operation),g=f.resultKey;Array.isArray(g)&&(g=g[0]);var i=h.search(e,g),j=!0;return d.util.arrayEach(i,function(b){if(j=a(null,b),j===!1)return d.util.abort}),j}var c=this;this.eachPage(b)},isPageable:function(){return!!this.service.paginationConfig(this.operation)},createReadStream:function(){var a=d.util.stream,c=this,e=null;return 2===d.HttpClient.streamsApiVersion?(e=new a.PassThrough,c.send()):(e=new a.Stream,e.readable=!0,e.sent=!1,e.on("newListener",function(a){e.sent||"data"!==a||(e.sent=!0,b.nextTick(function(){c.send()}))})),this.on("httpHeaders",function(b,f,g){if(b<300){c.removeListener("httpData",d.EventListeners.Core.HTTP_DATA),c.removeListener("httpError",d.EventListeners.Core.HTTP_ERROR),c.on("httpError",function(a){g.error=a,g.error.retryable=!1});var h,i=!1;if("HEAD"!==c.httpRequest.method&&(h=parseInt(f["content-length"],10)),void 0!==h&&!isNaN(h)&&h>=0){i=!0;var j=0}var k=function(){i&&j!==h?e.emit("error",d.util.error(new Error("Stream content length mismatch. Received "+j+" of "+h+" bytes."),{code:"StreamContentLengthMismatch"})):2===d.HttpClient.streamsApiVersion?e.end():e.emit("end")},l=g.httpResponse.createUnbufferedStream();if(2===d.HttpClient.streamsApiVersion)if(i){var m=new a.PassThrough;m._write=function(b){return b&&b.length&&(j+=b.length),a.PassThrough.prototype._write.apply(this,arguments)},m.on("end",k),l.pipe(m).pipe(e,{end:!1})}else l.pipe(e);else i&&l.on("data",function(a){a&&a.length&&(j+=a.length)}),l.on("data",function(a){e.emit("data",a)}),l.on("end",k);l.on("error",function(a){i=!1,e.emit("error",a)})}}),this.on("error",function(a){e.emit("error",a)}),e},emitEvent:function(a,b,c){"function"==typeof b&&(c=b,b=null),c||(c=function(){}),b||(b=this.eventParameters(a,this.response));var e=d.SequentialExecutor.prototype.emit;e.call(this,a,b,function(a){a&&(this.response.error=a),c.call(this,a)})},eventParameters:function(a){switch(a){case"restart":case"validate":case"sign":case"build":case"afterValidate":case"afterBuild":return[this];case"error":return[this.response.error,this.response];default:return[this.response]}},presign:function(a,b){return b||"function"!=typeof a||(b=a,a=null),(new d.Signers.Presign).sign(this.toGet(),a,b)},isPresigned:function(){return Object.prototype.hasOwnProperty.call(this.httpRequest.headers,"presigned-expires")},toUnauthenticated:function(){return this.removeListener("validate",d.EventListeners.Core.VALIDATE_CREDENTIALS),this.removeListener("sign",d.EventListeners.Core.SIGN),this},toGet:function(){return"query"!==this.service.api.protocol&&"ec2"!==this.service.api.protocol||(this.removeListener("build",this.buildAsGet),this.addListener("build",this.buildAsGet)),this},buildAsGet:function(a){a.httpRequest.method="GET",a.httpRequest.path=a.service.endpoint.path+"?"+a.httpRequest.body,a.httpRequest.body="",delete a.httpRequest.headers["Content-Length"],delete a.httpRequest.headers["Content-Type"]},haltHandlersOnError:function(){this._haltHandlersOnError=!0}}),d.util.addPromisesToRequests(d.Request),d.util.mixin(d.Request,d.SequentialExecutor)}).call(this,a("FWaASH"))},{"./core":11,"./state_machine":52,FWaASH:62,jmespath:79}],39:[function(a,b,c){function d(a){var b=a.request._waiter,c=b.config.acceptors,d=!1,e="retry";c.forEach(function(c){if(!d){var f=b.matchers[c.matcher];f&&f(a,c.expected,c.argument)&&(d=!0,e=c.state)}}),!d&&a.error&&(e="failure"),"success"===e?b.setSuccess(a):b.setError(a,"retry"===e)}var e=a("./core"),f=e.util.inherit,g=a("jmespath");e.ResourceWaiter=f({constructor:function(a,b){this.service=a,this.state=b,this.loadWaiterConfig(this.state)},service:null,state:null,config:null,matchers:{path:function(a,b,c){var d=g.search(a.data,c);return g.strictDeepEqual(d,b)},pathAll:function(a,b,c){var d=g.search(a.data,c);Array.isArray(d)||(d=[d]);var e=d.length;if(!e)return!1;for(var f=0;f<e;f++)if(!g.strictDeepEqual(d[f],b))return!1;return!0},pathAny:function(a,b,c){var d=g.search(a.data,c);Array.isArray(d)||(d=[d]);for(var e=d.length,f=0;f<e;f++)if(g.strictDeepEqual(d[f],b))return!0;return!1},status:function(a,b){var c=a.httpResponse.statusCode;return"number"==typeof c&&c===b},error:function(a,b){return"string"==typeof b&&a.error?b===a.error.code:b===!!a.error}},listeners:(new e.SequentialExecutor).addNamedListeners(function(a){a("RETRY_CHECK","retry",function(a){var b=a.request._waiter;a.error&&"ResourceNotReady"===a.error.code&&(a.error.retryDelay=1e3*(b.config.delay||0))}),a("CHECK_OUTPUT","extractData",d),a("CHECK_ERROR","extractError",d)}),wait:function(a,b){"function"==typeof a&&(b=a,a=void 0);var c=this.service.makeRequest(this.config.operation,a);return c._waiter=this,c.response.maxRetries=this.config.maxAttempts,c.addListeners(this.listeners),b&&c.send(b),c},setSuccess:function(a){a.error=null,a.data=a.data||{},a.request.removeAllListeners("extractData")},setError:function(a,b){a.data=null,a.error=e.util.error(a.error||new Error,{code:"ResourceNotReady",message:"Resource is not in the state "+this.state,retryable:b})},loadWaiterConfig:function(a){if(!this.service.api.waiters[a])throw new e.util.error(new Error,{code:"StateNotFoundError",message:"State "+a+" not found."});this.config=this.service.api.waiters[a]}})},{"./core":11,jmespath:79}],40:[function(a,b,c){var d=a("./core"),e=d.util.inherit,f=a("jmespath");d.Response=e({constructor:function(a){this.request=a,this.data=null,this.error=null,this.retryCount=0,this.redirectCount=0,this.httpResponse=new d.HttpResponse,a&&(this.maxRetries=a.service.numRetries(),this.maxRedirects=a.service.config.maxRedirects)},nextPage:function(a){var b,c=this.request.service,e=this.request.operation;try{b=c.paginationConfig(e,!0)}catch(a){this.error=a}if(!this.hasNextPage()){if(a)a(this.error,null);else if(this.error)throw this.error;return null}var f=d.util.copy(this.request.params);if(this.nextPageTokens){var g=b.inputToken;"string"==typeof g&&(g=[g]);for(var h=0;h<g.length;h++)f[g[h]]=this.nextPageTokens[h];return c.makeRequest(this.request.operation,f,a)}return a?a(null,null):null},hasNextPage:function(){return this.cacheNextPageTokens(),!!this.nextPageTokens||void 0===this.nextPageTokens&&void 0},cacheNextPageTokens:function(){if(Object.prototype.hasOwnProperty.call(this,"nextPageTokens"))return this.nextPageTokens;this.nextPageTokens=void 0;var a=this.request.service.paginationConfig(this.request.operation);if(!a)return this.nextPageTokens;if(this.nextPageTokens=null,a.moreResults&&!f.search(this.data,a.moreResults))return this.nextPageTokens;var b=a.outputToken;return"string"==typeof b&&(b=[b]),d.util.arrayEach.call(this,b,function(a){var b=f.search(this.data,a);b&&(this.nextPageTokens=this.nextPageTokens||[],this.nextPageTokens.push(b))}),this.nextPageTokens}})},{"./core":11,jmespath:79}],41:[function(a,b,c){var d=a("./core");d.SequentialExecutor=d.util.inherit({constructor:function(){this._events={}},listeners:function(a){return this._events[a]?this._events[a].slice(0):[]},on:function(a,b){return this._events[a]?this._events[a].push(b):this._events[a]=[b],this},onAsync:function(a,b){return b._isAsync=!0,this.on(a,b)},removeListener:function(a,b){var c=this._events[a];if(c){for(var d=c.length,e=-1,f=0;f<d;++f)c[f]===b&&(e=f);e>-1&&c.splice(e,1)}return this},removeAllListeners:function(a){return a?delete this._events[a]:this._events={},this},emit:function(a,b,c){c||(c=function(){});var d=this.listeners(a),e=d.length;return this.callListeners(d,b,c),e>0},callListeners:function(a,b,c,e){function f(e){return e&&(h=d.util.error(h||new Error,e),g._haltHandlersOnError)?c.call(g,h):void g.callListeners(a,b,c,h)}for(var g=this,h=e||null;a.length>0;){var i=a.shift();if(i._isAsync)return void i.apply(g,b.concat([f]));try{i.apply(g,b)}catch(a){h=d.util.error(h||new Error,a)}if(h&&g._haltHandlersOnError)return void c.call(g,h)}c.call(g,h)},addListeners:function(a){var b=this;return a._events&&(a=a._events),d.util.each(a,function(a,c){"function"==typeof c&&(c=[c]),d.util.arrayEach(c,function(c){b.on(a,c)})}),b},addNamedListener:function(a,b,c){return this[a]=c,this.addListener(b,c),this},addNamedAsyncListener:function(a,b,c){return c._isAsync=!0,this.addNamedListener(a,b,c)},addNamedListeners:function(a){var b=this;return a(function(){b.addNamedListener.apply(b,arguments)},function(){b.addNamedAsyncListener.apply(b,arguments)}),this}}),d.SequentialExecutor.prototype.addListener=d.SequentialExecutor.prototype.on,b.exports=d.SequentialExecutor},{"./core":11}],42:[function(a,b,c){var d=a("./core"),e=a("./model/api"),f=a("./region_config"),g=d.util.inherit,h=0;d.Service=g({constructor:function(a){if(!this.loadServiceClass)throw d.util.error(new Error,"Service must be constructed with `new' operator");var b=this.loadServiceClass(a||{});if(b){var c=d.util.copy(a),e=new b(a);return Object.defineProperty(e,"_originalConfig",{get:function(){return c},enumerable:!1,configurable:!0}),e._clientId=++h,e}this.initialize(a)},initialize:function(a){var b=d.config[this.serviceIdentifier];this.config=new d.Config(d.config),b&&this.config.update(b,!0),a&&this.config.update(a,!0),this.validateService(),this.config.endpoint||f(this),this.config.endpoint=this.endpointFromTemplate(this.config.endpoint),this.setEndpoint(this.config.endpoint)},validateService:function(){},loadServiceClass:function(a){var b=a;if(d.util.isEmpty(this.api)){if(b.apiConfig)return d.Service.defineServiceApi(this.constructor,b.apiConfig);if(this.constructor.services){b=new d.Config(d.config),b.update(a,!0);var c=b.apiVersions[this.constructor.serviceIdentifier];return c=c||b.apiVersion,this.getLatestServiceClass(c)}return null}return null},getLatestServiceClass:function(a){return a=this.getLatestServiceVersion(a),null===this.constructor.services[a]&&d.Service.defineServiceApi(this.constructor,a),this.constructor.services[a]},getLatestServiceVersion:function(a){if(!this.constructor.services||0===this.constructor.services.length)throw new Error("No services defined on "+this.constructor.serviceIdentifier);if(a?d.util.isType(a,Date)&&(a=d.util.date.iso8601(a).split("T")[0]):a="latest",Object.hasOwnProperty(this.constructor.services,a))return a;for(var b=Object.keys(this.constructor.services).sort(),c=null,e=b.length-1;e>=0;e--)if("*"!==b[e][b[e].length-1]&&(c=b[e]),b[e].substr(0,10)<=a)return c;throw new Error("Could not find "+this.constructor.serviceIdentifier+" API to satisfy version constraint `"+a+"'")},api:{},defaultRetryCount:3,makeRequest:function(a,b,c){if("function"==typeof b&&(c=b,b=null),b=b||{},this.config.params){var e=this.api.operations[a];e&&(b=d.util.copy(b),d.util.each(this.config.params,function(a,c){e.input.members[a]&&(void 0!==b[a]&&null!==b[a]||(b[a]=c))}))}var f=new d.Request(this,a,b);return this.addAllRequestListeners(f),c&&f.send(c),f},makeUnauthenticatedRequest:function(a,b,c){"function"==typeof b&&(c=b,b={});var d=this.makeRequest(a,b).toUnauthenticated();return c?d.send(c):d},waitFor:function(a,b,c){var e=new d.ResourceWaiter(this,a);return e.wait(b,c)},addAllRequestListeners:function(a){for(var b=[d.events,d.EventListeners.Core,this.serviceInterface(),d.EventListeners.CorePost],c=0;c<b.length;c++)b[c]&&a.addListeners(b[c]);this.config.paramValidation||a.removeListener("validate",d.EventListeners.Core.VALIDATE_PARAMETERS),this.config.logger&&a.addListeners(d.EventListeners.Logger),this.setupRequestListeners(a)},setupRequestListeners:function(){},getSignerClass:function(){var a;return a=this.config.signatureVersion?this.config.signatureVersion:this.api.signatureVersion,d.Signers.RequestSigner.getVersion(a)},serviceInterface:function(){switch(this.api.protocol){case"ec2":return d.EventListeners.Query;case"query":return d.EventListeners.Query;case"json":return d.EventListeners.Json;case"rest-json":return d.EventListeners.RestJson;case"rest-xml":return d.EventListeners.RestXml}if(this.api.protocol)throw new Error("Invalid service `protocol' "+this.api.protocol+" in API config")},successfulResponse:function(a){return a.httpResponse.statusCode<300},numRetries:function(){return void 0!==this.config.maxRetries?this.config.maxRetries:this.defaultRetryCount},retryDelays:function(a){return d.util.calculateRetryDelay(a,this.config.retryDelayOptions)},retryableError:function(a){return!!this.networkingError(a)||(!!this.expiredCredentialsError(a)||(!!this.throttledError(a)||a.statusCode>=500))},networkingError:function(a){return"NetworkingError"===a.code},expiredCredentialsError:function(a){return"ExpiredTokenException"===a.code},clockSkewError:function(a){switch(a.code){case"RequestTimeTooSkewed":case"RequestExpired":case"InvalidSignatureException":case"SignatureDoesNotMatch":case"AuthFailure":case"RequestInTheFuture":return!0;default:return!1}},throttledError:function(a){switch(a.code){case"ProvisionedThroughputExceededException":case"Throttling":case"ThrottlingException":case"RequestLimitExceeded":case"RequestThrottled":return!0;default:return!1}},endpointFromTemplate:function(a){if("string"!=typeof a)return a;var b=a;return b=b.replace(/\{service\}/g,this.api.endpointPrefix),b=b.replace(/\{region\}/g,this.config.region),b=b.replace(/\{scheme\}/g,this.config.sslEnabled?"https":"http")},setEndpoint:function(a){this.endpoint=new d.Endpoint(a,this.config)},paginationConfig:function(a,b){var c=this.api.operations[a].paginator;if(!c){if(b){var e=new Error;throw d.util.error(e,"No pagination configuration for "+a)}return null}return c}}),d.util.update(d.Service,{defineMethods:function(a){d.util.each(a.prototype.api.operations,function(b){if(!a.prototype[b]){var c=a.prototype.api.operations[b];"none"===c.authtype?a.prototype[b]=function(a,c){return this.makeUnauthenticatedRequest(b,a,c)}:a.prototype[b]=function(a,c){return this.makeRequest(b,a,c)}}})},defineService:function(a,b,c){d.Service._serviceMap[a]=!0,Array.isArray(b)||(c=b,b=[]);var e=g(d.Service,c||{});if("string"==typeof a){d.Service.addVersions(e,b);var f=e.serviceIdentifier||a;e.serviceIdentifier=f}else e.prototype.api=a,d.Service.defineMethods(e);return e},addVersions:function(a,b){Array.isArray(b)||(b=[b]),a.services=a.services||{};for(var c=0;c<b.length;c++)void 0===a.services[b[c]]&&(a.services[b[c]]=null);a.apiVersions=Object.keys(a.services).sort()},defineServiceApi:function(a,b,c){function f(a){a.isApi?h.prototype.api=a:h.prototype.api=new e(a)}var h=g(a,{serviceIdentifier:a.serviceIdentifier});if("string"==typeof b){if(c)f(c);else try{f(d.apiLoader(a.serviceIdentifier,b))}catch(c){throw d.util.error(c,{message:"Could not find API configuration "+a.serviceIdentifier+"-"+b})}Object.prototype.hasOwnProperty.call(a.services,b)||(a.apiVersions=a.apiVersions.concat(b).sort()),a.services[b]=h}else f(b);return d.Service.defineMethods(h),h},hasService:function(a){return Object.prototype.hasOwnProperty.call(d.Service._serviceMap,a)},_serviceMap:{}}),b.exports=d.Service},{"./core":11,"./model/api":23,"./region_config":36}],43:[function(a,b,c){var d=a("../core");d.util.update(d.CognitoIdentity.prototype,{getOpenIdToken:function(a,b){return this.makeUnauthenticatedRequest("getOpenIdToken",a,b)},getId:function(a,b){return this.makeUnauthenticatedRequest("getId",a,b)},getCredentialsForIdentity:function(a,b){return this.makeUnauthenticatedRequest("getCredentialsForIdentity",a,b)}})},{"../core":11}],44:[function(a,b,c){var d=a("../core");d.util.update(d.STS.prototype,{credentialsFrom:function(a,b){return a?(b||(b=new d.TemporaryCredentials),b.expired=!1,b.accessKeyId=a.Credentials.AccessKeyId,b.secretAccessKey=a.Credentials.SecretAccessKey,b.sessionToken=a.Credentials.SessionToken,b.expireTime=a.Credentials.Expiration,b):null},assumeRoleWithWebIdentity:function(a,b){return this.makeUnauthenticatedRequest("assumeRoleWithWebIdentity",a,b)},assumeRoleWithSAML:function(a,b){return this.makeUnauthenticatedRequest("assumeRoleWithSAML",a,b)}})},{"../core":11}],45:[function(a,b,c){function d(a){var b=a.httpRequest.headers[h],c=a.service.getSignerClass(a);if(delete a.httpRequest.headers["User-Agent"],delete a.httpRequest.headers["X-Amz-User-Agent"],c===f.Signers.V4){if(b>604800){var d="Presigning does not support expiry time greater than a week with SigV4 signing.";throw f.util.error(new Error,{code:"InvalidExpiryTime",message:d,retryable:!1})}a.httpRequest.headers[h]=b}else{if(c!==f.Signers.S3)throw f.util.error(new Error,{message:"Presigning only supports S3 or SigV4 signing.",code:"UnsupportedSigner",retryable:!1});a.httpRequest.headers[h]=parseInt(f.util.date.unixTimestamp()+b,10).toString()}}function e(a){var b=a.httpRequest.endpoint,c=f.util.urlParse(a.httpRequest.path),d={};c.search&&(d=f.util.queryStringParse(c.search.substr(1))),f.util.each(a.httpRequest.headers,function(a,b){a===h&&(a="Expires"),0===a.indexOf("x-amz-meta-")&&(delete d[a],a=a.toLowerCase()),d[a]=b}),delete a.httpRequest.headers[h];var e=d.Authorization.split(" ");if("AWS"===e[0])e=e[1].split(":"),d.AWSAccessKeyId=e[0],d.Signature=e[1];else if("AWS4-HMAC-SHA256"===e[0]){e.shift();var g=e.join(" "),i=g.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];d["X-Amz-Signature"]=i,delete d.Expires}delete d.Authorization,delete d.Host,b.pathname=c.pathname,b.search=f.util.queryParamsToString(d)}var f=a("../core"),g=f.util.inherit,h="presigned-expires";f.Signers.Presign=g({sign:function(a,b,c){if(a.httpRequest.headers[h]=b||3600,a.on("build",d),a.on("sign",e),a.removeListener("afterBuild",f.EventListeners.Core.SET_CONTENT_LENGTH),a.removeListener("afterBuild",f.EventListeners.Core.COMPUTE_SHA256),a.emit("beforePresign",[a]),!c){if(a.build(),a.response.error)throw a.response.error;return f.util.urlFormat(a.httpRequest.endpoint)}a.build(function(){this.response.error?c(this.response.error):c(null,f.util.urlFormat(a.httpRequest.endpoint))})}}),b.exports=f.Signers.Presign},{"../core":11}],46:[function(a,b,c){var d=a("../core"),e=d.util.inherit;d.Signers.RequestSigner=e({constructor:function(a){this.request=a},setServiceClientId:function(a){this.serviceClientId=a},getServiceClientId:function(){return this.serviceClientId}}),d.Signers.RequestSigner.getVersion=function(a){switch(a){case"v2":return d.Signers.V2;case"v3":return d.Signers.V3;case"v4":return d.Signers.V4;case"s3":return d.Signers.S3;case"v3https":return d.Signers.V3Https}throw new Error("Unknown signing version "+a)},a("./v2"),a("./v3"),a("./v3https"),a("./v4"),a("./s3"),a("./presign")},{"../core":11,"./presign":45,"./s3":47,"./v2":48,"./v3":49,"./v3https":50,"./v4":51}],47:[function(a,b,c){var d=a("../core"),e=d.util.inherit;d.Signers.S3=e(d.Signers.RequestSigner,{subResources:{acl:1,accelerate:1,cors:1,lifecycle:1,delete:1,location:1,logging:1,notification:1,partNumber:1,policy:1,requestPayment:1,replication:1,restore:1,tagging:1,torrent:1,uploadId:1,uploads:1,versionId:1,versioning:1,versions:1,website:1},responseHeaders:{"response-content-type":1,"response-content-language":1,"response-expires":1,"response-cache-control":1,"response-content-disposition":1,"response-content-encoding":1},addAuthorization:function(a,b){this.request.headers["presigned-expires"]||(this.request.headers["X-Amz-Date"]=d.util.date.rfc822(b)),a.sessionToken&&(this.request.headers["x-amz-security-token"]=a.sessionToken);var c=this.sign(a.secretAccessKey,this.stringToSign()),e="AWS "+a.accessKeyId+":"+c;this.request.headers.Authorization=e},stringToSign:function(){var a=this.request,b=[];b.push(a.method),b.push(a.headers["Content-MD5"]||""),b.push(a.headers["Content-Type"]||""),b.push(a.headers["presigned-expires"]||"");var c=this.canonicalizedAmzHeaders();return c&&b.push(c),b.push(this.canonicalizedResource()),b.join("\n")},canonicalizedAmzHeaders:function(){var a=[];d.util.each(this.request.headers,function(b){b.match(/^x-amz-/i)&&a.push(b)}),a.sort(function(a,b){return a.toLowerCase()<b.toLowerCase()?-1:1});var b=[];return d.util.arrayEach.call(this,a,function(a){b.push(a.toLowerCase()+":"+String(this.request.headers[a]))}),b.join("\n")},canonicalizedResource:function(){var a=this.request,b=a.path.split("?"),c=b[0],e=b[1],f="";if(a.virtualHostedBucket&&(f+="/"+a.virtualHostedBucket),f+=c,e){var g=[];d.util.arrayEach.call(this,e.split("&"),function(a){var b=a.split("=")[0],c=a.split("=")[1];if(this.subResources[b]||this.responseHeaders[b]){var d={name:b};void 0!==c&&(this.subResources[b]?d.value=c:d.value=decodeURIComponent(c)),g.push(d)}}),g.sort(function(a,b){return a.name<b.name?-1:1}),g.length&&(e=[],d.util.arrayEach(g,function(a){void 0===a.value?e.push(a.name):e.push(a.name+"="+a.value)}),f+="?"+e.join("&"))}return f},sign:function(a,b){return d.util.crypto.hmac(a,b,"base64","sha1")}}),b.exports=d.Signers.S3},{"../core":11}],48:[function(a,b,c){var d=a("../core"),e=d.util.inherit;d.Signers.V2=e(d.Signers.RequestSigner,{addAuthorization:function(a,b){b||(b=d.util.date.getDate());var c=this.request;c.params.Timestamp=d.util.date.iso8601(b),c.params.SignatureVersion="2",c.params.SignatureMethod="HmacSHA256",c.params.AWSAccessKeyId=a.accessKeyId,a.sessionToken&&(c.params.SecurityToken=a.sessionToken),delete c.params.Signature,c.params.Signature=this.signature(a),c.body=d.util.queryParamsToString(c.params),c.headers["Content-Length"]=c.body.length},signature:function(a){return d.util.crypto.hmac(a.secretAccessKey,this.stringToSign(),"base64")},stringToSign:function(){var a=[];return a.push(this.request.method),a.push(this.request.endpoint.host.toLowerCase()),a.push(this.request.pathname()),a.push(d.util.queryParamsToString(this.request.params)),
a.join("\n")}}),b.exports=d.Signers.V2},{"../core":11}],49:[function(a,b,c){var d=a("../core"),e=d.util.inherit;d.Signers.V3=e(d.Signers.RequestSigner,{addAuthorization:function(a,b){var c=d.util.date.rfc822(b);this.request.headers["X-Amz-Date"]=c,a.sessionToken&&(this.request.headers["x-amz-security-token"]=a.sessionToken),this.request.headers["X-Amzn-Authorization"]=this.authorization(a,c)},authorization:function(a){return"AWS3 AWSAccessKeyId="+a.accessKeyId+",Algorithm=HmacSHA256,SignedHeaders="+this.signedHeaders()+",Signature="+this.signature(a)},signedHeaders:function(){var a=[];return d.util.arrayEach(this.headersToSign(),function(b){a.push(b.toLowerCase())}),a.sort().join(";")},canonicalHeaders:function(){var a=this.request.headers,b=[];return d.util.arrayEach(this.headersToSign(),function(c){b.push(c.toLowerCase().trim()+":"+String(a[c]).trim())}),b.sort().join("\n")+"\n"},headersToSign:function(){var a=[];return d.util.each(this.request.headers,function(b){("Host"===b||"Content-Encoding"===b||b.match(/^X-Amz/i))&&a.push(b)}),a},signature:function(a){return d.util.crypto.hmac(a.secretAccessKey,this.stringToSign(),"base64")},stringToSign:function(){var a=[];return a.push(this.request.method),a.push("/"),a.push(""),a.push(this.canonicalHeaders()),a.push(this.request.body),d.util.crypto.sha256(a.join("\n"))}}),b.exports=d.Signers.V3},{"../core":11}],50:[function(a,b,c){var d=a("../core"),e=d.util.inherit;a("./v3"),d.Signers.V3Https=e(d.Signers.V3,{authorization:function(a){return"AWS3-HTTPS AWSAccessKeyId="+a.accessKeyId+",Algorithm=HmacSHA256,Signature="+this.signature(a)},stringToSign:function(){return this.request.headers["X-Amz-Date"]}}),b.exports=d.Signers.V3Https},{"../core":11,"./v3":49}],51:[function(a,b,c){var d=a("../core"),e=d.util.inherit,f={},g=[],h=50,i="presigned-expires";d.Signers.V4=e(d.Signers.RequestSigner,{constructor:function(a,b,c){d.Signers.RequestSigner.call(this,a),this.serviceName=b,this.signatureCache=c},algorithm:"AWS4-HMAC-SHA256",addAuthorization:function(a,b){var c=d.util.date.iso8601(b).replace(/[:\-]|\.\d{3}/g,"");this.isPresigned()?this.updateForPresigned(a,c):this.addHeaders(a,c),this.request.headers.Authorization=this.authorization(a,c)},addHeaders:function(a,b){this.request.headers["X-Amz-Date"]=b,a.sessionToken&&(this.request.headers["x-amz-security-token"]=a.sessionToken)},updateForPresigned:function(a,b){var c=this.credentialString(b),e={"X-Amz-Date":b,"X-Amz-Algorithm":this.algorithm,"X-Amz-Credential":a.accessKeyId+"/"+c,"X-Amz-Expires":this.request.headers[i],"X-Amz-SignedHeaders":this.signedHeaders()};a.sessionToken&&(e["X-Amz-Security-Token"]=a.sessionToken),this.request.headers["Content-Type"]&&(e["Content-Type"]=this.request.headers["Content-Type"]),this.request.headers["Content-MD5"]&&(e["Content-MD5"]=this.request.headers["Content-MD5"]),this.request.headers["Cache-Control"]&&(e["Cache-Control"]=this.request.headers["Cache-Control"]),d.util.each.call(this,this.request.headers,function(a,b){if(a!==i&&this.isSignableHeader(a)){var c=a.toLowerCase();0===c.indexOf("x-amz-meta-")?e[c]=b:0===c.indexOf("x-amz-")&&(e[a]=b)}});var f=this.request.path.indexOf("?")>=0?"&":"?";this.request.path+=f+d.util.queryParamsToString(e)},authorization:function(a,b){var c=[],d=this.credentialString(b);return c.push(this.algorithm+" Credential="+a.accessKeyId+"/"+d),c.push("SignedHeaders="+this.signedHeaders()),c.push("Signature="+this.signature(a,b)),c.join(", ")},signature:function(a,b){var c=null,e=this.serviceName+(this.getServiceClientId()?"_"+this.getServiceClientId():"");if(this.signatureCache){var c=f[e];c||(g.push(e),g.length>h&&delete f[g.shift()])}var i=b.substr(0,8);if(!c||c.akid!==a.accessKeyId||c.region!==this.request.region||c.date!==i){var j=a.secretAccessKey,k=d.util.crypto.hmac("AWS4"+j,i,"buffer"),l=d.util.crypto.hmac(k,this.request.region,"buffer"),m=d.util.crypto.hmac(l,this.serviceName,"buffer"),n=d.util.crypto.hmac(m,"aws4_request","buffer");if(!this.signatureCache)return d.util.crypto.hmac(n,this.stringToSign(b),"hex");f[e]={region:this.request.region,date:i,key:n,akid:a.accessKeyId}}var o=f[e].key;return d.util.crypto.hmac(o,this.stringToSign(b),"hex")},stringToSign:function(a){var b=[];return b.push("AWS4-HMAC-SHA256"),b.push(a),b.push(this.credentialString(a)),b.push(this.hexEncodedHash(this.canonicalString())),b.join("\n")},canonicalString:function(){var a=[],b=this.request.pathname();return"s3"!==this.serviceName&&(b=d.util.uriEscapePath(b)),a.push(this.request.method),a.push(b),a.push(this.request.search()),a.push(this.canonicalHeaders()+"\n"),a.push(this.signedHeaders()),a.push(this.hexEncodedBodyHash()),a.join("\n")},canonicalHeaders:function(){var a=[];d.util.each.call(this,this.request.headers,function(b,c){a.push([b,c])}),a.sort(function(a,b){return a[0].toLowerCase()<b[0].toLowerCase()?-1:1});var b=[];return d.util.arrayEach.call(this,a,function(a){var c=a[0].toLowerCase();this.isSignableHeader(c)&&b.push(c+":"+this.canonicalHeaderValues(a[1].toString()))}),b.join("\n")},canonicalHeaderValues:function(a){return a.replace(/\s+/g," ").replace(/^\s+|\s+$/g,"")},signedHeaders:function(){var a=[];return d.util.each.call(this,this.request.headers,function(b){b=b.toLowerCase(),this.isSignableHeader(b)&&a.push(b)}),a.sort().join(";")},credentialString:function(a){var b=[];return b.push(a.substr(0,8)),b.push(this.request.region),b.push(this.serviceName),b.push("aws4_request"),b.join("/")},hexEncodedHash:function(a){return d.util.crypto.sha256(a,"hex")},hexEncodedBodyHash:function(){return this.isPresigned()&&"s3"===this.serviceName&&!this.request.body?"UNSIGNED-PAYLOAD":this.request.headers["X-Amz-Content-Sha256"]?this.request.headers["X-Amz-Content-Sha256"]:this.hexEncodedHash(this.request.body||"")},unsignableHeaders:["authorization","content-type","content-length","user-agent",i,"expect"],isSignableHeader:function(a){return 0===a.toLowerCase().indexOf("x-amz-")||this.unsignableHeaders.indexOf(a)<0},isPresigned:function(){return!!this.request.headers[i]}}),b.exports=d.Signers.V4},{"../core":11}],52:[function(a,b,c){function d(a,b){this.currentState=b||null,this.states=a||{}}d.prototype.runTo=function(a,b,c,d){"function"==typeof a&&(d=c,c=b,b=a,a=null);var e=this,f=e.states[e.currentState];f.fn.call(c||e,d,function(d){if(d){if(!f.fail)return b?b.call(c,d):null;e.currentState=f.fail}else{if(!f.accept)return b?b.call(c):null;e.currentState=f.accept}return e.currentState===a?b?b.call(c,d):null:void e.runTo(a,b,c,d)})},d.prototype.addState=function(a,b,c,d){return"function"==typeof b?(d=b,b=null,c=null):"function"==typeof c&&(d=c,c=null),this.currentState||(this.currentState=a),this.states[a]={accept:b,fail:c,fn:d},this},b.exports=d},{}],53:[function(a,b,c){(function(c){var d,e={engine:function(){return e.isBrowser()&&"undefined"!=typeof navigator?navigator.userAgent:c.platform+"/"+c.version},userAgent:function(){var b=e.isBrowser()?"js":"nodejs",c="aws-sdk-"+b+"/"+a("./core").VERSION;return"nodejs"===b&&(c+=" "+e.engine()),c},isBrowser:function(){return c&&c.browser},isNode:function(){return!e.isBrowser()},uriEscape:function(a){var b=encodeURIComponent(a);return b=b.replace(/[^A-Za-z0-9_.~\-%]+/g,escape),b=b.replace(/[*]/g,function(a){return"%"+a.charCodeAt(0).toString(16).toUpperCase()})},uriEscapePath:function(a){var b=[];return e.arrayEach(a.split("/"),function(a){b.push(e.uriEscape(a))}),b.join("/")},urlParse:function(a){return e.url.parse(a)},urlFormat:function(a){return e.url.format(a)},queryStringParse:function(a){return e.querystring.parse(a)},queryParamsToString:function(a){var b=[],c=e.uriEscape,d=Object.keys(a).sort();return e.arrayEach(d,function(d){var f=a[d],g=c(d),h=g+"=";if(Array.isArray(f)){var i=[];e.arrayEach(f,function(a){i.push(c(a))}),h=g+"="+i.sort().join("&"+g+"=")}else void 0!==f&&null!==f&&(h=g+"="+c(f));b.push(h)}),b.join("&")},readFileSync:function(b){return e.isBrowser()?null:a("fs").readFileSync(b,"utf-8")},base64:{encode:function(a){return new e.Buffer(a).toString("base64")},decode:function(a){return new e.Buffer(a,"base64")}},buffer:{toStream:function(a){e.Buffer.isBuffer(a)||(a=new e.Buffer(a));var b=new e.stream.Readable,c=0;return b._read=function(d){if(c>=a.length)return b.push(null);var e=c+d;e>a.length&&(e=a.length),b.push(a.slice(c,e)),c=e},b},concat:function(a){var b,c=0,d=0,f=null;for(b=0;b<a.length;b++)c+=a[b].length;for(f=new e.Buffer(c),b=0;b<a.length;b++)a[b].copy(f,d),d+=a[b].length;return f}},string:{byteLength:function(b){if(null===b||void 0===b)return 0;if("string"==typeof b&&(b=new e.Buffer(b)),"number"==typeof b.byteLength)return b.byteLength;if("number"==typeof b.length)return b.length;if("number"==typeof b.size)return b.size;if("string"==typeof b.path)return a("fs").lstatSync(b.path).size;throw e.error(new Error("Cannot determine length of "+b),{object:b})},upperFirst:function(a){return a[0].toUpperCase()+a.substr(1)},lowerFirst:function(a){return a[0].toLowerCase()+a.substr(1)}},ini:{parse:function(a){var b,c={};return e.arrayEach(a.split(/\r?\n/),function(a){a=a.split(/(^|\s)[;#]/)[0];var d=a.match(/^\s*\[([^\[\]]+)\]\s*$/);if(d)b=d[1];else if(b){var e=a.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);e&&(c[b]=c[b]||{},c[b][e[1]]=e[2])}}),c}},fn:{noop:function(){},makeAsync:function(a,b){return b&&b<=a.length?a:function(){var b=Array.prototype.slice.call(arguments,0),c=b.pop(),d=a.apply(null,b);c(d)}}},date:{getDate:function(){return d||(d=a("./core")),d.config.systemClockOffset?new Date((new Date).getTime()+d.config.systemClockOffset):new Date},iso8601:function(a){return void 0===a&&(a=e.date.getDate()),a.toISOString().replace(/\.\d{3}Z$/,"Z")},rfc822:function(a){return void 0===a&&(a=e.date.getDate()),a.toUTCString()},unixTimestamp:function(a){return void 0===a&&(a=e.date.getDate()),a.getTime()/1e3},from:function(a){return"number"==typeof a?new Date(1e3*a):new Date(a)},format:function(a,b){return b||(b="iso8601"),e.date[b](e.date.from(a))},parseTimestamp:function(a){if("number"==typeof a)return new Date(1e3*a);if(a.match(/^\d+$/))return new Date(1e3*a);if(a.match(/^\d{4}/))return new Date(a);if(a.match(/^\w{3},/))return new Date(a);throw e.error(new Error("unhandled timestamp format: "+a),{code:"TimestampParserError"})}},crypto:{crc32Table:[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],crc32:function(a){var b=e.crypto.crc32Table,c=-1;"string"==typeof a&&(a=new e.Buffer(a));for(var d=0;d<a.length;d++){var f=a.readUInt8(d);c=c>>>8^b[255&(c^f)]}return(c^-1)>>>0},hmac:function(a,b,c,d){return c||(c="binary"),"buffer"===c&&(c=void 0),d||(d="sha256"),"string"==typeof b&&(b=new e.Buffer(b)),e.crypto.lib.createHmac(d,a).update(b).digest(c)},md5:function(a,b,c){return e.crypto.hash("md5",a,b,c)},sha256:function(a,b,c){return e.crypto.hash("sha256",a,b,c)},hash:function(a,b,c,d){var f=e.crypto.createHash(a);c||(c="binary"),"buffer"===c&&(c=void 0),"string"==typeof b&&(b=new e.Buffer(b));var g=e.arraySliceFn(b),h=e.Buffer.isBuffer(b);if(e.isBrowser()&&"undefined"!=typeof ArrayBuffer&&b&&b.buffer instanceof ArrayBuffer&&(h=!0),d&&"object"==typeof b&&"function"==typeof b.on&&!h)b.on("data",function(a){f.update(a)}),b.on("error",function(a){d(a)}),b.on("end",function(){d(null,f.digest(c))});else{if(!d||!g||h||"undefined"==typeof FileReader){e.isBrowser()&&"object"==typeof b&&!h&&(b=new e.Buffer(new Uint8Array(b)));var i=f.update(b).digest(c);return d&&d(null,i),i}var j=0,k=524288,l=new FileReader;l.onerror=function(){d(new Error("Failed to read data."))},l.onload=function(){var a=new e.Buffer(new Uint8Array(l.result));f.update(a),j+=a.length,l._continueReading()},l._continueReading=function(){if(j>=b.size)return void d(null,f.digest(c));var a=j+k;a>b.size&&(a=b.size),l.readAsArrayBuffer(g.call(b,j,a))},l._continueReading()}},toHex:function(a){for(var b=[],c=0;c<a.length;c++)b.push(("0"+a.charCodeAt(c).toString(16)).substr(-2,2));return b.join("")},createHash:function(a){return e.crypto.lib.createHash(a)}},abort:{},each:function(a,b){for(var c in a)if(Object.prototype.hasOwnProperty.call(a,c)){var d=b.call(this,c,a[c]);if(d===e.abort)break}},arrayEach:function(a,b){for(var c in a)if(Object.prototype.hasOwnProperty.call(a,c)){var d=b.call(this,a[c],parseInt(c,10));if(d===e.abort)break}},update:function(a,b){return e.each(b,function(b,c){a[b]=c}),a},merge:function(a,b){return e.update(e.copy(a),b)},copy:function(a){if(null===a||void 0===a)return a;var b={};for(var c in a)b[c]=a[c];return b},isEmpty:function(a){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b))return!1;return!0},arraySliceFn:function(a){var b=a.slice||a.webkitSlice||a.mozSlice;return"function"==typeof b?b:null},isType:function(a,b){return"function"==typeof b&&(b=e.typeName(b)),Object.prototype.toString.call(a)==="[object "+b+"]"},typeName:function(a){if(Object.prototype.hasOwnProperty.call(a,"name"))return a.name;var b=a.toString(),c=b.match(/^\s*function (.+)\(/);return c?c[1]:b},error:function(a,b){var c=null;return"string"==typeof a.message&&""!==a.message&&("string"==typeof b||b&&b.message)&&(c=e.copy(a),c.message=a.message),a.message=a.message||null,"string"==typeof b?a.message=b:"object"==typeof b&&null!==b&&(e.update(a,b),b.message&&(a.message=b.message),(b.code||b.name)&&(a.code=b.code||b.name),b.stack&&(a.stack=b.stack)),"function"==typeof Object.defineProperty&&(Object.defineProperty(a,"name",{writable:!0,enumerable:!1}),Object.defineProperty(a,"message",{enumerable:!0})),a.name=b&&b.name||a.name||a.code||"Error",a.time=new Date,c&&(a.originalError=c),a},inherit:function(a,b){var c=null;if(void 0===b)b=a,a=Object,c={};else{var d=function(){};d.prototype=a.prototype,c=new d}return b.constructor===Object&&(b.constructor=function(){if(a!==Object)return a.apply(this,arguments)}),b.constructor.prototype=c,e.update(b.constructor.prototype,b),b.constructor.__super__=a,b.constructor},mixin:function(){for(var a=arguments[0],b=1;b<arguments.length;b++)for(var c in arguments[b].prototype){var d=arguments[b].prototype[c];"constructor"!==c&&(a.prototype[c]=d)}return a},hideProperties:function(a,b){"function"==typeof Object.defineProperty&&e.arrayEach(b,function(b){Object.defineProperty(a,b,{enumerable:!1,writable:!0,configurable:!0})})},property:function(a,b,c,d,e){var f={configurable:!0,enumerable:void 0===d||d};"function"!=typeof c||e?(f.value=c,f.writable=!0):f.get=c,Object.defineProperty(a,b,f)},memoizedProperty:function(a,b,c,d){var f=null;e.property(a,b,function(){return null===f&&(f=c()),f},d)},hoistPayloadMember:function(a){var b=a.request,c=b.operation,d=b.service.api.operations[c].output;if(d.payload){var f=d.members[d.payload],g=a.data[d.payload];"structure"===f.type&&e.each(g,function(b,c){e.property(a.data,b,c,!1)})}},computeSha256:function(b,c){if(e.isNode()){var d=e.stream.Stream,f=a("fs");if(b instanceof d){if("string"!=typeof b.path)return c(new Error("Non-file stream objects are not supported with SigV4"));var g={};"number"==typeof b.start&&(g.start=b.start),"number"==typeof b.end&&(g.end=b.end),b=f.createReadStream(b.path,g)}}e.crypto.sha256(b,"hex",function(a,b){a?c(a):c(null,b)})},isClockSkewed:function(a){if(a)return e.property(d.config,"isClockSkewed",Math.abs((new Date).getTime()-a)>=3e5,!1),d.config.isClockSkewed},applyClockOffset:function(a){a&&(d.config.systemClockOffset=a-(new Date).getTime())},extractRequestId:function(a){var b=a.httpResponse.headers["x-amz-request-id"]||a.httpResponse.headers["x-amzn-requestid"];!b&&a.data&&a.data.ResponseMetadata&&(b=a.data.ResponseMetadata.RequestId),b&&(a.requestId=b),a.error&&(a.error.requestId=b)},addPromisesToRequests:function(a,b){return b=b||null,b||"undefined"==typeof Promise||(b=Promise),"function"!=typeof b?void delete a.prototype.promise:void(a.prototype.promise=function(){var a=this;return new b(function(b,c){a.on("complete",function(a){a.error?c(a.error):b(a.data)}),a.runTo()})})},isDualstackAvailable:function(b){if(!b)return!1;var c=a("../apis/metadata.json");return"string"!=typeof b&&(b=b.serviceIdentifier),!("string"!=typeof b||!c.hasOwnProperty(b))&&!!c[b].dualstackAvailable},calculateRetryDelay:function(a,b){b||(b={});var c=b.customBackoff||null;if("function"==typeof c)return c(a);var d=b.base||100,e=Math.random()*(Math.pow(2,a)*d);return e},handleRequestWithRetries:function(a,b,f){b||(b={});var g=d.HttpClient.getInstance(),h=b.httpOptions||{},i=0,j=function(a){var c=b.maxRetries||0;if(a&&"TimeoutError"===a.code&&(a.retryable=!0),a&&a.retryable&&i<c){i++;var d=e.calculateRetryDelay(i,b.retryDelayOptions);setTimeout(k,d+(a.retryAfter||0))}else f(a)},k=function(){var b="";g.handleRequest(a,h,function(a){a.on("data",function(a){b+=a.toString()}),a.on("end",function(){var c=a.statusCode;if(c<300)f(null,b);else{var d=1e3*parseInt(a.headers["retry-after"],10)||0,g=e.error(new Error,{retryable:c>=500||429===c});d&&g.retryable&&(g.retryAfter=d),j(g)}})},j)};c.nextTick(k)}};b.exports=e}).call(this,a("FWaASH"))},{"../apis/metadata.json":3,"./core":11,FWaASH:62,fs:56}],54:[function(a,b,c){function d(){}function e(a,b){switch(b||(b={}),b.type){case"structure":return f(a,b);case"map":return g(a,b);case"list":return h(a,b);case void 0:case null:return j(a);default:return i(a,b)}}function f(a,b){var c={};return null===a?c:(k.each(b.members,function(b,d){if(d.isXmlAttribute){if(Object.prototype.hasOwnProperty.call(a.attributes,d.name)){var f=a.attributes[d.name].value;c[b]=e({textContent:f},d)}}else{var g=d.flattened?a:a.getElementsByTagName(d.name)[0];g?c[b]=e(g,d):d.flattened||"list"!==d.type||(c[b]=d.defaultValue)}}),c)}function g(a,b){for(var c={},d=b.key.name||"key",f=b.value.name||"value",g=b.flattened?b.name:"entry",h=a.firstElementChild;h;){if(h.nodeName===g){var i=h.getElementsByTagName(d)[0].textContent,j=h.getElementsByTagName(f)[0];c[i]=e(j,b.value)}h=h.nextElementSibling}return c}function h(a,b){for(var c=[],d=b.flattened?b.name:b.member.name||"member",f=a.firstElementChild;f;)f.nodeName===d&&c.push(e(f,b.member)),f=f.nextElementSibling;return c}function i(a,b){if(a.getAttribute){var c=a.getAttribute("encoding");"base64"===c&&(b=new l.create({type:c}))}var d=a.textContent;return""===d&&(d=null),"function"==typeof b.toType?b.toType(d):d}function j(a){if(void 0===a||null===a)return"";if(!a.firstElementChild)return null===a.parentNode.parentNode?{}:0===a.childNodes.length?"":a.textContent;for(var b={type:"structure",members:{}},c=a.firstElementChild;c;){var d=c.nodeName;Object.prototype.hasOwnProperty.call(b.members,d)?b.members[d].type="list":b.members[d]={name:d},c=c.nextElementSibling}return f(a,b)}var k=a("../util"),l=a("../model/shape");d.prototype.parse=function(a,b){if(""===a.replace(/^\s+/,""))return{};var c,d;try{if(window.DOMParser){try{var f=new DOMParser;c=f.parseFromString(a,"text/xml")}catch(a){throw k.error(new Error("Parse error in document"),{originalError:a,code:"XMLParserError",retryable:!0})}if(null===c.documentElement)throw k.error(new Error("Cannot parse empty document."),{code:"XMLParserError",retryable:!0});var g=c.getElementsByTagName("parsererror")[0];if(g&&(g.parentNode===c||"body"===g.parentNode.nodeName||g.parentNode.parentNode===c||"body"===g.parentNode.parentNode.nodeName)){var h=g.getElementsByTagName("div")[0]||g;throw k.error(new Error(h.textContent||"Parser error in document"),{code:"XMLParserError",retryable:!0})}}else{if(!window.ActiveXObject)throw new Error("Cannot load XML parser");if(c=new window.ActiveXObject("Microsoft.XMLDOM"),c.async=!1,!c.loadXML(a))throw k.error(new Error("Parse error in document"),{code:"XMLParserError",retryable:!0})}}catch(a){d=a}if(c&&c.documentElement&&!d){var i=e(c.documentElement,b),j=c.getElementsByTagName("ResponseMetadata")[0];return j&&(i.ResponseMetadata=e(j,{})),i}if(d)throw k.error(d||new Error,{code:"XMLParserError",retryable:!0});return{}},b.exports=d},{"../model/shape":28,"../util":53}],55:[function(a,b,c){function d(){}function e(a,b,c){switch(c.type){case"structure":return f(a,b,c);case"map":return g(a,b,c);case"list":return h(a,b,c);default:return i(a,b,c)}}function f(a,b,c){k.arrayEach(c.memberNames,function(d){var f=c.members[d];if("body"===f.location){var g=b[d],h=f.name;if(void 0!==g&&null!==g)if(f.isXmlAttribute)a.att(h,g);else if(f.flattened)e(a,g,f);else{var i=a.ele(h);j(i,f),e(i,g,f)}}})}function g(a,b,c){var d=c.key.name||"key",f=c.value.name||"value";k.each(b,function(b,g){var h=a.ele(c.flattened?c.name:"entry");e(h.ele(d),b,c.key),e(h.ele(f),g,c.value)})}function h(a,b,c){c.flattened?k.arrayEach(b,function(b){var d=c.member.name||c.name,f=a.ele(d);e(f,b,c.member)}):k.arrayEach(b,function(b){var d=c.member.name||"member",f=a.ele(d);e(f,b,c.member)})}function i(a,b,c){a.txt(c.toWireFormat(b))}function j(a,b){var c,d="xmlns";b.xmlNamespaceUri?(c=b.xmlNamespaceUri,b.xmlNamespacePrefix&&(d+=":"+b.xmlNamespacePrefix)):a.isRoot&&b.api.xmlNamespaceUri&&(c=b.api.xmlNamespaceUri),c&&a.att(d,c)}var k=a("../util"),l=a("xmlbuilder");d.prototype.toXML=function(a,b,c,d){var f=l.create(c);return j(f,b),e(f,a,b),f.children.length>0||d?f.root().toString():""},b.exports=d},{"../util":53,xmlbuilder:100}],56:[function(a,b,c){},{}],57:[function(a,b,c){function d(a,b,c){if(!(this instanceof d))return new d(a,b,c);var e=typeof a;if("base64"===b&&"string"===e)for(a=C(a);a.length%4!==0;)a+="=";var f;if("number"===e)f=E(a);else if("string"===e)f=d.byteLength(a,b);else{if("object"!==e)throw new Error("First argument needs to be a number, array or string.");f=E(a.length)}var g;d._useTypedArrays?g=d._augment(new Uint8Array(f)):(g=this,g.length=f,g._isBuffer=!0);var h;if(d._useTypedArrays&&"number"==typeof a.byteLength)g._set(a);else if(G(a))for(h=0;h<f;h++)d.isBuffer(a)?g[h]=a.readUInt8(h):g[h]=a[h];else if("string"===e)g.write(a,0,b);else if("number"===e&&!d._useTypedArrays&&!c)for(h=0;h<f;h++)g[h]=0;return g}function e(a,b,c,e){c=Number(c)||0;var f=a.length-c;e?(e=Number(e),e>f&&(e=f)):e=f;var g=b.length;R(g%2===0,"Invalid hex string"),e>g/2&&(e=g/2);for(var h=0;h<e;h++){var i=parseInt(b.substr(2*h,2),16);R(!isNaN(i),"Invalid hex string"),a[c+h]=i}return d._charsWritten=2*h,h}function f(a,b,c,e){var f=d._charsWritten=M(I(b),a,c,e);return f}function g(a,b,c,e){var f=d._charsWritten=M(J(b),a,c,e);return f}function h(a,b,c,d){return g(a,b,c,d)}function i(a,b,c,e){var f=d._charsWritten=M(L(b),a,c,e);return f}function j(a,b,c,e){var f=d._charsWritten=M(K(b),a,c,e);return f}function k(a,b,c){return 0===b&&c===a.length?S.fromByteArray(a):S.fromByteArray(a.slice(b,c))}function l(a,b,c){var d="",e="";c=Math.min(a.length,c);for(var f=b;f<c;f++)a[f]<=127?(d+=N(e)+String.fromCharCode(a[f]),e=""):e+="%"+a[f].toString(16);return d+N(e)}function m(a,b,c){var d="";c=Math.min(a.length,c);for(var e=b;e<c;e++)d+=String.fromCharCode(a[e]);return d}function n(a,b,c){return m(a,b,c)}function o(a,b,c){var d=a.length;(!b||b<0)&&(b=0),(!c||c<0||c>d)&&(c=d);for(var e="",f=b;f<c;f++)e+=H(a[f]);return e}function p(a,b,c){for(var d=a.slice(b,c),e="",f=0;f<d.length;f+=2)e+=String.fromCharCode(d[f]+256*d[f+1]);return e}function q(a,b,c,d){d||(R("boolean"==typeof c,"missing or invalid endian"),R(void 0!==b&&null!==b,"missing offset"),R(b+1<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f;return c?(f=a[b],b+1<e&&(f|=a[b+1]<<8)):(f=a[b]<<8,b+1<e&&(f|=a[b+1])),f}}function r(a,b,c,d){d||(R("boolean"==typeof c,"missing or invalid endian"),R(void 0!==b&&null!==b,"missing offset"),R(b+3<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f;return c?(b+2<e&&(f=a[b+2]<<16),b+1<e&&(f|=a[b+1]<<8),f|=a[b],b+3<e&&(f+=a[b+3]<<24>>>0)):(b+1<e&&(f=a[b+1]<<16),b+2<e&&(f|=a[b+2]<<8),b+3<e&&(f|=a[b+3]),f+=a[b]<<24>>>0),f}}function s(a,b,c,d){d||(R("boolean"==typeof c,"missing or invalid endian"),R(void 0!==b&&null!==b,"missing offset"),R(b+1<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f=q(a,b,c,!0),g=32768&f;return g?(65535-f+1)*-1:f}}function t(a,b,c,d){d||(R("boolean"==typeof c,"missing or invalid endian"),R(void 0!==b&&null!==b,"missing offset"),R(b+3<a.length,"Trying to read beyond buffer length"));var e=a.length;if(!(b>=e)){var f=r(a,b,c,!0),g=2147483648&f;return g?(4294967295-f+1)*-1:f}}function u(a,b,c,d){return d||(R("boolean"==typeof c,"missing or invalid endian"),R(b+3<a.length,"Trying to read beyond buffer length")),T.read(a,b,c,23,4)}function v(a,b,c,d){return d||(R("boolean"==typeof c,"missing or invalid endian"),R(b+7<a.length,"Trying to read beyond buffer length")),T.read(a,b,c,52,8)}function w(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+1<a.length,"trying to write beyond buffer length"),O(b,65535));var f=a.length;if(!(c>=f))for(var g=0,h=Math.min(f-c,2);g<h;g++)a[c+g]=(b&255<<8*(d?g:1-g))>>>8*(d?g:1-g)}function x(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+3<a.length,"trying to write beyond buffer length"),O(b,4294967295));var f=a.length;if(!(c>=f))for(var g=0,h=Math.min(f-c,4);g<h;g++)a[c+g]=b>>>8*(d?g:3-g)&255}function y(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+1<a.length,"Trying to write beyond buffer length"),P(b,32767,-32768));var f=a.length;c>=f||(b>=0?w(a,b,c,d,e):w(a,65535+b+1,c,d,e))}function z(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+3<a.length,"Trying to write beyond buffer length"),P(b,2147483647,-2147483648));var f=a.length;c>=f||(b>=0?x(a,b,c,d,e):x(a,4294967295+b+1,c,d,e))}function A(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+3<a.length,"Trying to write beyond buffer length"),Q(b,3.4028234663852886e38,-3.4028234663852886e38));var f=a.length;c>=f||T.write(a,b,c,d,23,4)}function B(a,b,c,d,e){e||(R(void 0!==b&&null!==b,"missing value"),R("boolean"==typeof d,"missing or invalid endian"),R(void 0!==c&&null!==c,"missing offset"),R(c+7<a.length,"Trying to write beyond buffer length"),Q(b,1.7976931348623157e308,-1.7976931348623157e308));var f=a.length;c>=f||T.write(a,b,c,d,52,8)}function C(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")}function D(a,b,c){return"number"!=typeof a?c:(a=~~a,a>=b?b:a>=0?a:(a+=b,a>=0?a:0))}function E(a){return a=~~Math.ceil(+a),a<0?0:a}function F(a){return(Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)})(a)}function G(a){return F(a)||d.isBuffer(a)||a&&"object"==typeof a&&"number"==typeof a.length}function H(a){return a<16?"0"+a.toString(16):a.toString(16)}function I(a){for(var b=[],c=0;c<a.length;c++){var d=a.charCodeAt(c);if(d<=127)b.push(a.charCodeAt(c));else{var e=c;d>=55296&&d<=57343&&c++;for(var f=encodeURIComponent(a.slice(e,c+1)).substr(1).split("%"),g=0;g<f.length;g++)b.push(parseInt(f[g],16))}}return b}function J(a){for(var b=[],c=0;c<a.length;c++)b.push(255&a.charCodeAt(c));return b}function K(a){for(var b,c,d,e=[],f=0;f<a.length;f++)b=a.charCodeAt(f),c=b>>8,d=b%256,e.push(d),e.push(c);return e}function L(a){return S.toByteArray(a)}function M(a,b,c,d){for(var e=0;e<d&&!(e+c>=b.length||e>=a.length);e++)b[e+c]=a[e];return e}function N(a){try{return decodeURIComponent(a)}catch(a){return String.fromCharCode(65533)}}function O(a,b){R("number"==typeof a,"cannot write a non-number as a number"),R(a>=0,"specified a negative value for writing an unsigned value"),R(a<=b,"value is larger than maximum value for type"),R(Math.floor(a)===a,"value has a fractional component")}function P(a,b,c){R("number"==typeof a,"cannot write a non-number as a number"),R(a<=b,"value larger than maximum allowed value"),R(a>=c,"value smaller than minimum allowed value"),R(Math.floor(a)===a,"value has a fractional component")}function Q(a,b,c){R("number"==typeof a,"cannot write a non-number as a number"),R(a<=b,"value larger than maximum allowed value"),R(a>=c,"value smaller than minimum allowed value")}function R(a,b){if(!a)throw new Error(b||"Failed assertion")}var S=a("base64-js"),T=a("ieee754");c.Buffer=d,c.SlowBuffer=d,c.INSPECT_MAX_BYTES=50,d.poolSize=8192,d._useTypedArrays=function(){try{var a=new ArrayBuffer(0),b=new Uint8Array(a);return b.foo=function(){return 42},42===b.foo()&&"function"==typeof b.subarray}catch(a){return!1}}(),d.isEncoding=function(a){switch(String(a).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},d.isBuffer=function(a){return!(null===a||void 0===a||!a._isBuffer)},d.byteLength=function(a,b){var c;switch(a+="",b||"utf8"){case"hex":c=a.length/2;break;case"utf8":case"utf-8":c=I(a).length;break;case"ascii":case"binary":case"raw":c=a.length;break;case"base64":c=L(a).length;break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":c=2*a.length;break;default:throw new Error("Unknown encoding")}return c},d.concat=function(a,b){if(R(F(a),"Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."),0===a.length)return new d(0);if(1===a.length)return a[0];var c;if("number"!=typeof b)for(b=0,c=0;c<a.length;c++)b+=a[c].length;var e=new d(b),f=0;
for(c=0;c<a.length;c++){var g=a[c];g.copy(e,f),f+=g.length}return e},d.prototype.write=function(a,b,c,d){if(isFinite(b))isFinite(c)||(d=c,c=void 0);else{var k=d;d=b,b=c,c=k}b=Number(b)||0;var l=this.length-b;c?(c=Number(c),c>l&&(c=l)):c=l,d=String(d||"utf8").toLowerCase();var m;switch(d){case"hex":m=e(this,a,b,c);break;case"utf8":case"utf-8":m=f(this,a,b,c);break;case"ascii":m=g(this,a,b,c);break;case"binary":m=h(this,a,b,c);break;case"base64":m=i(this,a,b,c);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":m=j(this,a,b,c);break;default:throw new Error("Unknown encoding")}return m},d.prototype.toString=function(a,b,c){var d=this;if(a=String(a||"utf8").toLowerCase(),b=Number(b)||0,c=void 0!==c?Number(c):c=d.length,c===b)return"";var e;switch(a){case"hex":e=o(d,b,c);break;case"utf8":case"utf-8":e=l(d,b,c);break;case"ascii":e=m(d,b,c);break;case"binary":e=n(d,b,c);break;case"base64":e=k(d,b,c);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":e=p(d,b,c);break;default:throw new Error("Unknown encoding")}return e},d.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},d.prototype.copy=function(a,b,c,e){var f=this;if(c||(c=0),e||0===e||(e=this.length),b||(b=0),e!==c&&0!==a.length&&0!==f.length){R(e>=c,"sourceEnd < sourceStart"),R(b>=0&&b<a.length,"targetStart out of bounds"),R(c>=0&&c<f.length,"sourceStart out of bounds"),R(e>=0&&e<=f.length,"sourceEnd out of bounds"),e>this.length&&(e=this.length),a.length-b<e-c&&(e=a.length-b+c);var g=e-c;if(g<100||!d._useTypedArrays)for(var h=0;h<g;h++)a[h+b]=this[h+c];else a._set(this.subarray(c,c+g),b)}},d.prototype.slice=function(a,b){var c=this.length;if(a=D(a,c,0),b=D(b,c,c),d._useTypedArrays)return d._augment(this.subarray(a,b));for(var e=b-a,f=new d(e,void 0,!0),g=0;g<e;g++)f[g]=this[g+a];return f},d.prototype.get=function(a){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(a)},d.prototype.set=function(a,b){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(a,b)},d.prototype.readUInt8=function(a,b){if(b||(R(void 0!==a&&null!==a,"missing offset"),R(a<this.length,"Trying to read beyond buffer length")),!(a>=this.length))return this[a]},d.prototype.readUInt16LE=function(a,b){return q(this,a,!0,b)},d.prototype.readUInt16BE=function(a,b){return q(this,a,!1,b)},d.prototype.readUInt32LE=function(a,b){return r(this,a,!0,b)},d.prototype.readUInt32BE=function(a,b){return r(this,a,!1,b)},d.prototype.readInt8=function(a,b){if(b||(R(void 0!==a&&null!==a,"missing offset"),R(a<this.length,"Trying to read beyond buffer length")),!(a>=this.length)){var c=128&this[a];return c?(255-this[a]+1)*-1:this[a]}},d.prototype.readInt16LE=function(a,b){return s(this,a,!0,b)},d.prototype.readInt16BE=function(a,b){return s(this,a,!1,b)},d.prototype.readInt32LE=function(a,b){return t(this,a,!0,b)},d.prototype.readInt32BE=function(a,b){return t(this,a,!1,b)},d.prototype.readFloatLE=function(a,b){return u(this,a,!0,b)},d.prototype.readFloatBE=function(a,b){return u(this,a,!1,b)},d.prototype.readDoubleLE=function(a,b){return v(this,a,!0,b)},d.prototype.readDoubleBE=function(a,b){return v(this,a,!1,b)},d.prototype.writeUInt8=function(a,b,c){c||(R(void 0!==a&&null!==a,"missing value"),R(void 0!==b&&null!==b,"missing offset"),R(b<this.length,"trying to write beyond buffer length"),O(a,255)),b>=this.length||(this[b]=a)},d.prototype.writeUInt16LE=function(a,b,c){w(this,a,b,!0,c)},d.prototype.writeUInt16BE=function(a,b,c){w(this,a,b,!1,c)},d.prototype.writeUInt32LE=function(a,b,c){x(this,a,b,!0,c)},d.prototype.writeUInt32BE=function(a,b,c){x(this,a,b,!1,c)},d.prototype.writeInt8=function(a,b,c){c||(R(void 0!==a&&null!==a,"missing value"),R(void 0!==b&&null!==b,"missing offset"),R(b<this.length,"Trying to write beyond buffer length"),P(a,127,-128)),b>=this.length||(a>=0?this.writeUInt8(a,b,c):this.writeUInt8(255+a+1,b,c))},d.prototype.writeInt16LE=function(a,b,c){y(this,a,b,!0,c)},d.prototype.writeInt16BE=function(a,b,c){y(this,a,b,!1,c)},d.prototype.writeInt32LE=function(a,b,c){z(this,a,b,!0,c)},d.prototype.writeInt32BE=function(a,b,c){z(this,a,b,!1,c)},d.prototype.writeFloatLE=function(a,b,c){A(this,a,b,!0,c)},d.prototype.writeFloatBE=function(a,b,c){A(this,a,b,!1,c)},d.prototype.writeDoubleLE=function(a,b,c){B(this,a,b,!0,c)},d.prototype.writeDoubleBE=function(a,b,c){B(this,a,b,!1,c)},d.prototype.fill=function(a,b,c){if(a||(a=0),b||(b=0),c||(c=this.length),"string"==typeof a&&(a=a.charCodeAt(0)),R("number"==typeof a&&!isNaN(a),"value is not a number"),R(c>=b,"end < start"),c!==b&&0!==this.length){R(b>=0&&b<this.length,"start out of bounds"),R(c>=0&&c<=this.length,"end out of bounds");for(var d=b;d<c;d++)this[d]=a}},d.prototype.inspect=function(){for(var a=[],b=this.length,d=0;d<b;d++)if(a[d]=H(this[d]),d===c.INSPECT_MAX_BYTES){a[d+1]="...";break}return"<Buffer "+a.join(" ")+">"},d.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(d._useTypedArrays)return new d(this).buffer;for(var a=new Uint8Array(this.length),b=0,c=a.length;b<c;b+=1)a[b]=this[b];return a.buffer}throw new Error("Buffer.toArrayBuffer not supported in this browser")};var U=d.prototype;d._augment=function(a){return a._isBuffer=!0,a._get=a.get,a._set=a.set,a.get=U.get,a.set=U.set,a.write=U.write,a.toString=U.toString,a.toLocaleString=U.toString,a.toJSON=U.toJSON,a.copy=U.copy,a.slice=U.slice,a.readUInt8=U.readUInt8,a.readUInt16LE=U.readUInt16LE,a.readUInt16BE=U.readUInt16BE,a.readUInt32LE=U.readUInt32LE,a.readUInt32BE=U.readUInt32BE,a.readInt8=U.readInt8,a.readInt16LE=U.readInt16LE,a.readInt16BE=U.readInt16BE,a.readInt32LE=U.readInt32LE,a.readInt32BE=U.readInt32BE,a.readFloatLE=U.readFloatLE,a.readFloatBE=U.readFloatBE,a.readDoubleLE=U.readDoubleLE,a.readDoubleBE=U.readDoubleBE,a.writeUInt8=U.writeUInt8,a.writeUInt16LE=U.writeUInt16LE,a.writeUInt16BE=U.writeUInt16BE,a.writeUInt32LE=U.writeUInt32LE,a.writeUInt32BE=U.writeUInt32BE,a.writeInt8=U.writeInt8,a.writeInt16LE=U.writeInt16LE,a.writeInt16BE=U.writeInt16BE,a.writeInt32LE=U.writeInt32LE,a.writeInt32BE=U.writeInt32BE,a.writeFloatLE=U.writeFloatLE,a.writeFloatBE=U.writeFloatBE,a.writeDoubleLE=U.writeDoubleLE,a.writeDoubleBE=U.writeDoubleBE,a.fill=U.fill,a.inspect=U.inspect,a.toArrayBuffer=U.toArrayBuffer,a}},{"base64-js":58,ieee754:59}],58:[function(a,b,c){var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(a){"use strict";function b(a){var b=a.charCodeAt(0);return b===g||b===l?62:b===h||b===m?63:b<i?-1:b<i+10?b-i+26+26:b<k+26?b-k:b<j+26?b-j+26:void 0}function c(a){function c(a){j[l++]=a}var d,e,g,h,i,j;if(a.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var k=a.length;i="="===a.charAt(k-2)?2:"="===a.charAt(k-1)?1:0,j=new f(3*a.length/4-i),g=i>0?a.length-4:a.length;var l=0;for(d=0,e=0;d<g;d+=4,e+=3)h=b(a.charAt(d))<<18|b(a.charAt(d+1))<<12|b(a.charAt(d+2))<<6|b(a.charAt(d+3)),c((16711680&h)>>16),c((65280&h)>>8),c(255&h);return 2===i?(h=b(a.charAt(d))<<2|b(a.charAt(d+1))>>4,c(255&h)):1===i&&(h=b(a.charAt(d))<<10|b(a.charAt(d+1))<<4|b(a.charAt(d+2))>>2,c(h>>8&255),c(255&h)),j}function e(a){function b(a){return d.charAt(a)}function c(a){return b(a>>18&63)+b(a>>12&63)+b(a>>6&63)+b(63&a)}var e,f,g,h=a.length%3,i="";for(e=0,g=a.length-h;e<g;e+=3)f=(a[e]<<16)+(a[e+1]<<8)+a[e+2],i+=c(f);switch(h){case 1:f=a[a.length-1],i+=b(f>>2),i+=b(f<<4&63),i+="==";break;case 2:f=(a[a.length-2]<<8)+a[a.length-1],i+=b(f>>10),i+=b(f>>4&63),i+=b(f<<2&63),i+="="}return i}var f="undefined"!=typeof Uint8Array?Uint8Array:Array,g="+".charCodeAt(0),h="/".charCodeAt(0),i="0".charCodeAt(0),j="a".charCodeAt(0),k="A".charCodeAt(0),l="-".charCodeAt(0),m="_".charCodeAt(0);a.toByteArray=c,a.fromByteArray=e}("undefined"==typeof c?this.base64js={}:c)},{}],59:[function(a,b,c){c.read=function(a,b,c,d,e){var f,g,h=8*e-d-1,i=(1<<h)-1,j=i>>1,k=-7,l=c?e-1:0,m=c?-1:1,n=a[b+l];for(l+=m,f=n&(1<<-k)-1,n>>=-k,k+=h;k>0;f=256*f+a[b+l],l+=m,k-=8);for(g=f&(1<<-k)-1,f>>=-k,k+=d;k>0;g=256*g+a[b+l],l+=m,k-=8);if(0===f)f=1-j;else{if(f===i)return g?NaN:(n?-1:1)*(1/0);g+=Math.pow(2,d),f-=j}return(n?-1:1)*g*Math.pow(2,f-d)},c.write=function(a,b,c,d,e,f){var g,h,i,j=8*f-e-1,k=(1<<j)-1,l=k>>1,m=23===e?Math.pow(2,-24)-Math.pow(2,-77):0,n=d?0:f-1,o=d?1:-1,p=b<0||0===b&&1/b<0?1:0;for(b=Math.abs(b),isNaN(b)||b===1/0?(h=isNaN(b)?1:0,g=k):(g=Math.floor(Math.log(b)/Math.LN2),b*(i=Math.pow(2,-g))<1&&(g--,i*=2),b+=g+l>=1?m/i:m*Math.pow(2,1-l),b*i>=2&&(g++,i/=2),g+l>=k?(h=0,g=k):g+l>=1?(h=(b*i-1)*Math.pow(2,e),g+=l):(h=b*Math.pow(2,l-1)*Math.pow(2,e),g=0));e>=8;a[c+n]=255&h,n+=o,h/=256,e-=8);for(g=g<<e|h,j+=e;j>0;a[c+n]=255&g,n+=o,g/=256,j-=8);a[c+n-o]|=128*p}},{}],60:[function(a,b,c){function d(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function e(a){return"function"==typeof a}function f(a){return"number"==typeof a}function g(a){return"object"==typeof a&&null!==a}function h(a){return void 0===a}b.exports=d,d.EventEmitter=d,d.prototype._events=void 0,d.prototype._maxListeners=void 0,d.defaultMaxListeners=10,d.prototype.setMaxListeners=function(a){if(!f(a)||a<0||isNaN(a))throw TypeError("n must be a positive number");return this._maxListeners=a,this},d.prototype.emit=function(a){var b,c,d,f,i,j;if(this._events||(this._events={}),"error"===a&&(!this._events.error||g(this._events.error)&&!this._events.error.length)){if(b=arguments[1],b instanceof Error)throw b;throw TypeError('Uncaught, unspecified "error" event.')}if(c=this._events[a],h(c))return!1;if(e(c))switch(arguments.length){case 1:c.call(this);break;case 2:c.call(this,arguments[1]);break;case 3:c.call(this,arguments[1],arguments[2]);break;default:for(d=arguments.length,f=new Array(d-1),i=1;i<d;i++)f[i-1]=arguments[i];c.apply(this,f)}else if(g(c)){for(d=arguments.length,f=new Array(d-1),i=1;i<d;i++)f[i-1]=arguments[i];for(j=c.slice(),d=j.length,i=0;i<d;i++)j[i].apply(this,f)}return!0},d.prototype.addListener=function(a,b){var c;if(!e(b))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",a,e(b.listener)?b.listener:b),this._events[a]?g(this._events[a])?this._events[a].push(b):this._events[a]=[this._events[a],b]:this._events[a]=b,g(this._events[a])&&!this._events[a].warned){var c;c=h(this._maxListeners)?d.defaultMaxListeners:this._maxListeners,c&&c>0&&this._events[a].length>c&&(this._events[a].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[a].length),"function"==typeof console.trace&&console.trace())}return this},d.prototype.on=d.prototype.addListener,d.prototype.once=function(a,b){function c(){this.removeListener(a,c),d||(d=!0,b.apply(this,arguments))}if(!e(b))throw TypeError("listener must be a function");var d=!1;return c.listener=b,this.on(a,c),this},d.prototype.removeListener=function(a,b){var c,d,f,h;if(!e(b))throw TypeError("listener must be a function");if(!this._events||!this._events[a])return this;if(c=this._events[a],f=c.length,d=-1,c===b||e(c.listener)&&c.listener===b)delete this._events[a],this._events.removeListener&&this.emit("removeListener",a,b);else if(g(c)){for(h=f;h-- >0;)if(c[h]===b||c[h].listener&&c[h].listener===b){d=h;break}if(d<0)return this;1===c.length?(c.length=0,delete this._events[a]):c.splice(d,1),this._events.removeListener&&this.emit("removeListener",a,b)}return this},d.prototype.removeAllListeners=function(a){var b,c;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[a]&&delete this._events[a],this;if(0===arguments.length){for(b in this._events)"removeListener"!==b&&this.removeAllListeners(b);return this.removeAllListeners("removeListener"),this._events={},this}if(c=this._events[a],e(c))this.removeListener(a,c);else for(;c.length;)this.removeListener(a,c[c.length-1]);return delete this._events[a],this},d.prototype.listeners=function(a){var b;return b=this._events&&this._events[a]?e(this._events[a])?[this._events[a]]:this._events[a].slice():[]},d.listenerCount=function(a,b){var c;return c=a._events&&a._events[b]?e(a._events[b])?1:a._events[b].length:0}},{}],61:[function(a,b,c){"function"==typeof Object.create?b.exports=function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})}:b.exports=function(a,b){a.super_=b;var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a}},{}],62:[function(a,b,c){function d(){}var e=b.exports={};e.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),e.title="browser",e.browser=!0,e.env={},e.argv=[],e.on=d,e.addListener=d,e.once=d,e.off=d,e.removeListener=d,e.removeAllListeners=d,e.emit=d,e.binding=function(a){throw new Error("process.binding is not supported")},e.cwd=function(){return"/"},e.chdir=function(a){throw new Error("process.chdir is not supported")}},{}],63:[function(a,b,c){(function(a){!function(d){function e(a){throw RangeError(H[a])}function f(a,b){for(var c=a.length;c--;)a[c]=b(a[c]);return a}function g(a,b){return f(a.split(G),b).join(".")}function h(a){for(var b,c,d=[],e=0,f=a.length;e<f;)b=a.charCodeAt(e++),b>=55296&&b<=56319&&e<f?(c=a.charCodeAt(e++),56320==(64512&c)?d.push(((1023&b)<<10)+(1023&c)+65536):(d.push(b),e--)):d.push(b);return d}function i(a){return f(a,function(a){var b="";return a>65535&&(a-=65536,b+=K(a>>>10&1023|55296),a=56320|1023&a),b+=K(a)}).join("")}function j(a){return a-48<10?a-22:a-65<26?a-65:a-97<26?a-97:w}function k(a,b){return a+22+75*(a<26)-((0!=b)<<5)}function l(a,b,c){var d=0;for(a=c?J(a/A):a>>1,a+=J(a/b);a>I*y>>1;d+=w)a=J(a/I);return J(d+(I+1)*a/(a+z))}function m(a){var b,c,d,f,g,h,k,m,n,o,p=[],q=a.length,r=0,s=C,t=B;for(c=a.lastIndexOf(D),c<0&&(c=0),d=0;d<c;++d)a.charCodeAt(d)>=128&&e("not-basic"),p.push(a.charCodeAt(d));for(f=c>0?c+1:0;f<q;){for(g=r,h=1,k=w;f>=q&&e("invalid-input"),m=j(a.charCodeAt(f++)),(m>=w||m>J((v-r)/h))&&e("overflow"),r+=m*h,n=k<=t?x:k>=t+y?y:k-t,!(m<n);k+=w)o=w-n,h>J(v/o)&&e("overflow"),h*=o;b=p.length+1,t=l(r-g,b,0==g),J(r/b)>v-s&&e("overflow"),s+=J(r/b),r%=b,p.splice(r++,0,s)}return i(p)}function n(a){var b,c,d,f,g,i,j,m,n,o,p,q,r,s,t,u=[];for(a=h(a),q=a.length,b=C,c=0,g=B,i=0;i<q;++i)p=a[i],p<128&&u.push(K(p));for(d=f=u.length,f&&u.push(D);d<q;){for(j=v,i=0;i<q;++i)p=a[i],p>=b&&p<j&&(j=p);for(r=d+1,j-b>J((v-c)/r)&&e("overflow"),c+=(j-b)*r,b=j,i=0;i<q;++i)if(p=a[i],p<b&&++c>v&&e("overflow"),p==b){for(m=c,n=w;o=n<=g?x:n>=g+y?y:n-g,!(m<o);n+=w)t=m-o,s=w-o,u.push(K(k(o+t%s,0))),m=J(t/s);u.push(K(k(m,0))),g=l(c,r,d==f),c=0,++d}++c,++b}return u.join("")}function o(a){return g(a,function(a){return E.test(a)?m(a.slice(4).toLowerCase()):a})}function p(a){return g(a,function(a){return F.test(a)?"xn--"+n(a):a})}var q="object"==typeof c&&c,r="object"==typeof b&&b&&b.exports==q&&b,s="object"==typeof a&&a;s.global!==s&&s.window!==s||(d=s);var t,u,v=2147483647,w=36,x=1,y=26,z=38,A=700,B=72,C=128,D="-",E=/^xn--/,F=/[^ -~]/,G=/\x2E|\u3002|\uFF0E|\uFF61/g,H={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},I=w-x,J=Math.floor,K=String.fromCharCode;if(t={version:"1.2.4",ucs2:{decode:h,encode:i},decode:m,encode:n,toASCII:p,toUnicode:o},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return t});else if(q&&!q.nodeType)if(r)r.exports=t;else for(u in t)t.hasOwnProperty(u)&&(q[u]=t[u]);else d.punycode=t}(this)}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],64:[function(a,b,c){"use strict";function d(a,b){return Object.prototype.hasOwnProperty.call(a,b)}b.exports=function(a,b,c,f){b=b||"&",c=c||"=";var g={};if("string"!=typeof a||0===a.length)return g;var h=/\+/g;a=a.split(b);var i=1e3;f&&"number"==typeof f.maxKeys&&(i=f.maxKeys);var j=a.length;i>0&&j>i&&(j=i);for(var k=0;k<j;++k){var l,m,n,o,p=a[k].replace(h,"%20"),q=p.indexOf(c);q>=0?(l=p.substr(0,q),m=p.substr(q+1)):(l=p,m=""),n=decodeURIComponent(l),o=decodeURIComponent(m),d(g,n)?e(g[n])?g[n].push(o):g[n]=[g[n],o]:g[n]=o}return g};var e=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)}},{}],65:[function(a,b,c){"use strict";function d(a,b){if(a.map)return a.map(b);for(var c=[],d=0;d<a.length;d++)c.push(b(a[d],d));return c}var e=function(a){switch(typeof a){case"string":return a;case"boolean":return a?"true":"false";case"number":return isFinite(a)?a:"";default:return""}};b.exports=function(a,b,c,h){return b=b||"&",c=c||"=",null===a&&(a=void 0),"object"==typeof a?d(g(a),function(d){var g=encodeURIComponent(e(d))+c;return f(a[d])?a[d].map(function(a){return g+encodeURIComponent(e(a))}).join(b):g+encodeURIComponent(e(a[d]))}).join(b):h?encodeURIComponent(e(h))+c+encodeURIComponent(e(a)):""};var f=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},g=Object.keys||function(a){var b=[];for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b}},{}],66:[function(a,b,c){"use strict";c.decode=c.parse=a("./decode"),c.encode=c.stringify=a("./encode")},{"./decode":64,"./encode":65}],67:[function(a,b,c){b.exports=function(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.readUInt8}},{}],68:[function(a,b,c){(function(b,d){function e(a,b){var d={seen:[],stylize:g};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),p(b)?d.showHidden=b:b&&c._extend(d,b),v(d.showHidden)&&(d.showHidden=!1),v(d.depth)&&(d.depth=2),v(d.colors)&&(d.colors=!1),v(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=f),i(d,a,d.depth)}function f(a,b){var c=e.styles[b];return c?"["+e.colors[c][0]+"m"+a+"["+e.colors[c][1]+"m":a}function g(a,b){return a}function h(a){var b={};return a.forEach(function(a,c){b[a]=!0}),b}function i(a,b,d){if(a.customInspect&&b&&A(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d,a);return t(e)||(e=i(a,e,d)),e}var f=j(a,b);if(f)return f;var g=Object.keys(b),p=h(g);if(a.showHidden&&(g=Object.getOwnPropertyNames(b)),z(b)&&(g.indexOf("message")>=0||g.indexOf("description")>=0))return k(b);if(0===g.length){if(A(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(w(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(y(b))return a.stylize(Date.prototype.toString.call(b),"date");if(z(b))return k(b)}var r="",s=!1,u=["{","}"];if(o(b)&&(s=!0,u=["[","]"]),A(b)){var v=b.name?": "+b.name:"";r=" [Function"+v+"]"}if(w(b)&&(r=" "+RegExp.prototype.toString.call(b)),y(b)&&(r=" "+Date.prototype.toUTCString.call(b)),z(b)&&(r=" "+k(b)),0===g.length&&(!s||0==b.length))return u[0]+r+u[1];if(d<0)return w(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var x;return x=s?l(a,b,d,p,g):g.map(function(c){return m(a,b,d,p,c,s)}),a.seen.pop(),n(x,r,u)}function j(a,b){if(v(b))return a.stylize("undefined","undefined");if(t(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return s(b)?a.stylize(""+b,"number"):p(b)?a.stylize(""+b,"boolean"):q(b)?a.stylize("null","null"):void 0}function k(a){return"["+Error.prototype.toString.call(a)+"]"}function l(a,b,c,d,e){for(var f=[],g=0,h=b.length;g<h;++g)F(b,String(g))?f.push(m(a,b,c,d,String(g),!0)):f.push("");return e.forEach(function(e){e.match(/^\d+$/)||f.push(m(a,b,c,d,e,!0))}),f}function m(a,b,c,d,e,f){var g,h,j;if(j=Object.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?h=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(h=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),h||(a.seen.indexOf(j.value)<0?(h=q(c)?i(a,j.value,null):i(a,j.value,c-1),h.indexOf("\n")>-1&&(h=f?h.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+h.split("\n").map(function(a){return"   "+a}).join("\n"))):h=a.stylize("[Circular]","special")),v(g)){if(f&&e.match(/^\d+$/))return h;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+h}function n(a,b,c){var d=0,e=a.reduce(function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0);return e>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function o(a){return Array.isArray(a)}function p(a){return"boolean"==typeof a}function q(a){return null===a}function r(a){return null==a}function s(a){return"number"==typeof a}function t(a){return"string"==typeof a}function u(a){return"symbol"==typeof a}function v(a){return void 0===a}function w(a){return x(a)&&"[object RegExp]"===C(a)}function x(a){return"object"==typeof a&&null!==a}function y(a){return x(a)&&"[object Date]"===C(a)}function z(a){return x(a)&&("[object Error]"===C(a)||a instanceof Error)}function A(a){return"function"==typeof a}function B(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||"undefined"==typeof a}function C(a){return Object.prototype.toString.call(a)}function D(a){return a<10?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),J[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=/%[sdj%]/g;c.format=function(a){if(!t(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(e(arguments[c]));return b.join(" ")}for(var c=1,d=arguments,f=d.length,g=String(a).replace(G,function(a){if("%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(d[c++]);case"%d":return Number(d[c++]);case"%j":try{return JSON.stringify(d[c++])}catch(a){return"[Circular]"}default:return a}}),h=d[c];c<f;h=d[++c])g+=q(h)||!x(h)?" "+h:" "+e(h);return g},c.deprecate=function(a,e){function f(){if(!g){if(b.throwDeprecation)throw new Error(e);b.traceDeprecation?console.trace(e):console.error(e),g=!0}return a.apply(this,arguments)}if(v(d.process))return function(){return c.deprecate(a,e).apply(this,arguments)};if(b.noDeprecation===!0)return a;var g=!1;return f};var H,I={};c.debuglog=function(a){if(v(H)&&(H=b.env.NODE_DEBUG||""),a=a.toUpperCase(),!I[a])if(new RegExp("\\b"+a+"\\b","i").test(H)){var d=b.pid;I[a]=function(){var b=c.format.apply(c,arguments);console.error("%s %d: %s",a,d,b)}}else I[a]=function(){};return I[a]},c.inspect=e,e.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},e.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=o,c.isBoolean=p,c.isNull=q,c.isNullOrUndefined=r,c.isNumber=s,c.isString=t,c.isSymbol=u,c.isUndefined=v,c.isRegExp=w,c.isObject=x,c.isDate=y,c.isError=z,c.isFunction=A,c.isPrimitive=B,c.isBuffer=a("./support/isBuffer");var J=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=a("inherits"),c._extend=function(a,b){if(!b||!x(b))return a;for(var c=Object.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}}).call(this,a("FWaASH"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":67,FWaASH:62,inherits:61}],69:[function(a,b,c){(function(b){"use strict";function d(){try{var a=new Uint8Array(1);return a.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===a.foo()&&"function"==typeof a.subarray&&0===a.subarray(1,1).byteLength}catch(a){return!1}}function e(){return g.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function f(a,b){if(e()<b)throw new RangeError("Invalid typed array length");return g.TYPED_ARRAY_SUPPORT?(a=new Uint8Array(b),a.__proto__=g.prototype):(null===a&&(a=new g(b)),a.length=b),a}function g(a,b,c){if(!(g.TYPED_ARRAY_SUPPORT||this instanceof g))return new g(a,b,c);if("number"==typeof a){if("string"==typeof b)throw new Error("If encoding is specified then the first argument must be a string");return k(this,a)}return h(this,a,b,c)}function h(a,b,c,d){if("number"==typeof b)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&b instanceof ArrayBuffer?n(a,b,c,d):"string"==typeof b?l(a,b,c):o(a,b)}function i(a){if("number"!=typeof a)throw new TypeError('"size" argument must be a number');if(a<0)throw new RangeError('"size" argument must not be negative')}function j(a,b,c,d){return i(b),b<=0?f(a,b):void 0!==c?"string"==typeof d?f(a,b).fill(c,d):f(a,b).fill(c):f(a,b)}function k(a,b){if(i(b),a=f(a,b<0?0:0|p(b)),!g.TYPED_ARRAY_SUPPORT)for(var c=0;c<b;++c)a[c]=0;return a}function l(a,b,c){if("string"==typeof c&&""!==c||(c="utf8"),!g.isEncoding(c))throw new TypeError('"encoding" must be a valid string encoding');var d=0|r(b,c);a=f(a,d);var e=a.write(b,c);return e!==d&&(a=a.slice(0,e)),a}function m(a,b){var c=b.length<0?0:0|p(b.length);a=f(a,c);for(var d=0;d<c;d+=1)a[d]=255&b[d];return a}function n(a,b,c,d){if(b.byteLength,c<0||b.byteLength<c)throw new RangeError("'offset' is out of bounds");if(b.byteLength<c+(d||0))throw new RangeError("'length' is out of bounds");return b=void 0===c&&void 0===d?new Uint8Array(b):void 0===d?new Uint8Array(b,c):new Uint8Array(b,c,d),g.TYPED_ARRAY_SUPPORT?(a=b,a.__proto__=g.prototype):a=m(a,b),a}function o(a,b){if(g.isBuffer(b)){var c=0|p(b.length);return a=f(a,c),0===a.length?a:(b.copy(a,0,0,c),a)}if(b){if("undefined"!=typeof ArrayBuffer&&b.buffer instanceof ArrayBuffer||"length"in b)return"number"!=typeof b.length||Y(b.length)?f(a,0):m(a,b);if("Buffer"===b.type&&_(b.data))return m(a,b.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function p(a){if(a>=e())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+e().toString(16)+" bytes");return 0|a}function q(a){return+a!=a&&(a=0),g.alloc(+a)}function r(a,b){if(g.isBuffer(a))return a.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(a)||a instanceof ArrayBuffer))return a.byteLength;"string"!=typeof a&&(a=""+a);var c=a.length;if(0===c)return 0;for(var d=!1;;)switch(b){case"ascii":case"latin1":case"binary":return c;case"utf8":case"utf-8":case void 0:return T(a).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*c;case"hex":return c>>>1;case"base64":return W(a).length;default:if(d)return T(a).length;b=(""+b).toLowerCase(),d=!0}}function s(a,b,c){var d=!1;if((void 0===b||b<0)&&(b=0),b>this.length)return"";if((void 0===c||c>this.length)&&(c=this.length),c<=0)return"";if(c>>>=0,b>>>=0,c<=b)return"";for(a||(a="utf8");;)switch(a){case"hex":return H(this,b,c);case"utf8":case"utf-8":return D(this,b,c);case"ascii":return F(this,b,c);case"latin1":case"binary":return G(this,b,c);case"base64":return C(this,b,c);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return I(this,b,c);default:if(d)throw new TypeError("Unknown encoding: "+a);a=(a+"").toLowerCase(),d=!0}}function t(a,b,c){var d=a[b];a[b]=a[c],a[c]=d}function u(a,b,c,d,e){if(0===a.length)return-1;if("string"==typeof c?(d=c,c=0):c>2147483647?c=2147483647:c<-2147483648&&(c=-2147483648),c=+c,isNaN(c)&&(c=e?0:a.length-1),c<0&&(c=a.length+c),c>=a.length){if(e)return-1;c=a.length-1}else if(c<0){if(!e)return-1;c=0}if("string"==typeof b&&(b=g.from(b,d)),g.isBuffer(b))return 0===b.length?-1:v(a,b,c,d,e);if("number"==typeof b)return b&=255,g.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?e?Uint8Array.prototype.indexOf.call(a,b,c):Uint8Array.prototype.lastIndexOf.call(a,b,c):v(a,[b],c,d,e);throw new TypeError("val must be string, number or Buffer")}function v(a,b,c,d,e){function f(a,b){return 1===g?a[b]:a.readUInt16BE(b*g)}var g=1,h=a.length,i=b.length;if(void 0!==d&&(d=String(d).toLowerCase(),"ucs2"===d||"ucs-2"===d||"utf16le"===d||"utf-16le"===d)){if(a.length<2||b.length<2)return-1;g=2,h/=2,i/=2,c/=2}var j;if(e){var k=-1;for(j=c;j<h;j++)if(f(a,j)===f(b,k===-1?0:j-k)){if(k===-1&&(k=j),j-k+1===i)return k*g}else k!==-1&&(j-=j-k),k=-1}else for(c+i>h&&(c=h-i),j=c;j>=0;j--){for(var l=!0,m=0;m<i;m++)if(f(a,j+m)!==f(b,m)){l=!1;break}if(l)return j}return-1}function w(a,b,c,d){c=Number(c)||0;var e=a.length-c;d?(d=Number(d),d>e&&(d=e)):d=e;var f=b.length;if(f%2!==0)throw new TypeError("Invalid hex string");d>f/2&&(d=f/2);for(var g=0;g<d;++g){var h=parseInt(b.substr(2*g,2),16);if(isNaN(h))return g;a[c+g]=h}return g}function x(a,b,c,d){return X(T(b,a.length-c),a,c,d)}function y(a,b,c,d){return X(U(b),a,c,d)}function z(a,b,c,d){return y(a,b,c,d)}function A(a,b,c,d){return X(W(b),a,c,d)}function B(a,b,c,d){return X(V(b,a.length-c),a,c,d)}function C(a,b,c){return 0===b&&c===a.length?Z.fromByteArray(a):Z.fromByteArray(a.slice(b,c))}function D(a,b,c){c=Math.min(a.length,c);for(var d=[],e=b;e<c;){var f=a[e],g=null,h=f>239?4:f>223?3:f>191?2:1;if(e+h<=c){var i,j,k,l;switch(h){case 1:f<128&&(g=f);break;case 2:i=a[e+1],128===(192&i)&&(l=(31&f)<<6|63&i,l>127&&(g=l));break;case 3:i=a[e+1],j=a[e+2],128===(192&i)&&128===(192&j)&&(l=(15&f)<<12|(63&i)<<6|63&j,l>2047&&(l<55296||l>57343)&&(g=l));break;case 4:i=a[e+1],j=a[e+2],k=a[e+3],128===(192&i)&&128===(192&j)&&128===(192&k)&&(l=(15&f)<<18|(63&i)<<12|(63&j)<<6|63&k,l>65535&&l<1114112&&(g=l))}}null===g?(g=65533,h=1):g>65535&&(g-=65536,d.push(g>>>10&1023|55296),g=56320|1023&g),d.push(g),e+=h}return E(d)}function E(a){var b=a.length;if(b<=aa)return String.fromCharCode.apply(String,a);for(var c="",d=0;d<b;)c+=String.fromCharCode.apply(String,a.slice(d,d+=aa));return c}function F(a,b,c){var d="";c=Math.min(a.length,c);for(var e=b;e<c;++e)d+=String.fromCharCode(127&a[e]);return d}function G(a,b,c){var d="";c=Math.min(a.length,c);for(var e=b;e<c;++e)d+=String.fromCharCode(a[e]);return d}function H(a,b,c){var d=a.length;(!b||b<0)&&(b=0),(!c||c<0||c>d)&&(c=d);for(var e="",f=b;f<c;++f)e+=S(a[f]);return e}function I(a,b,c){for(var d=a.slice(b,c),e="",f=0;f<d.length;f+=2)e+=String.fromCharCode(d[f]+256*d[f+1]);return e}function J(a,b,c){if(a%1!==0||a<0)throw new RangeError("offset is not uint");if(a+b>c)throw new RangeError("Trying to access beyond buffer length")}function K(a,b,c,d,e,f){if(!g.isBuffer(a))throw new TypeError('"buffer" argument must be a Buffer instance');if(b>e||b<f)throw new RangeError('"value" argument is out of bounds');if(c+d>a.length)throw new RangeError("Index out of range")}function L(a,b,c,d){b<0&&(b=65535+b+1);for(var e=0,f=Math.min(a.length-c,2);e<f;++e)a[c+e]=(b&255<<8*(d?e:1-e))>>>8*(d?e:1-e)}function M(a,b,c,d){b<0&&(b=4294967295+b+1);for(var e=0,f=Math.min(a.length-c,4);e<f;++e)a[c+e]=b>>>8*(d?e:3-e)&255}function N(a,b,c,d,e,f){if(c+d>a.length)throw new RangeError("Index out of range");if(c<0)throw new RangeError("Index out of range")}function O(a,b,c,d,e){return e||N(a,b,c,4,3.4028234663852886e38,-3.4028234663852886e38),$.write(a,b,c,d,23,4),c+4}function P(a,b,c,d,e){return e||N(a,b,c,8,1.7976931348623157e308,-1.7976931348623157e308),$.write(a,b,c,d,52,8),c+8}function Q(a){if(a=R(a).replace(ba,""),a.length<2)return"";for(;a.length%4!==0;)a+="=";return a}function R(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")}function S(a){
return a<16?"0"+a.toString(16):a.toString(16)}function T(a,b){b=b||1/0;for(var c,d=a.length,e=null,f=[],g=0;g<d;++g){if(c=a.charCodeAt(g),c>55295&&c<57344){if(!e){if(c>56319){(b-=3)>-1&&f.push(239,191,189);continue}if(g+1===d){(b-=3)>-1&&f.push(239,191,189);continue}e=c;continue}if(c<56320){(b-=3)>-1&&f.push(239,191,189),e=c;continue}c=(e-55296<<10|c-56320)+65536}else e&&(b-=3)>-1&&f.push(239,191,189);if(e=null,c<128){if((b-=1)<0)break;f.push(c)}else if(c<2048){if((b-=2)<0)break;f.push(c>>6|192,63&c|128)}else if(c<65536){if((b-=3)<0)break;f.push(c>>12|224,c>>6&63|128,63&c|128)}else{if(!(c<1114112))throw new Error("Invalid code point");if((b-=4)<0)break;f.push(c>>18|240,c>>12&63|128,c>>6&63|128,63&c|128)}}return f}function U(a){for(var b=[],c=0;c<a.length;++c)b.push(255&a.charCodeAt(c));return b}function V(a,b){for(var c,d,e,f=[],g=0;g<a.length&&!((b-=2)<0);++g)c=a.charCodeAt(g),d=c>>8,e=c%256,f.push(e),f.push(d);return f}function W(a){return Z.toByteArray(Q(a))}function X(a,b,c,d){for(var e=0;e<d&&!(e+c>=b.length||e>=a.length);++e)b[e+c]=a[e];return e}function Y(a){return a!==a}var Z=a("base64-js"),$=a("ieee754"),_=a("isarray");c.Buffer=g,c.SlowBuffer=q,c.INSPECT_MAX_BYTES=50,g.TYPED_ARRAY_SUPPORT=void 0!==b.TYPED_ARRAY_SUPPORT?b.TYPED_ARRAY_SUPPORT:d(),c.kMaxLength=e(),g.poolSize=8192,g._augment=function(a){return a.__proto__=g.prototype,a},g.from=function(a,b,c){return h(null,a,b,c)},g.TYPED_ARRAY_SUPPORT&&(g.prototype.__proto__=Uint8Array.prototype,g.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&g[Symbol.species]===g&&Object.defineProperty(g,Symbol.species,{value:null,configurable:!0})),g.alloc=function(a,b,c){return j(null,a,b,c)},g.allocUnsafe=function(a){return k(null,a)},g.allocUnsafeSlow=function(a){return k(null,a)},g.isBuffer=function(a){return!(null==a||!a._isBuffer)},g.compare=function(a,b){if(!g.isBuffer(a)||!g.isBuffer(b))throw new TypeError("Arguments must be Buffers");if(a===b)return 0;for(var c=a.length,d=b.length,e=0,f=Math.min(c,d);e<f;++e)if(a[e]!==b[e]){c=a[e],d=b[e];break}return c<d?-1:d<c?1:0},g.isEncoding=function(a){switch(String(a).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},g.concat=function(a,b){if(!_(a))throw new TypeError('"list" argument must be an Array of Buffers');if(0===a.length)return g.alloc(0);var c;if(void 0===b)for(b=0,c=0;c<a.length;++c)b+=a[c].length;var d=g.allocUnsafe(b),e=0;for(c=0;c<a.length;++c){var f=a[c];if(!g.isBuffer(f))throw new TypeError('"list" argument must be an Array of Buffers');f.copy(d,e),e+=f.length}return d},g.byteLength=r,g.prototype._isBuffer=!0,g.prototype.swap16=function(){var a=this.length;if(a%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var b=0;b<a;b+=2)t(this,b,b+1);return this},g.prototype.swap32=function(){var a=this.length;if(a%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var b=0;b<a;b+=4)t(this,b,b+3),t(this,b+1,b+2);return this},g.prototype.swap64=function(){var a=this.length;if(a%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var b=0;b<a;b+=8)t(this,b,b+7),t(this,b+1,b+6),t(this,b+2,b+5),t(this,b+3,b+4);return this},g.prototype.toString=function(){var a=0|this.length;return 0===a?"":0===arguments.length?D(this,0,a):s.apply(this,arguments)},g.prototype.equals=function(a){if(!g.isBuffer(a))throw new TypeError("Argument must be a Buffer");return this===a||0===g.compare(this,a)},g.prototype.inspect=function(){var a="",b=c.INSPECT_MAX_BYTES;return this.length>0&&(a=this.toString("hex",0,b).match(/.{2}/g).join(" "),this.length>b&&(a+=" ... ")),"<Buffer "+a+">"},g.prototype.compare=function(a,b,c,d,e){if(!g.isBuffer(a))throw new TypeError("Argument must be a Buffer");if(void 0===b&&(b=0),void 0===c&&(c=a?a.length:0),void 0===d&&(d=0),void 0===e&&(e=this.length),b<0||c>a.length||d<0||e>this.length)throw new RangeError("out of range index");if(d>=e&&b>=c)return 0;if(d>=e)return-1;if(b>=c)return 1;if(b>>>=0,c>>>=0,d>>>=0,e>>>=0,this===a)return 0;for(var f=e-d,h=c-b,i=Math.min(f,h),j=this.slice(d,e),k=a.slice(b,c),l=0;l<i;++l)if(j[l]!==k[l]){f=j[l],h=k[l];break}return f<h?-1:h<f?1:0},g.prototype.includes=function(a,b,c){return this.indexOf(a,b,c)!==-1},g.prototype.indexOf=function(a,b,c){return u(this,a,b,c,!0)},g.prototype.lastIndexOf=function(a,b,c){return u(this,a,b,c,!1)},g.prototype.write=function(a,b,c,d){if(void 0===b)d="utf8",c=this.length,b=0;else if(void 0===c&&"string"==typeof b)d=b,c=this.length,b=0;else{if(!isFinite(b))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");b|=0,isFinite(c)?(c|=0,void 0===d&&(d="utf8")):(d=c,c=void 0)}var e=this.length-b;if((void 0===c||c>e)&&(c=e),a.length>0&&(c<0||b<0)||b>this.length)throw new RangeError("Attempt to write outside buffer bounds");d||(d="utf8");for(var f=!1;;)switch(d){case"hex":return w(this,a,b,c);case"utf8":case"utf-8":return x(this,a,b,c);case"ascii":return y(this,a,b,c);case"latin1":case"binary":return z(this,a,b,c);case"base64":return A(this,a,b,c);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return B(this,a,b,c);default:if(f)throw new TypeError("Unknown encoding: "+d);d=(""+d).toLowerCase(),f=!0}},g.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var aa=4096;g.prototype.slice=function(a,b){var c=this.length;a=~~a,b=void 0===b?c:~~b,a<0?(a+=c,a<0&&(a=0)):a>c&&(a=c),b<0?(b+=c,b<0&&(b=0)):b>c&&(b=c),b<a&&(b=a);var d;if(g.TYPED_ARRAY_SUPPORT)d=this.subarray(a,b),d.__proto__=g.prototype;else{var e=b-a;d=new g(e,void 0);for(var f=0;f<e;++f)d[f]=this[f+a]}return d},g.prototype.readUIntLE=function(a,b,c){a|=0,b|=0,c||J(a,b,this.length);for(var d=this[a],e=1,f=0;++f<b&&(e*=256);)d+=this[a+f]*e;return d},g.prototype.readUIntBE=function(a,b,c){a|=0,b|=0,c||J(a,b,this.length);for(var d=this[a+--b],e=1;b>0&&(e*=256);)d+=this[a+--b]*e;return d},g.prototype.readUInt8=function(a,b){return b||J(a,1,this.length),this[a]},g.prototype.readUInt16LE=function(a,b){return b||J(a,2,this.length),this[a]|this[a+1]<<8},g.prototype.readUInt16BE=function(a,b){return b||J(a,2,this.length),this[a]<<8|this[a+1]},g.prototype.readUInt32LE=function(a,b){return b||J(a,4,this.length),(this[a]|this[a+1]<<8|this[a+2]<<16)+16777216*this[a+3]},g.prototype.readUInt32BE=function(a,b){return b||J(a,4,this.length),16777216*this[a]+(this[a+1]<<16|this[a+2]<<8|this[a+3])},g.prototype.readIntLE=function(a,b,c){a|=0,b|=0,c||J(a,b,this.length);for(var d=this[a],e=1,f=0;++f<b&&(e*=256);)d+=this[a+f]*e;return e*=128,d>=e&&(d-=Math.pow(2,8*b)),d},g.prototype.readIntBE=function(a,b,c){a|=0,b|=0,c||J(a,b,this.length);for(var d=b,e=1,f=this[a+--d];d>0&&(e*=256);)f+=this[a+--d]*e;return e*=128,f>=e&&(f-=Math.pow(2,8*b)),f},g.prototype.readInt8=function(a,b){return b||J(a,1,this.length),128&this[a]?(255-this[a]+1)*-1:this[a]},g.prototype.readInt16LE=function(a,b){b||J(a,2,this.length);var c=this[a]|this[a+1]<<8;return 32768&c?4294901760|c:c},g.prototype.readInt16BE=function(a,b){b||J(a,2,this.length);var c=this[a+1]|this[a]<<8;return 32768&c?4294901760|c:c},g.prototype.readInt32LE=function(a,b){return b||J(a,4,this.length),this[a]|this[a+1]<<8|this[a+2]<<16|this[a+3]<<24},g.prototype.readInt32BE=function(a,b){return b||J(a,4,this.length),this[a]<<24|this[a+1]<<16|this[a+2]<<8|this[a+3]},g.prototype.readFloatLE=function(a,b){return b||J(a,4,this.length),$.read(this,a,!0,23,4)},g.prototype.readFloatBE=function(a,b){return b||J(a,4,this.length),$.read(this,a,!1,23,4)},g.prototype.readDoubleLE=function(a,b){return b||J(a,8,this.length),$.read(this,a,!0,52,8)},g.prototype.readDoubleBE=function(a,b){return b||J(a,8,this.length),$.read(this,a,!1,52,8)},g.prototype.writeUIntLE=function(a,b,c,d){if(a=+a,b|=0,c|=0,!d){var e=Math.pow(2,8*c)-1;K(this,a,b,c,e,0)}var f=1,g=0;for(this[b]=255&a;++g<c&&(f*=256);)this[b+g]=a/f&255;return b+c},g.prototype.writeUIntBE=function(a,b,c,d){if(a=+a,b|=0,c|=0,!d){var e=Math.pow(2,8*c)-1;K(this,a,b,c,e,0)}var f=c-1,g=1;for(this[b+f]=255&a;--f>=0&&(g*=256);)this[b+f]=a/g&255;return b+c},g.prototype.writeUInt8=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,1,255,0),g.TYPED_ARRAY_SUPPORT||(a=Math.floor(a)),this[b]=255&a,b+1},g.prototype.writeUInt16LE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,2,65535,0),g.TYPED_ARRAY_SUPPORT?(this[b]=255&a,this[b+1]=a>>>8):L(this,a,b,!0),b+2},g.prototype.writeUInt16BE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,2,65535,0),g.TYPED_ARRAY_SUPPORT?(this[b]=a>>>8,this[b+1]=255&a):L(this,a,b,!1),b+2},g.prototype.writeUInt32LE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,4,4294967295,0),g.TYPED_ARRAY_SUPPORT?(this[b+3]=a>>>24,this[b+2]=a>>>16,this[b+1]=a>>>8,this[b]=255&a):M(this,a,b,!0),b+4},g.prototype.writeUInt32BE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,4,4294967295,0),g.TYPED_ARRAY_SUPPORT?(this[b]=a>>>24,this[b+1]=a>>>16,this[b+2]=a>>>8,this[b+3]=255&a):M(this,a,b,!1),b+4},g.prototype.writeIntLE=function(a,b,c,d){if(a=+a,b|=0,!d){var e=Math.pow(2,8*c-1);K(this,a,b,c,e-1,-e)}var f=0,g=1,h=0;for(this[b]=255&a;++f<c&&(g*=256);)a<0&&0===h&&0!==this[b+f-1]&&(h=1),this[b+f]=(a/g>>0)-h&255;return b+c},g.prototype.writeIntBE=function(a,b,c,d){if(a=+a,b|=0,!d){var e=Math.pow(2,8*c-1);K(this,a,b,c,e-1,-e)}var f=c-1,g=1,h=0;for(this[b+f]=255&a;--f>=0&&(g*=256);)a<0&&0===h&&0!==this[b+f+1]&&(h=1),this[b+f]=(a/g>>0)-h&255;return b+c},g.prototype.writeInt8=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,1,127,-128),g.TYPED_ARRAY_SUPPORT||(a=Math.floor(a)),a<0&&(a=255+a+1),this[b]=255&a,b+1},g.prototype.writeInt16LE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,2,32767,-32768),g.TYPED_ARRAY_SUPPORT?(this[b]=255&a,this[b+1]=a>>>8):L(this,a,b,!0),b+2},g.prototype.writeInt16BE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,2,32767,-32768),g.TYPED_ARRAY_SUPPORT?(this[b]=a>>>8,this[b+1]=255&a):L(this,a,b,!1),b+2},g.prototype.writeInt32LE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,4,2147483647,-2147483648),g.TYPED_ARRAY_SUPPORT?(this[b]=255&a,this[b+1]=a>>>8,this[b+2]=a>>>16,this[b+3]=a>>>24):M(this,a,b,!0),b+4},g.prototype.writeInt32BE=function(a,b,c){return a=+a,b|=0,c||K(this,a,b,4,2147483647,-2147483648),a<0&&(a=4294967295+a+1),g.TYPED_ARRAY_SUPPORT?(this[b]=a>>>24,this[b+1]=a>>>16,this[b+2]=a>>>8,this[b+3]=255&a):M(this,a,b,!1),b+4},g.prototype.writeFloatLE=function(a,b,c){return O(this,a,b,!0,c)},g.prototype.writeFloatBE=function(a,b,c){return O(this,a,b,!1,c)},g.prototype.writeDoubleLE=function(a,b,c){return P(this,a,b,!0,c)},g.prototype.writeDoubleBE=function(a,b,c){return P(this,a,b,!1,c)},g.prototype.copy=function(a,b,c,d){if(c||(c=0),d||0===d||(d=this.length),b>=a.length&&(b=a.length),b||(b=0),d>0&&d<c&&(d=c),d===c)return 0;if(0===a.length||0===this.length)return 0;if(b<0)throw new RangeError("targetStart out of bounds");if(c<0||c>=this.length)throw new RangeError("sourceStart out of bounds");if(d<0)throw new RangeError("sourceEnd out of bounds");d>this.length&&(d=this.length),a.length-b<d-c&&(d=a.length-b+c);var e,f=d-c;if(this===a&&c<b&&b<d)for(e=f-1;e>=0;--e)a[e+b]=this[e+c];else if(f<1e3||!g.TYPED_ARRAY_SUPPORT)for(e=0;e<f;++e)a[e+b]=this[e+c];else Uint8Array.prototype.set.call(a,this.subarray(c,c+f),b);return f},g.prototype.fill=function(a,b,c,d){if("string"==typeof a){if("string"==typeof b?(d=b,b=0,c=this.length):"string"==typeof c&&(d=c,c=this.length),1===a.length){var e=a.charCodeAt(0);e<256&&(a=e)}if(void 0!==d&&"string"!=typeof d)throw new TypeError("encoding must be a string");if("string"==typeof d&&!g.isEncoding(d))throw new TypeError("Unknown encoding: "+d)}else"number"==typeof a&&(a&=255);if(b<0||this.length<b||this.length<c)throw new RangeError("Out of range index");if(c<=b)return this;b>>>=0,c=void 0===c?this.length:c>>>0,a||(a=0);var f;if("number"==typeof a)for(f=b;f<c;++f)this[f]=a;else{var h=g.isBuffer(a)?a:T(new g(a,d).toString()),i=h.length;for(f=0;f<c-b;++f)this[f+b]=h[f%i]}return this};var ba=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":70,ieee754:71,isarray:72}],70:[function(a,b,c){"use strict";function d(){for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b=0,c=a.length;b<c;++b)i[b]=a[b],j[a.charCodeAt(b)]=b;j["-".charCodeAt(0)]=62,j["_".charCodeAt(0)]=63}function e(a){var b,c,d,e,f,g,h=a.length;if(h%4>0)throw new Error("Invalid string. Length must be a multiple of 4");f="="===a[h-2]?2:"="===a[h-1]?1:0,g=new k(3*h/4-f),d=f>0?h-4:h;var i=0;for(b=0,c=0;b<d;b+=4,c+=3)e=j[a.charCodeAt(b)]<<18|j[a.charCodeAt(b+1)]<<12|j[a.charCodeAt(b+2)]<<6|j[a.charCodeAt(b+3)],g[i++]=e>>16&255,g[i++]=e>>8&255,g[i++]=255&e;return 2===f?(e=j[a.charCodeAt(b)]<<2|j[a.charCodeAt(b+1)]>>4,g[i++]=255&e):1===f&&(e=j[a.charCodeAt(b)]<<10|j[a.charCodeAt(b+1)]<<4|j[a.charCodeAt(b+2)]>>2,g[i++]=e>>8&255,g[i++]=255&e),g}function f(a){return i[a>>18&63]+i[a>>12&63]+i[a>>6&63]+i[63&a]}function g(a,b,c){for(var d,e=[],g=b;g<c;g+=3)d=(a[g]<<16)+(a[g+1]<<8)+a[g+2],e.push(f(d));return e.join("")}function h(a){for(var b,c=a.length,d=c%3,e="",f=[],h=16383,j=0,k=c-d;j<k;j+=h)f.push(g(a,j,j+h>k?k:j+h));return 1===d?(b=a[c-1],e+=i[b>>2],e+=i[b<<4&63],e+="=="):2===d&&(b=(a[c-2]<<8)+a[c-1],e+=i[b>>10],e+=i[b>>4&63],e+=i[b<<2&63],e+="="),f.push(e),f.join("")}c.toByteArray=e,c.fromByteArray=h;var i=[],j=[],k="undefined"!=typeof Uint8Array?Uint8Array:Array;d()},{}],71:[function(a,b,c){b.exports=a(59)},{}],72:[function(a,b,c){var d={}.toString;b.exports=Array.isArray||function(a){return"[object Array]"==d.call(a)}},{}],73:[function(a,b,c){function d(a,b){if(a.length%h!==0){var c=a.length+(h-a.length%h);a=g.concat([a,i],c)}for(var d=[],e=b?a.readInt32BE:a.readInt32LE,f=0;f<a.length;f+=h)d.push(e.call(a,f));return d}function e(a,b,c){for(var d=new g(b),e=c?d.writeInt32BE:d.writeInt32LE,f=0;f<a.length;f++)e.call(d,a[f],4*f,!0);return d}function f(a,b,c,f){g.isBuffer(a)||(a=new g(a));var h=b(d(a,f),a.length*j);return e(h,c,f)}var g=a("buffer").Buffer,h=4,i=new g(h);i.fill(0);var j=8;b.exports={hash:f}},{buffer:57}],74:[function(a,b,c){function d(a,b,c){h.isBuffer(b)||(b=new h(b)),h.isBuffer(c)||(c=new h(c)),b.length>n?b=a(b):b.length<n&&(b=h.concat([b,o],n));for(var d=new h(n),e=new h(n),f=0;f<n;f++)d[f]=54^b[f],e[f]=92^b[f];var g=a(h.concat([d,c]));return a(h.concat([e,g]))}function e(a,b){a=a||"sha1";var c=m[a],e=[],g=0;return c||f("algorithm:",a,"is not yet supported"),{update:function(a){return h.isBuffer(a)||(a=new h(a)),e.push(a),g+=a.length,this},digest:function(a){var f=h.concat(e),g=b?d(c,b,f):c(f);return e=null,a?g.toString(a):g}}}function f(){var a=[].slice.call(arguments).join(" ");throw new Error([a,"we accept pull requests","http://github.com/dominictarr/crypto-browserify"].join("\n"))}function g(a,b){for(var c in a)b(a[c],c)}var h=a("buffer").Buffer,i=a("./sha"),j=a("./sha256"),k=a("./rng"),l=a("./md5"),m={sha1:i,sha256:j,md5:l},n=64,o=new h(n);o.fill(0),c.createHash=function(a){return e(a)},c.createHmac=function(a,b){return e(a,b)},c.randomBytes=function(a,b){if(!b||!b.call)return new h(k(a));try{b.call(this,void 0,new h(k(a)))}catch(a){b(a)}},g(["createCredentials","createCipher","createCipheriv","createDecipher","createDecipheriv","createSign","createVerify","createDiffieHellman","pbkdf2"],function(a){c[a]=function(){f("sorry,",a,"is not implemented yet")}})},{"./md5":75,"./rng":76,"./sha":77,"./sha256":78,buffer:57}],75:[function(a,b,c){function d(a,b){a[b>>5]|=128<<b%32,a[(b+64>>>9<<4)+14]=b;for(var c=1732584193,d=-271733879,e=-1732584194,k=271733878,l=0;l<a.length;l+=16){var m=c,n=d,o=e,p=k;c=f(c,d,e,k,a[l+0],7,-680876936),k=f(k,c,d,e,a[l+1],12,-389564586),e=f(e,k,c,d,a[l+2],17,606105819),d=f(d,e,k,c,a[l+3],22,-1044525330),c=f(c,d,e,k,a[l+4],7,-176418897),k=f(k,c,d,e,a[l+5],12,1200080426),e=f(e,k,c,d,a[l+6],17,-1473231341),d=f(d,e,k,c,a[l+7],22,-45705983),c=f(c,d,e,k,a[l+8],7,1770035416),k=f(k,c,d,e,a[l+9],12,-1958414417),e=f(e,k,c,d,a[l+10],17,-42063),d=f(d,e,k,c,a[l+11],22,-1990404162),c=f(c,d,e,k,a[l+12],7,1804603682),k=f(k,c,d,e,a[l+13],12,-40341101),e=f(e,k,c,d,a[l+14],17,-1502002290),d=f(d,e,k,c,a[l+15],22,1236535329),c=g(c,d,e,k,a[l+1],5,-165796510),k=g(k,c,d,e,a[l+6],9,-1069501632),e=g(e,k,c,d,a[l+11],14,643717713),d=g(d,e,k,c,a[l+0],20,-373897302),c=g(c,d,e,k,a[l+5],5,-701558691),k=g(k,c,d,e,a[l+10],9,38016083),e=g(e,k,c,d,a[l+15],14,-660478335),d=g(d,e,k,c,a[l+4],20,-405537848),c=g(c,d,e,k,a[l+9],5,568446438),k=g(k,c,d,e,a[l+14],9,-1019803690),e=g(e,k,c,d,a[l+3],14,-187363961),d=g(d,e,k,c,a[l+8],20,1163531501),c=g(c,d,e,k,a[l+13],5,-1444681467),k=g(k,c,d,e,a[l+2],9,-51403784),e=g(e,k,c,d,a[l+7],14,1735328473),d=g(d,e,k,c,a[l+12],20,-1926607734),c=h(c,d,e,k,a[l+5],4,-378558),k=h(k,c,d,e,a[l+8],11,-2022574463),e=h(e,k,c,d,a[l+11],16,1839030562),d=h(d,e,k,c,a[l+14],23,-35309556),c=h(c,d,e,k,a[l+1],4,-1530992060),k=h(k,c,d,e,a[l+4],11,1272893353),e=h(e,k,c,d,a[l+7],16,-155497632),d=h(d,e,k,c,a[l+10],23,-1094730640),c=h(c,d,e,k,a[l+13],4,681279174),k=h(k,c,d,e,a[l+0],11,-358537222),e=h(e,k,c,d,a[l+3],16,-722521979),d=h(d,e,k,c,a[l+6],23,76029189),c=h(c,d,e,k,a[l+9],4,-640364487),k=h(k,c,d,e,a[l+12],11,-421815835),e=h(e,k,c,d,a[l+15],16,530742520),d=h(d,e,k,c,a[l+2],23,-995338651),c=i(c,d,e,k,a[l+0],6,-198630844),k=i(k,c,d,e,a[l+7],10,1126891415),e=i(e,k,c,d,a[l+14],15,-1416354905),d=i(d,e,k,c,a[l+5],21,-57434055),c=i(c,d,e,k,a[l+12],6,1700485571),k=i(k,c,d,e,a[l+3],10,-1894986606),e=i(e,k,c,d,a[l+10],15,-1051523),d=i(d,e,k,c,a[l+1],21,-2054922799),c=i(c,d,e,k,a[l+8],6,1873313359),k=i(k,c,d,e,a[l+15],10,-30611744),e=i(e,k,c,d,a[l+6],15,-1560198380),d=i(d,e,k,c,a[l+13],21,1309151649),c=i(c,d,e,k,a[l+4],6,-145523070),k=i(k,c,d,e,a[l+11],10,-1120210379),e=i(e,k,c,d,a[l+2],15,718787259),d=i(d,e,k,c,a[l+9],21,-343485551),c=j(c,m),d=j(d,n),e=j(e,o),k=j(k,p)}return Array(c,d,e,k)}function e(a,b,c,d,e,f){return j(k(j(j(b,a),j(d,f)),e),c)}function f(a,b,c,d,f,g,h){return e(b&c|~b&d,a,b,f,g,h)}function g(a,b,c,d,f,g,h){return e(b&d|c&~d,a,b,f,g,h)}function h(a,b,c,d,f,g,h){return e(b^c^d,a,b,f,g,h)}function i(a,b,c,d,f,g,h){return e(c^(b|~d),a,b,f,g,h)}function j(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function k(a,b){return a<<b|a>>>32-b}var l=a("./helpers");b.exports=function(a){return l.hash(a,d,16)}},{"./helpers":73}],76:[function(a,b,c){!function(){var a,c,d=this;a=function(a){for(var b,b,c=new Array(a),d=0;d<a;d++)0==(3&d)&&(b=4294967296*Math.random()),c[d]=b>>>((3&d)<<3)&255;return c},d.crypto&&crypto.getRandomValues&&(c=function(a){var b=new Uint8Array(a);return crypto.getRandomValues(b),b}),b.exports=c||a}()},{}],77:[function(a,b,c){function d(a,b){a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b;for(var c=Array(80),d=1732584193,i=-271733879,j=-1732584194,k=271733878,l=-1009589776,m=0;m<a.length;m+=16){for(var n=d,o=i,p=j,q=k,r=l,s=0;s<80;s++){s<16?c[s]=a[m+s]:c[s]=h(c[s-3]^c[s-8]^c[s-14]^c[s-16],1);var t=g(g(h(d,5),e(s,i,j,k)),g(g(l,c[s]),f(s)));l=k,k=j,j=h(i,30),i=d,d=t}d=g(d,n),i=g(i,o),j=g(j,p),k=g(k,q),l=g(l,r)}return Array(d,i,j,k,l)}function e(a,b,c,d){return a<20?b&c|~b&d:a<40?b^c^d:a<60?b&c|b&d|c&d:b^c^d}function f(a){return a<20?1518500249:a<40?1859775393:a<60?-1894007588:-899497514}function g(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function h(a,b){return a<<b|a>>>32-b}var i=a("./helpers");b.exports=function(a){return i.hash(a,d,20,!0)}},{"./helpers":73}],78:[function(a,b,c){var d=a("./helpers"),e=function(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c},f=function(a,b){return a>>>b|a<<32-b},g=function(a,b){return a>>>b},h=function(a,b,c){return a&b^~a&c},i=function(a,b,c){return a&b^a&c^b&c},j=function(a){return f(a,2)^f(a,13)^f(a,22)},k=function(a){return f(a,6)^f(a,11)^f(a,25)},l=function(a){return f(a,7)^f(a,18)^g(a,3)},m=function(a){return f(a,17)^f(a,19)^g(a,10)},n=function(a,b){var c,d,f,g,n,o,p,q,r,s,t,u,v=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),w=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),x=new Array(64);a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b;for(var r=0;r<a.length;r+=16){c=w[0],d=w[1],f=w[2],g=w[3],n=w[4],o=w[5],p=w[6],q=w[7];for(var s=0;s<64;s++)s<16?x[s]=a[s+r]:x[s]=e(e(e(m(x[s-2]),x[s-7]),l(x[s-15])),x[s-16]),t=e(e(e(e(q,k(n)),h(n,o,p)),v[s]),x[s]),u=e(j(c),i(c,d,f)),q=p,p=o,o=n,n=e(g,t),g=f,f=d,d=c,c=e(t,u);w[0]=e(c,w[0]),w[1]=e(d,w[1]),w[2]=e(f,w[2]),w[3]=e(g,w[3]),w[4]=e(n,w[4]),w[5]=e(o,w[5]),w[6]=e(p,w[6]),w[7]=e(q,w[7])}return w};b.exports=function(a){return d.hash(a,n,32,!0)}},{"./helpers":73}],79:[function(a,b,c){!function(a){"use strict";function b(a){return null!==a&&"[object Array]"===Object.prototype.toString.call(a)}function c(a){return null!==a&&"[object Object]"===Object.prototype.toString.call(a)}function d(a,e){if(a===e)return!0;var f=Object.prototype.toString.call(a);if(f!==Object.prototype.toString.call(e))return!1;if(b(a)===!0){if(a.length!==e.length)return!1;for(var g=0;g<a.length;g++)if(d(a[g],e[g])===!1)return!1;return!0}if(c(a)===!0){var h={};for(var i in a)if(hasOwnProperty.call(a,i)){if(d(a[i],e[i])===!1)return!1;h[i]=!0}for(var j in e)if(hasOwnProperty.call(e,j)&&h[j]!==!0)return!1;return!0}return!1}function e(a){if(""===a||a===!1||null===a)return!0;if(b(a)&&0===a.length)return!0;if(c(a)){for(var d in a)if(a.hasOwnProperty(d))return!1;return!0}return!1}function f(a){for(var b=Object.keys(a),c=[],d=0;d<b.length;d++)c.push(a[b[d]]);return c}function g(a){return a>="a"&&a<="z"||a>="A"&&a<="Z"||"_"===a}function h(a){return a>="0"&&a<="9"||"-"===a}function i(a){return a>="a"&&a<="z"||a>="A"&&a<="Z"||a>="0"&&a<="9"||"_"===a}function j(){}function k(){}function l(a){this.runtime=a}function m(a){this._interpreter=a,this.functionTable={abs:{_func:this._functionAbs,_signature:[{types:[r]}]},avg:{_func:this._functionAvg,_signature:[{types:[z]}]},ceil:{_func:this._functionCeil,_signature:[{types:[r]}]},contains:{_func:this._functionContains,_signature:[{types:[t,u]},{types:[s]}]},ends_with:{_func:this._functionEndsWith,_signature:[{types:[t]},{types:[t]}]},floor:{_func:this._functionFloor,_signature:[{types:[r]}]},length:{_func:this._functionLength,_signature:[{types:[t,u,v]}]},map:{_func:this._functionMap,_signature:[{types:[x]},{types:[u]}]},max:{_func:this._functionMax,_signature:[{types:[z,A]}]},merge:{_func:this._functionMerge,_signature:[{types:[v],variadic:!0}]},max_by:{_func:this._functionMaxBy,_signature:[{types:[u]},{types:[x]}]},sum:{_func:this._functionSum,_signature:[{types:[z]}]},starts_with:{_func:this._functionStartsWith,_signature:[{types:[t]},{types:[t]}]},min:{_func:this._functionMin,_signature:[{types:[z,A]}]},min_by:{_func:this._functionMinBy,_signature:[{types:[u]},{types:[x]}]},type:{_func:this._functionType,_signature:[{types:[s]}]},keys:{_func:this._functionKeys,_signature:[{types:[v]}]},values:{_func:this._functionValues,_signature:[{types:[v]}]},sort:{_func:this._functionSort,_signature:[{types:[A,z]}]},sort_by:{_func:this._functionSortBy,_signature:[{types:[u]},{types:[x]}]},join:{_func:this._functionJoin,_signature:[{types:[t]},{types:[A]}]},reverse:{_func:this._functionReverse,_signature:[{types:[t,u]}]},to_array:{_func:this._functionToArray,_signature:[{types:[s]}]},to_string:{_func:this._functionToString,_signature:[{types:[s]}]},to_number:{_func:this._functionToNumber,_signature:[{types:[s]}]},not_null:{_func:this._functionNotNull,_signature:[{types:[s],variadic:!0}]}}}function n(a){var b=new k,c=b.parse(a);return c}function o(a){var b=new j;return b.tokenize(a)}function p(a,b){var c=new k,d=new m,e=new l(d);d._interpreter=e;var f=c.parse(b);return e.search(f,a)}var q;q="function"==typeof String.prototype.trimLeft?function(a){return a.trimLeft()}:function(a){return a.match(/^\s*(.*)/)[1]};var r=0,s=1,t=2,u=3,v=4,w=5,x=6,y=7,z=8,A=9,B="EOF",C="UnquotedIdentifier",D="QuotedIdentifier",E="Rbracket",F="Rparen",G="Comma",H="Colon",I="Rbrace",J="Number",K="Current",L="Expref",M="Pipe",N="Or",O="And",P="EQ",Q="GT",R="LT",S="GTE",T="LTE",U="NE",V="Flatten",W="Star",X="Filter",Y="Dot",Z="Not",$="Lbrace",_="Lbracket",aa="Lparen",ba="Literal",ca={".":Y,"*":W,",":G,":":H,"{":$,"}":I,"]":E,"(":aa,")":F,"@":K},da={"<":!0,">":!0,"=":!0,"!":!0},ea={" ":!0,"\t":!0,"\n":!0};j.prototype={tokenize:function(a){var b=[];this._current=0;for(var c,d,e;this._current<a.length;)if(g(a[this._current]))c=this._current,d=this._consumeUnquotedIdentifier(a),b.push({type:C,value:d,start:c});else if(void 0!==ca[a[this._current]])b.push({type:ca[a[this._current]],value:a[this._current],start:this._current}),this._current++;else if(h(a[this._current]))e=this._consumeNumber(a),b.push(e);else if("["===a[this._current])e=this._consumeLBracket(a),b.push(e);else if('"'===a[this._current])c=this._current,d=this._consumeQuotedIdentifier(a),b.push({type:D,value:d,start:c});else if("'"===a[this._current])c=this._current,d=this._consumeRawStringLiteral(a),b.push({type:ba,value:d,start:c});else if("`"===a[this._current]){c=this._current;var f=this._consumeLiteral(a);b.push({type:ba,value:f,start:c})}else if(void 0!==da[a[this._current]])b.push(this._consumeOperator(a));else if(void 0!==ea[a[this._current]])this._current++;else if("&"===a[this._current])c=this._current,this._current++,"&"===a[this._current]?(this._current++,b.push({type:O,value:"&&",start:c})):b.push({type:L,value:"&",start:c});else{if("|"!==a[this._current]){var i=new Error("Unknown character:"+a[this._current]);throw i.name="LexerError",i}c=this._current,this._current++,"|"===a[this._current]?(this._current++,b.push({type:N,value:"||",start:c})):b.push({type:M,value:"|",start:c})}return b},_consumeUnquotedIdentifier:function(a){var b=this._current;for(this._current++;this._current<a.length&&i(a[this._current]);)this._current++;return a.slice(b,this._current)},_consumeQuotedIdentifier:function(a){var b=this._current;this._current++;for(var c=a.length;'"'!==a[this._current]&&this._current<c;){var d=this._current;"\\"!==a[d]||"\\"!==a[d+1]&&'"'!==a[d+1]?d++:d+=2,this._current=d}return this._current++,JSON.parse(a.slice(b,this._current))},_consumeRawStringLiteral:function(a){var b=this._current;this._current++;for(var c=a.length;"'"!==a[this._current]&&this._current<c;){var d=this._current;"\\"!==a[d]||"\\"!==a[d+1]&&"'"!==a[d+1]?d++:d+=2,this._current=d}this._current++;var e=a.slice(b+1,this._current-1);return e.replace("\\'","'")},_consumeNumber:function(a){var b=this._current;this._current++;for(var c=a.length;h(a[this._current])&&this._current<c;)this._current++;var d=parseInt(a.slice(b,this._current));return{type:J,value:d,start:b}},_consumeLBracket:function(a){var b=this._current;return this._current++,"?"===a[this._current]?(this._current++,{type:X,value:"[?",start:b}):"]"===a[this._current]?(this._current++,{type:V,value:"[]",start:b}):{type:_,value:"[",start:b}},_consumeOperator:function(a){var b=this._current,c=a[b];return this._current++,"!"===c?"="===a[this._current]?(this._current++,{type:U,value:"!=",start:b}):{type:Z,value:"!",start:b}:"<"===c?"="===a[this._current]?(this._current++,{type:T,value:"<=",start:b}):{type:R,value:"<",start:b}:">"===c?"="===a[this._current]?(this._current++,{type:S,value:">=",start:b}):{type:Q,value:">",start:b}:"="===c&&"="===a[this._current]?(this._current++,{type:P,value:"==",start:b}):void 0},_consumeLiteral:function(a){this._current++;for(var b,c=this._current,d=a.length;"`"!==a[this._current]&&this._current<d;){var e=this._current;"\\"!==a[e]||"\\"!==a[e+1]&&"`"!==a[e+1]?e++:e+=2,this._current=e}var f=q(a.slice(c,this._current));return f=f.replace("\\`","`"),b=this._looksLikeJSON(f)?JSON.parse(f):JSON.parse('"'+f+'"'),this._current++,b},_looksLikeJSON:function(a){var b='[{"',c=["true","false","null"],d="-0123456789";if(""===a)return!1;if(b.indexOf(a[0])>=0)return!0;if(c.indexOf(a)>=0)return!0;if(!(d.indexOf(a[0])>=0))return!1;try{return JSON.parse(a),!0}catch(a){return!1}}};var fa={};fa[B]=0,fa[C]=0,fa[D]=0,fa[E]=0,fa[F]=0,fa[G]=0,fa[I]=0,fa[J]=0,fa[K]=0,fa[L]=0,fa[M]=1,fa[N]=2,fa[O]=3,fa[P]=5,fa[Q]=5,fa[R]=5,fa[S]=5,fa[T]=5,fa[U]=5,fa[V]=9,fa[W]=20,fa[X]=21,fa[Y]=40,fa[Z]=45,fa[$]=50,fa[_]=55,fa[aa]=60,k.prototype={parse:function(a){this._loadTokens(a),this.index=0;var b=this.expression(0);if(this._lookahead(0)!==B){var c=this._lookaheadToken(0),d=new Error("Unexpected token type: "+c.type+", value: "+c.value);throw d.name="ParserError",d}return b},_loadTokens:function(a){var b=new j,c=b.tokenize(a);c.push({type:B,value:"",start:a.length}),this.tokens=c},expression:function(a){var b=this._lookaheadToken(0);this._advance();for(var c=this.nud(b),d=this._lookahead(0);a<fa[d];)this._advance(),c=this.led(d,c),d=this._lookahead(0);return c},_lookahead:function(a){return this.tokens[this.index+a].type},_lookaheadToken:function(a){return this.tokens[this.index+a]},_advance:function(){this.index++},nud:function(a){var b,c,d;switch(a.type){case ba:return{type:"Literal",value:a.value};case C:return{type:"Field",name:a.value};case D:var e={type:"Field",name:a.value};if(this._lookahead(0)===aa)throw new Error("Quoted identifier not allowed for function names.");return e;case Z:return c=this.expression(fa.Not),{type:"NotExpression",children:[c]};case W:return b={type:"Identity"},c=null,c=this._lookahead(0)===E?{type:"Identity"}:this._parseProjectionRHS(fa.Star),{type:"ValueProjection",children:[b,c]};case X:return this.led(a.type,{type:"Identity"});case $:return this._parseMultiselectHash();case V:return b={type:V,children:[{type:"Identity"}]},c=this._parseProjectionRHS(fa.Flatten),{type:"Projection",children:[b,c]};case _:return this._lookahead(0)===J||this._lookahead(0)===H?(c=this._parseIndexExpression(),this._projectIfSlice({type:"Identity"},c)):this._lookahead(0)===W&&this._lookahead(1)===E?(this._advance(),this._advance(),c=this._parseProjectionRHS(fa.Star),{type:"Projection",children:[{type:"Identity"},c]}):this._parseMultiselectList();case K:return{type:K};case L:return d=this.expression(fa.Expref),{type:"ExpressionReference",children:[d]};case aa:for(var f=[];this._lookahead(0)!==F;)this._lookahead(0)===K?(d={type:K},this._advance()):d=this.expression(0),f.push(d);return this._match(F),f[0];default:this._errorToken(a)}},led:function(a,b){var c;switch(a){case Y:var d=fa.Dot;return this._lookahead(0)!==W?(c=this._parseDotRHS(d),{type:"Subexpression",children:[b,c]}):(this._advance(),c=this._parseProjectionRHS(d),{type:"ValueProjection",children:[b,c]});case M:return c=this.expression(fa.Pipe),{type:M,children:[b,c]};case N:return c=this.expression(fa.Or),{type:"OrExpression",children:[b,c]};case O:return c=this.expression(fa.And),{type:"AndExpression",children:[b,c]};case aa:for(var e,f,g=b.name,h=[];this._lookahead(0)!==F;)this._lookahead(0)===K?(e={type:K},this._advance()):e=this.expression(0),this._lookahead(0)===G&&this._match(G),h.push(e);return this._match(F),f={type:"Function",name:g,children:h};case X:var i=this.expression(0);return this._match(E),c=this._lookahead(0)===V?{type:"Identity"}:this._parseProjectionRHS(fa.Filter),{type:"FilterProjection",children:[b,c,i]};case V:var j={type:V,children:[b]},k=this._parseProjectionRHS(fa.Flatten);return{type:"Projection",children:[j,k]};case P:case U:case Q:case S:case R:case T:return this._parseComparator(b,a);case _:var l=this._lookaheadToken(0);
return l.type===J||l.type===H?(c=this._parseIndexExpression(),this._projectIfSlice(b,c)):(this._match(W),this._match(E),c=this._parseProjectionRHS(fa.Star),{type:"Projection",children:[b,c]});default:this._errorToken(this._lookaheadToken(0))}},_match:function(a){if(this._lookahead(0)!==a){var b=this._lookaheadToken(0),c=new Error("Expected "+a+", got: "+b.type);throw c.name="ParserError",c}this._advance()},_errorToken:function(a){var b=new Error("Invalid token ("+a.type+'): "'+a.value+'"');throw b.name="ParserError",b},_parseIndexExpression:function(){if(this._lookahead(0)===H||this._lookahead(1)===H)return this._parseSliceExpression();var a={type:"Index",value:this._lookaheadToken(0).value};return this._advance(),this._match(E),a},_projectIfSlice:function(a,b){var c={type:"IndexExpression",children:[a,b]};return"Slice"===b.type?{type:"Projection",children:[c,this._parseProjectionRHS(fa.Star)]}:c},_parseSliceExpression:function(){for(var a=[null,null,null],b=0,c=this._lookahead(0);c!==E&&b<3;){if(c===H)b++,this._advance();else{if(c!==J){var d=this._lookahead(0),e=new Error("Syntax error, unexpected token: "+d.value+"("+d.type+")");throw e.name="Parsererror",e}a[b]=this._lookaheadToken(0).value,this._advance()}c=this._lookahead(0)}return this._match(E),{type:"Slice",children:a}},_parseComparator:function(a,b){var c=this.expression(fa[b]);return{type:"Comparator",name:b,children:[a,c]}},_parseDotRHS:function(a){var b=this._lookahead(0),c=[C,D,W];return c.indexOf(b)>=0?this.expression(a):b===_?(this._match(_),this._parseMultiselectList()):b===$?(this._match($),this._parseMultiselectHash()):void 0},_parseProjectionRHS:function(a){var b;if(fa[this._lookahead(0)]<10)b={type:"Identity"};else if(this._lookahead(0)===_)b=this.expression(a);else if(this._lookahead(0)===X)b=this.expression(a);else{if(this._lookahead(0)!==Y){var c=this._lookaheadToken(0),d=new Error("Sytanx error, unexpected token: "+c.value+"("+c.type+")");throw d.name="ParserError",d}this._match(Y),b=this._parseDotRHS(a)}return b},_parseMultiselectList:function(){for(var a=[];this._lookahead(0)!==E;){var b=this.expression(0);if(a.push(b),this._lookahead(0)===G&&(this._match(G),this._lookahead(0)===E))throw new Error("Unexpected token Rbracket")}return this._match(E),{type:"MultiSelectList",children:a}},_parseMultiselectHash:function(){for(var a,b,c,d,e=[],f=[C,D];;){if(a=this._lookaheadToken(0),f.indexOf(a.type)<0)throw new Error("Expecting an identifier token, got: "+a.type);if(b=a.value,this._advance(),this._match(H),c=this.expression(0),d={type:"KeyValuePair",name:b,value:c},e.push(d),this._lookahead(0)===G)this._match(G);else if(this._lookahead(0)===I){this._match(I);break}}return{type:"MultiSelectHash",children:e}}},l.prototype={search:function(a,b){return this.visit(a,b)},visit:function(a,g){var h,i,j,k,l,m,n,o,p,q;switch(a.type){case"Field":return null===g?null:c(g)?(m=g[a.name],void 0===m?null:m):null;case"Subexpression":for(j=this.visit(a.children[0],g),q=1;q<a.children.length;q++)if(j=this.visit(a.children[1],j),null===j)return null;return j;case"IndexExpression":return n=this.visit(a.children[0],g),o=this.visit(a.children[1],n);case"Index":if(!b(g))return null;var r=a.value;return r<0&&(r=g.length+r),j=g[r],void 0===j&&(j=null),j;case"Slice":if(!b(g))return null;var s=a.children.slice(0),t=this.computeSliceParams(g.length,s),u=t[0],v=t[1],w=t[2];if(j=[],w>0)for(q=u;q<v;q+=w)j.push(g[q]);else for(q=u;q>v;q+=w)j.push(g[q]);return j;case"Projection":var x=this.visit(a.children[0],g);if(!b(x))return null;for(p=[],q=0;q<x.length;q++)i=this.visit(a.children[1],x[q]),null!==i&&p.push(i);return p;case"ValueProjection":if(x=this.visit(a.children[0],g),!c(x))return null;p=[];var y=f(x);for(q=0;q<y.length;q++)i=this.visit(a.children[1],y[q]),null!==i&&p.push(i);return p;case"FilterProjection":if(x=this.visit(a.children[0],g),!b(x))return null;var z=[],A=[];for(q=0;q<x.length;q++)h=this.visit(a.children[2],x[q]),e(h)||z.push(x[q]);for(var B=0;B<z.length;B++)i=this.visit(a.children[1],z[B]),null!==i&&A.push(i);return A;case"Comparator":switch(k=this.visit(a.children[0],g),l=this.visit(a.children[1],g),a.name){case P:j=d(k,l);break;case U:j=!d(k,l);break;case Q:j=k>l;break;case S:j=k>=l;break;case R:j=k<l;break;case T:j=k<=l;break;default:throw new Error("Unknown comparator: "+a.name)}return j;case V:var C=this.visit(a.children[0],g);if(!b(C))return null;var D=[];for(q=0;q<C.length;q++)i=C[q],b(i)?D.push.apply(D,i):D.push(i);return D;case"Identity":return g;case"MultiSelectList":if(null===g)return null;for(p=[],q=0;q<a.children.length;q++)p.push(this.visit(a.children[q],g));return p;case"MultiSelectHash":if(null===g)return null;p={};var E;for(q=0;q<a.children.length;q++)E=a.children[q],p[E.name]=this.visit(E.value,g);return p;case"OrExpression":return h=this.visit(a.children[0],g),e(h)&&(h=this.visit(a.children[1],g)),h;case"AndExpression":return k=this.visit(a.children[0],g),e(k)===!0?k:this.visit(a.children[1],g);case"NotExpression":return k=this.visit(a.children[0],g),e(k);case"Literal":return a.value;case M:return n=this.visit(a.children[0],g),this.visit(a.children[1],n);case K:return g;case"Function":var F=[];for(q=0;q<a.children.length;q++)F.push(this.visit(a.children[q],g));return this.runtime.callFunction(a.name,F);case"ExpressionReference":var G=a.children[0];return G.jmespathType=L,G;default:throw new Error("Unknown node type: "+a.type)}},computeSliceParams:function(a,b){var c=b[0],d=b[1],e=b[2],f=[null,null,null];if(null===e)e=1;else if(0===e){var g=new Error("Invalid slice, step cannot be 0");throw g.name="RuntimeError",g}var h=e<0;return c=null===c?h?a-1:0:this.capSliceRange(a,c,e),d=null===d?h?-1:a:this.capSliceRange(a,d,e),f[0]=c,f[1]=d,f[2]=e,f},capSliceRange:function(a,b,c){return b<0?(b+=a,b<0&&(b=c<0?-1:0)):b>=a&&(b=c<0?a-1:a),b}},m.prototype={callFunction:function(a,b){var c=this.functionTable[a];if(void 0===c)throw new Error("Unknown function: "+a+"()");return this._validateArgs(a,b,c._signature),c._func.call(this,b)},_validateArgs:function(a,b,c){var d;if(c[c.length-1].variadic){if(b.length<c.length)throw d=1===c.length?" argument":" arguments",new Error("ArgumentError: "+a+"() takes at least"+c.length+d+" but received "+b.length)}else if(b.length!==c.length)throw d=1===c.length?" argument":" arguments",new Error("ArgumentError: "+a+"() takes "+c.length+d+" but received "+b.length);for(var e,f,g,h=0;h<c.length;h++){g=!1,e=c[h].types,f=this._getTypeName(b[h]);for(var i=0;i<e.length;i++)if(this._typeMatches(f,e[i],b[h])){g=!0;break}if(!g)throw new Error("TypeError: "+a+"() expected argument "+(h+1)+" to be type "+e+" but received type "+f+" instead.")}},_typeMatches:function(a,b,c){if(b===s)return!0;if(b!==A&&b!==z&&b!==u)return a===b;if(b===u)return a===u;if(a===u){var d;b===z?d=r:b===A&&(d=t);for(var e=0;e<c.length;e++)if(!this._typeMatches(this._getTypeName(c[e]),d,c[e]))return!1;return!0}},_getTypeName:function(a){switch(Object.prototype.toString.call(a)){case"[object String]":return t;case"[object Number]":return r;case"[object Array]":return u;case"[object Boolean]":return w;case"[object Null]":return y;case"[object Object]":return a.jmespathType===L?x:v}},_functionStartsWith:function(a){return 0===a[0].lastIndexOf(a[1])},_functionEndsWith:function(a){var b=a[0],c=a[1];return b.indexOf(c,b.length-c.length)!==-1},_functionReverse:function(a){var b=this._getTypeName(a[0]);if(b===t){for(var c=a[0],d="",e=c.length-1;e>=0;e--)d+=c[e];return d}var f=a[0].slice(0);return f.reverse(),f},_functionAbs:function(a){return Math.abs(a[0])},_functionCeil:function(a){return Math.ceil(a[0])},_functionAvg:function(a){for(var b=0,c=a[0],d=0;d<c.length;d++)b+=c[d];return b/c.length},_functionContains:function(a){return a[0].indexOf(a[1])>=0},_functionFloor:function(a){return Math.floor(a[0])},_functionLength:function(a){return c(a[0])?Object.keys(a[0]).length:a[0].length},_functionMap:function(a){for(var b=[],c=this._interpreter,d=a[0],e=a[1],f=0;f<e.length;f++)b.push(c.visit(d,e[f]));return b},_functionMerge:function(a){for(var b={},c=0;c<a.length;c++){var d=a[c];for(var e in d)b[e]=d[e]}return b},_functionMax:function(a){if(a[0].length>0){var b=this._getTypeName(a[0][0]);if(b===r)return Math.max.apply(Math,a[0]);for(var c=a[0],d=c[0],e=1;e<c.length;e++)d.localeCompare(c[e])<0&&(d=c[e]);return d}return null},_functionMin:function(a){if(a[0].length>0){var b=this._getTypeName(a[0][0]);if(b===r)return Math.min.apply(Math,a[0]);for(var c=a[0],d=c[0],e=1;e<c.length;e++)c[e].localeCompare(d)<0&&(d=c[e]);return d}return null},_functionSum:function(a){for(var b=0,c=a[0],d=0;d<c.length;d++)b+=c[d];return b},_functionType:function(a){switch(this._getTypeName(a[0])){case r:return"number";case t:return"string";case u:return"array";case v:return"object";case w:return"boolean";case x:return"expref";case y:return"null"}},_functionKeys:function(a){return Object.keys(a[0])},_functionValues:function(a){for(var b=a[0],c=Object.keys(b),d=[],e=0;e<c.length;e++)d.push(b[c[e]]);return d},_functionJoin:function(a){var b=a[0],c=a[1];return c.join(b)},_functionToArray:function(a){return this._getTypeName(a[0])===u?a[0]:[a[0]]},_functionToString:function(a){return this._getTypeName(a[0])===t?a[0]:JSON.stringify(a[0])},_functionToNumber:function(a){var b,c=this._getTypeName(a[0]);return c===r?a[0]:c!==t||(b=+a[0],isNaN(b))?null:b},_functionNotNull:function(a){for(var b=0;b<a.length;b++)if(this._getTypeName(a[b])!==y)return a[b];return null},_functionSort:function(a){var b=a[0].slice(0);return b.sort(),b},_functionSortBy:function(a){var b=a[0].slice(0);if(0===b.length)return b;var c=this._interpreter,d=a[1],e=this._getTypeName(c.visit(d,b[0]));if([r,t].indexOf(e)<0)throw new Error("TypeError");for(var f=this,g=[],h=0;h<b.length;h++)g.push([h,b[h]]);g.sort(function(a,b){var g=c.visit(d,a[1]),h=c.visit(d,b[1]);if(f._getTypeName(g)!==e)throw new Error("TypeError: expected "+e+", received "+f._getTypeName(g));if(f._getTypeName(h)!==e)throw new Error("TypeError: expected "+e+", received "+f._getTypeName(h));return g>h?1:g<h?-1:a[0]-b[0]});for(var i=0;i<g.length;i++)b[i]=g[i][1];return b},_functionMaxBy:function(a){for(var b,c,d=a[1],e=a[0],f=this.createKeyFunction(d,[r,t]),g=-(1/0),h=0;h<e.length;h++)c=f(e[h]),c>g&&(g=c,b=e[h]);return b},_functionMinBy:function(a){for(var b,c,d=a[1],e=a[0],f=this.createKeyFunction(d,[r,t]),g=1/0,h=0;h<e.length;h++)c=f(e[h]),c<g&&(g=c,b=e[h]);return b},createKeyFunction:function(a,b){var c=this,d=this._interpreter,e=function(e){var f=d.visit(a,e);if(b.indexOf(c._getTypeName(f))<0){var g="TypeError: expected one of "+b+", received "+c._getTypeName(f);throw new Error(g)}return f};return e}},a.tokenize=o,a.compile=n,a.search=p,a.strictDeepEqual=d}("undefined"==typeof c?this.jmespath={}:c)},{}],80:[function(a,b,c){"use strict";function d(a,b){return Object.prototype.hasOwnProperty.call(a,b)}b.exports=function(a,b,c,e){b=b||"&",c=c||"=";var f={};if("string"!=typeof a||0===a.length)return f;var g=/\+/g;a=a.split(b);var h=1e3;e&&"number"==typeof e.maxKeys&&(h=e.maxKeys);var i=a.length;h>0&&i>h&&(i=h);for(var j=0;j<i;++j){var k,l,m,n,o=a[j].replace(g,"%20"),p=o.indexOf(c);p>=0?(k=o.substr(0,p),l=o.substr(p+1)):(k=o,l=""),m=decodeURIComponent(k),n=decodeURIComponent(l),d(f,m)?Array.isArray(f[m])?f[m].push(n):f[m]=[f[m],n]:f[m]=n}return f}},{}],81:[function(a,b,c){"use strict";var d=function(a){switch(typeof a){case"string":return a;case"boolean":return a?"true":"false";case"number":return isFinite(a)?a:"";default:return""}};b.exports=function(a,b,c,e){return b=b||"&",c=c||"=",null===a&&(a=void 0),"object"==typeof a?Object.keys(a).map(function(e){var f=encodeURIComponent(d(e))+c;return Array.isArray(a[e])?a[e].map(function(a){return f+encodeURIComponent(d(a))}).join(b):f+encodeURIComponent(d(a[e]))}).join(b):e?encodeURIComponent(d(e))+c+encodeURIComponent(d(a)):""}},{}],82:[function(a,b,c){arguments[4][66][0].apply(c,arguments)},{"./decode":80,"./encode":81}],83:[function(a,b,c){function d(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function e(a,b,c){if(a&&j(a)&&a instanceof d)return a;var e=new d;return e.parse(a,b,c),e}function f(a){return i(a)&&(a=e(a)),a instanceof d?a.format():d.prototype.format.call(a)}function g(a,b){return e(a,!1,!0).resolve(b)}function h(a,b){return a?e(a,!1,!0).resolveObject(b):b}function i(a){return"string"==typeof a}function j(a){return"object"==typeof a&&null!==a}function k(a){return null===a}function l(a){return null==a}var m=a("punycode");c.parse=e,c.resolve=g,c.resolveObject=h,c.format=f,c.Url=d;var n=/^([a-z0-9.+-]+:)/i,o=/:[0-9]*$/,p=["<",">",'"',"`"," ","\r","\n","\t"],q=["{","}","|","\\","^","`"].concat(p),r=["'"].concat(q),s=["%","/","?",";","#"].concat(r),t=["/","?","#"],u=255,v=/^[a-z0-9A-Z_-]{0,63}$/,w=/^([a-z0-9A-Z_-]{0,63})(.*)$/,x={javascript:!0,"javascript:":!0},y={javascript:!0,"javascript:":!0},z={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},A=a("querystring");d.prototype.parse=function(a,b,c){if(!i(a))throw new TypeError("Parameter 'url' must be a string, not "+typeof a);var d=a;d=d.trim();var e=n.exec(d);if(e){e=e[0];var f=e.toLowerCase();this.protocol=f,d=d.substr(e.length)}if(c||e||d.match(/^\/\/[^@\/]+@[^@\/]+/)){var g="//"===d.substr(0,2);!g||e&&y[e]||(d=d.substr(2),this.slashes=!0)}if(!y[e]&&(g||e&&!z[e])){for(var h=-1,j=0;j<t.length;j++){var k=d.indexOf(t[j]);k!==-1&&(h===-1||k<h)&&(h=k)}var l,o;o=h===-1?d.lastIndexOf("@"):d.lastIndexOf("@",h),o!==-1&&(l=d.slice(0,o),d=d.slice(o+1),this.auth=decodeURIComponent(l)),h=-1;for(var j=0;j<s.length;j++){var k=d.indexOf(s[j]);k!==-1&&(h===-1||k<h)&&(h=k)}h===-1&&(h=d.length),this.host=d.slice(0,h),d=d.slice(h),this.parseHost(),this.hostname=this.hostname||"";var p="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!p)for(var q=this.hostname.split(/\./),j=0,B=q.length;j<B;j++){var C=q[j];if(C&&!C.match(v)){for(var D="",E=0,F=C.length;E<F;E++)D+=C.charCodeAt(E)>127?"x":C[E];if(!D.match(v)){var G=q.slice(0,j),H=q.slice(j+1),I=C.match(w);I&&(G.push(I[1]),H.unshift(I[2])),H.length&&(d="/"+H.join(".")+d),this.hostname=G.join(".");break}}}if(this.hostname.length>u?this.hostname="":this.hostname=this.hostname.toLowerCase(),!p){for(var J=this.hostname.split("."),K=[],j=0;j<J.length;++j){var L=J[j];K.push(L.match(/[^A-Za-z0-9_-]/)?"xn--"+m.encode(L):L)}this.hostname=K.join(".")}var M=this.port?":"+this.port:"",N=this.hostname||"";this.host=N+M,this.href+=this.host,p&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==d[0]&&(d="/"+d))}if(!x[f])for(var j=0,B=r.length;j<B;j++){var O=r[j],P=encodeURIComponent(O);P===O&&(P=escape(O)),d=d.split(O).join(P)}var Q=d.indexOf("#");Q!==-1&&(this.hash=d.substr(Q),d=d.slice(0,Q));var R=d.indexOf("?");if(R!==-1?(this.search=d.substr(R),this.query=d.substr(R+1),b&&(this.query=A.parse(this.query)),d=d.slice(0,R)):b&&(this.search="",this.query={}),d&&(this.pathname=d),z[f]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var M=this.pathname||"",L=this.search||"";this.path=M+L}return this.href=this.format(),this},d.prototype.format=function(){var a=this.auth||"";a&&(a=encodeURIComponent(a),a=a.replace(/%3A/i,":"),a+="@");var b=this.protocol||"",c=this.pathname||"",d=this.hash||"",e=!1,f="";this.host?e=a+this.host:this.hostname&&(e=a+(this.hostname.indexOf(":")===-1?this.hostname:"["+this.hostname+"]"),this.port&&(e+=":"+this.port)),this.query&&j(this.query)&&Object.keys(this.query).length&&(f=A.stringify(this.query));var g=this.search||f&&"?"+f||"";return b&&":"!==b.substr(-1)&&(b+=":"),this.slashes||(!b||z[b])&&e!==!1?(e="//"+(e||""),c&&"/"!==c.charAt(0)&&(c="/"+c)):e||(e=""),d&&"#"!==d.charAt(0)&&(d="#"+d),g&&"?"!==g.charAt(0)&&(g="?"+g),c=c.replace(/[?#]/g,function(a){return encodeURIComponent(a)}),g=g.replace("#","%23"),b+e+c+g+d},d.prototype.resolve=function(a){return this.resolveObject(e(a,!1,!0)).format()},d.prototype.resolveObject=function(a){if(i(a)){var b=new d;b.parse(a,!1,!0),a=b}var c=new d;if(Object.keys(this).forEach(function(a){c[a]=this[a]},this),c.hash=a.hash,""===a.href)return c.href=c.format(),c;if(a.slashes&&!a.protocol)return Object.keys(a).forEach(function(b){"protocol"!==b&&(c[b]=a[b])}),z[c.protocol]&&c.hostname&&!c.pathname&&(c.path=c.pathname="/"),c.href=c.format(),c;if(a.protocol&&a.protocol!==c.protocol){if(!z[a.protocol])return Object.keys(a).forEach(function(b){c[b]=a[b]}),c.href=c.format(),c;if(c.protocol=a.protocol,a.host||y[a.protocol])c.pathname=a.pathname;else{for(var e=(a.pathname||"").split("/");e.length&&!(a.host=e.shift()););a.host||(a.host=""),a.hostname||(a.hostname=""),""!==e[0]&&e.unshift(""),e.length<2&&e.unshift(""),c.pathname=e.join("/")}if(c.search=a.search,c.query=a.query,c.host=a.host||"",c.auth=a.auth,c.hostname=a.hostname||a.host,c.port=a.port,c.pathname||c.search){var f=c.pathname||"",g=c.search||"";c.path=f+g}return c.slashes=c.slashes||a.slashes,c.href=c.format(),c}var h=c.pathname&&"/"===c.pathname.charAt(0),j=a.host||a.pathname&&"/"===a.pathname.charAt(0),m=j||h||c.host&&a.pathname,n=m,o=c.pathname&&c.pathname.split("/")||[],e=a.pathname&&a.pathname.split("/")||[],p=c.protocol&&!z[c.protocol];if(p&&(c.hostname="",c.port=null,c.host&&(""===o[0]?o[0]=c.host:o.unshift(c.host)),c.host="",a.protocol&&(a.hostname=null,a.port=null,a.host&&(""===e[0]?e[0]=a.host:e.unshift(a.host)),a.host=null),m=m&&(""===e[0]||""===o[0])),j)c.host=a.host||""===a.host?a.host:c.host,c.hostname=a.hostname||""===a.hostname?a.hostname:c.hostname,c.search=a.search,c.query=a.query,o=e;else if(e.length)o||(o=[]),o.pop(),o=o.concat(e),c.search=a.search,c.query=a.query;else if(!l(a.search)){if(p){c.hostname=c.host=o.shift();var q=!!(c.host&&c.host.indexOf("@")>0)&&c.host.split("@");q&&(c.auth=q.shift(),c.host=c.hostname=q.shift())}return c.search=a.search,c.query=a.query,k(c.pathname)&&k(c.search)||(c.path=(c.pathname?c.pathname:"")+(c.search?c.search:"")),c.href=c.format(),c}if(!o.length)return c.pathname=null,c.search?c.path="/"+c.search:c.path=null,c.href=c.format(),c;for(var r=o.slice(-1)[0],s=(c.host||a.host)&&("."===r||".."===r)||""===r,t=0,u=o.length;u>=0;u--)r=o[u],"."==r?o.splice(u,1):".."===r?(o.splice(u,1),t++):t&&(o.splice(u,1),t--);if(!m&&!n)for(;t--;t)o.unshift("..");!m||""===o[0]||o[0]&&"/"===o[0].charAt(0)||o.unshift(""),s&&"/"!==o.join("/").substr(-1)&&o.push("");var v=""===o[0]||o[0]&&"/"===o[0].charAt(0);if(p){c.hostname=c.host=v?"":o.length?o.shift():"";var q=!!(c.host&&c.host.indexOf("@")>0)&&c.host.split("@");q&&(c.auth=q.shift(),c.host=c.hostname=q.shift())}return m=m||c.host&&o.length,m&&!v&&o.unshift(""),o.length?c.pathname=o.join("/"):(c.pathname=null,c.path=null),k(c.pathname)&&k(c.search)||(c.path=(c.pathname?c.pathname:"")+(c.search?c.search:"")),c.auth=a.auth||c.auth,c.slashes=c.slashes||a.slashes,c.href=c.format(),c},d.prototype.parseHost=function(){var a=this.host,b=o.exec(a);b&&(b=b[0],":"!==b&&(this.port=b.substr(1)),a=a.substr(0,a.length-b.length)),a&&(this.hostname=a)}},{punycode:63,querystring:66}],84:[function(a,b,c){(function(){var c,d;d=a("lodash/object/create"),b.exports=c=function(){function a(a,b,c){if(this.stringify=a.stringify,null==b)throw new Error("Missing attribute name of element "+a.name);if(null==c)throw new Error("Missing attribute value for attribute "+b+" of element "+a.name);this.name=this.stringify.attName(b),this.value=this.stringify.attValue(c)}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){return" "+this.name+'="'+this.value+'"'},a}()}).call(this)},{"lodash/object/create":143}],85:[function(a,b,c){(function(){var c,d,e,f,g;g=a("./XMLStringifier"),d=a("./XMLDeclaration"),e=a("./XMLDocType"),f=a("./XMLElement"),b.exports=c=function(){function a(a,b){var c,d;if(null==a)throw new Error("Root element needs a name");null==b&&(b={}),this.options=b,this.stringify=new g(b),d=new f(this,"doc"),c=d.element(a),c.isRoot=!0,c.documentObject=this,this.rootObject=c,b.headless||(c.declaration(b),null==b.pubID&&null==b.sysID||c.doctype(b))}return a.prototype.root=function(){return this.rootObject},a.prototype.end=function(a){return this.toString(a)},a.prototype.toString=function(a){var b,c,d,e,f,g,h,i;return e=(null!=a?a.pretty:void 0)||!1,b=null!=(g=null!=a?a.indent:void 0)?g:"  ",d=null!=(h=null!=a?a.offset:void 0)?h:0,c=null!=(i=null!=a?a.newline:void 0)?i:"\n",f="",null!=this.xmldec&&(f+=this.xmldec.toString(a)),null!=this.doctype&&(f+=this.doctype.toString(a)),f+=this.rootObject.toString(a),e&&f.slice(-c.length)===c&&(f=f.slice(0,-c.length)),f},a}()}).call(this)},{"./XMLDeclaration":92,"./XMLDocType":93,"./XMLElement":94,"./XMLStringifier":98}],86:[function(a,b,c){(function(){var c,d,e,f=function(a,b){function c(){this.constructor=a}for(var d in b)g.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},g={}.hasOwnProperty;e=a("lodash/object/create"),d=a("./XMLNode"),b.exports=c=function(a){function b(a,c){if(b.__super__.constructor.call(this,a),null==c)throw new Error("Missing CDATA text");this.text=this.stringify.cdata(c)}return f(b,a),b.prototype.clone=function(){return e(b.prototype,this)},b.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<![CDATA["+this.text+"]]>",f&&(g+=d),g},b}(d)}).call(this)},{"./XMLNode":95,"lodash/object/create":143}],87:[function(a,b,c){(function(){var c,d,e,f=function(a,b){function c(){this.constructor=a}for(var d in b)g.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},g={}.hasOwnProperty;e=a("lodash/object/create"),d=a("./XMLNode"),b.exports=c=function(a){function b(a,c){if(b.__super__.constructor.call(this,a),null==c)throw new Error("Missing comment text");this.text=this.stringify.comment(c)}return f(b,a),b.prototype.clone=function(){return e(b.prototype,this)},b.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<!-- "+this.text+" -->",f&&(g+=d),g},b}(d)}).call(this)},{"./XMLNode":95,"lodash/object/create":143}],88:[function(a,b,c){(function(){var c,d;d=a("lodash/object/create"),b.exports=c=function(){function a(a,b,c,d,e,f){if(this.stringify=a.stringify,null==b)throw new Error("Missing DTD element name");if(null==c)throw new Error("Missing DTD attribute name");if(!d)throw new Error("Missing DTD attribute type");if(!e)throw new Error("Missing DTD attribute default");if(0!==e.indexOf("#")&&(e="#"+e),!e.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/))throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT");if(f&&!e.match(/^(#FIXED|#DEFAULT)$/))throw new Error("Default value only applies to #FIXED or #DEFAULT");this.elementName=this.stringify.eleName(b),this.attributeName=this.stringify.attName(c),this.attributeType=this.stringify.dtdAttType(d),this.defaultValue=this.stringify.dtdAttDefault(f),this.defaultValueType=e}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<!ATTLIST "+this.elementName+" "+this.attributeName+" "+this.attributeType,"#DEFAULT"!==this.defaultValueType&&(g+=" "+this.defaultValueType),this.defaultValue&&(g+=' "'+this.defaultValue+'"'),g+=">",f&&(g+=d),g},a}()}).call(this)},{"lodash/object/create":143}],89:[function(a,b,c){(function(){var c,d,e;d=a("lodash/object/create"),e=a("lodash/lang/isArray"),b.exports=c=function(){function a(a,b,c){if(this.stringify=a.stringify,null==b)throw new Error("Missing DTD element name");c||(c="(#PCDATA)"),e(c)&&(c="("+c.join(",")+")"),this.name=this.stringify.eleName(b),this.value=this.stringify.dtdElementValue(c)}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<!ELEMENT "+this.name+" "+this.value+">",f&&(g+=d),g},a}()}).call(this)},{"lodash/lang/isArray":135,"lodash/object/create":143}],90:[function(a,b,c){(function(){var c,d,e;d=a("lodash/object/create"),e=a("lodash/lang/isObject"),b.exports=c=function(){function a(a,b,c,d){if(this.stringify=a.stringify,null==c)throw new Error("Missing entity name");if(null==d)throw new Error("Missing entity value");if(this.pe=!!b,this.name=this.stringify.eleName(c),e(d)){if(!d.pubID&&!d.sysID)throw new Error("Public and/or system identifiers are required for an external entity");if(d.pubID&&!d.sysID)throw new Error("System identifier is required for a public external entity");if(null!=d.pubID&&(this.pubID=this.stringify.dtdPubID(d.pubID)),null!=d.sysID&&(this.sysID=this.stringify.dtdSysID(d.sysID)),null!=d.nData&&(this.nData=this.stringify.dtdNData(d.nData)),this.pe&&this.nData)throw new Error("Notation declaration is not allowed in a parameter entity")}else this.value=this.stringify.dtdEntityValue(d)}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<!ENTITY",this.pe&&(g+=" %"),g+=" "+this.name,this.value?g+=' "'+this.value+'"':(this.pubID&&this.sysID?g+=' PUBLIC "'+this.pubID+'" "'+this.sysID+'"':this.sysID&&(g+=' SYSTEM "'+this.sysID+'"'),this.nData&&(g+=" NDATA "+this.nData)),g+=">",f&&(g+=d),g},a}()}).call(this)},{"lodash/lang/isObject":139,"lodash/object/create":143}],91:[function(a,b,c){(function(){var c,d;d=a("lodash/object/create"),b.exports=c=function(){function a(a,b,c){if(this.stringify=a.stringify,null==b)throw new Error("Missing notation name");if(!c.pubID&&!c.sysID)throw new Error("Public or system identifiers are required for an external entity");this.name=this.stringify.eleName(b),null!=c.pubID&&(this.pubID=this.stringify.dtdPubID(c.pubID)),null!=c.sysID&&(this.sysID=this.stringify.dtdSysID(c.sysID))}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<!NOTATION "+this.name,this.pubID&&this.sysID?g+=' PUBLIC "'+this.pubID+'" "'+this.sysID+'"':this.pubID?g+=' PUBLIC "'+this.pubID+'"':this.sysID&&(g+=' SYSTEM "'+this.sysID+'"'),g+=">",f&&(g+=d),g},a}()}).call(this)},{"lodash/object/create":143}],92:[function(a,b,c){(function(){var c,d,e,f,g=function(a,b){function c(){this.constructor=a}for(var d in b)h.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},h={}.hasOwnProperty;e=a("lodash/object/create"),f=a("lodash/lang/isObject"),d=a("./XMLNode"),b.exports=c=function(a){function b(a,c,d,e){var g;b.__super__.constructor.call(this,a),f(c)&&(g=c,c=g.version,d=g.encoding,e=g.standalone),c||(c="1.0"),null!=c&&(this.version=this.stringify.xmlVersion(c)),null!=d&&(this.encoding=this.stringify.xmlEncoding(d)),null!=e&&(this.standalone=this.stringify.xmlStandalone(e))}return g(b,a),b.prototype.clone=function(){return e(b.prototype,this)},b.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<?xml",null!=this.version&&(g+=' version="'+this.version+'"'),null!=this.encoding&&(g+=' encoding="'+this.encoding+'"'),null!=this.standalone&&(g+=' standalone="'+this.standalone+'"'),g+="?>",f&&(g+=d),g},b}(d)}).call(this)},{"./XMLNode":95,"lodash/lang/isObject":139,"lodash/object/create":143}],93:[function(a,b,c){(function(){var c,d,e,f,g,h,i,j,k,l;k=a("lodash/object/create"),l=a("lodash/lang/isObject"),c=a("./XMLCData"),d=a("./XMLComment"),e=a("./XMLDTDAttList"),g=a("./XMLDTDEntity"),f=a("./XMLDTDElement"),h=a("./XMLDTDNotation"),j=a("./XMLProcessingInstruction"),b.exports=i=function(){function a(a,b,c){var d,e;this.documentObject=a,this.stringify=this.documentObject.stringify,this.children=[],l(b)&&(d=b,b=d.pubID,c=d.sysID),null==c&&(e=[b,c],c=e[0],b=e[1]),null!=b&&(this.pubID=this.stringify.dtdPubID(b)),null!=c&&(this.sysID=this.stringify.dtdSysID(c))}return a.prototype.clone=function(){return k(a.prototype,this)},a.prototype.element=function(a,b){var c;return c=new f(this,a,b),this.children.push(c),this},a.prototype.attList=function(a,b,c,d,f){var g;return g=new e(this,a,b,c,d,f),this.children.push(g),this},a.prototype.entity=function(a,b){var c;return c=new g(this,!1,a,b),this.children.push(c),this},a.prototype.pEntity=function(a,b){var c;return c=new g(this,!0,a,b),this.children.push(c),this},a.prototype.notation=function(a,b){var c;return c=new h(this,a,b),this.children.push(c),this},a.prototype.cdata=function(a){var b;return b=new c(this,a),this.children.push(b),this},a.prototype.comment=function(a){var b;return b=new d(this,a),this.children.push(b),this},a.prototype.instruction=function(a,b){var c;return c=new j(this,a,b),this.children.push(c),this},a.prototype.root=function(){return this.documentObject.root()},a.prototype.document=function(){return this.documentObject},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;if(i=(null!=a?a.pretty:void 0)||!1,e=null!=(k=null!=a?a.indent:void 0)?k:"  ",h=null!=(l=null!=a?a.offset:void 0)?l:0,g=null!=(m=null!=a?a.newline:void 0)?m:"\n",b||(b=0),o=new Array(b+h+1).join(e),j="",i&&(j+=o),j+="<!DOCTYPE "+this.root().name,this.pubID&&this.sysID?j+=' PUBLIC "'+this.pubID+'" "'+this.sysID+'"':this.sysID&&(j+=' SYSTEM "'+this.sysID+'"'),this.children.length>0){for(j+=" [",i&&(j+=g),n=this.children,d=0,f=n.length;d<f;d++)c=n[d],j+=c.toString(a,b+1);j+="]"}return j+=">",i&&(j+=g),j},a.prototype.ele=function(a,b){return this.element(a,b)},a.prototype.att=function(a,b,c,d,e){return this.attList(a,b,c,d,e)},a.prototype.ent=function(a,b){return this.entity(a,b)},a.prototype.pent=function(a,b){return this.pEntity(a,b)},a.prototype.not=function(a,b){return this.notation(a,b)},a.prototype.dat=function(a){return this.cdata(a)},a.prototype.com=function(a){return this.comment(a)},a.prototype.ins=function(a,b){return this.instruction(a,b)},a.prototype.up=function(){return this.root()},a.prototype.doc=function(){return this.document()},a}()}).call(this)},{"./XMLCData":86,"./XMLComment":87,"./XMLDTDAttList":88,"./XMLDTDElement":89,"./XMLDTDEntity":90,"./XMLDTDNotation":91,"./XMLProcessingInstruction":96,"lodash/lang/isObject":139,"lodash/object/create":143}],94:[function(a,b,c){(function(){var c,d,e,f,g,h,i,j,k,l=function(a,b){function c(){this.constructor=a}for(var d in b)m.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},m={}.hasOwnProperty;g=a("lodash/object/create"),k=a("lodash/lang/isObject"),i=a("lodash/lang/isArray"),j=a("lodash/lang/isFunction"),h=a("lodash/collection/every"),e=a("./XMLNode"),c=a("./XMLAttribute"),f=a("./XMLProcessingInstruction"),
b.exports=d=function(a){function b(a,c,d){if(b.__super__.constructor.call(this,a),null==c)throw new Error("Missing element name");this.name=this.stringify.eleName(c),this.children=[],this.instructions=[],this.attributes={},null!=d&&this.attribute(d)}return l(b,a),b.prototype.clone=function(){var a,c,d,e,f,h,i,j;d=g(b.prototype,this),d.isRoot&&(d.documentObject=null),d.attributes={},i=this.attributes;for(c in i)m.call(i,c)&&(a=i[c],d.attributes[c]=a.clone());for(d.instructions=[],j=this.instructions,e=0,f=j.length;e<f;e++)h=j[e],d.instructions.push(h.clone());return d.children=[],this.children.forEach(function(a){var b;return b=a.clone(),b.parent=d,d.children.push(b)}),d},b.prototype.attribute=function(a,b){var d,e;if(null!=a&&(a=a.valueOf()),k(a))for(d in a)m.call(a,d)&&(e=a[d],this.attribute(d,e));else j(b)&&(b=b.apply()),this.options.skipNullAttributes&&null==b||(this.attributes[a]=new c(this,a,b));return this},b.prototype.removeAttribute=function(a){var b,c,d;if(null==a)throw new Error("Missing attribute name");if(a=a.valueOf(),i(a))for(c=0,d=a.length;c<d;c++)b=a[c],delete this.attributes[b];else delete this.attributes[a];return this},b.prototype.instruction=function(a,b){var c,d,e,g,h;if(null!=a&&(a=a.valueOf()),null!=b&&(b=b.valueOf()),i(a))for(c=0,h=a.length;c<h;c++)d=a[c],this.instruction(d);else if(k(a))for(d in a)m.call(a,d)&&(e=a[d],this.instruction(d,e));else j(b)&&(b=b.apply()),g=new f(this,a,b),this.instructions.push(g);return this},b.prototype.toString=function(a,b){var c,d,e,f,g,i,j,k,l,n,o,p,q,r,s,t,u,v,w,x;for(p=(null!=a?a.pretty:void 0)||!1,f=null!=(r=null!=a?a.indent:void 0)?r:"  ",o=null!=(s=null!=a?a.offset:void 0)?s:0,n=null!=(t=null!=a?a.newline:void 0)?t:"\n",b||(b=0),x=new Array(b+o+1).join(f),q="",u=this.instructions,e=0,j=u.length;e<j;e++)g=u[e],q+=g.toString(a,b+1);p&&(q+=x),q+="<"+this.name,v=this.attributes;for(l in v)m.call(v,l)&&(c=v[l],q+=c.toString(a));if(0===this.children.length||h(this.children,function(a){return""===a.value}))q+="/>",p&&(q+=n);else if(p&&1===this.children.length&&null!=this.children[0].value)q+=">",q+=this.children[0].value,q+="</"+this.name+">",q+=n;else{for(q+=">",p&&(q+=n),w=this.children,i=0,k=w.length;i<k;i++)d=w[i],q+=d.toString(a,b+1);p&&(q+=x),q+="</"+this.name+">",p&&(q+=n)}return q},b.prototype.att=function(a,b){return this.attribute(a,b)},b.prototype.ins=function(a,b){return this.instruction(a,b)},b.prototype.a=function(a,b){return this.attribute(a,b)},b.prototype.i=function(a,b){return this.instruction(a,b)},b}(e)}).call(this)},{"./XMLAttribute":84,"./XMLNode":95,"./XMLProcessingInstruction":96,"lodash/collection/every":101,"lodash/lang/isArray":135,"lodash/lang/isFunction":137,"lodash/lang/isObject":139,"lodash/object/create":143}],95:[function(a,b,c){(function(){var c,d,e,f,g,h,i,j,k,l,m,n,o={}.hasOwnProperty;n=a("lodash/lang/isObject"),k=a("lodash/lang/isArray"),m=a("lodash/lang/isFunction"),l=a("lodash/lang/isEmpty"),g=null,c=null,d=null,e=null,f=null,i=null,j=null,b.exports=h=function(){function b(b){this.parent=b,this.options=this.parent.options,this.stringify=this.parent.stringify,null===g&&(g=a("./XMLElement"),c=a("./XMLCData"),d=a("./XMLComment"),e=a("./XMLDeclaration"),f=a("./XMLDocType"),i=a("./XMLRaw"),j=a("./XMLText"))}return b.prototype.clone=function(){throw new Error("Cannot clone generic XMLNode")},b.prototype.element=function(a,b,c){var d,e,f,g,h,i,j;if(g=null,null==b&&(b={}),b=b.valueOf(),n(b)||(i=[b,c],c=i[0],b=i[1]),null!=a&&(a=a.valueOf()),k(a))for(e=0,h=a.length;e<h;e++)d=a[e],g=this.element(d);else if(m(a))g=this.element(a.apply());else if(n(a))for(f in a)o.call(a,f)&&(j=a[f],m(j)&&(j=j.apply()),n(j)&&l(j)&&(j=null),!this.options.ignoreDecorators&&this.stringify.convertAttKey&&0===f.indexOf(this.stringify.convertAttKey)?g=this.attribute(f.substr(this.stringify.convertAttKey.length),j):!this.options.ignoreDecorators&&this.stringify.convertPIKey&&0===f.indexOf(this.stringify.convertPIKey)?g=this.instruction(f.substr(this.stringify.convertPIKey.length),j):n(j)?!this.options.ignoreDecorators&&this.stringify.convertListKey&&0===f.indexOf(this.stringify.convertListKey)&&k(j)?g=this.element(j):(g=this.element(f),g.element(j)):g=this.element(f,j));else g=!this.options.ignoreDecorators&&this.stringify.convertTextKey&&0===a.indexOf(this.stringify.convertTextKey)?this.text(c):!this.options.ignoreDecorators&&this.stringify.convertCDataKey&&0===a.indexOf(this.stringify.convertCDataKey)?this.cdata(c):!this.options.ignoreDecorators&&this.stringify.convertCommentKey&&0===a.indexOf(this.stringify.convertCommentKey)?this.comment(c):!this.options.ignoreDecorators&&this.stringify.convertRawKey&&0===a.indexOf(this.stringify.convertRawKey)?this.raw(c):this.node(a,b,c);if(null==g)throw new Error("Could not create any elements with: "+a);return g},b.prototype.insertBefore=function(a,b,c){var d,e,f;if(this.isRoot)throw new Error("Cannot insert elements at root level");return e=this.parent.children.indexOf(this),f=this.parent.children.splice(e),d=this.parent.element(a,b,c),Array.prototype.push.apply(this.parent.children,f),d},b.prototype.insertAfter=function(a,b,c){var d,e,f;if(this.isRoot)throw new Error("Cannot insert elements at root level");return e=this.parent.children.indexOf(this),f=this.parent.children.splice(e+1),d=this.parent.element(a,b,c),Array.prototype.push.apply(this.parent.children,f),d},b.prototype.remove=function(){var a,b;if(this.isRoot)throw new Error("Cannot remove the root element");return a=this.parent.children.indexOf(this),[].splice.apply(this.parent.children,[a,a-a+1].concat(b=[])),b,this.parent},b.prototype.node=function(a,b,c){var d,e;return null!=a&&(a=a.valueOf()),null==b&&(b={}),b=b.valueOf(),n(b)||(e=[b,c],c=e[0],b=e[1]),d=new g(this,a,b),null!=c&&d.text(c),this.children.push(d),d},b.prototype.text=function(a){var b;return b=new j(this,a),this.children.push(b),this},b.prototype.cdata=function(a){var b;return b=new c(this,a),this.children.push(b),this},b.prototype.comment=function(a){var b;return b=new d(this,a),this.children.push(b),this},b.prototype.raw=function(a){var b;return b=new i(this,a),this.children.push(b),this},b.prototype.declaration=function(a,b,c){var d,f;return d=this.document(),f=new e(d,a,b,c),d.xmldec=f,d.root()},b.prototype.doctype=function(a,b){var c,d;return c=this.document(),d=new f(c,a,b),c.doctype=d,d},b.prototype.up=function(){if(this.isRoot)throw new Error("The root node has no parent. Use doc() if you need to get the document object.");return this.parent},b.prototype.root=function(){var a;if(this.isRoot)return this;for(a=this.parent;!a.isRoot;)a=a.parent;return a},b.prototype.document=function(){return this.root().documentObject},b.prototype.end=function(a){return this.document().toString(a)},b.prototype.prev=function(){var a;if(this.isRoot)throw new Error("Root node has no siblings");if(a=this.parent.children.indexOf(this),a<1)throw new Error("Already at the first node");return this.parent.children[a-1]},b.prototype.next=function(){var a;if(this.isRoot)throw new Error("Root node has no siblings");if(a=this.parent.children.indexOf(this),a===-1||a===this.parent.children.length-1)throw new Error("Already at the last node");return this.parent.children[a+1]},b.prototype.importXMLBuilder=function(a){var b;return b=a.root().clone(),b.parent=this,b.isRoot=!1,this.children.push(b),this},b.prototype.ele=function(a,b,c){return this.element(a,b,c)},b.prototype.nod=function(a,b,c){return this.node(a,b,c)},b.prototype.txt=function(a){return this.text(a)},b.prototype.dat=function(a){return this.cdata(a)},b.prototype.com=function(a){return this.comment(a)},b.prototype.doc=function(){return this.document()},b.prototype.dec=function(a,b,c){return this.declaration(a,b,c)},b.prototype.dtd=function(a,b){return this.doctype(a,b)},b.prototype.e=function(a,b,c){return this.element(a,b,c)},b.prototype.n=function(a,b,c){return this.node(a,b,c)},b.prototype.t=function(a){return this.text(a)},b.prototype.d=function(a){return this.cdata(a)},b.prototype.c=function(a){return this.comment(a)},b.prototype.r=function(a){return this.raw(a)},b.prototype.u=function(){return this.up()},b}()}).call(this)},{"./XMLCData":86,"./XMLComment":87,"./XMLDeclaration":92,"./XMLDocType":93,"./XMLElement":94,"./XMLRaw":97,"./XMLText":99,"lodash/lang/isArray":135,"lodash/lang/isEmpty":136,"lodash/lang/isFunction":137,"lodash/lang/isObject":139}],96:[function(a,b,c){(function(){var c,d;d=a("lodash/object/create"),b.exports=c=function(){function a(a,b,c){if(this.stringify=a.stringify,null==b)throw new Error("Missing instruction target");this.target=this.stringify.insTarget(b),c&&(this.value=this.stringify.insValue(c))}return a.prototype.clone=function(){return d(a.prototype,this)},a.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+="<?",g+=this.target,this.value&&(g+=" "+this.value),g+="?>",f&&(g+=d),g},a}()}).call(this)},{"lodash/object/create":143}],97:[function(a,b,c){(function(){var c,d,e,f=function(a,b){function c(){this.constructor=a}for(var d in b)g.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},g={}.hasOwnProperty;e=a("lodash/object/create"),c=a("./XMLNode"),b.exports=d=function(a){function b(a,c){if(b.__super__.constructor.call(this,a),null==c)throw new Error("Missing raw text");this.value=this.stringify.raw(c)}return f(b,a),b.prototype.clone=function(){return e(b.prototype,this)},b.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+=this.value,f&&(g+=d),g},b}(c)}).call(this)},{"./XMLNode":95,"lodash/object/create":143}],98:[function(a,b,c){(function(){var a,c=function(a,b){return function(){return a.apply(b,arguments)}},d={}.hasOwnProperty;b.exports=a=function(){function a(a){this.assertLegalChar=c(this.assertLegalChar,this);var b,e,f;this.allowSurrogateChars=null!=a?a.allowSurrogateChars:void 0,e=(null!=a?a.stringify:void 0)||{};for(b in e)d.call(e,b)&&(f=e[b],this[b]=f)}return a.prototype.eleName=function(a){return a=""+a||"",this.assertLegalChar(a)},a.prototype.eleText=function(a){return a=""+a||"",this.assertLegalChar(this.elEscape(a))},a.prototype.cdata=function(a){if(a=""+a||"",a.match(/]]>/))throw new Error("Invalid CDATA text: "+a);return this.assertLegalChar(a)},a.prototype.comment=function(a){if(a=""+a||"",a.match(/--/))throw new Error("Comment text cannot contain double-hypen: "+a);return this.assertLegalChar(a)},a.prototype.raw=function(a){return""+a||""},a.prototype.attName=function(a){return""+a||""},a.prototype.attValue=function(a){return a=""+a||"",this.attEscape(a)},a.prototype.insTarget=function(a){return""+a||""},a.prototype.insValue=function(a){if(a=""+a||"",a.match(/\?>/))throw new Error("Invalid processing instruction value: "+a);return a},a.prototype.xmlVersion=function(a){if(a=""+a||"",!a.match(/1\.[0-9]+/))throw new Error("Invalid version number: "+a);return a},a.prototype.xmlEncoding=function(a){if(a=""+a||"",!a.match(/[A-Za-z](?:[A-Za-z0-9._-]|-)*/))throw new Error("Invalid encoding: "+a);return a},a.prototype.xmlStandalone=function(a){return a?"yes":"no"},a.prototype.dtdPubID=function(a){return""+a||""},a.prototype.dtdSysID=function(a){return""+a||""},a.prototype.dtdElementValue=function(a){return""+a||""},a.prototype.dtdAttType=function(a){return""+a||""},a.prototype.dtdAttDefault=function(a){return null!=a?""+a||"":a},a.prototype.dtdEntityValue=function(a){return""+a||""},a.prototype.dtdNData=function(a){return""+a||""},a.prototype.convertAttKey="@",a.prototype.convertPIKey="?",a.prototype.convertTextKey="#text",a.prototype.convertCDataKey="#cdata",a.prototype.convertCommentKey="#comment",a.prototype.convertRawKey="#raw",a.prototype.convertListKey="#list",a.prototype.assertLegalChar=function(a){var b,c;if(b=this.allowSurrogateChars?/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uFFFE-\uFFFF]/:/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/,c=a.match(b))throw new Error("Invalid character ("+c+") in string: "+a+" at index "+c.index);return a},a.prototype.elEscape=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r/g,"&#xD;")},a.prototype.attEscape=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/\t/g,"&#x9;").replace(/\n/g,"&#xA;").replace(/\r/g,"&#xD;")},a}()}).call(this)},{}],99:[function(a,b,c){(function(){var c,d,e,f=function(a,b){function c(){this.constructor=a}for(var d in b)g.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},g={}.hasOwnProperty;e=a("lodash/object/create"),c=a("./XMLNode"),b.exports=d=function(a){function b(a,c){if(b.__super__.constructor.call(this,a),null==c)throw new Error("Missing element text");this.value=this.stringify.eleText(c)}return f(b,a),b.prototype.clone=function(){return e(b.prototype,this)},b.prototype.toString=function(a,b){var c,d,e,f,g,h,i,j,k;return f=(null!=a?a.pretty:void 0)||!1,c=null!=(h=null!=a?a.indent:void 0)?h:"  ",e=null!=(i=null!=a?a.offset:void 0)?i:0,d=null!=(j=null!=a?a.newline:void 0)?j:"\n",b||(b=0),k=new Array(b+e+1).join(c),g="",f&&(g+=k),g+=this.value,f&&(g+=d),g},b}(c)}).call(this)},{"./XMLNode":95,"lodash/object/create":143}],100:[function(a,b,c){(function(){var c,d;d=a("lodash/object/assign"),c=a("./XMLBuilder"),b.exports.create=function(a,b,e,f){return f=d({},b,e,f),new c(a,f).root()}}).call(this)},{"./XMLBuilder":85,"lodash/object/assign":142}],101:[function(a,b,c){function d(a,b,c){var d=h(a)?e:g;return"function"==typeof b&&"undefined"==typeof c||(b=f(b,c,3)),d(a,b)}var e=a("../internal/arrayEvery"),f=a("../internal/baseCallback"),g=a("../internal/baseEvery"),h=a("../lang/isArray");b.exports=d},{"../internal/arrayEvery":102,"../internal/baseCallback":104,"../internal/baseEvery":108,"../lang/isArray":135}],102:[function(a,b,c){function d(a,b){for(var c=-1,d=a.length;++c<d;)if(!b(a[c],c,a))return!1;return!0}b.exports=d},{}],103:[function(a,b,c){function d(a,b,c){var d=f(b);if(!c)return e(b,a,d);for(var g=-1,h=d.length;++g<h;){var i=d[g],j=a[i],k=c(j,b[i],i,a,b);(k===k?k===j:j!==j)&&("undefined"!=typeof j||i in a)||(a[i]=k)}return a}var e=a("./baseCopy"),f=a("../object/keys");b.exports=d},{"../object/keys":144,"./baseCopy":105}],104:[function(a,b,c){function d(a,b,c){var d=typeof a;return"function"==d?"undefined"!=typeof b&&j(a)?h(a,b,c):a:null==a?i:"object"==d?e(a):"undefined"==typeof b?g(a+""):f(a+"",b)}var e=a("./baseMatches"),f=a("./baseMatchesProperty"),g=a("./baseProperty"),h=a("./bindCallback"),i=a("../utility/identity"),j=a("./isBindable");b.exports=d},{"../utility/identity":148,"./baseMatches":115,"./baseMatchesProperty":116,"./baseProperty":117,"./bindCallback":120,"./isBindable":125}],105:[function(a,b,c){function d(a,b,c){c||(c=b,b={});for(var d=-1,e=c.length;++d<e;){var f=c[d];b[f]=a[f]}return b}b.exports=d},{}],106:[function(a,b,c){(function(c){var d=a("../lang/isObject"),e=function(){function a(){}return function(b){if(d(b)){a.prototype=b;var e=new a;a.prototype=null}return e||c.Object()}}();b.exports=e}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../lang/isObject":139}],107:[function(a,b,c){function d(a,b){var c=a?a.length:0;if(!f(c))return e(a,b);for(var d=-1,h=g(a);++d<c&&b(h[d],d,h)!==!1;);return a}var e=a("./baseForOwn"),f=a("./isLength"),g=a("./toObject");b.exports=d},{"./baseForOwn":110,"./isLength":128,"./toObject":133}],108:[function(a,b,c){function d(a,b){var c=!0;return e(a,function(a,d,e){return c=!!b(a,d,e)}),c}var e=a("./baseEach");b.exports=d},{"./baseEach":107}],109:[function(a,b,c){function d(a,b,c){for(var d=-1,f=e(a),g=c(a),h=g.length;++d<h;){var i=g[d];if(b(f[i],i,f)===!1)break}return a}var e=a("./toObject");b.exports=d},{"./toObject":133}],110:[function(a,b,c){function d(a,b){return e(a,b,f)}var e=a("./baseFor"),f=a("../object/keys");b.exports=d},{"../object/keys":144,"./baseFor":109}],111:[function(a,b,c){function d(a,b,c,f,g,h){if(a===b)return 0!==a||1/a==1/b;var i=typeof a,j=typeof b;return"function"!=i&&"object"!=i&&"function"!=j&&"object"!=j||null==a||null==b?a!==a&&b!==b:e(a,b,d,c,f,g,h)}var e=a("./baseIsEqualDeep");b.exports=d},{"./baseIsEqualDeep":112}],112:[function(a,b,c){function d(a,b,c,d,m,p,q){var r=h(a),s=h(b),t=k,u=k;r||(t=o.call(a),t==j?t=l:t!=l&&(r=i(a))),s||(u=o.call(b),u==j?u=l:u!=l&&(s=i(b)));var v=t==l,w=u==l,x=t==u;if(x&&!r&&!v)return f(a,b,t);var y=v&&n.call(a,"__wrapped__"),z=w&&n.call(b,"__wrapped__");if(y||z)return c(y?a.value():a,z?b.value():b,d,m,p,q);if(!x)return!1;p||(p=[]),q||(q=[]);for(var A=p.length;A--;)if(p[A]==a)return q[A]==b;p.push(a),q.push(b);var B=(r?e:g)(a,b,c,d,m,p,q);return p.pop(),q.pop(),B}var e=a("./equalArrays"),f=a("./equalByTag"),g=a("./equalObjects"),h=a("../lang/isArray"),i=a("../lang/isTypedArray"),j="[object Arguments]",k="[object Array]",l="[object Object]",m=Object.prototype,n=m.hasOwnProperty,o=m.toString;b.exports=d},{"../lang/isArray":135,"../lang/isTypedArray":141,"./equalArrays":122,"./equalByTag":123,"./equalObjects":124}],113:[function(a,b,c){function d(a){return"function"==typeof a||!1}b.exports=d},{}],114:[function(a,b,c){function d(a,b,c,d,f){var h=b.length;if(null==a)return!h;for(var i=-1,j=!f;++i<h;)if(j&&d[i]?c[i]!==a[b[i]]:!g.call(a,b[i]))return!1;for(i=-1;++i<h;){var k=b[i];if(j&&d[i])var l=g.call(a,k);else{var m=a[k],n=c[i];l=f?f(m,n,k):void 0,"undefined"==typeof l&&(l=e(n,m,f,!0))}if(!l)return!1}return!0}var e=a("./baseIsEqual"),f=Object.prototype,g=f.hasOwnProperty;b.exports=d},{"./baseIsEqual":111}],115:[function(a,b,c){function d(a){var b=g(a),c=b.length;if(1==c){var d=b[0],h=a[d];if(f(h))return function(a){return null!=a&&a[d]===h&&i.call(a,d)}}for(var j=Array(c),k=Array(c);c--;)h=a[b[c]],j[c]=h,k[c]=f(h);return function(a){return e(a,b,j,k)}}var e=a("./baseIsMatch"),f=a("./isStrictComparable"),g=a("../object/keys"),h=Object.prototype,i=h.hasOwnProperty;b.exports=d},{"../object/keys":144,"./baseIsMatch":114,"./isStrictComparable":130}],116:[function(a,b,c){function d(a,b){return f(b)?function(c){return null!=c&&c[a]===b}:function(c){return null!=c&&e(b,c[a],null,!0)}}var e=a("./baseIsEqual"),f=a("./isStrictComparable");b.exports=d},{"./baseIsEqual":111,"./isStrictComparable":130}],117:[function(a,b,c){function d(a){return function(b){return null==b?void 0:b[a]}}b.exports=d},{}],118:[function(a,b,c){var d=a("../utility/identity"),e=a("./metaMap"),f=e?function(a,b){return e.set(a,b),a}:d;b.exports=f},{"../utility/identity":148,"./metaMap":131}],119:[function(a,b,c){function d(a){return"string"==typeof a?a:null==a?"":a+""}b.exports=d},{}],120:[function(a,b,c){function d(a,b,c){if("function"!=typeof a)return e;if("undefined"==typeof b)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 3:return function(c,d,e){return a.call(b,c,d,e)};case 4:return function(c,d,e,f){return a.call(b,c,d,e,f)};case 5:return function(c,d,e,f,g){return a.call(b,c,d,e,f,g)}}return function(){return a.apply(b,arguments)}}var e=a("../utility/identity");b.exports=d},{"../utility/identity":148}],121:[function(a,b,c){function d(a){return function(){var b=arguments,c=b.length,d=b[0];if(c<2||null==d)return d;var g=b[c-2],h=b[c-1],i=b[3];c>3&&"function"==typeof g?(g=e(g,h,5),c-=2):(g=c>2&&"function"==typeof h?h:null,c-=g?1:0),i&&f(b[1],b[2],i)&&(g=3==c?null:g,c=2);for(var j=0;++j<c;){var k=b[j];k&&a(d,k,g)}return d}}var e=a("./bindCallback"),f=a("./isIterateeCall");b.exports=d},{"./bindCallback":120,"./isIterateeCall":127}],122:[function(a,b,c){function d(a,b,c,d,e,f,g){var h=-1,i=a.length,j=b.length,k=!0;if(i!=j&&!(e&&j>i))return!1;for(;k&&++h<i;){var l=a[h],m=b[h];if(k=void 0,d&&(k=e?d(m,l,h):d(l,m,h)),"undefined"==typeof k)if(e)for(var n=j;n--&&(m=b[n],!(k=l&&l===m||c(l,m,d,e,f,g))););else k=l&&l===m||c(l,m,d,e,f,g)}return!!k}b.exports=d},{}],123:[function(a,b,c){function d(a,b,c){switch(c){case e:case f:return+a==+b;case g:return a.name==b.name&&a.message==b.message;case h:return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case i:case j:return a==b+""}return!1}var e="[object Boolean]",f="[object Date]",g="[object Error]",h="[object Number]",i="[object RegExp]",j="[object String]";b.exports=d},{}],124:[function(a,b,c){function d(a,b,c,d,f,h,i){var j=e(a),k=j.length,l=e(b),m=l.length;if(k!=m&&!f)return!1;for(var n,o=-1;++o<k;){var p=j[o],q=g.call(b,p);if(q){var r=a[p],s=b[p];q=void 0,d&&(q=f?d(s,r,p):d(r,s,p)),"undefined"==typeof q&&(q=r&&r===s||c(r,s,d,f,h,i))}if(!q)return!1;n||(n="constructor"==p)}if(!n){var t=a.constructor,u=b.constructor;if(t!=u&&"constructor"in a&&"constructor"in b&&!("function"==typeof t&&t instanceof t&&"function"==typeof u&&u instanceof u))return!1}return!0}var e=a("../object/keys"),f=Object.prototype,g=f.hasOwnProperty;b.exports=d},{"../object/keys":144}],125:[function(a,b,c){function d(a){var b=!(g.funcNames?a.name:g.funcDecomp);if(!b){var c=j.call(a);g.funcNames||(b=!h.test(c)),b||(b=i.test(c)||f(a),e(a,b))}return b}var e=a("./baseSetData"),f=a("../lang/isNative"),g=a("../support"),h=/^\s*function[ \n\r\t]+\w/,i=/\bthis\b/,j=Function.prototype.toString;b.exports=d},{"../lang/isNative":138,"../support":147,"./baseSetData":118}],126:[function(a,b,c){function d(a,b){return a=+a,b=null==b?e:b,a>-1&&a%1==0&&a<b}var e=Math.pow(2,53)-1;b.exports=d},{}],127:[function(a,b,c){function d(a,b,c){if(!g(c))return!1;var d=typeof b;if("number"==d)var h=c.length,i=f(h)&&e(b,h);else i="string"==d&&b in c;if(i){var j=c[b];return a===a?a===j:j!==j}return!1}var e=a("./isIndex"),f=a("./isLength"),g=a("../lang/isObject");b.exports=d},{"../lang/isObject":139,"./isIndex":126,"./isLength":128}],128:[function(a,b,c){function d(a){return"number"==typeof a&&a>-1&&a%1==0&&a<=e}var e=Math.pow(2,53)-1;b.exports=d},{}],129:[function(a,b,c){function d(a){return a&&"object"==typeof a||!1}b.exports=d},{}],130:[function(a,b,c){function d(a){return a===a&&(0===a?1/a>0:!e(a))}var e=a("../lang/isObject");b.exports=d},{"../lang/isObject":139}],131:[function(a,b,c){(function(c){var d=a("../lang/isNative"),e=d(e=c.WeakMap)&&e,f=e&&new e;b.exports=f}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../lang/isNative":138}],132:[function(a,b,c){function d(a){for(var b=i(a),c=b.length,d=c&&a.length,k=d&&h(d)&&(f(a)||j.nonEnumArgs&&e(a)),m=-1,n=[];++m<c;){var o=b[m];(k&&g(o,d)||l.call(a,o))&&n.push(o)}return n}var e=a("../lang/isArguments"),f=a("../lang/isArray"),g=a("./isIndex"),h=a("./isLength"),i=a("../object/keysIn"),j=a("../support"),k=Object.prototype,l=k.hasOwnProperty;b.exports=d},{"../lang/isArguments":134,"../lang/isArray":135,"../object/keysIn":145,"../support":147,"./isIndex":126,"./isLength":128}],133:[function(a,b,c){function d(a){return e(a)?a:Object(a)}var e=a("../lang/isObject");b.exports=d},{"../lang/isObject":139}],134:[function(a,b,c){function d(a){var b=f(a)?a.length:void 0;return e(b)&&i.call(a)==g||!1}var e=a("../internal/isLength"),f=a("../internal/isObjectLike"),g="[object Arguments]",h=Object.prototype,i=h.toString;b.exports=d},{"../internal/isLength":128,"../internal/isObjectLike":129}],135:[function(a,b,c){var d=a("../internal/isLength"),e=a("./isNative"),f=a("../internal/isObjectLike"),g="[object Array]",h=Object.prototype,i=h.toString,j=e(j=Array.isArray)&&j,k=j||function(a){return f(a)&&d(a.length)&&i.call(a)==g||!1};b.exports=k},{"../internal/isLength":128,"../internal/isObjectLike":129,"./isNative":138}],136:[function(a,b,c){function d(a){if(null==a)return!0;var b=a.length;return h(b)&&(f(a)||j(a)||e(a)||i(a)&&g(a.splice))?!b:!k(a).length}var e=a("./isArguments"),f=a("./isArray"),g=a("./isFunction"),h=a("../internal/isLength"),i=a("../internal/isObjectLike"),j=a("./isString"),k=a("../object/keys");b.exports=d},{"../internal/isLength":128,"../internal/isObjectLike":129,"../object/keys":144,"./isArguments":134,"./isArray":135,"./isFunction":137,"./isString":140}],137:[function(a,b,c){(function(c){var d=a("../internal/baseIsFunction"),e=a("./isNative"),f="[object Function]",g=Object.prototype,h=g.toString,i=e(i=c.Uint8Array)&&i,j=d(/x/)||i&&!d(i)?function(a){return h.call(a)==f}:d;b.exports=j}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../internal/baseIsFunction":113,"./isNative":138}],138:[function(a,b,c){function d(a){return null!=a&&(k.call(a)==g?l.test(j.call(a)):f(a)&&h.test(a)||!1)}var e=a("../string/escapeRegExp"),f=a("../internal/isObjectLike"),g="[object Function]",h=/^\[object .+?Constructor\]$/,i=Object.prototype,j=Function.prototype.toString,k=i.toString,l=RegExp("^"+e(k).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");b.exports=d},{"../internal/isObjectLike":129,"../string/escapeRegExp":146}],139:[function(a,b,c){function d(a){var b=typeof a;return"function"==b||a&&"object"==b||!1}b.exports=d},{}],140:[function(a,b,c){function d(a){return"string"==typeof a||e(a)&&h.call(a)==f||!1}var e=a("../internal/isObjectLike"),f="[object String]",g=Object.prototype,h=g.toString;b.exports=d},{"../internal/isObjectLike":129}],141:[function(a,b,c){function d(a){return f(a)&&e(a.length)&&D[F.call(a)]||!1}var e=a("../internal/isLength"),f=a("../internal/isObjectLike"),g="[object Arguments]",h="[object Array]",i="[object Boolean]",j="[object Date]",k="[object Error]",l="[object Function]",m="[object Map]",n="[object Number]",o="[object Object]",p="[object RegExp]",q="[object Set]",r="[object String]",s="[object WeakMap]",t="[object ArrayBuffer]",u="[object Float32Array]",v="[object Float64Array]",w="[object Int8Array]",x="[object Int16Array]",y="[object Int32Array]",z="[object Uint8Array]",A="[object Uint8ClampedArray]",B="[object Uint16Array]",C="[object Uint32Array]",D={};D[u]=D[v]=D[w]=D[x]=D[y]=D[z]=D[A]=D[B]=D[C]=!0,D[g]=D[h]=D[t]=D[i]=D[j]=D[k]=D[l]=D[m]=D[n]=D[o]=D[p]=D[q]=D[r]=D[s]=!1;var E=Object.prototype,F=E.toString;b.exports=d},{"../internal/isLength":128,"../internal/isObjectLike":129}],142:[function(a,b,c){var d=a("../internal/baseAssign"),e=a("../internal/createAssigner"),f=e(d);b.exports=f},{"../internal/baseAssign":103,"../internal/createAssigner":121}],143:[function(a,b,c){function d(a,b,c){var d=f(a);return c&&g(a,b,c)&&(b=null),b?e(b,d,h(b)):d}var e=a("../internal/baseCopy"),f=a("../internal/baseCreate"),g=a("../internal/isIterateeCall"),h=a("./keys");b.exports=d},{"../internal/baseCopy":105,"../internal/baseCreate":106,"../internal/isIterateeCall":127,"./keys":144}],144:[function(a,b,c){var d=a("../internal/isLength"),e=a("../lang/isNative"),f=a("../lang/isObject"),g=a("../internal/shimKeys"),h=e(h=Object.keys)&&h,i=h?function(a){if(a)var b=a.constructor,c=a.length;return"function"==typeof b&&b.prototype===a||"function"!=typeof a&&c&&d(c)?g(a):f(a)?h(a):[]}:g;b.exports=i},{"../internal/isLength":128,"../internal/shimKeys":132,"../lang/isNative":138,"../lang/isObject":139}],145:[function(a,b,c){function d(a){if(null==a)return[];i(a)||(a=Object(a));var b=a.length;b=b&&h(b)&&(f(a)||j.nonEnumArgs&&e(a))&&b||0;for(var c=a.constructor,d=-1,k="function"==typeof c&&c.prototype===a,m=Array(b),n=b>0;++d<b;)m[d]=d+"";for(var o in a)n&&g(o,b)||"constructor"==o&&(k||!l.call(a,o))||m.push(o);return m}var e=a("../lang/isArguments"),f=a("../lang/isArray"),g=a("../internal/isIndex"),h=a("../internal/isLength"),i=a("../lang/isObject"),j=a("../support"),k=Object.prototype,l=k.hasOwnProperty;b.exports=d},{"../internal/isIndex":126,"../internal/isLength":128,"../lang/isArguments":134,"../lang/isArray":135,"../lang/isObject":139,"../support":147}],146:[function(a,b,c){function d(a){return a=e(a),a&&g.test(a)?a.replace(f,"\\$&"):a}var e=a("../internal/baseToString"),f=/[.*+?^${}()|[\]\/\\]/g,g=RegExp(f.source);b.exports=d},{"../internal/baseToString":119}],147:[function(a,b,c){(function(c){var d=a("./lang/isNative"),e=/\bthis\b/,f=Object.prototype,g=(g=c.window)&&g.document,h=f.propertyIsEnumerable,i={};!function(a){i.funcDecomp=!d(c.WinRTError)&&e.test(function(){return this}),i.funcNames="string"==typeof Function.name;try{i.dom=11===g.createDocumentFragment().nodeType}catch(a){i.dom=!1}try{i.nonEnumArgs=!h.call(arguments,1)}catch(a){i.nonEnumArgs=!0}}(0,0),b.exports=i}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./lang/isNative":138}],148:[function(a,b,c){function d(a){return a}b.exports=d},{}]},{},[8]);
//# sourceMappingURL=aws-cognito-sdk.min.js.map

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

  const poolData = {
    UserPoolId: "us-east-1_h1mwAM07G",
    ClientId: "5bpqnf0gltgmbpee7vfn36koms"
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

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
  
});
