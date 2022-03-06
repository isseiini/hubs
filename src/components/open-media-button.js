import { isLocalHubsSceneUrl, isHubsRoomUrl, isLocalHubsAvatarUrl } from "../utils/media-url-utils";
import { guessContentType } from "../utils/media-url-utils";
import { handleExitTo2DInterstitial } from "../utils/vr-interstitial";
import myCognitouserclass from "../hub.js";
import myCognitouserpoolclass from "../hub.js"

AFRAME.registerComponent("open-media-button", {
  schema: {
    onlyOpenLink: { type: "boolean" }
  },
  init() {
    this.label = this.el.querySelector("[text]");

    const poolData = {
      UserPoolId: "ap-northeast-1_RWH9txS1J",
      ClientId: "4h2qfcv13p4c6246q37bb4v9dk"
    };
    const userPool = new myCognitouserpoolclass(poolData);

    this.updateSrc = async () => {
      if (!this.targetEl.parentNode) return; // If removed
      const mediaLoader = this.targetEl.components["media-loader"].data;
      const src = (this.src = (mediaLoader.mediaOptions && mediaLoader.mediaOptions.href) || mediaLoader.src);
      const visible = src && guessContentType(src) !== "video/vnd.hubs-webrtc";
      const mayChangeScene = this.el.sceneEl.systems.permissions.canOrWillIfCreator("update_hub");

      this.el.object3D.visible = !!visible;

      if (visible) {
        let label = "リンクを開く";
        const url = new URL(src);
        if (!this.data.onlyOpenLink) {
          let hubId;
          if (await isLocalHubsAvatarUrl(src)) {
            label = "use avatar";
          } else if ((await isLocalHubsSceneUrl(src)) && mayChangeScene) {
            label = "use scene";
          } else if ((hubId = await isHubsRoomUrl(src))) {
            if (url.hash && APP.hub.hub_id === hubId) {
              label = "go to";
            } else {
              label = "visit room";
            }
          }
        }
        this.label.setAttribute("text", "value", label);
        if(url.hash) {
          if(url.hash == "#coupon") {
            label = "クーポンを取得する";
            this.label.setAttribute("text", "value", label);
          } else {
            this.label.setAttribute("text", "value", label);
          }
        }
        
        
      }
    };

    this.onClick = async () => {
      const mayChangeScene = this.el.sceneEl.systems.permissions.canOrWillIfCreator("update_hub");

      const exitImmersive = async () => await handleExitTo2DInterstitial(false, () => {}, true);

      let hubId;
      if (this.data.onlyOpenLink) {
        await exitImmersive();
        if(this.src.hash) {
          if(this.src.hash == "#coupon") {
            /*var cognitoUser_me2 = userPool.getCurrentUser(); 
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
            }*/
          } else {
            window.open(this.src);
          }
        }
      } else if (await isLocalHubsAvatarUrl(this.src)) {
        const avatarId = new URL(this.src).pathname.split("/").pop();
        window.APP.store.update({ profile: { avatarId } });
        this.el.sceneEl.emit("avatar_updated");
      } else if ((await isLocalHubsSceneUrl(this.src)) && mayChangeScene) {
        this.el.sceneEl.emit("scene_media_selected", this.src);
      } else if ((hubId = await isHubsRoomUrl(this.src))) {
        const url = new URL(this.src);
        if (url.hash && APP.hub.hub_id === hubId) {
          // move to waypoint w/o writing to history
          window.history.replaceState(null, null, window.location.href.split("#")[0] + url.hash);
        } else {
          await exitImmersive();
          location.href = this.src;
        }
      } else {
        await exitImmersive();
        console.log(this.src)
        //window.open(this.src);
        if(this.src.hash) {
          if(this.src.hash == "#coupon") {
            /*var cognitoUser_me2 = userPool.getCurrentUser(); 
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
            }*/
          } else {
            window.open(this.src);
          }
        }
      }
    };

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;
      this.targetEl.addEventListener("media_resolved", this.updateSrc, { once: true });
      this.updateSrc();
    });
  },

  play() {
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("interact", this.onClick);
  }
});
