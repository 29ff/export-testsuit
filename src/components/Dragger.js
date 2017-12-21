import React, { Component } from 'react';
import { Grid, Icon, List, Image, Button } from 'semantic-ui-react';
import DropZone from 'react-dropzone';
import { fetchResults } from '../lib/common';

class Dragger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accept: '.json',
      dataJsonFile: {},
      jsonName: '',
      instruction: 'Import JSON file',
      disableDropzone: false,
      buttonSubmitLoading: false
    }
    this.handleDrop = this.handleDrop.bind(this);
  }

  convertName = (fileName) => {
    const name = fileName.split('.')[0];
    if (name.length > 70) {
      return `${name.slice(0, 67)}...`;
    }
    return name;
  }

  handleDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataJsonFile = JSON.parse(reader.result);
        this.setState({
          dataJsonFile,
          instruction: 'Can not import more file',
          disableDropzone: true,
          jsonName: file.name
        })
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  handleButtonSubmit = () => {
    const { dataJsonFile, jsonName } = this.state;
    this.setState({
      buttonSubmitLoading: true
    })
    setTimeout(() => {
      this.setState({
        buttonSubmitLoading: false
      })
      fetchResults(dataJsonFile, jsonName);
    }, 300)
  }

  render() {
    const { accept, disableDropzone, instruction, jsonName, buttonSubmitLoading } = this.state;
    return (
      <div>
        <Grid>
          <Grid.Column width={5}></Grid.Column>
          <Grid.Column width={6}>
            <DropZone
              id="dropzone"
              onDropAccepted={this.handleDrop}
              accept={accept}
              multiple={false}
              disabled={disableDropzone}
            >
              <p id="icon"><Icon name="download"/></p>
              <p style={{ fontSize: "1.2em" }}>Click or drag file to this area to upload</p>
              <p id="instruction">{instruction}</p>
            </DropZone>
            {
              jsonName !== '' && <div>
                <List divided verticalAlign='middle'>
                  <List.Item>
                    <Image size='mini' spaced src='/json.svg' />
                    <List.Content><List.Header>{this.convertName(jsonName)}</List.Header></List.Content>
                  </List.Item>
                </List>
                <Button
                  loading={buttonSubmitLoading}
                  fluid
                  style={{backgroundColor: "#4183c4", color: "#fff"}}
                  onClick={this.handleButtonSubmit}
                >
                  Submit
                </Button>
              </div>
            }
          </Grid.Column>
          <Grid.Column width={5}></Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Dragger;
