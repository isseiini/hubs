import "./utils/debug-log";
import "./webxr-bypass-hacks";
import configs from "./utils/configs";
import "./utils/theme";
import "@babel/polyfill";

console.log(`App version: ${process.env.BUILD_VERSION || "?"}`);

import "./react-components/styles/global.scss";
import "./assets/stylesheets/globals.scss";

import CognitoUser from "amazon-cognito-identity-js/src/CognitoUser";
import CognitoUserPool from "amazon-cognito-identity-js/src/CognitoUserPool";
import AuthenticationHelper from "amazon-cognito-identity-js/src/AuthenticationHelper";
import DateHelper from "amazon-cognito-identity-js/src/DateHelper";
import BigInteger from "amazon-cognito-identity-js/src/BigInteger";
import CryptoJS from "crypto-js/core";
import Base64 from "crypto-js/enc-base64";
import { Buffer } from "buffer";
import HmacSHA256 from "crypto-js/hmac-sha256";
import CognitoAccessToken from "amazon-cognito-identity-js/src/CognitoAccessToken";
import CognitoIdToken from "amazon-cognito-identity-js/src/CognitoIdToken";
import CognitoRefreshToken from "amazon-cognito-identity-js/src/CognitoRefreshToken";
import CognitoUserSession from "amazon-cognito-identity-js/src/CognitoUserSession";
import Client from "amazon-cognito-identity-js/src/Client";

import CognitoUserAttribute from "amazon-cognito-identity-js/src/CognitoUserAttribute";
import StorageHelper from "amazon-cognito-identity-js/src/StorageHelper";
import { func } from "prop-types";

AWS.config.region = "ap-northeast-1"; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-northeast-1:ed1df237-f6f6-441a-8a2c-7f958ab642ae"
});

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

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

const isBrowser = typeof navigator !== "undefined";
const userAgent = isBrowser ? navigator.userAgent : "nodejs";
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
      throw new Error("Username and Pool information are required.");
    }

    this.username = data.Username || "";
    this.pool = data.Pool;
    this.Session = null;
    this.client = data.Pool.client;

    this.signInUserSession = null;
    this.authenticationFlowType = "USER_SRP_AUTH";

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
      return callback(new Error("Username is null. Cannot retrieve a new session"), null);
    }

    if (this.signInUserSession != null && this.signInUserSession.isValid()) {
      return callback(null, this.signInUserSession);
    }

    const keyPrefix = `CognitoIdentityServiceProvider.${this.pool.getClientId()}.${this.username}`;
    const idTokenKey = `${keyPrefix}.idToken`;
    const accessTokenKey = `${keyPrefix}.accessToken`;
    const refreshTokenKey = `${keyPrefix}.refreshToken`;
    const clockDriftKey = `${keyPrefix}.clockDrift`;

    if (this.storage.getItem(idTokenKey)) {
      const idToken = new CognitoIdToken({
        IdToken: this.storage.getItem(idTokenKey)
      });
      const accessToken = new CognitoAccessToken({
        AccessToken: this.storage.getItem(accessTokenKey)
      });
      const refreshToken = new CognitoRefreshToken({
        RefreshToken: this.storage.getItem(refreshTokenKey)
      });
      const clockDrift = parseInt(this.storage.getItem(clockDriftKey), 0) || 0;

      const sessionData = {
        IdToken: idToken,
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        ClockDrift: clockDrift
      };
      const cachedSession = new CognitoUserSession(sessionData);

      if (cachedSession.isValid()) {
        this.signInUserSession = cachedSession;
        return callback(null, this.signInUserSession);
      }

      if (!refreshToken.getToken()) {
        return callback(new Error("Cannot retrieve a new session. Please authenticate."), null);
      }

      this.refreshSession(refreshToken, callback, options.clientMetadata);
    } else {
      callback(new Error("Local storage is missing an ID Token, Please authenticate"), null);
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

    const { UserPoolId, ClientId, endpoint, fetchOptions, AdvancedSecurityDataCollectionFlag } = data || {};
    if (!UserPoolId || !ClientId) {
      throw new Error("Both UserPoolId and ClientId are required.");
    }
    if (UserPoolId.length > USER_POOL_ID_MAX_LENGTH || !/^[\w-]+_[0-9a-zA-Z]+$/.test(UserPoolId)) {
      throw new Error("Invalid UserPoolId format.");
    }
    const region = UserPoolId.split("_")[0];

    this.userPoolId = UserPoolId;
    this.clientId = ClientId;

    this.client = new Client(region, endpoint, fetchOptions);

    /**
     * By default, AdvancedSecurityDataCollectionFlag is set to true,
     * if no input value is provided.
     */
    this.advancedSecurityDataCollectionFlag = AdvancedSecurityDataCollectionFlag !== false;

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
  signUp(username, password, userAttributes, validationData, callback, clientMetadata) {
    const jsonReq = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: userAttributes,
      ValidationData: validationData,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData(username)) {
      jsonReq.UserContextData = this.getUserContextData(username);
    }
    this.client.request("SignUp", jsonReq, (err, data) => {
      if (err) {
        return callback(err, null);
      }

      const cognitoUser = {
        Username: username,
        Pool: this,
        Storage: this.storage
      };

      const returnData = {
        user: new myCognitouserclass(cognitoUser),
        userConfirmed: data.UserConfirmed,
        userSub: data.UserSub,
        codeDeliveryDetails: data.CodeDeliveryDetails
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
        Storage: this.storage
      };

      return new myCognitouserclass(cognitoUser);
    }

    return null;
  }
}

