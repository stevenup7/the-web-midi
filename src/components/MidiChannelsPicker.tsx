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
  let aliasList: { [channelNumber: number]: string } = {};

  // load up the aliases and selected channels from config
  if (defaultValue) {
    for (const channelNumber in defaultValue) {
      aliasList[channelNumber] = defaultValue[channelNumber];
      channelList.push(parseInt(channelNumber, 10));
    }
  }

  const [selectedChannels, setSelectedChannels] = useState([...channelList]);

  const handleChannelChange = (channel: number, updatedAlias?: string) => {
    let newlist: number[];
    if (updatedAlias) {
      // we are just editing the alias not clicking a checkbox
      newlist = selectedChannels;
    } else if (selectedChannels.includes(channel)) {
      newlist = selectedChannels.filter((c) => c !== channel);
    } else {
      newlist = [...selectedChannels, channel];
    }
    setSelectedChannels([...newlist]);
    if (updatedAlias) {
      aliasList[channel] = updatedAlias;
    }
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
                  defaultValue={defaultValue ? defaultValue[index] : ""}
                  onChange={(e) => {
                    handleChannelChange(index, e.target.value);
                  }}
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
