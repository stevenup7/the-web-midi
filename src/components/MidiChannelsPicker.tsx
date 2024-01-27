import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

interface ChannelPickerProps {
  onChange: (
    channels: number[],
    aliases: { [channelNumber: number]: string }
  ) => void;
  defaultValue?: { [channelNumber: number]: string };
}

function MidiChannelsPicker({ onChange, defaultValue }: ChannelPickerProps) {
  let channelList: number[] = [];
  if (defaultValue) {
    for (const channelNumber in defaultValue) {
      channelList.push(parseInt(channelNumber, 10));
    }
  }

  const [selectedChannels, setSelectedChannels] =
    useState<number[]>(channelList);

  const handleChannelChange = (channel: number) => {
    let newlist: number[];
    if (channel === -1) {
      newlist = selectedChannels;
    } else if (selectedChannels.includes(channel)) {
      newlist = selectedChannels.filter((c) => c !== channel);
    } else {
      newlist = [...selectedChannels, channel];
    }
    setSelectedChannels(newlist);
    let aliasList: { [channelNumber: number]: string } = {};

    newlist.map((channel: number) => {
      let alias = document.getElementById(
        `channel-alias-${channel}`
      ) as HTMLInputElement;
      aliasList[channel] = alias?.value;
    });

    onChange(newlist, aliasList);
  };

  return (
    <Container fluid>
      <Form.Group className="midi-channels-picker">
        {[...Array(16)].map((_, index) => (
          <Row key={index}>
            <Col xs={1}>
              <div key={index}>
                <Form.Check
                  type="checkbox"
                  id={`channel-${index}`}
                  label={`${index + 1}`}
                  checked={selectedChannels.includes(index)}
                  onChange={() => handleChannelChange(index)}
                />
              </div>
            </Col>
            <Col xs="auto" md="auto">
              <div>
                <Form.Control
                  id={`channel-alias-${index}`}
                  type="text"
                  size="sm"
                  htmlSize={20}
                  placeholder="eg. Kick"
                  disabled={!selectedChannels.includes(index)}
                  value={
                    defaultValue
                      ? defaultValue[index]
                        ? defaultValue[index]
                        : ""
                      : ""
                  }
                  onChange={() => handleChannelChange(-1)}
                />
              </div>
            </Col>
          </Row>
        ))}
      </Form.Group>
    </Container>
  );
}

export default MidiChannelsPicker;
