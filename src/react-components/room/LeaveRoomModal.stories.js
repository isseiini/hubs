import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { LeaveReason, LeaveRoomModal } from "./LeaveRoomModal";

export default {
  title: "LeaveRoomModal",
  parameters: {
    layout: "fullscreen"
  },
  args: {
    destinationUrl: "#"
  }
};

export const LeaveRoom = args => <RoomLayout modal={<LeaveRoomModal reason={LeaveReason.joinRoom} {...args} />} />;

export const CreateRoom = args => <RoomLayout modal={<LeaveRoomModal reason={LeaveReason.createRoom} {...args} />} />;