const userPool = new myCognitouserpoolclass(poolData);

document.addEventListener("DOMContentLoaded", async () => {
  var btn = document.querySelectorAll(".open_path_menu");
  document.getElementById("main1-bottom").style.height = "30vh";
  document.getElementById("main2-bottom").style.height = "30vh";
  document.getElementById("hubs-bottom").style.height = "30vh";
  document.getElementById("VRChat-bottom").style.height = "30vh";
  btn.forEach(function(el, i) {
    el.parentElement.addEventListener("click", function() {
      if (el.parentElement.parentElement.style.height == "30vh") {
        el.parentElement.parentElement.style.height = "auto";
        el.innerHTML = "クリックして閉じる";
        el.parentElement.children[1].setAttribute("data-augmented-ui", "all-triangle-up");
      } else {
        el.parentElement.parentElement.style.height = "30vh";
        el.innerHTML = "クリックして開く";
        el.parentElement.children[1].setAttribute("data-augmented-ui", "all-triangle-down");
      }
    });
  });

  var confirm_terms = document.getElementById("confirm-terms-button");
  confirm_terms.addEventListener("click", function() {
    document.getElementById("terms-container").style.display = "none";
  });

  const main_contents1 = document.getElementById("main-contents1");
  const main_contents2 = document.getElementById("main-contents2");

  const attributeList = [];

  const createAccountBtn = document.getElementById("createAccount");
  createAccountBtn.addEventListener("click", () => {
    const email_signup = document.getElementById("email-signup").value;
    const name_signup = document.getElementById("name-signup").value;
    const password_signup = document.getElementById("password-signup").value;
    const age_signup = document.getElementById("age-signup").value;
    const sex_signup = document.getElementById("sex-signup").value;
    const location_signup = document.getElementById("location-signup").value;
    const hobby_signup = document.getElementById("hobby-signup").innerText;
    const game_signup = document.getElementById("game-signup").innerText;
    const experience_signup = document.getElementById("experience-signup").innerText;

    if (!email_signup | !name_signup | !password_signup | !age_signup | !sex_signup | !location_signup) {
      alert("未入力項目があります。");
      return false;
    }

    const dataName = {
      Name: "name",
      Value: name_signup
    };
    const attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    const dataEmail = {
      Name: "email",
      Value: email_signup
    };
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    const dataAge = {
      Name: "custom:age",
      Value: age_signup
    };
    const attributeAge = new AmazonCognitoIdentity.CognitoUserAttribute(dataAge);

    const dataSex = {
      Name: "custom:sex",
      Value: sex_signup
    };
    const attributeSex = new AmazonCognitoIdentity.CognitoUserAttribute(dataSex);

    const dataLocation = {
      Name: "custom:location",
      Value: location_signup
    };
    const attributeLocation = new AmazonCognitoIdentity.CognitoUserAttribute(dataLocation);

    const dataHobby = {
      Name: "custom:hobby",
      Value: hobby_signup
    };
    const attributeHobby = new AmazonCognitoIdentity.CognitoUserAttribute(dataHobby);

    const dataGame = {
      Name: "custom:game",
      Value: game_signup
    };
    const attributeGame = new AmazonCognitoIdentity.CognitoUserAttribute(dataGame);

    const dataExperience = {
      Name: "custom:experience",
      Value: experience_signup
    };
    const attributeExperience = new AmazonCognitoIdentity.CognitoUserAttribute(dataExperience);

    attributeList.push(attributeName);
    attributeList.push(attributeEmail);
    attributeList.push(attributeAge);
    attributeList.push(attributeSex);
    attributeList.push(attributeLocation);
    attributeList.push(attributeHobby);
    attributeList.push(attributeGame);
    attributeList.push(attributeExperience);

    userPool.signUp(name_signup, password_signup, attributeList, null, (err, data1) => {
      if (err) {
        alert("失敗しました。");
      } else {
        alert("登録したメールアドレスへアクティベーション用のリンクを送付しました。");
      }
    });
  });

  document.getElementById("signinButton").addEventListener("click", () => {
    const email_signin = document.getElementById("email-signin").value;
    const password_signin = document.getElementById("password-signin").value;

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
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

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
    if (cognitoUser_me) {
      cognitoUser_me.getSession((err, session) => {
        if (err) {
          console.log(err);
        } else {
          cognitoUser_me.signOut();
          alert("ログアウトしました。");
        }
      });
    }
  });

  document.getElementById("hubs-middle").addEventListener("click", function() {
    const cognito_mine = userPool.getCurrentUser();
    if (cognito_mine == null) {
      alert("ログインしてください。");
      return;
    }
    if (cognito_mine != null) {
      cognito_mine.getSession((err, session) => {
        if (err) {
          alert("ログインしてください。");
          return;
        } else {
          var matching_params = {
            TableName: "Sightseeing-table"
          };
          docClient.scan(matching_params, function(err, data3) {
            if (err) {
              console.log(err);
            } else {
              data3.Items.sort((a, b) => b.Sum - a.Sum);
              var goal_url = "https://virtual-dotonbori.com/" + data3.Items[0].hubId + "/" + data3.Items[0].URL;
              var match_sightseeing = {
                TableName: "Sightseeing-table",
                Key: {
                  //更新したい項目をプライマリキー(及びソートキー)によって１つ指定
                  URL: data3.Items[0].URL
                },
                ExpressionAttributeNames: {
                  "#S": "Sum"
                },
                ExpressionAttributeValues: {
                  ":add": 1
                },
                UpdateExpression: "SET #S = #S + :add"
              };
              if (confirm("マッチングしました。観光ワールドへ移動します。")) {
                docClient.update(match_sightseeing, function(err, data2) {
                  if (err) {
                    console.log("error");
                  } else {
                    console.log("success");
                  }
                });
                setTimeout(() => {
                  location.href = goal_url;
                }, 3000);
              } else {
                //alert("キャンセルしました。");
              }
            }
          });
        }
      });
    }
  });

  document.getElementById("VRChat-middle").addEventListener("click", function() {
    location.href = "https://vrch.at/wrld_4432ea9b-729c-46e3-8eaf-846aa0a37fdd";
  });

  document.getElementById("menu-button").addEventListener("click", function() {
    document.getElementById("menu-button").style.display = "none";
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

  document.documentElement.style.setProperty("--display1", "block");

  document.getElementById("grid-tl").addEventListener("click", function() {
    document.documentElement.style.setProperty("--main-color", "rgb(76, 183, 233)");
    document.documentElement.style.setProperty("--sub-color", "rgb(76, 183, 233, 0.3)");
    document.documentElement.style.setProperty("--display1", "block");
    document.documentElement.style.setProperty("--display2", "none");
    document.documentElement.style.setProperty("--display3", "none");
    document.documentElement.style.setProperty("--display4", "none");
    document.documentElement.style.setProperty("--display5", "none");
    document.documentElement.style.setProperty("--display6", "none");
  });

  document.getElementById("grid-tr").addEventListener("click", function() {
    document.documentElement.style.setProperty("--main-color", "rgb(255, 124, 124)");
    document.documentElement.style.setProperty("--sub-color", "rgb(255, 124, 124, 0.3)");
    document.documentElement.style.setProperty("--display1", "none");
    document.documentElement.style.setProperty("--display2", "block");
    document.documentElement.style.setProperty("--display3", "none");
    document.documentElement.style.setProperty("--display4", "none");
    document.documentElement.style.setProperty("--display5", "none");
    document.documentElement.style.setProperty("--display6", "none");
  });

  document.getElementById("grid-ml").addEventListener("click", function() {
    document.documentElement.style.setProperty("--main-color", "rgb(255, 253, 108)");
    document.documentElement.style.setProperty("--sub-color", "rgb(255, 253, 108, 0.3)");
    document.documentElement.style.setProperty("--display1", "none");
    document.documentElement.style.setProperty("--display2", "none");
    document.documentElement.style.setProperty("--display3", "none");
    document.documentElement.style.setProperty("--display4", "none");
    document.documentElement.style.setProperty("--display5", "none");
    document.documentElement.style.setProperty("--display6", "block");
  });

  document.getElementById("grid-mc").addEventListener("click", function() {
    document.getElementById("menu-button").style.display = "flex";
    document.getElementById("hex-grid").style.display = "none";
    document.getElementById("grid-tl").style.display = "none";
    document.getElementById("grid-tr").style.display = "none";
    document.getElementById("grid-ml").style.display = "none";
    document.getElementById("grid-mc").style.display = "none";
    document.getElementById("grid-mr").style.display = "none";
    document.getElementById("grid-bl").style.display = "none";
    document.getElementById("grid-br").style.display = "none";
  });

  document.getElementById("grid-mr").addEventListener("click", function() {
    document.documentElement.style.setProperty("--main-color", "rgb(93, 255, 128)");
    document.documentElement.style.setProperty("--sub-color", "rgb(93, 255, 128, 0.3)");
    document.documentElement.style.setProperty("--display1", "none");
    document.documentElement.style.setProperty("--display2", "none");
    document.documentElement.style.setProperty("--display3", "block");
    var cognitoUser_me2 = userPool.getCurrentUser();
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err);
      } else {
        cognitoUser_me2.getUserAttributes((err, result) => {
          if (err) {
            console.log(err);
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            }
          }
        });
      }
    });
    document.getElementById("my_data").innerText = "あなたのIDは" + currentUserData["sub"] + "です。";
    document.documentElement.style.setProperty("--display4", "none");
    document.documentElement.style.setProperty("--display5", "none");
    document.documentElement.style.setProperty("--display6", "none");
  });

  function generate_table() {
    var cognitoUser_me2 = userPool.getCurrentUser();
    cognitoUser_me2.getSession((err, session) => {
      if (err) {
        console.log(err);
      } else {
        cognitoUser_me2.getUserAttributes((err, result) => {
          if (err) {
            console.log(err);
          } else {
            var i;
            for (i = 0; i < result.length; i++) {
              currentUserData[result[i].getName()] = result[i].getValue();
            }

            var coupon_params = {
              TableName: "coupon",
              IndexName: "User_ID-index",
              ExpressionAttributeNames: { "#U": "User_ID" },
              ExpressionAttributeValues: { ":val": currentUserData["sub"] },
              KeyConditionExpression: "#U = :val"
            };
            docClient.query(coupon_params, function(err, coupon_data) {
              if (err) {
                console.log(err);
              } else {
                let coupon_available = document.getElementById("coupon-available");
                let coupon_used = document.getElementById("coupon-used");

                coupon_available.innerHTML = "";
                coupon_used.innerHTML = "";

                let coupon_list = coupon_data.Items;
                let coupon_available_list = coupon_list.filter(x => x.available_or_used === "available");
                let coupon_used_list = coupon_list.filter(x => x.available_or_used === "used");

                // creates a <table> element and a <tbody> element
                var tbl = document.createElement("table");
                tbl.setAttribute("id", "coupon_table");
                var tblBody = document.createElement("tbody");

                var label_1 = document.createElement("tr");

                var label_1_number = document.createElement("th");
                label_1_number.classList.add("arrow_box");
                label_1_number.classList.add("styleme");
                label_1_number.setAttribute("data-augmented-ui", "tl-clip tr-clip-x br-clip both");
                var label_1_number_txt = document.createTextNode("対象店舗");
                label_1_number.appendChild(label_1_number_txt);
                label_1.appendChild(label_1_number);

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
                  cell_1_4.innerHTML =
                    '<input class="use_Coupon" style="padding: 8px 15px" type="button" value="表示する">';

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
                label_2.appendChild(label_2_number);

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
                  target.addEventListener("click", function(event) {
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
                    if (target.parentNode.parentNode.children[0].innerText == "アンドリューのエッグタルト 道頓堀本店") {
                      coupon_logo = "coupon_logo1";
                      coupon_message = "message_1";
                    } else if (target.parentNode.parentNode.children[0].innerText == "お好み焼き 千房 道頓堀支店") {
                      coupon_logo = "coupon_logo2";
                      coupon_message = "message_2";
                    } else if (target.parentNode.parentNode.children[0].innerText == "串カツだるま 道頓堀店") {
                      coupon_logo = "coupon_logo3";
                      coupon_message = "message_3";
                    } else if (target.parentNode.parentNode.children[0].innerText == "くれおーる 道頓堀店") {
                      coupon_logo = "coupon_logo4";
                      coupon_message = "message_4";
                    } else if (target.parentNode.parentNode.children[0].innerText == "道頓堀コナモンミュージアム") {
                      coupon_logo = "coupon_logo5";
                      coupon_message = "message_5";
                    } else if (target.parentNode.parentNode.children[0].innerText == "たこ八 道頓堀総本店") {
                      coupon_logo = "coupon_logo6";
                      coupon_message = "message_6";
                    } else if (target.parentNode.parentNode.children[0].innerText == "なにわ名物 いちびり庵 道頓堀店") {
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
                    innerElement.addEventListener("click", () => {
                      closeModal();
                    });

                    document.getElementById("confirm_use_Coupon").addEventListener("click", () => {
                      if (
                        span1.innerText != target.parentNode.parentNode.children[0].innerText ||
                        span2.innerText != target.parentNode.parentNode.children[1].innerText ||
                        span3.innerText != target.parentNode.parentNode.children[2].innerText
                      ) {
                        return false;
                      }
                      var confirmed_coupon = {
                        TableName: "coupon",
                        Key: {
                          //更新したい項目をプライマリキー(及びソートキー)によって１つ指定
                          Play_ID: currentUserData["sub"] + ":" + span3.innerText + ":" + span1.innerText
                        },
                        ExpressionAttributeNames: {
                          "#available_or_used": "available_or_used",
                          "#used_Date": "used_Date"
                        },
                        ExpressionAttributeValues: {
                          ":used": "used",
                          ":used_Date": current_Date
                        },
                        UpdateExpression: "SET #available_or_used = :used, #used_Date = :used_Date"
                      };
                      docClient.update(confirmed_coupon, function(err, data2) {
                        if (err) {
                          console.log("error");
                        } else {
                          console.log("success");
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
              }
            });
          }
        });
      }
    });
  }

  document.getElementById("grid-bl").addEventListener("click", function() {
    generate_table();
    document.documentElement.style.setProperty("--main-color", "rgb(255, 93, 215)");
    document.documentElement.style.setProperty("--sub-color", "rgb(255, 93, 215, 0.3)");
    document.documentElement.style.setProperty("--display1", "none");
    document.documentElement.style.setProperty("--display2", "none");
    document.documentElement.style.setProperty("--display3", "none");
    document.documentElement.style.setProperty("--display4", "none");
    document.documentElement.style.setProperty("--display5", "block");
    document.documentElement.style.setProperty("--display6", "none");
  });

  document.getElementById("grid-br").addEventListener("click", function() {
    document.documentElement.style.setProperty("--main-color", "rgb(185, 185, 185)");
    document.documentElement.style.setProperty("--sub-color", "rgb(185, 185, 185, 0.3)");
    document.documentElement.style.setProperty("--display1", "none");
    document.documentElement.style.setProperty("--display2", "none");
    document.documentElement.style.setProperty("--display3", "none");
    document.documentElement.style.setProperty("--display4", "block");
    document.documentElement.style.setProperty("--display5", "none");
    document.documentElement.style.setProperty("--display6", "none");
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

  document.addEventListener("keydown", event => {
    if (event.altKey && event.code === "Slash") {
      var cognitoUser_me2 = userPool.getCurrentUser();
      cognitoUser_me2.getSession((err, session) => {
        if (err) {
          console.log(err);
        } else {
          cognitoUser_me2.getUserAttributes((err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          });
        }
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

  /*const Game_Restart = document.getElementById("Game-Restart");
  const Game_Result = document.getElementById("game-progress-origin");
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
  })*/
});
