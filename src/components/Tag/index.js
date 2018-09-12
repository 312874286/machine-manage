import React, { PureComponent } from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

class EditableTagGroup extends PureComponent {
  constructor(props) {
    super(props);

  }
  state = {
    inputVisible: false,
    inputValue: '',
    tags: [],
  };
  componentWillReceiveProps(nextProps) {
    const { value, } = nextProps;
    console.log('tags', value)
    if (value.tags) {
      this.setState({
        tags: value.tags,
      });
    }
  }
  componentDidMount() {
    const { value, } = this.props;
    if (value.tags) {
      this.setState({
        tags: value.tags,
      });
    }
  }
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
    this.props.handleTags(tags)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.props.handleTags(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
  saveInputRef = input => this.input = input
  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}
export default EditableTagGroup;
