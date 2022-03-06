import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ReactComponent as MicrophoneIcon } from "../icons/Microphone.svg";
import { ReactComponent as MicrophoneMutedIcon } from "../icons/MicrophoneMuted.svg";
import { ToolbarButton } from "../input/ToolbarButton";
import { useMicrophone } from "./useMicrophone";
import { FormattedMessage } from "react-intl";

//talk_count: 会話回数,talk_time: 会話時間,is_talk: 会話識別
var is_talk = false;
var talk_count = 0;
var talk_time = 0;

export function VoiceButtonContainer({ scene, microphoneEnabled }) {
  const buttonRef = useRef();

  const { isMuted, volume, toggleMute } = useMicrophone(scene);

  useEffect(
    () => {
      const rect = buttonRef.current.querySelector("rect");

      if (volume < 0.05) {
        rect.setAttribute("height", 0);
        if (is_talk == true) {
          talk_count += 1;
          is_talk = false;
        }
      } else if (volume < 0.3) {
        rect.setAttribute("y", 8);
        rect.setAttribute("height", 4);
      } else {
        rect.setAttribute("y", 4);
        rect.setAttribute("height", 8);
        talk_time += 1;
        is_talk = true;
      }

      document.addEventListener('keyup', event => {
        if (event.code === 'KeyV') {
          console.log("会話回数 : " + talk_count);
          console.log("会話時間 : " + talk_time);
        }
      });
    },
    [volume, isMuted]
  );

  return (
    <ToolbarButton
      ref={buttonRef}
      icon={isMuted || !microphoneEnabled ? <MicrophoneMutedIcon /> : <MicrophoneIcon />}
      label={<FormattedMessage id="voice-button-container.label" defaultMessage="マイク" />}
      preset="basic"
      onClick={toggleMute}
      statusColor={isMuted || !microphoneEnabled ? "disabled" : "enabled"}
    />
  );
}

VoiceButtonContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  microphoneEnabled: PropTypes.bool
};
