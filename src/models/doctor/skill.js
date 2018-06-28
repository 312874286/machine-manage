import {
  getSkillList,
  delSkill,
  addSkill,
  moveSkill,
  getSkill,
  editSkill,
} from '../../services/doctor/skill';

export default {
  namespace: 'skill',
  state: {
    list: [],
    page: {
      total: 0,
      pageSize: 20,
      current: 1,
    },
    datas: {},
  },

  effects: {
    *getSkillList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSkillList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *delSkill({ payload: { restParams, params } }, { call, put }) {
      const response = yield call(delSkill, { restParams, params });
      return response;
    },
    *addSkill({ payload: { restParams, params } }, { call, put }) {
      const response = yield call(addSkill, { restParams, params });
      return response;
    },
    *moveSkill({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(moveSkill, { params, restParams });
      return response;
    },
    *getSkill({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSkill, { restParams });
      return response;
    },
    *editSkill({ payload: { restParams, params } }, { call, put }) {
      const response = yield call(editSkill, { restParams, params });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        // page: {
        //   total: page.totalCount,
        //   pageSize: page.pageSize,
        //   current: page.pageNo,
        // },
      };
    },
  },
};
