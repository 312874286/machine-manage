import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getChannelSettingList: '/channel/list?pageNo={pageNo}&keyword={keyword}',
  saveChannelSetting: '/channel/add',
  updateChannelSetting: '/channel/update',
  deleteChannelSetting: '/channel/delete',
});

export default api;
