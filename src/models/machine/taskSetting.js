import { taskList, taskDelete, taskAdd, taskUpdate, taskSelectAppList, taskDetail, taskSelectAreaMachines } from '../../services/machine/taskSetting';

export default {
  namespace: 'taskSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *taskList({ payload: { restParams } }, { call, put }) {
      const response = yield call(taskList, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *taskDelete({ payload: { params } }, { call }) {
      const response = yield call(taskDelete, { params });
      return response;
    },
    *taskAdd({ payload: { params } }, { call }) {
      const response = yield call(taskAdd, { params });
      return response;
    },
    *taskUpdate({ payload: { params } }, { call }) {
      const response = yield call(taskUpdate, { params });
      return response;
    },
    *taskSelectAppList({ payload: { params } }, { call }) {
      const response = yield call(taskSelectAppList, { params });
      return response;
    },
    *taskDetail({ payload: { params } }, { call }) {
      const response = yield call(taskDetail, { params });
      return response;
    },
    *taskSelectAreaMachines({ payload: { params } }, { call }) {
      const response = yield call(taskSelectAreaMachines, { params });
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
