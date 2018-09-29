import React, { PureComponent } from 'react';
import { Tag, Input, Tooltip, Icon, Select, List, Button } from 'antd';
// import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import styles from './index.less'

const Option = Select.Option;
let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = querystring.encode({
      code: 'utf-8',
      q: value,
    });
    // jsonp(`https://suggest.taobao.com/sug?${str}`)
    //   .then(response => response.json())
    //   .then((d) => {
    //     if (currentValue === value) {
    //       const result = d.result;
    //       const data = [];
    //       result.forEach((r) => {
    //         data.push({
    //           value: r[0],
    //           text: r[0],
    //         });
    //       });
    //       callback(data);
    //     }
    //   });
  }

  timeout = setTimeout(fake, 300);
}

class EditableTagGroup extends PureComponent {
  constructor(props) {
    super(props);

  }
  state = {
    inputVisible: false,
    inputValue: '',
    tags: [],
    search: false,
    data: []
  };
  componentWillReceiveProps(nextProps) {
    const { value, tags, data, search } = nextProps;
    if (tags) {
      this.setState({
        tags,
      });
    }
    if (search) {
      this.setState({
        search,
      });
    }
    if (data) {
      this.setState({
        data,
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
    this.setState({ tags });
    this.props.handleTags(tags)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }
  showSelect = () => {
    this.setState({ inputVisible: true }, () => this.select.focus());
  }
  handleInputConfirm = () => {
    this.setState({
      data: []
    }, () => {
      const state = this.state;
      const { search } = state
      const inputValue = state.inputValue;
      let tags = state.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      search && this.props.handTagLists('')
      this.props.handleTags(tags);
      this.setState({
        tags,
        inputVisible: false,
        inputValue: '',
      });
    })
  }
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
  clickItem = (item) => {
    console.log('item', item)
    this.setState({ inputValue: item.name }, () => {
      this.handleInputConfirm()
    });
  }
  handleSelectChange = (e) => {
    const { search } = this.state
    this.setState({ inputValue: e.target.value }, () => {
      this.select.focus()
    });
    search && this.props.handTagLists(e.target.value)
  }
  saveInputRef = input => this.input = input
  saveSelectRef = select => this.select = select
  render() {
    const { tags, inputVisible, inputValue, search, data } = this.state;
    const options = this.state.data.map(d => <Option key={d.name}>{d.name}</Option>);
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
        {(inputVisible && search) &&  (
            <div className={styles.inputBox}>
              <Input
                ref={this.saveSelectRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleSelectChange}
                // onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
              <div style={{ display: data.length > 0 ? '' : 'none'}}>
                <List
                  size="small"
                  bordered
                  dataSource={data}
                  renderItem={item => (<List.Item>
                    <div style={{ cursor: 'pointer' }} onClick={() => this.clickItem(item)}>{item.name}</div>
                  </List.Item>)}
                />
              </div>

            </div>
          // )

        )}
        {(inputVisible && !search) && (
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
        {(!inputVisible && !search)&& (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
        {(!inputVisible && search)&& (
          <Tag
            onClick={this.showSelect}
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
