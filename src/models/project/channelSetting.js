import { getChannelSettingList, getChannelSettingDetail, saveChannelSetting, editChannelSetting, delChannelSetting } from '../../services/project/channelSetting';

export default {
  namespace: 'channelSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getChannelSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getChannelSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getChannelSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getChannelSettingDetail, { restParams });
      return response.data;
    },
    *saveChannelSetting({ payload: { params } }, { call }) {
      const response = yield call(saveChannelSetting, { params });
      return response;
    },
    *editChannelSetting({ payload: { params } }, { call }) {
      const response = yield call(editChannelSetting, { params });
      return response;
    },
    *delChannelSetting({ payload: { params } }, { call }) {
      const response = yield call(delChannelSetting, { params });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
