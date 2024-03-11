class MidiMachine {
  id: number; // unique id only used for internal purposes
  name: string; // descriptive name of the machine entered by user
  midiName: string; // port name of the midi device (from web midi api)
  midiInPort: string;
  midiOutPort: string;
  channels: number[];
  fxChannel: number;
  channelAliases: { [channelNumber: number]: string };
  connected: boolean;

  constructor(
    id: number,
    name: string,
    midiName: string,
    midiInPort: string,
    midiOutPort: string,
    channels: number[],
    fxChannel: number,
    channelAliases: { [channelNumber: number]: string }
  ) {
    this.id = id;
    this.name = name;
    this.midiName = midiName;
    this.midiInPort = midiInPort;
    this.midiOutPort = midiOutPort;
    this.channels = channels;
    this.fxChannel = fxChannel;
    this.channelAliases = channelAliases;
    this.connected = false;
  }

  toString(): string {
    if (this.connected) {
      return this.name + " (id:" + this.id + ") connected";
    }
    return this.name + " (id:" + this.id + ")";
  }

  toJSON(indent?: number): string {
    if (indent) {
      // return a formatted string
      return JSON.stringify(
        {
          id: this.id,
          name: this.name,
          midiName: this.midiName,
          midiInPort: this.midiInPort,
          midiOutPort: this.midiOutPort,
          channels: this.channels,
          fxChannel: this.fxChannel,
          channelAliases: this.channelAliases,
        },
        null,
        indent
      );
    } else {
      // just splat it back
      return JSON.stringify({
        id: this.id,
        name: this.name,
        midiName: this.midiName,
        midiInPort: this.midiInPort,
        midiOutPort: this.midiOutPort,
        channels: this.channels,
        fxChannel: this.fxChannel,
        channelAliases: this.channelAliases,
      });
    }
  }

  static fromJSON(json: string): MidiMachine {
    const data = JSON.parse(json);

    return new MidiMachine(
      data.id,
      data.name,
      data.midiName,
      data.midiInPort,
      data.midiOutPort,
      data.channels,
      data.fxChannel,
      data.channelAliases
    );
  }
}

export default MidiMachine;
