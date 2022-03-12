import "./utils/configs";
import { getAbsoluteHref } from "./utils/media-url-utils";
import { isValidSceneUrl } from "./utils/scene-url-utils";
import { spawnChatMessage } from "./react-components/chat-message";
import { SOUND_CHAT_MESSAGE, SOUND_QUACK, SOUND_SPECIAL_QUACK, SOUND_HIT} from "./systems/sound-effects-system";
import ducky from "./assets/models/DuckyMesh.glb";
import { EventTarget } from "event-target-shim";
import { ExitReason } from "./react-components/room/ExitedRoomScreen";
import { LogMessageType } from "./react-components/room/ChatSidebar";
import {waitForDOMContentLoaded} from "./utils/async-utils";
import { width } from "@fortawesome/free-solid-svg-icons/faTimes";
import { WindowsMixedRealityControllerDevice } from "./systems/userinput/devices/windows-mixed-reality-controller";

/*AWS.config.region = 'ap-northeast-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:1a5b9f55-2ccb-494f-964f-6fda4d7f9eda',
});*/

AWS.config.region = 'ap-northeast-1'; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:ed1df237-f6f6-441a-8a2c-7f958ab642ae',
});

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const currentUserData2 = {}; 

var docClient = new AWS.DynamoDB.DocumentClient();

/*const poolData = {
  UserPoolId: "ap-northeast-1_OBc87MXYg",
  ClientId: "2a0a73brf9cnv2u7pbn3aa3e5r"
};*/

