import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import PropTypes, { func } from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { render } from "react-dom";

AWS.config.region = "ap-northeast-1"; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-northeast-1:ed1df237-f6f6-441a-8a2c-7f958ab642ae"
});

var docClient = new AWS.DynamoDB.DocumentClient();

export const LeaveReason = {
  leaveRoom: "leaveRoom",
  joinRoom: "joinRoom",
  createRoom: "createRoom"
};

const reasonMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.message",
    defaultMessage: "本当に退出してもよろしいですか"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.message",
    defaultMessage: "Joining a new room will leave this one. Are you sure?"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.message",
    defaultMessage: "Creating a new room will leave this one. Are you sure?"
  }
});

const confirmationMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.confirm",
    defaultMessage: "退出する"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.confirm",
    defaultMessage: "ワールドに入場する"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.confirm",
    defaultMessage: "Leave and Create Room"
  }
});

export function LeaveRoomModal({ reason, destinationUrl, onClose }) {
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="leave-room-modal.title" defaultMessage="トップページに戻ります" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center centerMd="both" grow>
        <p>{intl.formatMessage(reasonMessages[reason])}</p>
        <Button
          as="a"
          preset="cancel"
          rel="noopener noreferrer"
          onClick={() => {
            let arr1 = [
              "fresh-candid-barbecue",
              "posh-courteous-plane",
              "curly-wicked-conclave",
              "clever-powerful-gala",
              "kooky-passionate-safari"
            ];
            let arr2 = [
              "conscious-tricky-camp",
              "impressive-easygoing-commons",
              "fine-zigzag-exploration",
              "wee-likable-commons",
              "envious-shiny-vacation"
            ];
            let arr3 = [
              "devoted-healthy-gala",
              "petty-handsome-plaza",
              "real-qualified-spot",
              "absolute-pertinent-convention",
              "neat-striking-spot"
            ];
            let arr4 = [
              "celebrated-calm-rendezvous",
              "lasting-spiffy-camp",
              "leafy-expert-dominion",
              "melodic-courageous-picnic",
              "plump-cheerful-plane"
            ];
            var current_url = (location.protocol + "//" + location.hostname + location.pathname).split("/");

            var room_name = String(current_url[current_url.length - 1]);

            document.getElementById("avatar-pov-node").object3D.rotation;
            var Communication_params = {
              TableName: "Communication",
              Item: {
                PlayID: PlayID,
                URL: room_name,
                text_chat_count: use_text_chat_count,
                voice_chat_count: talk_count,
                voice_chat_time: talk_time,
                User: UserData,
                talk_position: talk_position,
                start_Date: startDate
              }
            };
            docClient.put(Communication_params, function(err, data) {
              if (err) {
                console.log("error");
              } else {
                console.log("success");
              }
            });
            var Position_params = {
              TableName: "Position",
              Item: {
                PlayID: PlayID,
                URL: room_name,
                User: UserData,
                start_Date: startDate,
                Position: Positionlist
              }
            };
            docClient.put(Position_params, function(err, data) {
              if (err) {
                console.log("error");
              } else {
                console.log("success");
              }
            });
            var ViewPoint_params = {
              TableName: "Communication",
              Item: {
                PlayID: PlayID,
                URL: room_name,
                User: UserData,
                start_Date: startDate,
                ViewPoint: ViewPointlist
              }
            };
            docClient.put(ViewPoint_params, function(err, data) {
              if (err) {
                console.log("error");
              } else {
                location.href = "/";
              }
            });
          }}
        >
          {intl.formatMessage(confirmationMessages[reason])}
        </Button>
      </Column>
    </Modal>
  );
}
// onClick="leave_confirmed"
LeaveRoomModal.propTypes = {
  reason: PropTypes.string,
  destinationUrl: PropTypes.string,
  onClose: PropTypes.func
};
