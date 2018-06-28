import {
  getServiceList,
  getServiceItemTags,
  getDoctorReportDept,
  getDoctorGroup,
  uploadFile,
  addOrUpdateServiceItemBaseInfo,
  getServiceItemDetail,
  updateState,
  updateConnect,
  delServiceItem,
  saveDianThirdData,
} from '../../services/goods/serviceItem';

export default {
  namespace: 'serviceItem',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getServiceList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getServiceList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getServiceItemTags({ payload: { restParams } }, { call, put }) {
      const response = yield call(getServiceItemTags, { restParams });
      return response;
    },
    *getDoctorReportDept({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctorReportDept, { restParams });
      return response;
    },
    *getDoctorGroup({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctorGroup, { restParams });
      return response;
    },
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    },
    *addOrUpdateServiceItemBaseInfo({ payload: { params } }, { call }) {
      const response = yield call(addOrUpdateServiceItemBaseInfo, { params });
      return response;
    },
    *getServiceItemDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getServiceItemDetail, { restParams });
      return response;
    },
    *updateState({ payload: { params } }, { call }) {
      const response = yield call(updateState, { params });
      return response;
    },
    *updateConnect({ payload: { params } }, { call }) {
      const response = yield call(updateConnect, { params });
      return response;
    },
    *delServiceItem({ payload: { params } }, { call }) {
      const response = yield call(delServiceItem, { params });
      return response;
    },
    *saveDianThirdData({ payload: { params } }, { call }) {
      const response = yield call(saveDianThirdData, { params });
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
