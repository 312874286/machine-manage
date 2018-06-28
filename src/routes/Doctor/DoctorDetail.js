import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Col, Row, DatePicker, Upload, Icon, Input, Select, message, Radio, Checkbox, Modal, Popover } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { getUser, SMID } from '../../utils/authority';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import { parseUploadFileUrl, RegexTool } from '../../utils/utils';

import styles from './DoctorDetail.less';

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 },
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 14 },
  },
};

const { Option } = Select;

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('仅支持JPG/PNG格式图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于2MB');
  }
  return isJPG && isLt2M;
}

function fileValueFromEvent(e) {
  if (Array.isArray(e)) {
    return e;
  }
  // return e && e.fileList;
  if (e && e.fileList && e.file.response && e.file.response.code === 0) {
    const { file: { response: { data } } } = e;
    return data;
  } else {
    return null;
  }
}

function fileListValueFromEvent(e) {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
}

function parseSubmitData(data) {
  const { config } = this.state;
  const result = { ...data };
  const { birthday, jobDate, practisingCertificate, otherCertificate, credentials, provinceCode, cityCode, departmentId } = result;
  const dateFormat = 'YYYY-MM-DD';
  if (birthday) {
    delete result.birthday;
    result.birthday = birthday.format(dateFormat);
  }
  if (jobDate) {
    delete result.jobDate;
    result.jobDate = jobDate.format(dateFormat);
  }
  if (credentials && credentials.length > 0) {
    result.credentials = credentials.map((item) => {
      return item.response ? item.response.data : item.url;
    });
    result.credentialsStr = JSON.stringify(result.credentials);
  }
  if (practisingCertificate && practisingCertificate.length > 0) {
    result.practisingCertificate = practisingCertificate.map((item) => {
      return item.response ? item.response.data : item.url;
    });
    result.practisingCertificateStr = JSON.stringify(result.practisingCertificate);
  }
  if (otherCertificate && otherCertificate.length > 0) {
    result.otherCertificate = otherCertificate.map((item) => {
      return item.response ? item.response.data : item.url;
    });
    result.otherCertificateStr = JSON.stringify(result.otherCertificate);
  }
  if (provinceCode) {
    const province = config.cityObj.find(item => item.cityCode === provinceCode);
    if (province) {
      result.provinceName = province.name;
      if (cityCode) {
        const city = province.children.find(item => item.cityCode === cityCode);
        if (city) {
          result.cityName = city.name;
        }
      }
    }
  }
  if (departmentId) {
    const dept = config.deptVos.find(item => item.id === departmentId);
    if (dept) {
      result.departmentName = dept.name;
    }
  }
  return result;
}

function parseInitDataConfig(data) {
  const { config } = this.state;
  const getConfigValue = (key, value) => {
    const tempConfig = config[key].find(item => item.id === value);
    let r = value;
    if (tempConfig && tempConfig.status !== 1) {
      r = tempConfig.name;
    }
    return r;
  };
  const result = { ...data };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (key === 'departmentId') {
        result[key] = getConfigValue('deptVos', result[key]);
      } else if (key === 'identity') {
        result[key] = getConfigValue('doctorIdentity', result[key]);
      } else if (key === 'qualification') {
        result[key] = getConfigValue('doctorQualification', result[key]);
      } else if (key === 'title') {
        result[key] = getConfigValue('doctorTitle', result[key]);
      } else if (key === 'education' || key === 'hospitalLv' || key === 'hospitalType') {
        result[key] = getConfigValue(key, result[key]);
      }
    }
  }
  return result;
}
function parseInitData(data) {
  let result = { ...data };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (result[key] === null || result[key] === undefined || key === 'createTime' || key === 'updateTime') {
        delete result[key];
      } else if (key === 'birthday' || key === 'jobDate') {
        result[key] = moment(result[key]);
      } else if (key === 'credentials' || key === 'otherCertificate' || key === 'practisingCertificate') {
        if (result[key].length > 0) {
          result[key] = result[key].map((path, index) => {
            return {
              uid: index,
              name: '',
              status: 'done',
              url: path,
              thumbUrl: parseUploadFileUrl(path),
            };
          });
        }
      }
    }
  }
  result = parseInitDataConfig.bind(this)(result);
  return result;
}
function parseConfig(data) {
  const result = { ...this.state.config, ...data };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (!result[key]) {
        result[key] = [];
      }
    }
  }
  if (result.skills.length > 0) {
    result.skills = result.skills.filter(item => item.status === 1).map((item) => {
      return {
        label: item.firstSkill,
        value: item.id,
      };
    });
  }
  if (result.unscrambles.length > 0) {
    result.unscrambles = result.unscrambles.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
  result.currentCitys = [];
  return result;
}

