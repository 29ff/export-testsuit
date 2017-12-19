import React, { Component } from 'react';
import { Grid, Icon, List, Image, Button, Divider } from 'semantic-ui-react';
import DropZone from 'react-dropzone';

class Dragger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accept: '.xlsx',
      excelName: '',
      jsonName: '',
      instruction: 'Import EXCEL file first',
      fileList: [],
      disableDropzone: false,
      buttonSubmitLoading: false,
      buttonSubmitDisable: false,
      hasResult: false,
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

  handleDrop = (file) => {
    if (this.state.accept === '.xlsx') {
      this.setState({
        excelName: file[0].name,
        accept: '.json',
        instruction: 'Then import JSON file',
        fileList: [...this.state.fileList, file]
      })
    } else {
      this.setState(({fileList}) => ({
        jsonName: file[0].name,
        instruction: 'Can not import more file',
        fileList: [...fileList, file],
        disableDropzone: true
      }))
    }
  }

  handleButtonSubmit = () => {
    this.setState({
      buttonSubmitLoading: true
    })
    setTimeout(() => {
      this.setState({
        buttonSubmitLoading: false,
        hasResult: true,
        buttonSubmitDisable: true
      })
    }, 1000)
  }

  render() {
    const { fileList, accept, disableDropzone, instruction, excelName, jsonName, buttonSubmitLoading, buttonSubmitDisable, hasResult } = this.state;
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
              fileList.length !== 0 && <List divided verticalAlign='middle'>
                {excelName !== '' && <List.Item>
                  <Image size='mini' spaced src='/excel.svg' />
                  <List.Content><List.Header>{this.convertName(excelName)}</List.Header></List.Content>
                </List.Item>}
                {jsonName !== '' && <List.Item>
                  <Image size='mini' spaced src='/json.svg' />
                  <List.Content><List.Header>{this.convertName(jsonName)}</List.Header></List.Content>
                </List.Item>}
              </List>
            }
            {
              disableDropzone && <Button
                loading={buttonSubmitLoading}
                disabled={buttonSubmitDisable}
                fluid
                style={{backgroundColor: "#4183c4", color: "#fff"}}
                onClick={this.handleButtonSubmit}
              >
                Submit
              </Button>
            }
            {hasResult && <div><Divider horizontal>Choose action</Divider>
            <Button.Group fluid>
              <Button color="instagram">View</Button>
              <Button.Or />
              <Button positive>Download</Button>
            </Button.Group></div>}
          </Grid.Column>
          <Grid.Column width={5}></Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Dragger;