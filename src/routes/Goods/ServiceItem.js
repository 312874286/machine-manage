import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Checkbox,
  Radio,
  Upload,
  Icon,
  Table,
  Divider,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ServiceTable from '../../components/Goods/serviceTable';
import { consumers, operator, sampleType } from '../../common/config/operationItem';
import { area } from '../../common/config/area';
import { padLeft, bitParse, parseUploadFileUrl } from '../../utils/utils';
import LogModal from '../../components/LogModal';
import styles, { cardStyle, cardConnectStyle, createModalStyle } from './ServiceItem.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea, Search } = Input;
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const CreateModal = Form.create()(
  (props) => {
    const {
      modalType,
      createModalVisible,
      createModalHandleCancel,
      createModalHandleOk,
      createModalConfirmLoading,
      form,
      tagList,
      doctorDeptList,
      doctorGroupList,
      handleUpload,
      normFile,
      detail,
      dian,
      onSellState,
      dianEditEdit,
      dianEditSave,
      dianEditCancel,
      dianEditHandleChange,
      dianEditDelete,
      dianEditAdd,
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 19,
          offset: 5,
        },
      },
    };
    const renderColumns = (text, record, column) => {
      return (
        <EditableCell
          editable={record.editable}
          value={text}
          onChange={value => dianEditHandleChange(value, record.id, column)}
        />
      );
    };
    const dianProps = {
      rowKey: record => record.id,
      dataSource: dian,
      pagination: false,
      bordered: true,
      footer: () => (<div style={{ textAlign: 'center' }}><a onClick={() => dianEditAdd()} disabled={dian.find(i => i.editable)}>+&nbsp;添加迪安数据配置</a></div>),
      columns: [
        {
          title: '迪安对接码',
          dataIndex: 'idDian',
          render: (text, record) => renderColumns(text, record, 'idDian'),
        },
        {
          title: '迪安项目中文名',
          dataIndex: 'checkProductName',
          render: (text, record) => renderColumns(text, record, 'checkProductName'),
        },
        {
          title: '迪安项目英文名',
          dataIndex: 'checkProductCode',
          render: (text, record) => renderColumns(text, record, 'checkProductCode'),
        },
        {
          title: '操作',
          render: (text, record) => {
            const { editable } = record;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    (
                      <span>
                        <a onClick={() => dianEditSave()}>保存</a>
                        <Divider type="vertical" />
                        <a onClick={() => dianEditCancel(record)}>取消</a>
                      </span>
                    )
                    :
                    (
                      <span>
                        <a onClick={() => dianEditEdit(record)} disabled={dian.find(i => i.editable)}>修改</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确认删除?" onConfirm={() => dianEditDelete(record)}>
                          <a>删除</a>
                        </Popconfirm>
                      </span>
                    )
                }
              </div>
            );
          },
        },
      ],
    };

    const beforeUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        message.error('仅支持JPG/PNG格式图片!');
      }
      // const isLt2M = file.size / 1024 / 1024 > 2;
      // if (!isLt2M) {
      //   message.error('图片大小必须大于2MB');
      // }
      // return isJPG && isLt2M;
      return isJPG;
    }

    return (
      <Modal
        title="操作项设置"
        width="1000px"
        visible={createModalVisible}
        onOk={createModalHandleOk}
        confirmLoading={createModalConfirmLoading}
        onCancel={createModalHandleCancel}
        maskClosable="true"
        footer={
          <div>
            {modalType === 'edit' && detail.sellState === 1 ? <Button type="danger" onClick={() => { onSellState(detail.id, 0, 1); }} disabled={dian.find(i => i.editable)}>停止售卖</Button> : ''}
            {modalType === 'edit' && detail.sellState === 0 ? <Button type="primary" onClick={() => { onSellState(detail.id, 1, 1); }} disabled={dian.find(i => i.editable)}>开始售卖</Button> : ''}
            <Button onClick={createModalHandleCancel}>取消</Button>
            <Button type="primary" onClick={createModalHandleOk} disabled={dian.find(i => i.editable) || (detail && detail.sellState === 1)}>确定</Button>
          </div>
        }
      >
        <Form>
          {modalType === 'edit' &&
            (
              <FormItem {...formItemLayout} label="服务项ID">
                {getFieldDecorator('code')(
                  <Input disabled placeholder="请输入" />
                )}
              </FormItem>
            )
          }

          <FormItem {...formItemLayout} label="服务项名称" >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入操作项名称' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="简介" >
            {getFieldDecorator('info')(
              <TextArea placeholder="请输入内容" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="商品详情">
            {getFieldDecorator('fileList', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              initialValue: [],
            })(
              <Upload
                name="file"
                listType="picture"
                beforeUpload={beforeUpload}
                customRequest={(params) => { handleUpload(params, 3); }}
              >
                <Button>
                  <Icon type="upload" /> 上传图片
                </Button>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>*请上传宽度为750px，大小不小于2M，格式为png/jpg的图片</p>
              </Upload>

            )}
          </FormItem>

          <FormItem {...formItemLayout} label="分类标签" >
            {getFieldDecorator('tags', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Checkbox.Group>
                {tagList.map((item) => {
                  return (
                    <Checkbox key={item.id} value={item.val}>{item.name}</Checkbox>
                  )
                })}
              </Checkbox.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="区域" >
            {getFieldDecorator('areaId', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                {area.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="送检机构" >
            {getFieldDecorator('examineOrg', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group>
                <Radio value={1}>第三方</Radio>
                <Radio value={2}>小风车</Radio>
                <Radio value={0}>无</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="解读医生要求" >
            {getFieldDecorator('doctorDeptId')(
              <Radio.Group>
                {doctorDeptList.map((item) => {
                  return (
                    <Radio key={item.id} value={item.id}>{item.name}</Radio>
                  );
                })}
              </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="基础价格(单位：元)" >
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="医生分成比例(单位：%)" >
            {getFieldDecorator('ext2Int', {
              rules: [{ required: true, message: '请输入' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="可售卖医生组" >
            {getFieldDecorator('doctorGroupId')(
              <Select placeholder="请选择">
                {doctorGroupList.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.groupName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem> */}

          <FormItem {...formItemLayout} label="使用方" >
            {getFieldDecorator('ext3Txt', {
              rules: [{ required: true, message: '请选择' }],
            })(
              // <Select placeholder="请选择">
              //   {consumers.map((item) => {
              //     return (
              //       <Option value={item.id} key={item.id}>{item.name}</Option>
              //     );
              //   })}
              // </Select>
              <Checkbox.Group>
                <Checkbox value="1">车上商品加项</Checkbox>
                <Checkbox value="10">医生商品</Checkbox>
              </Checkbox.Group>
            )}
          </FormItem>
          <div id="sampleTypeBox">
            <FormItem {...formItemLayout} label="样本类型">
              {getFieldDecorator('sampleType')(
                <Select placeholder="请选择" getPopupContainer={() => document.getElementById('sampleTypeBox')}>
                  {sampleType.map((item) => {
                    return (
                      <Option value={item.name} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </div>
          {detail && (
            <FormItem {...formItemLayout} label="迪安数据配置">
              <Table {...dianProps} />
            </FormItem>
          )}
          {detail && detail.sellState === 1 && (
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 0 }}>
              <p style={{ color: 'red', marginBottom: 0 }}>请先停止售卖，再编辑内容</p>
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
);

@connect(({ serviceItem, loading, log, operationItem }) => ({
  serviceItem,
  log,
  operationItem,
  loading: loading.models.serviceItem,
}))
@Form.create()
export default class ServiceItem extends PureComponent {
  state = {
    pageNo: 1,
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    createModalVisible: false,
    modalType: 'create',
    createModalConfirmLoading: false,
    detailData: null,
    dian: [],
    tagList: [],
    doctorDeptList: [],
    doctorGroupList: [],
    processFile: [],
    queryString: {
      arrangeState: '',
      tag: '',
      sellState: '',
      searchKey: '',
      doctorGroup: '',
      area: '',
      useType: '',
    },
    connectModalVisible: false,
    connectModalConfirmLoading: false,
    operationPageNo: 1,
    operationPageNoParameters: '',
    existingOperationItemList: [],
    operationTimes: 0,
    firstOperator: null,
    secondOperator: null,
    connectModalSellStateLoading: false,
  };

  componentDidMount = () => {
    this.getList();
    this.getServiceItemTags();
    this.getDoctorReportDept();
    this.getDoctorGroup();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'serviceItem/getServiceList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          ...this.state.queryString,
        },
      },
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
    });
  }

  // 获取分类标签列表
  getServiceItemTags = () => {
    this.props.dispatch({
      type: 'serviceItem/getServiceItemTags',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        tagList: data,
      });
    });
  }

  // 搜索
  handleSearch = () => {
    // e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (err) return;
      this.setState({
        queryString: {
          arrangeState: value.arrangeState || '',
          tag: value.tag || '',
          sellState: value.sellState || '',
          searchKey: value.searchKey || '',
          doctorGroup: value.doctorGroup || '',
          area: value.area || '',
          useType: value.useType || '',
        },
        pageNo: 1,
      }, () => {
        this.getList();
      });
    });
  }

  // 清空
  clearSearch = () => {
    this.props.form.setFieldsValue({
      arrangeState: '',
      tag: '',
      sellState: '',
      searchKey: '',
      doctorGroup: '',
      area: '',
      useType: '',
    });
    this.getList();
  }

  // 获取解读医生
  getDoctorReportDept = () => {
    this.props.dispatch({
      type: 'serviceItem/getDoctorReportDept',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        doctorDeptList: data,
      });
    })
  }

  // 获取医生组
  getDoctorGroup = () => {
    this.props.dispatch({
      type: 'serviceItem/getDoctorGroup',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        doctorGroupList: data,
      });
    })
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

  handleLogClick = (data) => {
    this.setState({
      logModalVisible: !!data,
      logModalLoading: true,
      logId: data.id,
    }, () => {
      this.getLogList();
    });
  }

  logModalHandleCancel = () => {
    this.setState({
      logModalVisible: false,
    });
  }

  logModalhandleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      logModalPageNo: current,
    }, () => {
      this.getLogList();
    });
  }

  // 新建
  createOperationItem = () => {
    this.setState({
      modalType: 'create',
      createModalVisible: true,
      dian: [],
      detailData: null,
    });
    this.form.setFieldsValue({
      areaId: undefined,
      doctorDeptId: undefined,
      // doctorGroupId: undefined,
      examineOrg: undefined,
      ext3Txt: undefined,
      ext2Int: undefined,
      info: undefined,
      name: undefined,
      fileList: [],
      price: undefined,
      tags: undefined,
      code: undefined,
      sampleType: undefined,
    });
  }

  // 详情事件
  handleDetailClick = (data) => {
    // this.setState({ detailData: data });
    this.getServiceItemDetail(data);
  }

  // 详情请求数据
  getServiceItemDetail = ({ id }) => {
    this.props.dispatch({
      type: 'serviceItem/getServiceItemDetail',
      payload: {
        restParams: {
          id,
        },
      },
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      data.dian = data.dian || [];
      this.setState({
        createModalVisible: true,
        modalType: 'edit',
        detailData: data,
        dian: data.dian || [],
      });

      const fileList = data.itemInfos.map((item, index) => {
        return {
          uid: index,
          name: '',
          status: 'done',
          url: item.name,
          thumbUrl: parseUploadFileUrl(item.name),
        };
      });

      this.form.setFieldsValue({
        code: data.code,
        areaId: data.areaId,
        doctorDeptId: data.doctorDeptId,
        // doctorGroupId: data.doctorGroupId,
        examineOrg: data.examineOrg,
        ext3Txt: data.ext3Txt ? data.ext3Txt.split(',') : undefined,
        ext2Int: data.ext2Int,
        info: data.info,
        name: data.name,
        price: data.price,
        sampleType: data.sampleType,
        fileList: fileList || [],
        tags: bitParse(data.tags).join(',').split(','),
      });
    });
  }

  // 删除
  handleDelClick = (data) => {
    this.props.dispatch({
      type: 'serviceItem/delServiceItem',
      payload: {
        params: { id: data.id },
      },
    }).then((res) => {
      const { code, msg } = res;
      if (code === 0) {
        message.success('操作成功');
        this.getList();
      } else {
        message.error(msg);
      }
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  // 创建操作项确定事件
  createModalHandleOk = () => {
    this.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const pics = value.fileList.map((item) => {
        if (item.response) {
          return item.response.data;
        }
        return item.url;
      });
      let tags = 0;
      value.tags.forEach((item) => {
        tags += parseInt(item, 10);
      });
      const submitData = {
        areaId: value.areaId || '',
        doctorDeptId: value.doctorDeptId || '',
        // doctorGroupId: value.doctorGroupId || '',
        examineOrg: value.examineOrg,
        ext3Txt: value.ext3Txt.join(',') || '',
        ext2Int: value.ext2Int || '',
        info: value.info || '',
        name: value.name || '',
        sampleType: value.sampleType || '',
        pics: pics.join(','),
        price: value.price || '',
        tags: padLeft(tags, 20) || '',
      };
      if (this.state.modalType === 'edit') {
        submitData.id = this.state.detailData.id;
      }
      this.submitServiceItem(submitData);
    });
  }

  // 创建事件
  submitServiceItem = (submitData) => {
    this.setState({
      createModalConfirmLoading: true,
    });
    this.props.dispatch({
      type: 'serviceItem/addOrUpdateServiceItemBaseInfo',
      payload: {
        params: { ...submitData },
      },
    }).then((res) => {
      const { code } = res;
      if (!res || code !== 0) return;
      message.success('操作成功');
      this.setState({
        createModalVisible: false,
        createModalConfirmLoading: false,
      });
      this.getList();
    });
  }

  // 创建modal 取消事件
  createModalHandleCancel = () => {
    this.setState({
      createModalVisible: false,
    });
  }

  // 上传图片
  handleUpload = ({ file, onError, onSuccess }, fileType) => {
    const { dispatch } = this.props;
    const nowFile = [...this.state.processFile];
    nowFile.push(file);
    this.setState({
      processFile: nowFile,
    });
    dispatch({
      type: 'doctorDetail/upload',
      payload: {
        params: { file },
        restParams: { fileType },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        onSuccess(resp, file);
        message.success('上传成功');
      }
    }).catch((e) => {
      onError(e);
    }).finally(() => {
      const removeFile = [...this.state.processFile];
      removeFile.splice(removeFile.findIndex(f => f === file), 1);
      this.setState({
        processFile: removeFile,
      });
    });
  };


  fileListValueFromEvent = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
    // if (e && e.fileList && e.file.response && e.file.response.code === 0) {
    //   const { file: { response: { data } } } = e;
    //   return data;
    // } else {
    //   return null;
    // }
  }

  // 开始停止售卖
  handleSellState = (id, state, type) => {
    this.setState({
      connectModalSellStateLoading: true,
    });
    this.props.dispatch({
      type: 'serviceItem/updateState',
      payload: {
        params: {
          id,
          state,
          type,
        },
      },
    }).then((res) => {
      if (!res || res.code !== 0) return;
      this.getList();
      message.success('操作成功');
      this.setState({
        connectModalSellStateLoading: false,
      });
      if (type === 1) {
        this.setState({
          createModalVisible: false,
        });
      } else {
        this.setState({
          connectModalVisible: false,
        });
      }
    });
  }

  // 关联操作项 modal
  handleContentClick = (data) => {
    this.setState({
      connectModalVisible: true,
      existingOperationItemList: [],
      specialExplain: '',
    }, () => {
      this.getOperationList();
      this.props.dispatch({
        type: 'serviceItem/getServiceItemDetail',
        payload: {
          restParams: {
            id: data.id,
          },
        },
      }).then((res) => {
        const { code } = res;
        if (!res || code !== 0) return;
        const existingOperationItemList = res.data.operations.map((item) => {
          return item.operation;
        });
        this.setState({
          detailData: res.data,
          existingOperationItemList,
          specialExplain: res.data.specialExplain,
        }, () => {
          this.calcTimes();
        });
      });
    });
  }

  // 关联操作项 确定
  connectModalHandleOk = () => {
    const { detailData, existingOperationItemList, specialExplain } = this.state;
    const operations = existingOperationItemList.map((item) => {
      return item.id;
    });
    const submitData = {
      id: detailData.id,
      operations: operations.join(','),
      specialExplain,
    };

    this.props.dispatch({
      type: 'serviceItem/updateConnect',
      payload: {
        params: { ...submitData },
      },
    }).then((res) => {
      if (!res || res.code !== 0) return;
      message.success('操作成功');
      this.setState({
        connectModalVisible: false,
      });
      this.getList();
    });
  }

  // 关联操作项 取消
  connectModalHandleCancel = () => {
    this.setState({
      connectModalVisible: false,
    });
  }

  // 关联操作项 获取操作项
  getOperationList = () => {
    this.props.dispatch({
      type: 'operationItem/getOperationList',
      payload: {
        restParams: {
          pageNo: this.state.operationPageNo,
          parameters: this.state.operationPageNoParameters,
          useType: '',
        },
      },
    });
  }

  // 关联操作项 操作项搜索
  searchOperationItem = (value) => {
    this.setState({
      operationPageNoParameters: value || '',
      operationPageNo: 1,
    }, () => {
      this.getOperationList();
    });
  }

  // 关联操作项 操作项分页
  handleContentTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      operationPageNo: current,
    }, () => {
      this.getOperationList();
    });
  }

  // 关联操作项 操作项添加
  connectHandleAdd = (data) => {
    const { existingOperationItemList } = this.state;
    existingOperationItemList.push(data);
    this.setState({
      existingOperationItemList: JSON.parse(JSON.stringify(existingOperationItemList)),
    }, () => {
      this.calcTimes();
    });
  }

  // 关联操作项 操作项移动删除
  connectHandleChange = (data, type, index) => {
    const { existingOperationItemList } = this.state;

    if (type === 'delete') {
      existingOperationItemList.splice(index, 1);
    } else if (type === 'up') {
      existingOperationItemList[index - 1] = existingOperationItemList.splice(index, 1, existingOperationItemList[index - 1])[0];
    } else if (type === 'down') {
      existingOperationItemList[index + 1] = existingOperationItemList.splice(index, 1, existingOperationItemList[index + 1])[0];
    }

    this.setState({
      existingOperationItemList: JSON.parse(JSON.stringify(existingOperationItemList)),
    }, () => {
      this.calcTimes();
    });
  }
  // 计算时长 第一操作人 第二操作人
  calcTimes = () => {
    let operationTimes = 0;
    const { existingOperationItemList } = this.state;
    let first = 0;
    let sec = 0;
    existingOperationItemList.forEach((item) => {
      if (item.firstOperator > first) {
        first = item.firstOperator;
      }

      if (item.secondOperator > sec && item.secondOperator !== 99) {
        sec = item.secondOperator;
      }

      operationTimes += item.operationTimes;
    });

    const firstOperator = operator.find((item) => {
      return item.id === first;
    });

    const secondOperator = operator.find((item) => {
      return item.id === sec;
    });

    this.setState({
      operationTimes,
      firstOperator: firstOperator ? firstOperator.name : '',
      secondOperator: secondOperator ? secondOperator.name : '无',
    });
  }
  // 分类标签
  getTags = (value) => {
    if (!value || !value.tags) return;
    const result = [];
    const tagvalue = bitParse(value.tags);
    tagvalue.forEach((tag) => {
      const tmp = this.state.tagList.find((item) => {
        return item.val === tag.toString();
      });
      if (tmp) {
        result.push(tmp.name);
      }
    });
    return result.join(' | ');
  }

  // 解读医生
  getDoctorDept = (value) => {
    if (!value || !value.doctorDeptId) return;
    const dept = this.state.doctorDeptList.find((item) => {
      return item.id === value.doctorDeptId;
    });
    return dept && dept.name;
  }

  // 送检解构
  getExamineOrg = (value) => {
    if (!value || !value.examineOrg) return;
    if (value.examineOrg === 1) {
      return '第三方';
    } else if (value.examineOrg === 2) {
      return '小风车';
    }
    return '无';
  }

  // 特殊说明
  handleChangesSpecialExplain = (e) => {
    this.setState({
      specialExplain: e.target.value,
    });
  }

  // 获取使用方
  getUseSide = (value) => {
    if (!value) {
      return '';
    }
    const arr = value.split(',');
    const resArr = arr.map((item) => {
      if (item === '1') {
        return '车上加项商品';
      } else if (item === '10') {
        return '医生商品';
      }
      return '';
    });
    return resArr.join(' | ');
  }

  dianEditHandleChange(value, key, column) {
    const dian = [...this.state.dian];
    const target = dian.filter(item => key === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({ dian });
    }
  }

  dianEditCancel = () => {
    this.setState({
      dian: [...this.state.detailData.dian],
    });
  }

  dianEditSave = () => {
    const products = [...this.state.dian].map((d) => {
      return {
        checkProductName: d.checkProductName,
        checkProductCode: d.checkProductCode,
        idDian: d.idDian,
      };
    });
    this.props.dispatch({
      type: 'serviceItem/saveDianThirdData',
      payload: {
        params: {
          serviceCode: this.state.detailData.code,
          products,
        },
      },
    }).then((resp) => {
      if (resp.code === 0) {
        const dian = resp.data || [];
        const detailData = { ...this.state.detailData };
        detailData.dian = dian;
        this.setState({ detailData, dian }, () => {
          message.success('保存成功');
        });
      }
    });
  }
  dianEditEdit = (record) => {
    this.dianEditHandleChange(true, record.id, 'editable');
  }
  dianEditAdd = () => {
    const dian = [...this.state.dian];
    dian.push({
      serviceCode: this.state.detailData.code,
      checkProductName: '',
      checkProductCode: '',
      idDian: '',
      editable: true,
      id: 'N_INSERT',
    });
    this.setState({ dian });
  }
  dianEditDelete = (record) => {
    const products = [...this.state.dian.filter(i => i.id !== record.id)].map((d) => {
      return {
        checkProductName: d.checkProductName,
        checkProductCode: d.checkProductCode,
        idDian: d.idDian,
      };
    });
    this.props.dispatch({
      type: 'serviceItem/saveDianThirdData',
      payload: {
        params: {
          serviceCode: this.state.detailData.code,
          products,
        },
      },
    }).then((resp) => {
      if (resp.code === 0) {
        const dian = resp.data || [];
        const detailData = { ...this.state.detailData };
        detailData.dian = dian;
        this.setState({ detailData, dian }, () => {
          message.success('删除成功');
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { serviceItem: { list, page }, log: { logList, logPage }, loading, operationItem } = this.props;
    const operationItemList = operationItem.list;
    const operationItemPage = operationItem.page;
    const {
      createModalConfirmLoading,
      createModalVisible,
      modalType,
      tagList,
      doctorDeptList,
      doctorGroupList,
      detailData,
      dian,
    } = this.state;

    const {
      connectModalVisible,
      connectModalConfirmLoading,
      contentLeftTableLoading,
      existingOperationItemList,
      operationTimes,
      firstOperator,
      secondOperator,
      specialExplain,
      connectModalSellStateLoading,
    } = this.state;

    const contentLeftTableColumns = [
      {
        title: '操作项ID',
        dataIndex: 'operationCode',
        width: 165,
      },
      {
        title: '操作项名称',
        dataIndex: 'operationName',
        width: 130,
      },
      {
        title: '第一操作人',
        dataIndex: 'firstOperator',
        width: 90,
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '第二操作人',
        dataIndex: 'secondOperator',
        width: 90,
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '标准时长',
        dataIndex: 'operationTimes',
        width: 80,
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.connectHandleAdd(item)}>添加</a>
          </Fragment>
        ),
      },
    ];

    const contentRightTableColumns = [
      {
        title: '操作项ID',
        dataIndex: 'operationCode',
        width: 165,
      },
      {
        title: '操作项名称',
        dataIndex: 'operationName',
        width: 130,
      },
      {
        title: '第一操作人',
        dataIndex: 'firstOperator',
        width: 90,
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '第二操作人',
        dataIndex: 'secondOperator',
        width: 90,
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '标准时长',
        dataIndex: 'operationTimes',
        width: 80,
      },
      {
        title: '操作',
        render: (text, item, index) => {
          return (
            <Fragment>
              {index !== 0 &&
                (
                  <span>
                    <a className="operating-btn" onClick={() => this.connectHandleChange(item, 'up', index)}>↑</a>
                    <Divider type="vertical" />
                  </span>
                )
              }
              {index !== existingOperationItemList.length - 1 &&
                (
                  <span>
                    <a className="operating-btn" onClick={() => this.connectHandleChange(item, 'down', index)}>↓</a>
                    <Divider type="vertical" />
                  </span>
                )
              }
              <a className="operating-btn" onClick={() => this.connectHandleChange(item, 'delete', index)}>×</a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="分类">
                      {getFieldDecorator('tag')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          {tagList.map((item) => {
                            return <Option key={item.id} value={item.val}>{item.name}</Option>;
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col md={8} sm={12}>
                    <FormItem label="可售卖状态">
                      {getFieldDecorator('sellState')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value="1">是</Option>
                          <Option value="0">否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col md={8} sm={12}>
                    <FormItem label="可履约状态">
                      {getFieldDecorator('arrangeState')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value="1">是</Option>
                          <Option value="0">否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>


                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="使用方">
                      {getFieldDecorator('useType')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          {consumers.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col md={8} sm={12}>
                    <FormItem label="区域">
                      {getFieldDecorator('area')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          {area.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('searchKey')(
                        <Search
                          placeholder="操作项名称/ID关键字"
                          onSearch={this.handleSearch}
                          enterButton
                        />
                      )}
                    </FormItem>
                  </Col>

                </Row>
                <Row className={styles.submitButtons} gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <Button type="primary" onClick={this.clearSearch}>清空</Button>
                  </Col>
                  <Col md={8} sm={12}>
                    <Button type="primary" onClick={this.createOperationItem}>新建服务项</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <ServiceTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onLogClick={this.handleLogClick}
            onDetailClick={this.handleDetailClick}
            onDelClick={this.handleDelClick}
            onContentClick={this.handleContentClick}
            tagList={tagList}
          />
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        <CreateModal
          modalType={modalType}
          createModalVisible={createModalVisible}
          createModalHandleOk={this.createModalHandleOk}
          createModalHandleCancel={this.createModalHandleCancel}
          createModalConfirmLoading={createModalConfirmLoading}
          tagList={tagList}
          doctorDeptList={doctorDeptList}
          doctorGroupList={doctorGroupList}
          handleUpload={this.handleUpload}
          normFile={this.fileListValueFromEvent}
          detail={detailData}
          dian={dian}
          onSellState={this.handleSellState}
          ref={this.saveFormRef}
          dianEditCancel={this.dianEditCancel}
          dianEditSave={() => this.dianEditSave()}
          dianEditEdit={this.dianEditEdit}
          dianEditAdd={this.dianEditAdd}
          dianEditDelete={record => this.dianEditDelete(record)}
          dianEditHandleChange={(value, key, column) => this.dianEditHandleChange(value, key, column)}
        />

        <Modal
          title="关联操作项"
          width="1000px"
          style={{ top: 20 }}
          visible={connectModalVisible}
          onOk={this.connectModalHandleOk}
          confirmLoading={connectModalConfirmLoading}
          onCancel={this.connectModalHandleCancel}
          maskClosable="true"
          footer={
            <div>
              {detailData && detailData.arrangeState === 1 && <Button disabled={connectModalSellStateLoading} type="danger" onClick={() => { this.handleSellState(detailData.id, 0, 2); }}>停止履约</Button>}
              {detailData && detailData.arrangeState === 0 && <Button disabled={connectModalSellStateLoading} type="primary" onClick={() => { this.handleSellState(detailData.id, 1, 2); }}>开始履约</Button>}
              <Button onClick={this.connectModalHandleCancel}>取消</Button>
              <Button type="primary" onClick={this.connectModalHandleOk} loading={connectModalConfirmLoading}>确定</Button>
            </div>
          }
        >
          <Card title="订单基本信息" className={cardStyle}>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">服务项名称</span></Col>
                  <Col span={17}><p>{detailData && detailData.name}</p></Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content">简介</span></Col>
                  <Col span={17}><p>{detailData && detailData.info}</p></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">分类标签</span></Col>
                  {/* <Col span={17}><p>{detailData && detailData.tags}</p></Col> */}
                  <Col span={17}><p>{this.getTags(detailData)}</p></Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content">区域</span></Col>
                  <Col span={17}><p>{detailData && area.find(item => item.id === detailData.areaId).name}</p></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">机构送检</span></Col>
                  {/* <Col span={17}><p>{detailData && detailData.examineOrg === 1 ? '第三方' : detailData.examineOrg === 2 ? '小风车' : '无'}</p></Col> */}
                  <Col span={17}><p>{this.getExamineOrg(detailData)}</p></Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">解读医生要求</span></Col>
                  <Col span={17}><p>{this.getDoctorDept(detailData)}</p></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">基础价格</span></Col>
                  <Col span={17}><p>{detailData && detailData.price}</p></Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">可售卖医生组</span></Col>
                  <Col span={17}><p>{detailData && detailData.doctorGroupName}</p></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={7} className="label"><span className="label-content red">使用方</span></Col>
                  <Col span={17}><p>{detailData && this.getUseSide(detailData.ext3Txt)}</p></Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card title="关联操作项信息" className={cardConnectStyle}>
            <Row>
              <Col span={12} className="left">
                <Search
                  placeholder="请输入检验项ID/名称等关键字"
                  onSearch={(value) => { this.searchOperationItem(value); }}
                  enterButton
                />
                <Table
                  bordered
                  loading={contentLeftTableLoading}
                  rowKey={record => record.id}
                  dataSource={operationItemList}
                  columns={contentLeftTableColumns}
                  pagination={operationItemPage}
                  onChange={this.handleContentTableChange}
                  scroll={{ x: 630, y: 300 }}
                  size="small"
                  style={{ marginTop: '10px' }}
                />
              </Col>
              <Col span={12} className="right">
                <div style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#f5f5f5' }}>已添加</div>
                <Table
                  bordered
                  pagination={false}
                  loading={contentLeftTableLoading}
                  rowKey={record => record.id}
                  dataSource={existingOperationItemList}
                  columns={contentRightTableColumns}
                  scroll={{ x: 700, y: 300 }}
                  size="small"
                  style={{ marginTop: '10px' }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content red">第一操作人</span></Col>
              <Col span={17}><p>{firstOperator}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content red">第二操作人</span></Col>
              <Col span={17}><p>{secondOperator}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content red">服务时长</span></Col>
              <Col span={17}><p>{operationTimes}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content">特殊说明</span></Col>
              <Col span={21}>
                <TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  onChange={this.handleChangesSpecialExplain}
                  value={specialExplain}
                />
              </Col>
            </Row>
            {detailData && detailData.arrangeState === 1 && <p style={{ color: 'red', margin: '30px 0 0' }}>请先停止履约，再编辑内容</p>}
          </Card>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
