import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Popconfirm } from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];
class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data, page, loading, scrollX, columns, scrollY } = this.props;
    const status = ['关闭', '运行中', '已上线', '异常'];
    // const columns = [
    //   {
    //     title: '编号ID',
    //     width: 200,
    //     dataIndex: 'no',
    //     fixed: 'left',
    //   },
    //   {
    //     title: '所属省市区商圈',
    //     width: 300,
    //     dataIndex: 'provinceCityAreaTradeArea',
    //   },
    //   {
    //     title: '商场',
    //     width: 100,
    //     dataIndex: 'shopPlace',
    //   },
    //   {
    //     title: '状态',
    //     width: 100,
    //     dataIndex: 'status',
    //     filters: [
    //       {
    //         text: status[0],
    //         value: 0,
    //       },
    //       {
    //         text: status[1],
    //         value: 1,
    //       },
    //       {
    //         text: status[2],
    //         value: 2,
    //       },
    //       {
    //         text: status[3],
    //         value: 3,
    //       },
    //     ],
    //     onFilter: (value, record) => record.status.toString() === value,
    //     render(val) {
    //       return <Badge status={statusMap[val]} text={status[val]} />;
    //     },
    //   },
    //   {
    //     title: '运营人',
    //     width: 100,
    //     dataIndex: 'operator',
    //   },
    //   {
    //     title: '手机号',
    //     width: 150,
    //     dataIndex: 'phoneNo',
    //   },
    //   {
    //     title: '更新时间',
    //     dataIndex: 'updatedAt',
    //     width: 200,
    //     sorter: true,
    //     render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    //   },
    //   {
    //     fixed: 'right',
    //     title: '操作',
    //     render: (text, item) => (
    //       <Fragment>
    //         <a onClick={() => onEditClick(item)}>编辑</a>
    //         <Divider type="vertical" />
    //         <a onClick={() => onLogClick(item)}>日志</a>
    //         <Divider type="vertical" />
    //         <Popconfirm title="确定要删除吗" onConfirm={() => onDelClick(item)} okText="Yes" cancelText="No">
    //           <a>删除</a>
    //         </Popconfirm>
    //       </Fragment>
    //     ),
    //   },
    // ];
    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   ...page,
    // };
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
      },
      ...page,
      showQuickJumper: true,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        {/*<div className={styles.tableAlert}>*/}
          {/*<Alert*/}
            {/*message={(*/}
              {/*<div>*/}
                {/*已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;*/}
                {/*服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万*/}
                {/*<a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>*/}
              {/*</div>*/}
            {/*)}*/}
            {/*type="info"*/}
            {/*showIcon*/}
          {/*/>*/}
        {/*</div>*/}
        <Table
          loading={loading}
          rowKey={record => record.id}
          // rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}}
        />
      </div>
    );
  }
}

export default StandardTable;