@connect(({ doctorDetail, loading }) => ({
  doctorDetail,
  loading: loading.models.doctorDetail,
}))
@Form.create()
export default class DoctorDetail extends PureComponent {
  state = {
    uploadState: false,
    form: {},
    config: {
      cityObj: [],
      hospitalType: [],
      education: [],
      hospitalLv: [],
      rankPValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      doctorQualification: [],
      doctorTitle: [],
      doctorIdentity: [],
      skills: [],
      unscrambles: [],
      all: [],
      currentCitys: [],
      deptVos: [],
    },
    processFile: [],
    doctorId: null,
    accountId: null,
    pageState: 'EDIT',
    previewVisible: false,
    merchantId: getUser().merchantId,
  }

  componentDidMount() {
    this.initPage();
  }

  handleUpload({ file, onError, onSuccess }, fileType) {
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
  }

  handleUploadChange = (info) => {
    this.setState({ uploadState: info.file.uploadState !== 'done' });
  }

  initPage = () => {
    const { match: { params: { id } }, dispatch } = this.props;
    dispatch({
      type: 'doctorDetail/config',
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          config: parseConfig.bind(this)(resp.data),
        }, () => {
          if (id) {
            this.setState({
              pageState: 'DETAIL',
            }, () => {
              this.initDoctorInfo(id);
            });
          }
        });
      }
    });
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true,
    });
  }
  initDoctorInfo(id) {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'doctorDetail/item',
      payload: { restParams: { doctorId: id } },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          form: resp.data,
          doctorId: id,
          accountId: resp.data.accountId,
        }, () => {
          const doctorInfo = parseInitData.bind(this)({ ...this.state.form });
          form.setFieldsValue(doctorInfo);
          this.handleProvinceChange(resp.data.provinceCode);
        });
      } else {
        message.error('获取详情数据失败', resp ? resp.msg : resp);
      }
    });
  }
  handleSubmit = (data) => {
    const { dispatch } = this.props;
    const params = parseSubmitData.bind(this)(data);
    if (this.state.doctorId) {
      params.id = this.state.doctorId;
      params.accountId = this.state.accountId;
    }
    dispatch({
      type: 'doctorDetail/postItem',
      payload: { params },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('保存成功');
        dispatch(routerRedux.push('/doctor/list'));
      } else {
        message.error('保存失败');
      }
    });
  }
  handleProvinceChange = (data) => {
    if (!data) {
      return;
    }
    const config = JSON.parse(JSON.stringify(this.state.config));
    const province = config.cityObj.find(item => item.cityCode === data);
    if (province) {
      const { dispatch, form: { setFieldsValue } } = this.props;
      if (!province.children || province.children <= 0) {
        dispatch({
          type: 'doctorDetail/citys',
          payload: {
            restParams: {
              parentCode: province.cityCode,
            },
          },
        }).then((resp) => {
          if (resp && resp.code === 0) {
            if (resp.data && resp.data.cityObj && resp.data.cityObj.length > 0) {
              province.children = resp.data.cityObj;
              config.currentCitys = resp.data.cityObj;
              setFieldsValue({ cityCode: resp.data.cityObj[0].cityCode });
              this.setState({
                config,
              });
            }
          }
        });
      } else {
        config.currentCitys = province.children;
        setFieldsValue({ cityCode: province.children[0].cityCode });
        this.setState({
          config,
        });
      }
    }
  }

  handleEdit = () => {
    this.setState({ pageState: 'EDIT' });
  }

  handleEditCancel = () => {
    this.setState({ pageState: 'DETAIL' });
    this.initDoctorInfo(this.state.doctorId);
  }
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  renderButton = () => {
    return (
      <div>
        <Icon type={this.state.uploadState ? 'loading' : 'plus'} />
      </div>
    );
  }

  renderBaseInfo() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { config: { cityObj, currentCitys, education }, pageState, doctorId } = this.state;
    const disabled = pageState === 'DETAIL';
    return (
      <Col xxl={24} md={24}>
        <Card title="医生基本信息" className={styles.card} bordered={false}>
          <Form.Item {...formItemLayout} label="医生姓名">
            {getFieldDecorator('doctorName', {
              rules: [{ required: true, message: '请输入医生姓名' }],
            })(<Input placeholder="请输入医生姓名" disabled={disabled} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="城市" required>
            <Row gutter={3}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('provinceCode', {
                    rules: [{ required: true, message: '请选择省份' }],
                  })(
                    <Select onChange={this.handleProvinceChange} placeholder="请选择省份" disabled={disabled}>
                      {
                        cityObj.map((item) => {
                          return <Option key={item.cityCode}>{item.name}</Option>;
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('cityCode', {
                    rules: [{ required: true, message: '请选择城市' }],
                  })(
                    <Select placeholder="请选择城市" disabled={disabled}>
                      {
                        currentCitys.map((item) => {
                          return <Option key={item.cityCode}>{item.name}</Option>;
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号码">
            {getFieldDecorator('phone', {
              validateFirst: true,
              rules: [
                { type: 'string', required: true, message: '请输入手机号' },
                {
                  validator(rule, value, callback) {
                    if (!(RegexTool.mobile.test(value))) {
                      callback('请输入正确的手机号');
                    }
                    callback();
                  },
                }],
            })(<Input placeholder="请输入手机号码" disabled={disabled || !!doctorId} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="身份证号">
            {getFieldDecorator('idNum', {
              validateFirst: true,
              rules: [
                { type: 'string', required: true, message: '请输入身份证号' },
                {
                  validator(rule, value, callback) {
                    if (!(RegexTool.idCard.test(value))) {
                      callback('请输入正确的身份证号');
                    }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请输入身份证号" disabled={disabled} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="照片">
            {getFieldDecorator('pictureUrl', {
              // rules: [{ required: true, message: '请上传照片' }],
              valuePropName: 'file',
              getValueFromEvent: fileValueFromEvent,
            })(
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={(params) => { this.handleUpload(params, 2); }}
                disabled={disabled}
              >
                {getFieldValue('pictureUrl') ? <img src={parseUploadFileUrl(getFieldValue('pictureUrl'))} className={styles.avatar} alt="" /> : !disabled ? this.renderButton() : ''}
              </Upload>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="性别">
            {getFieldDecorator('sex', {
              rules: [
                { type: 'number', required: true, message: '请选择性别' },
              ],
            })(
              <Radio.Group disabled={disabled}>
                <Radio value={1}>男</Radio>
                <Radio value={0}>女</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="生日">
            {getFieldDecorator('birthday')(
              <DatePicker placeholder="请选择生日" style={{ width: '100%' }} disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="电子邮箱">
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: '请输入正确的电子邮箱' }],
            })(<Input placeholder="请输入电子邮箱" disabled={disabled} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="毕业院校">
            {getFieldDecorator('graduateSchool')(<Input placeholder="请输入毕业院校" disabled={disabled} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="教育程度">
            {getFieldDecorator('education')(
              <Select placeholder="请选择教育程度" style={{ width: '100%' }} disabled={disabled}>
                {
                  education.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
        </Card>
      </Col >
    );
  }

  renderAuthenticateInfo() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { config: { skills, unscrambles, rankPValue }, pageState, merchantId } = this.state;
    const disabled = pageState === 'DETAIL';
    return (
      <Col xxl={24} md={24}>
        <Card title="认证相关信息" className={styles.card} bordered={false}>
          <Form.Item {...formItemLayout} label="医生技能">
            {getFieldDecorator('skills')(
              <Checkbox.Group options={skills} disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医生解读科室">
            {getFieldDecorator('deptLinks')(
              <Checkbox.Group options={unscrambles} disabled={disabled} />
            )}
          </Form.Item>
          {
            merchantId === SMID &&
            (
              <Form.Item {...formItemLayout} label="Rank(P)当前值" extra="Rank(P)当前值：系统计算获得的当前正在使用的Rank(P)值，范围为1-10或无">
                {getFieldDecorator('l')(
                  <Input disabled />
                )}
              </Form.Item>
            )
          }
          {
            merchantId === SMID &&
            (
              <Form.Item {...formItemLayout} label="Rank(P)设定值" extra="Rank(P)设定值：手动设定的Rank(P)值，保存后保持不变">
                {getFieldDecorator('rankP')(
                  <Select placeholder="请选择设定值" style={{ width: '100%' }} disabled={disabled}>
                    <Option value={null}>请选择设定值</Option>
                    {
                      rankPValue.map((item) => {
                        return <Option key={item}>{item}</Option>;
                      })
                    }
                  </Select>
                )}
              </Form.Item>
            )
          }
        </Card>
      </Col >
    );
  }

  renderPractiseInfo() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { config: { hospitalType, hospitalLv, doctorIdentity, deptVos }, pageState } = this.state;
    const disabled = pageState === 'DETAIL';
    return (
      <Col xxl={24} md={24}>
        <Card title="从业相关信息" className={styles.card} bordered={false}>
          <Form.Item {...formItemLayout} label="医院名称">
            {getFieldDecorator('hospital')(
              <Input placeholder="请输入医院名称" disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医院类型">
            {getFieldDecorator('hospitalType')(
              <Select placeholder="请选择医院类型" style={{ width: '100%' }} disabled={disabled}>
                {
                  hospitalType.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医院级别">
            {getFieldDecorator('hospitalLv')(
              <Select placeholder="请选择医院级别" style={{ width: '100%' }} disabled={disabled}>
                {
                  hospitalLv.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="科室">
            {getFieldDecorator('departmentId', {
              rules: [{ required: true, message: '请选择科室' }],
            })(
              <Select placeholder="请选择科室" style={{ width: '100%' }} disabled={disabled}>
                {
                  deptVos.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="从业日期">
            {getFieldDecorator('jobDate', {
              rules: [{ required: true, message: '请选择从业日期' }],
            })(
              <DatePicker placeholder="请选择从业日期" style={{ width: '100%' }} disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医生简介">
            {getFieldDecorator('introduce')(
              <Input.TextArea rows={4} placeholder="请输入医生简介" disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="擅长领域">
            {getFieldDecorator('skilledDomain')(
              <Input.TextArea rows={4} placeholder="请输入擅长领域" disabled={disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医生身份">
            {getFieldDecorator('identity')(
              <Select placeholder="请选择医生身份" style={{ width: '100%' }} disabled={disabled}>
                {
                  doctorIdentity.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
        </Card>
      </Col >
    );
  }

  renderQualifiedInfo() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { config: { doctorQualification, doctorTitle }, pageState, merchantId } = this.state;
    const disabled = pageState === 'DETAIL';
    return (
      <Col xxl={24} md={24}>
        <Card title="医生资格相关信息" className={styles.card} bordered={false}>
          <Form.Item {...formItemLayout} label="医生资格">
            {getFieldDecorator('qualification')(
              <Select placeholder="请选择医生资格" style={{ width: '100%' }} disabled={disabled}>
                {
                  doctorQualification.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医生专业">
            {getFieldDecorator('specialty')(
              <Input placeholder="请输入医生专业" disabled={disabled} />
            )}
          </Form.Item>
          {/* <Form.Item {...formItemLayout} label="医生专业">
            {getFieldDecorator('specialty')(
              <Select placeholder="请选择医生专业" style={{ width: '100%' }} disabled={disabled}>
                {
                  doctorSpecialty.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item> */}
          <Form.Item {...formItemLayout} label="医生职称">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请选择医生职称' }],
            })(
              <Select placeholder="请选择医生职称" style={{ width: '100%' }} disabled={disabled}>
                {
                  doctorTitle.filter(item => item.status === 1).map((item) => {
                    return <Option key={item.id}>{item.desc}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          {
            merchantId === SMID &&
            (
              <Form.Item {...formItemLayout} label="家长端展示认证信息">
                {getFieldDecorator('tipAuth', {
                  initialValue: '0',
                  rules: [
                    { type: 'string', message: '请选择家长端是否展示认证信息' },
                  ],
                })(
                  <Radio.Group disabled={disabled}>
                    <Radio value="0" checked>不展示</Radio>
                    <Radio value="1">展示</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            )
          }
          <Form.Item {...formItemLayout} label="医生资格证书">
            {getFieldDecorator('credentials', {
              valuePropName: 'fileList',
              getValueFromEvent: fileListValueFromEvent,
              initialValue: [],
            })(
              <Upload
                name="file"
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={(params) => { this.handleUpload(params, 1); }}
                disabled={disabled}
                onPreview={this.handlePreview}
                showUploadList={{ showRemoveIcon: !disabled }}
              >
                {(getFieldValue('credentials').length < 3 && !disabled) && this.renderButton()}
              </Upload>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="医生执业证书">
            {getFieldDecorator('practisingCertificate', {
              valuePropName: 'fileList',
              getValueFromEvent: fileListValueFromEvent,
              initialValue: [],
            })(
              <Upload
                name="file"
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={(params) => { this.handleUpload(params, 1); }}
                disabled={disabled}
                onPreview={this.handlePreview}
                showUploadList={{ showRemoveIcon: !disabled }}
              >
                {(getFieldValue('practisingCertificate').length < 3 && !disabled) && this.renderButton()}
              </Upload>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="其他相关证书">
            {getFieldDecorator('otherCertificate', {
              valuePropName: 'fileList',
              getValueFromEvent: fileListValueFromEvent,
              initialValue: [],
            })(
              <Upload
                name="file"
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={(params) => { this.handleUpload(params, 1); }}
                disabled={disabled}
                onPreview={this.handlePreview}
                showUploadList={{ showRemoveIcon: !disabled }}
              >
                {(getFieldValue('otherCertificate').length < 3 && !disabled) && this.renderButton()}
              </Upload>
            )}
          </Form.Item>
        </Card>
      </Col>
    );
  }

  render() {
    const { form, loading } = this.props;
    const { validateFieldsAndScroll, getFieldsError } = form;
    const { previewVisible, previewImage, pageState, processFile } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          this.handleSubmit(values);
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            {/* <div className={styles.errorField}>请确认</div> */}
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="错误信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <a>
              <Icon type="exclamation-circle" />
              有<strong>{errorCount}</strong>条信息输入有误
            </a>
          </Popover>
        </span>
      );
    };
    return (
      <PageHeaderLayout>
        <Form>
          <Row gutter={{ md: 24, lg: 12 }}>
            <Col md={24} lg={12}>
              <Row gutter={{ md: 24, lg: 12 }}>
                {this.renderBaseInfo()}
                {this.renderAuthenticateInfo()}
              </Row>
            </Col>
            <Col md={24} lg={12}>
              <Row gutter={{ md: 24, lg: 12 }}>
                {this.renderPractiseInfo()}
                {this.renderQualifiedInfo()}
              </Row>
            </Col>
          </Row>
        </Form>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          {
            pageState === 'EDIT' ? (
              <span>
                <Button type="primary" onClick={validate} loading={loading || processFile.length > 0}>保存</Button>
                <Button onClick={this.handleEditCancel} loading={loading}>取消</Button>
              </span>
            ) : (<Button type="primary" onClick={this.handleEdit} loading={loading}>编辑</Button>)
          }
        </FooterToolbar>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout >
    );
  }
}
