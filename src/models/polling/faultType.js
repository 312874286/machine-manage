import { getCheckFaultTypeList, getCheckFaultTypeAdd, getCheckFaultTypeDetail, getCheckFaultTypeUpdate } from '../../services/polling/faultType';

export default {
  namespace: 'faultType',
  state: {
    list: [],
    page: {},
    totalNo: 0,
  },

  effects: {
    *getCheckFaultTypeList({ payload: { params } }, { call, put }) {
        // console.log('getCheckFaultTypeList::11',response);
      const response = yield call(getCheckFaultTypeList, { params });
      yield put({
        type: 'getCheckFaultTypeListBack',
        payload: response,
      });
    },
    *getCheckFaultTypeAdd({ payload: { params } }, { call, put }) {
        // console.log('getCheckFaultTypeList::11',response);
      const response = yield call(getCheckFaultTypeAdd, { params });
      return response;
    },
    *getCheckFaultTypeDetail({ payload: { params } }, { call, put }) {
        // console.log('getCheckFaultTypeList::11',response);
      const response = yield call(getCheckFaultTypeDetail, { params });
      return response;
    },
    *getCheckFaultTypeUpdate({ payload: { params } }, { call, put }) {
        // console.log('getCheckFaultTypeList::11',response);
      const response = yield call(getCheckFaultTypeUpdate, { params });
      return response;
    },
  },

  reducers: {
    getCheckFaultTypeListBack(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        totalNo: Math.ceil(page.totalCount/page.pageSize)
      };
    },
  },
};
