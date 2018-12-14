import React, { PureComponent } from 'react';
import { Table, Alert, Input, Button } from 'antd';
import styles from './userTable.less';

export default class userTable extends PureComponent {
  state = {
    No: '',
    totalNo: 0
  };
  componentWillReceiveProps(nextProps) {
    const { page, } = this.props;
    this.setState({
      totalNo: Math.ceil(page.total/page.pageSize)
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }
  go = () => {
    const { totalNo, No } = this.state
    if (No) {
      if (No <= totalNo && No > 0) {
        this.props.handleTableChange({current: No, pageSize: 20 }, {}, {});
      } else {
        this.setState({
          No: ''
        })
      }
    } else {
      return false
    }
  }
  inputValue = (e) => {
    this.setState({
      No: e.target.value
    })
  }
  render() {
    const { No } = this.state;
    const {
      data,
      page,
      loading,
      unColumn,
      getPoint,
    } = this.props;
    let columns = [
      {
        title: '用户Id',
        dataIndex: 'id',
        key: 'id',
        width: '100px',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '100px',
      },
      {
        title: '用户性别',
        dataIndex: 'sex',
        key: 'sex',
        width: '100px',
      },
      {
        title: '用户年龄',
        dataIndex: 'age',
        key: 'age',
        width: '100px',
      },
      {
        title: '微信',
        dataIndex: 'openId',
        key: 'openId',
        width: '100px',
      },
      {
        title: '所在城市',
        dataIndex: 'city',
        key: 'city',
        width: '100px',
      },
      {
        title: '参与地点',
        width: '100px',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }}
               onClick={() => getPoint(item)} >查看</div>
        ),
      },
      {
        title: '标签',
        dataIndex: 'tagName',
        key: 'tagName',
        width: '100px',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '150px',
      },
      {
        title: '注册地点',
        dataIndex: 'createArea',
        key: 'createArea',
        width: '100px',
      },
      {
        title: '最后一次登陆时间',
        dataIndex: 'lastTime',
        key: 'lastTime',
        width: '500px',
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 100/(columns.length)
    for (let i = 0; i < columns.length; i++) {
      columns[i].width = width + '%'
    }
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            {/*<div>*/}
              {/*<span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>*/}
              {/*<span>*/}
                 {/*<span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>*/}
                 {/*<Button type="primary" onClick={() => this.go()}>Go</Button>*/}
               {/*</span>*/}
            {/*</div>*/}
          </div>
        );
      },
      ...page,
      showQuickJumper: true,
    };

    return (
      <div className={styles.standardTable}>
        {/*<div className={styles.tableAlert}>*/}
          {/*<Alert*/}
            {/*message={(*/}
              {/*<div>*/}
                {/*查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;*/}
                {/*每页{paginationProps.pageSize}条*/}
              {/*</div>*/}
            {/*)}*/}
            {/*type="info"*/}
            {/*showIcon*/}
          {/*/>*/}
        {/*</div>*/}
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1600, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 60)}}
        />
      </div>
    );
  }
}

