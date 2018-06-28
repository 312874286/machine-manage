import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Modal } from 'antd';
import WechatPushTable from '../../components/WechatPushTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import LogModal from '../../components/LogModal';
import styles from './WechatPush.less';

const FormItem = Form.Item;

@connect(({ wechatPush, loading, log }) => ({
  wechatPush,
  log,
  loading: loading.models.wechatPush,
}))
@Form.create()
export default class WechatPush extends PureComponent {
  state = {
    templateVisible: false,
    template: {},
    hasValue: true,
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatPush/list',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
      },
    });
  }

  handleDetailClick = (data) => {
    this.setState({
      templateVisible: true,
    });
    this.setState({
      template: data,
      wechatTemplateId: data.wechatTemplateId,
    });
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

  // 关联模板modal
  templateHandleOk = () => {
    const { id } = this.state.template;
    const { wechatTemplateId } = this.state;

    if (!wechatTemplateId) {
      this.setState({
        hasValue: false,
      });
      return;
    } else {
      this.setState({
        hasValue: true,
      });
    }

    this.setState({
      templateConfirmLoading: true,
    });

    this.props.dispatch({
      type: 'wechatPush/setWechatItem',
      payload: {
        restParams: {
          configId: id,
          merchantId: getUser().merchantId,
        },
        params: {
          wechatTemplateId,
        },
      },
    }).then(() => {
      this.setState({
        templateVisible: false,
        templateConfirmLoading: false,
      });
      this.getList();
    });
  }

  templateHandleCancel = () => {
    this.setState({
      templateVisible: false,
    });
  }

  wechatTemplateIdChange = (e) => {
    this.setState({
      wechatTemplateId: e.target.value,
    });
  }

  render() {
    const { wechatPush: { list, page }, log: { logList, logPage }, loading } = this.props;
    const { wechatTemplateId, templateVisible, templateConfirmLoading, hasValue } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 15 },
      },
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <WechatPushTable
              loading={loading}
              data={list}
              page={page}
              onSelectRow={this.handleSelectRows}
              onDetailClick={this.handleDetailClick}
              onLogClick={this.handleLogClick}
            />
          </div>
        </Card>
        <Modal
          title="关联模板"
          visible={templateVisible}
          onOk={this.templateHandleOk}
          confirmLoading={templateConfirmLoading}
          onCancel={this.templateHandleCancel}
        >
          <Form className={styles.modalForm}>
            <FormItem {...formItemLayout} label="模板标题">
              <p className="p">{this.state.template.title}</p>
            </FormItem>
            <FormItem {...formItemLayout} label="模板ID">
              <div className={!hasValue ? 'error-box' : ''}>
                <Input value={wechatTemplateId} onChange={this.wechatTemplateIdChange} placeholder="请输入" />
                {!hasValue && <p className="p" style={{ color: '#f5222d' }}>请填写微信中申请的模板ID</p>}
              </div>
            </FormItem>
            <FormItem className="example" {...formItemLayout} label="内容示例">
              <p className="p" dangerouslySetInnerHTML={{ __html: this.state.template.example }} />
            </FormItem>
          </Form>
        </Modal>

        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
