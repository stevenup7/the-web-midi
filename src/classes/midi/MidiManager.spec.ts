import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

import MidiManager from "./MidiManager";
import MidiMachine from "./MidiMachine";

const createMachine = () => {
  return new MidiMachine(
    999,
    "name",
    "port-name",
    "port-in",
    "port-out",
    [1, 2, 3],
    16,
    {
      1: "one",
      2: "two",
      3: "three",
    }
  );
};

const MockNavigator = vi.fn(() => ({
  requestMIDIAccess: () => {
    return new Promise((_resolve, _reject) => {});
  },
}));
vi.stubGlobal("navigator", MockNavigator);

describe("MidiManager", () => {
  let midiManager: MidiManager;

  beforeEach(() => {
    midiManager = new MidiManager(
      () => {},
      () => {}
    );
  });

  afterEach(() => {
    // Clean up any resources used by the MidiManager
  });

  test("should add a MIDI machine", () => {
    const machine = createMachine();
    midiManager.addEventListener("midiSuccess", (e: any) => {
      console.log("MIDI Success", e);
    });
    midiManager.addMachine(machine);

    expect(midiManager.midiMachines).toContain(machine);
  });

  test("should get a MIDI machine on a specific port", () => {
    const machine = createMachine();
    midiManager.addMachine(machine);

    const foundMachine = midiManager.getMachieOnPort("port-in");

    expect(foundMachine).toBe(machine);
  });

  test("should get the list of MIDI inputs and outputs", () => {
    const inputsAndOutputs = midiManager.getInputsAndOutputs();

    // Assert on the expected inputs and outputs
  });

  // Add more tests for other methods in the MidiManager class
});
