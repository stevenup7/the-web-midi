import { createContext } from "react";
import MidiManager from "./classes/midi/MidiManager";

const m = new MidiManager(
  () => {
    // console.log("midi manager connected");
  },
  () => {
    throw new Error("midi manager disconnected");
  }
);

export const MidiManagerContext = createContext(m);
