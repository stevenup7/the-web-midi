import { describe, test, expect } from "vitest";

import MidiMachine from "./MidiMachine";

describe("MidiMachine", () => {
  test("can be created", () => {
    const midiMachine = new MidiMachine(
      0,
      "name",
      "midiInPort",
      "midiOutPort",
      [1, 2, 3],
      4,
      {
        1: "one",
        2: "two",
        3: "three",
      }
    );
    expect(midiMachine.id).toBe(0);

    expect(midiMachine.name).toBe("name");
    expect(midiMachine.midiInPort).toBe("midiInPort");
    expect(midiMachine.midiOutPort).toBe("midiOutPort");
    expect(midiMachine.channels).toEqual([1, 2, 3]);
    expect(midiMachine.channelAliases).toEqual({
      1: "one",
      2: "two",
      3: "three",
    });
    expect(midiMachine.fxChannel).toBe(4);
  });

  test("can be serialized and deserialized", () => {
    const midiMachine = new MidiMachine(
      0,
      "name",
      "midiInPort",
      "midiOutPort",
      [1, 2, 3],
      4,
      {
        1: "one",
        2: "two",
        3: "three",
      }
    );
    // Add serialization and deserialization tests for fxChannel here
    // and in the MidiMachine class itself.
    const serialized = midiMachine.toJSON();
    const deserialized = MidiMachine.fromJSON(serialized);
    expect(deserialized.id).toBe(0);
    expect(deserialized.name).toBe("name");
    expect(deserialized.midiInPort).toBe("midiInPort");
    expect(deserialized.midiOutPort).toBe("midiOutPort");
    expect(deserialized.channels).toEqual([1, 2, 3]);
    expect(deserialized.channelAliases).toEqual({
      1: "one",
      2: "two",
      3: "three",
    });
    expect(deserialized.fxChannel).toBe(4);
  });
});
