import {
  getCompositList,
  addOrEditRule,
  getCompositDetail,
  updateCompositSellState,
  delComposit,

  getServiceItemTags,
  getDoctorReportDept,
  getDoctorGroup,
  uploadFile,
  addOrUpdateServiceItemBaseInfo,
  getServiceItemDetail,
  updateState,
  updateConnect,
  delServiceItem,
} from '../../services/goods/compositing';

export default {
  namespace: 'compositing',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getCompositList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getCompositList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *addOrEditRule({ payload: { params } }, { call, put }) {
      const response = yield call(addOrEditRule, { params });
      return response;
    },
    *getCompositDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getCompositDetail, { restParams });
      return response;
    },
    *updateCompositSellState({ payload: { params } }, { call }) {
      const response = yield call(updateCompositSellState, { params });
      return response;
    },
    *delComposit({ payload: { params } }, { call }) {
      const response = yield call(delComposit, { params });
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
