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
    } = this.props;
    let columns = [
      {
        title: '用户Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户昵称',
        dataIndex: 'userNick',
        key: 'userNick'
      },
      // {
      //   title: '手机号',
      //   dataIndex: 'phone',
      // },
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        key: 'channelName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      // {
      //   title: '操作',
      //   render: (text, item) => (
      //     <Fragment>
      //       <a onClick={() => onLogClick(item)}>日志</a>
      //     </Fragment>
      //   ),
      // },
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
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            <div>
              <span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>
              <span>
                 <span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>
                 <Button type="primary" onClick={() => this.go()}>Go</Button>
               </span>
            </div>
          </div>
        );
      },
      ...page,
      showQuickJumper: false,
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
          scroll={{ y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 30)}}
        />
      </div>
    );
  }
}

