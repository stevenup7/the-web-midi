class MidiMachine {
  id: number;
  name: string;
  midiInPort: string;
  midiOutPort: string;
  channels: number[];
  fxChannel: number;
  channelAliases: { [channelNumber: number]: string };

  constructor(
    id: number,
    name: string,
    midiInPort: string,
    midiOutPort: string,
    channels: number[],
    fxChannel: number,
    channelAliases: { [channelNumber: number]: string }
  ) {
    this.id = id;
    this.name = name;
    this.midiInPort = midiInPort;
    this.midiOutPort = midiOutPort;
    this.channels = channels;
    this.fxChannel = fxChannel;
    this.channelAliases = channelAliases;
  }

  toString(): string {
    return this.name + this.id;
  }

  toJSON(indent?: number): string {
    if (indent) {
      // return a formatted string
      return JSON.stringify(
        {
          id: this.id,
          name: this.name,
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
      data.midiInPort,
      data.midiOutPort,
      data.channels,
      data.fxChannel,
      data.channelAliases
    );
  }
}

export default MidiMachine;
