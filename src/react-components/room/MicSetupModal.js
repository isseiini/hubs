import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as MicrophoneIcon } from "../icons/Microphone.svg";
import { ReactComponent as MicrophoneMutedIcon } from "../icons/MicrophoneMuted.svg";
import { ReactComponent as VolumeHighIcon } from "../icons/VolumeHigh.svg";
import { ReactComponent as VolumeOffIcon } from "../icons/VolumeOff.svg";
import styles from "./MicSetupModal.scss";
import { BackButton } from "../input/BackButton";
import { SelectInputField } from "../input/SelectInputField";
import { ToggleInput } from "../input/ToggleInput";
import { ToolbarButton } from "../input/ToolbarButton";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

const micButtonDiameter = 96;

export function MicSetupModal({
  className,
  onPromptMicrophone,
  selectedMicrophone,
  microphoneOptions,
  onChangeMicrophone,
  microphoneEnabled,
  micLevel,
  soundPlaying,
  onPlaySound,
  microphoneMuted,
  onChangeMicrophoneMuted,
  onEnterRoom,
  onBack,
  ...rest
}) {
  return (
    <Modal
      title={<FormattedMessage id="mic-setup-modal.title" defaultMessage="音声の設定" />}
      beforeTitle={<BackButton onClick={onBack} />}
      className={className}
      {...rest}
    >
      <Column center padding className={styles.content}>
        <p>入場される前に規約をご確認ください。</p>
        <p>
          テキストチャット及びボイスチャットの利用における合意のお願い<br/><br/>

          A.チャット利用データ取得について<br/>
          ・ボイスチャットによるチャット送信時に同じワールドに存在しているユーザーのIDデータ会話回数及び、会話相手、会話が行われたバーチャル空間上でのワールド座標データ<br/>
          ・テキストチャットによる会話回数及び、会話相手、会話が行われたバーチャル空間上でのワールド座標データ<br/>
          上記、チャット利用データが取得されることに合意する。<br/><br/>

          B.禁止行為について<br/>
          ・自己または他人のプライバシーに関する情報や個人情報を含むチャット送信や表現<br/>
          ・センシティブな内容を含むチャット送信や表現<br/>
          ・他者の誹謗・中傷等に当たる内容を含むチャット送信や表現<br/>
          ・宗教活動や政治活動を伴う内容を含むチャット送信や表現<br/>
          ・1:1の出会いを継続的に勧誘または要求する行為<br/>
          ・交際相手を求める行為や出会いを目的とする行為<br/>
          ・一緒に宿泊や居住する相手を探そうとする行為<br/>
          ・その他社会的に容認されないと判断される出会い行為<br/>
          ・わいせつな内容を含むチャット送信や表現<br/>
          ・VR道頓堀商店会管理者が定める運営方針に反する行為<br/>
          ・不適切ニックネームでのVR道頓堀商店会が提供するVRワールドへの参加<br/>
          ・VR道頓堀商店会が提供するVRワールドへの入退室を繰り返す行為<br/>
          ・不適切なチャット送信、またそれを連続的におこなう行為(テキストチャット、ボイスチャット)<br/>
          ・その他のスパムとみなされる行為<br/>
          ・真偽不明の情報の拡散<br/>
          ・悪質なVR道頓堀商店会が提供するVRワールド乗っ取り行為<br/>
          ・悪意をもって他者になりすます行為<br/>
          ・ネットワークビジネスへの勧誘<br/>
          ・禁止薬物の売買や株式などの不法取引、違法な商業活動<br/>
          ・その他、違法行為、およびそれを助長する内容のチャット送信<br/>
          ・自殺予告など過激なチャット送信<br/>
          ・第三者の権利・利益の侵害、また本来の使用方法・目的とは異なる方法・目的でのVR道頓堀商店会利用等の不正行為及び迷惑行為<br/>
          ・薬物等、危険物その他の物品の乱用、誤った使用法等により生命・身体に危険を及ぼす可能性がある行為を紹介、推奨、助長等する行為<br/><br/>

          上記、禁止行為に該当する行為を行わないことに合意する。
        </p>

        <p>
          <FormattedMessage
            id="mic-setup-modal.check-mic"
            defaultMessage="入場する前にマイクとスピーカーを確認してください。"
          />
        </p>
        <div className={styles.audioCheckContainer}>
          <ToolbarButton
            icon={
              microphoneEnabled && !microphoneMuted ? (
                <MicrophoneIcon width={48} height={48} />
              ) : (
                <MicrophoneMutedIcon width={48} height={48} />
              )
            }
            label={
              microphoneEnabled ? (
                <FormattedMessage id="mic-setup-modal.test-mic" defaultMessage="マイクをテストする" />
              ) : (
                <FormattedMessage id="mic-setup-modal.mic-disabled" defaultMessage="Microphone Disabled" />
              )
            }
            className={classNames(styles.largeToolbarButton, styles.micButton)}
            iconContainerClassName={styles.micButtonContainer}
            onClick={onPromptMicrophone}
            disabled={microphoneEnabled}
            large
          >
            <div
              className={styles.micLevelIcon}
              style={{
                clip: `rect(${micButtonDiameter -
                  Math.floor(micLevel * micButtonDiameter)}px, ${micButtonDiameter}px, ${micButtonDiameter}px, 0px)`
              }}
            >
              {microphoneEnabled && !microphoneMuted ? (
                <MicrophoneIcon className={styles.clippedIcon} width={48} height={48} />
              ) : (
                <MicrophoneMutedIcon className={styles.clippedIcon} width={48} height={48} />
              )}
            </div>
            <div
              className={styles.micLevel}
              style={{
                clip: `rect(${micButtonDiameter -
                  Math.floor(micLevel * micButtonDiameter)}px, ${micButtonDiameter}px, ${micButtonDiameter}px, 0px)`
              }}
            >
              <svg
                width={micButtonDiameter}
                height={micButtonDiameter}
                viewBox={`0 0 ${micButtonDiameter} ${micButtonDiameter}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx={micButtonDiameter / 2}
                  cy={micButtonDiameter / 2}
                  r={micButtonDiameter / 2}
                  fill="currentColor"
                  fillOpacity="0.8"
                />
              </svg>
            </div>
          </ToolbarButton>
          <ToolbarButton
            icon={soundPlaying ? <VolumeHighIcon width={48} height={48} /> : <VolumeOffIcon width={48} height={48} />}
            label={<FormattedMessage id="mic-setup-modal.test-audio" defaultMessage="スピーカーをテストする" />}
            preset={soundPlaying ? "primary" : "basic"}
            className={styles.largeToolbarButton}
            onClick={onPlaySound}
            large
          />
        </div>
        <>
          <SelectInputField value={selectedMicrophone} options={microphoneOptions} onChange={onChangeMicrophone} />
          <ToggleInput
            label={<FormattedMessage id="mic-setup-modal.mute-mic-toggle" defaultMessage="ミュートする" />}
            checked={microphoneMuted}
            onChange={onChangeMicrophoneMuted}
          />
        </>
        <Button preset="accept" onClick={onEnterRoom}>
          <FormattedMessage id="mic-setup-modal.enter-room-button" defaultMessage="規約に合意して入場する" />
        </Button>
      </Column>
    </Modal>
  );
}

MicSetupModal.propTypes = {
  className: PropTypes.string,
  soundPlaying: PropTypes.bool,
  onPlaySound: PropTypes.func,
  micLevel: PropTypes.number,
  microphoneEnabled: PropTypes.bool,
  microphoneMuted: PropTypes.bool,
  onChangeMicrophoneMuted: PropTypes.func,
  selectedMicrophone: PropTypes.string,
  microphoneOptions: PropTypes.array,
  onChangeMicrophone: PropTypes.func,
  onPromptMicrophone: PropTypes.func,
  onEnterRoom: PropTypes.func,
  onBack: PropTypes.func
};

MicSetupModal.defaultProps = {
  micLevel: 0
};