const poolData = {
  UserPoolId: "ap-northeast-1_RWH9txS1J",
  ClientId: "4h2qfcv13p4c6246q37bb4v9dk"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var current_url_parts = (location.protocol + '//' + location.hostname + location.pathname).split("/");
var current_room = current_url_parts[current_url_parts.length - 1];

let uiRoot;

window.BlueSum = 0;
window.RedSum = 0;

waitForDOMContentLoaded().then(() => {
  var hit_target_container = document.getElementById("hit_target_container");
  const Game_Result = document.getElementById("Game-Result");
  const Red_Score = document.getElementById("red-score");
});

const playerMine = Math.random().toString(36).slice(-8);

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
    
    const lifeBar = document.getElementById('life-background')
    var HP = Number(lifeBar.style.width.slice( 0, -1 )) ; 
    const Player_Respawn = document.getElementById("Player-Respawn");
    /*const Player_UI = document.getElementById("Player-Ui");
    Player_UI.classList.add("moveToRight");
    Player_UI.classList.remove("moveToRight");*/
    if(HP > 0) {
      let team = document.getElementById("score-display-top").innerText;
      this.scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_HIT);

      var life = HP - 20;

      
      if ( life <= 0 ){
        const scene = document.querySelector("a-scene");
        //const waypointSystem = scene.systems["hubs-systems"].waypointSystem;
        //waypointSystem.moveToSpawnPoint();

        if(team == "BlueTeam") {
          var hit_target2 = "_Red_+1#" + playerMine;
        }

        if(team == "RedTeam") {
          var hit_target2 = "_Blue_+1#" + playerMine;
        }
        
        var event3 = new Event('change');
        var hit_target_container = document.getElementById("hit_target_container");
        hit_target_container.value = hit_target2;
        hit_target_container.dispatchEvent(event3);
  
        Player_Respawn.style.display = "block";
        //const general_scene = document.querySelector("a-scene");
        //general_scene.pause();
        life = 100  

        
        //sanshakudama.setAttribute("animation-mixer")
        /*var down_count = {
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
        });*/
      } else {
      // 算出の結果 100 を超過した場合
      if ( life > 100 ) {
          life = 100
      }
    
      }

      lifeBar.style.width = life + "%"
    }
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
    /*if (naf_Mine == null || naf_Mine == undefined){
      my_NAF_data.count();
      naf_Mine = my_NAF_data;
    }*/

    if (entry.type ==="chat" && entry.body.indexOf("_naf-") === 0){
      console.log(naf_Mine)
      if ("_" + naf_Mine == entry.body) {
        this.damage();
      };
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_RedTeam") === 0){
      window.RedSum += 1;
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_BlueTeam") === 0){
      window.BlueSum += 1;
      return
    };

    if (entry.type ==="chat" && isNaN(entry.body) == false){
      window.timeCount = entry.body;
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Red_+1") === 0){
      if(entry.body.substring(entry.body.indexOf("#") + 1) === playerMine) {
        let HanabiAction = document.querySelector(".sanshakudama");//document.getElementById("HanabiContainer")
        HanabiAction.setAttribute("hanabi-animation", {action: "true"});
        console.log(HanabiAction)
      }
      const Red_Score = document.getElementById("red-score");
      const Red_Progress = document.getElementById("Red-Progress");
      Red_Progress.value = Red_Progress.value + 1;
      let current_Red_Score = Number(Red_Score.innerText) + 1;
      if (current_Red_Score >= 25) {
        var hit_target2 = "_Win_Red";
        var event2 = new Event('change');
        var hit_target_container = document.getElementById("hit_target_container");
        hit_target_container.value = hit_target2;
        hit_target_container.dispatchEvent(event2);
        Red_Score.innerText = "0";
        Red_Progress.value = 0;
        return
      }
      Red_Score.innerText = current_Red_Score;
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Blue_+1") === 0){
      if(entry.body.substring(entry.body.indexOf("#") + 1) === playerMine) {
        let HanabiAction = document.querySelector(".sanshakudama");//document.getElementById("HanabiContainer")
        HanabiAction.setAttribute("hanabi-animation", {action: "true"});
        console.log(HanabiAction)
      }
      const Blue_Score = document.getElementById("blue-score");
      const Blue_Progress = document.getElementById("Blue-Progress");
      Blue_Progress.value = Blue_Progress.value + 1;
      let current_Blue_Score = Number(Blue_Score.innerText) + 1;
      if (current_Blue_Score >= 25) {
        var hit_target2 = "_Win_Blue";
        var event2 = new Event('change');
        var hit_target_container = document.getElementById("hit_target_container");
        hit_target_container.value = hit_target2;
        hit_target_container.dispatchEvent(event2);
        Blue_Score.innerText = "0";
        Blue_Progress.value = 0;
        return
      }
      Blue_Score.innerText = current_Blue_Score;
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Red:") === 0){
      console.log(entry.body)
      const Red_Score = document.getElementById("red-score");
      const Blue_Score = document.getElementById("blue-score");
      const Red_Progress = document.getElementById("Red-Progress");
      const Blue_Progress = document.getElementById("Blue-Progress");
      var entered_red = entry.body.substring(0, entry.body.indexOf('_Blue:'));
      entered_red = entered_red.substr(entered_red.indexOf(':') + 1);
      //entered_red = entered_red.slice(-1);
      var entered_blue = entry.body.substr(entry.body.indexOf('_Blue:') + 1);
      entered_blue = entered_blue.substr(entered_blue.indexOf(':') + 1);
      //entered_blue = entered_blue.slice(-1);
      if (Number(Red_Score.innerText) <= Number(entered_red) && Number(Blue_Score.innerText) <= Number(entered_blue)) {
        Red_Score.innerText = entered_red;
        Blue_Score.innerText = entered_blue;
        if (Number(entered_red) >= 25) {
          var hit_target2 = "_Win_Red";
          var event2 = new Event('change');
          var hit_target_container = document.getElementById("hit_target_container");
          hit_target_container.value = hit_target2;
          hit_target_container.dispatchEvent(event2);
          Red_Score.innerText = "0";
          Blue_Score.innerText = "0";
          Red_Progress.value = 0;
          Blue_Progress.value = 0;
          return
        }
        if (Number(entered_blue) >= 25) {
          var hit_target2 = "_Win_Blue";
          var event2 = new Event('change');
          var hit_target_container = document.getElementById("hit_target_container");
          hit_target_container.value = hit_target2;
          hit_target_container.dispatchEvent(event2);
          Red_Score.innerText = "0";
          Blue_Score.innerText = "0";
          Red_Progress.value = 0;
          Blue_Progress.value = 0;
          return
        }
      }
      Red_Progress.value = Number(entered_red);
      Blue_Progress.value = Number(entered_blue);
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Win_Red") === 0){
      const scene = document.querySelector("a-scene");
      scene.pause();
      const Game_Result = document.getElementById("Game-Result");
      Game_Result.style.display = "block";
      return
    };

    if (entry.type ==="chat" && entry.body.indexOf("_Win_Blue") === 0){
      const scene = document.querySelector("a-scene");
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
