import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './serviceTable.less';
import { consumers, operationType, operator } from '../../common/config/operationItem';
import { area } from '../../common/config/area';
import { bitParse } from '../../utils/utils';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class ServiceTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
      onLogClick,
      onDetailClick,
      onDelClick,
      onContentClick,
      tagList,
    } = this.props;
    const columns = [
      {
        title: '服务项ID',
        dataIndex: 'code',
        width: 165,
      },
      {
        title: '服务项名称',
        dataIndex: 'name',
        width: 130,
      },
      {
        title: '分类标签',
        dataIndex: 'tags',
        width: 120,
        render: (value) => {
          // const typeItem = operationType.find(item => item.id === value);
          // return typeItem ? typeItem.name : '';
          const result = [];
          const tagvalue = bitParse(value);
          tagvalue.forEach((tag) => {
            const tmp = tagList.find((item) => {
              return item.val === tag.toString();
            });
            if (tmp) {
              result.push(tmp.name);
            }
          });
          return result.join(' | ');
        },
      },
      {
        title: '使用方',
        dataIndex: 'useType',
        width: 180,
        render: (value) => {
          const useType = (value && value.split(',').map((v) => {
            const typeItem = consumers.find(item => item.id === v);
            return typeItem ? typeItem.name : '';
          })) || [];
          return useType.join(',');
        },
      },
      {
        title: '可售卖医生组',
        width: 120,
        dataIndex: 'doctorGroupName',
      },
      {
        title: '售卖区域',
        dataIndex: 'areaId',
        width: 100,
        render: (value) => {
          const typeItem = area.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '基础价格',
        dataIndex: 'price',
        width: 100,
        render: (value) => {
          return value && value.toFixed(2);
        },
      },
      {
        title: '可销售状态',
        dataIndex: 'sellState',
        render: (value) => {
          return value === 1 ? '是' : '否';
        },
      },
      {
        title: '可履约状态',
        dataIndex: 'arrangeState',
        render: (value) => {
          return value === 1 ? '是' : '否';
        },
      },
      {
        title: '创建时间',
        width: 110,
        dataIndex: 'createTime',
      },
      {
        title: '最近修改时间',
        width: 110,
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onDetailClick(item)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => onContentClick(item)}>关联操作项</a>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(item)}>日志</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => onDelClick(item)}>
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;
                每页{paginationProps.pageSize}条
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1600 }}
        />
      </div>
    );
  }
}

