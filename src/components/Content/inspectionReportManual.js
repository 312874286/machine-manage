import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Button, Input, message, Upload, Icon } from 'antd';
import { parseUploadFileUrl } from '../../utils/utils';

const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('仅支持JPG/PNG格式图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于2MB');
  }
  return isJPG && isLt2M;
};
@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
export default class inspectionReportDianInfo extends PureComponent {
  state = {
    urls: [],
    uploadState: false,
    processFile: [],
    successFile: [],
    currentFile: null,
    totalFileCount: 0,
    disabled: false,
  }
  componentDidMount = () => {
    const urls = (this.props.data.urls || []).map((img, index) => {
      return {
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: parseUploadFileUrl(img),
        thumbUrl: parseUploadFileUrl(img),
      };
    });
    this.setState({ urls, disabled: urls.length === 0 });
  }
  handleUpload({ file, onError, onSuccess }) {
    const { processFile, currentFile, totalFileCount, successFile } = this.state;
    if (!processFile.find(f => f === file)) {
      processFile.push(file);
      this.setState({ totalFileCount: totalFileCount + 1 });
    }
    if (!currentFile) {
      if (processFile.length > 0) {
        console.log(`${processFile.length} to go`);
        const newFile = processFile.splice(0, 1);
        this.setState({ currentFile: newFile, processFile }, () => {
          this.props.dispatch({
            type: 'common/upload',
            payload: {
              params: { file },
              restParams: { fileType: 4 },
            },
          }).then((resp) => {
            const key = (new Date()).valueOf();
            const uploadedFile = {
              uid: key,
              name: newFile.name,
            };
            if (resp && resp.code === 0) {
              uploadedFile.status = 'done';
              uploadedFile.url = parseUploadFileUrl(resp.data);
            } else {
              uploadedFile.status = 'falied';
              uploadedFile.url = null;
            }
            debugger;
            successFile.push(uploadedFile);
            this.setState({ successFile }, () => {
              if (successFile.length === totalFileCount) {
                message.success('上传完成');
              }
            });
          }).catch((e) => {
            onError(e);
          });
        });
      }
    } else {
      this.setState({ processFile }, () => {
        setTimeout(() => {
          this.handleUpload({ file, onError, onSuccess });
        }, 500);
      });
    }
  }
  handleUploadChange = (info) => {
    console.log(info);
    this.setState({ uploadState: info.file.uploadState !== 'done' });
  }
  handlePreview = (file) => {
    this.props.onReportPreview(file.thumbUrl);
  }
  renderUploadButton = () => {
    return (
      <div>
        {this.state.uploadState ? '正在上传' : '重新上传'}
      </div>
    );
  }
  render() {
    const { urls, disabled } = this.state;
    const UploadButton = this.renderUploadButton;
    return (
      <Upload
        name="file"
        fileList={urls}
        listType="picture-card"
        disabled={disabled}
        onPreview={this.handlePreview}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
        beforeUpload={beforeUpload}
        customRequest={(params) => { this.handleUpload(params); }}
        onchange={(a) => { console.log(a); }}
        multiple
      >
        {/* <UploadButton /> */}
      </Upload>
    );
  }
}

