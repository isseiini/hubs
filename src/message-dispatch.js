import "./utils/configs";
import { getAbsoluteHref } from "./utils/media-url-utils";
import { isValidSceneUrl } from "./utils/scene-url-utils";
import { spawnChatMessage } from "./react-components/chat-message";
import { SOUND_CHAT_MESSAGE, SOUND_QUACK, SOUND_SPECIAL_QUACK } from "./systems/sound-effects-system";
import ducky from "./assets/models/DuckyMesh.glb";
import { EventTarget } from "event-target-shim";
import { ExitReason } from "./react-components/room/ExitedRoomScreen";
import { LogMessageType } from "./react-components/room/ChatSidebar";
import {waitForDOMContentLoaded} from "./utils/async-utils";

AWS.config.region = 'ap-northeast-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:1a5b9f55-2ccb-494f-964f-6fda4d7f9eda',
});

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const currentUserData2 = {}; 

var ddb = new AWS.DynamoDB({
  apiVersion: '2012-08-10'
});

var docClient = new AWS.DynamoDB.DocumentClient();

const poolData = {
  UserPoolId: "ap-northeast-1_OBc87MXYg",
  ClientId: "2a0a73brf9cnv2u7pbn3aa3e5r"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var current_url_parts = location.href.split("/");
var current_room = current_url_parts[current_url_parts.length - 1];

let uiRoot;

waitForDOMContentLoaded().then(() => {
  var hit_target_container = document.getElementById("hit_target_container");
  const Game_Result = document.getElementById("Game-Result");
  const Red_Score = document.getElementById("red-score");
});

/*if (current_room == "kooky--passionate-safari") {
  let cognitoUser_me = userPool.getCurrentUser(); 
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
            currentUserData2[result[i].getName()] = result[i].getValue();
          };   
        };
      });
    };
  });
};*/

var HanabiAction = document.getElementById("HanabiContainer");

export default class MessageDispatch extends EventTarget {
  constructor(scene, entryManager, hubChannel, remountUI, mediaSearchStore) {
    super();
    this.scene = scene;
    this.entryManager = entryManager;
    this.hubChannel = hubChannel;
    this.remountUI = remountUI;
    this.mediaSearchStore = mediaSearchStore;
    this.presenceLogEntries = [];
  }
 
  damage() {  
    const Player_Respawn = document.getElementById("Player-Respawn");
    const lifeBar = document.getElementById('life-bar')         
    const lifeMark = document.getElementById('life-mark') 
    const sanshakudama = document.querySelector(".sanshakudama");
    var HP = Number(lifeBar.style.width.slice( 0, -1 )) ;                            

    var life = HP - 10;

    if ( life <= 0 ){
      const HanabiAction = document.getElementById("HanabiContainer")
      HanabiAction.setAttribute("hanabi-animation", {action: "true"});
      HanabiAction.emit("true");

      var hit_target2 = "_Red_+1";
      var event3 = new Event('change');
      var hit_target_container = document.getElementById("hit_target_container");
      hit_target_container.value = hit_target2;
      hit_target_container.dispatchEvent(event3);

      life = 0
 
      lifeMark.style.visibility = 'hidden'
      Player_Respawn.style.display = "block";
      const general_scene = document.querySelector("a-scene");
      general_scene.pause();
      life = 100  

      //sanshakudama.setAttribute("animation-mixer")
      var down_count = {
        TableName: 'Matching-table',
        Key:{//更新したい項目をプライマリキー(及びソートキー)によって１つ指定
          URL: current_room
        },
        ExpressionAttributeNames: {
          '#red': "RedPoints",
        },
        ExpressionAttributeValues: {
          ':newScore': 1,
        },
        UpdateExpression: 'SET #red = #red + :newScore'
      };
      docClient.update(down_count, function(err, data2){
        if(err){
          console.log('error');
        }else{
          console.log('success');
        }
      });

      var params = {
        TableName: 'Matching-table',
        Key:{//取得したい項目をプライマリキー(及びソートキー)によって１つ指定
          URL: current_room,
        }
      };
      docClient.get(params, function(err, data){
        if(err){
          console.log(err);
        }else{
          if(data.Item.RedPoints >= 25) {
            var hit_target2 = "_Win_Red";
            var event2 = new Event('change');
            var hit_target_container = document.getElementById("hit_target_container");
            hit_target_container.value = hit_target2;
            hit_target_container.dispatchEvent(event2);
            const Game_Result = document.getElementById("Game-Result");
            Game_Result.style.display = "block";
          }
        }
      });
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

  addToPresenceLog(entry) {
    entry.key = Date.now().toString();

    /*var naf_Mine;

    if (naf_Mine == null || naf_Mine == undefined) {
      var params = {
        TableName: 'Matching-table',
        Key:{
          URL: "kooky--passionate-safari"
        }
      };
      docClient.get(params, function(err, data){
          if(err){
              console.log(err);
          }else{
              naf_Mine = data.Item.player[currentUserData2['sub']]
              console.log("naf_NAF =" + naf_Mine)
          }
      });
    }*/
    
    var naf_Mine = window.NAF_ID_for_SHOOTING; //sessionStorage.getItem(this.hubChannel.channel.joinPush.receivedResp.response.session_id); 
    console.log(naf_Mine)
    /*if (naf_Mine == null || naf_Mine == undefined){
      my_NAF_data.count();
      naf_Mine = my_NAF_data;
    }*/

    if (entry.type ==="chat" && entry.body.indexOf("_naf-") === 0){
      if ("_" + naf_Mine == entry.body) {
        this.damage();
      };
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Red_+1") === 0){
      const Red_Score = document.getElementById("red-score");
      let current_Red_Score = Number(Red_Score.innerText) + 1;
      Red_Score.innerText = current_Red_Score;
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Win_") === 0){
      scene.pause();
      const Game_Result = document.getElementById("Game-Result");
      Game_Result.style.display = "block";
      return
    };

    this.presenceLogEntries.push(entry);
    this.remountUI({ presenceLogEntries: this.presenceLogEntries });
    if (entry.type === "chat" && this.scene.is("loaded")) {
      this.scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_CHAT_MESSAGE);
    }

    // Fade out and then remove
    setTimeout(() => {
      entry.expired = true;
      this.remountUI({ presenceLogEntries: this.presenceLogEntries });

      setTimeout(() => {
        this.presenceLogEntries.splice(this.presenceLogEntries.indexOf(entry), 1);
        this.remountUI({ presenceLogEntries: this.presenceLogEntries });
      }, 5000);
    }, 20000);
  }

  receive(message) {
    this.addToPresenceLog(message);
    this.dispatchEvent(new CustomEvent("message", { detail: message }));
  }

  log = (messageType, props) => {
    this.receive({ type: "log", messageType, props });
  };

  dispatch = message => {
    if (message.startsWith("/")) {
      const commandParts = message.substring(1).split(/\s+/);
      this.dispatchCommand(commandParts[0], ...commandParts.slice(1));
      document.activeElement.blur(); // Commands should blur
    } else {
      this.hubChannel.sendMessage(message);
    }
  };

  dispatchCommand = async (command, ...args) => {
    const entered = this.scene.is("entered");
    uiRoot = uiRoot || document.getElementById("ui-root");
    const isGhost = !entered && uiRoot && uiRoot.firstChild && uiRoot.firstChild.classList.contains("isGhost");

    // TODO: Some of the commands below should be available without requiring
    //       room entry. For example, audiomode should not require room entry.
    if (!entered && (!isGhost || command === "duck")) {
      this.log(LogMessageType.roomEntryRequired);
      return;
    }

    const avatarRig = document.querySelector("#avatar-rig");
    const scales = [0.0625, 0.125, 0.25, 0.5, 1.0, 1.5, 3, 5, 7.5, 12.5];
    const curScale = avatarRig.object3D.scale;
    let err;
    let physicsSystem;
    const captureSystem = this.scene.systems["capture-system"];

    switch (command) {
      case "fly":
        if (this.scene.systems["hubs-systems"].characterController.fly) {
          this.scene.systems["hubs-systems"].characterController.enableFly(false);
          this.log(LogMessageType.flyModeDisabled);
        } else {
          if (this.scene.systems["hubs-systems"].characterController.enableFly(true)) {
            this.log(LogMessageType.flyModeEnabled);
          }
        }
        break;
      case "grow":
        for (let i = 0; i < scales.length; i++) {
          if (scales[i] > curScale.x) {
            avatarRig.object3D.scale.set(scales[i], scales[i], scales[i]);
            avatarRig.object3D.matrixNeedsUpdate = true;
            break;
          }
        }

        break;
      case "shrink":
        for (let i = scales.length - 1; i >= 0; i--) {
          if (curScale.x > scales[i]) {
            avatarRig.object3D.scale.set(scales[i], scales[i], scales[i]);
            avatarRig.object3D.matrixNeedsUpdate = true;
            break;
          }
        }

        break;
      case "leave":
        this.entryManager.exitScene();
        this.remountUI({ roomUnavailableReason: ExitReason.left });
        break;
      case "duck":
        spawnChatMessage(getAbsoluteHref(location.href, ducky));
        if (Math.random() < 0.01) {
          this.scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_SPECIAL_QUACK);
        } else {
          this.scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_QUACK);
        }
        break;
      case "debug":
        physicsSystem = document.querySelector("a-scene").systems["hubs-systems"].physicsSystem;
        physicsSystem.setDebug(!physicsSystem.debugEnabled);
        break;
      case "vrstats":
        document.getElementById("stats").components["stats-plus"].toggleVRStats();
        break;
      case "scene":
        if (args[0]) {
          if (await isValidSceneUrl(args[0])) {
            err = this.hubChannel.updateScene(args[0]);
            if (err === "unauthorized") {
              this.log(LogMessageType.unauthorizedSceneChange);
            }
          } else {
            this.log(LogMessageType.inalidSceneUrl);
          }
        } else if (this.hubChannel.canOrWillIfCreator("update_hub")) {
          this.mediaSearchStore.sourceNavigateWithNoNav("scenes", "use");
        }

        break;
      case "rename":
        err = this.hubChannel.rename(args.join(" "));
        if (err === "unauthorized") {
          this.log(LogMessageType.unauthorizedRoomRename);
        }
        break;
      case "capture":
        if (!captureSystem.available()) {
          this.log(LogMessageType.captureUnavailable);
          break;
        }
        if (args[0] === "stop") {
          if (captureSystem.started()) {
            captureSystem.stop();
            this.log(LogMessageType.captureStopped);
          } else {
            this.log(LogMessageType.captureAlreadyStopped);
          }
        } else {
          if (captureSystem.started()) {
            this.log(LogMessageType.captureAlreadyRunning);
          } else {
            captureSystem.start();
            this.log(LogMessageType.captureStarted);
          }
        }
        break;
      case "audiomode":
        {
          const shouldEnablePositionalAudio = window.APP.store.state.preferences.audioOutputMode === "audio";
          window.APP.store.update({
            // TODO: This should probably just be a boolean to disable panner node settings
            // and even if it's not, "audio" is a weird name for the "audioOutputMode" that means
            // "stereo" / "not panner".
            preferences: { audioOutputMode: shouldEnablePositionalAudio ? "panner" : "audio" }
          });
          // TODO: The user message here is a little suspicious. We might be ignoring the
          // user preference (e.g. if panner nodes are broken in safari, then we never create
          // panner nodes, regardless of user preference.)
          // Warning: This comment may be out of date when you read it.
          this.log(
            shouldEnablePositionalAudio ? LogMessageType.positionalAudioEnabled : LogMessageType.positionalAudioDisabled
          );
        }
        break;
      case "audioNormalization":
        {
          if (args.length === 1) {
            const factor = Number(args[0]);
            if (!isNaN(factor)) {
              const effectiveFactor = Math.max(0.0, Math.min(255.0, factor));
              window.APP.store.update({
                preferences: { audioNormalization: effectiveFactor }
              });
              if (factor) {
                this.log(LogMessageType.setAudioNormalizationFactor, { factor: effectiveFactor });
              } else {
                this.log(LogMessageType.audioNormalizationDisabled);
              }
            } else {
              this.log(LogMessageType.audioNormalizationNaN);
            }
          } else {
            this.log(LogMessageType.invalidAudioNormalizationRange);
          }
        }
        break;
    }
  };
}
