import {
  getUsers,
  saveUser,
  createUser,
  setUserStatus,
  setUserRoles,
  getUserRoles,
  getRoles,
  getRole,
  putRole,
  postRole,
  delRole,
  getRoleFunctions,
} from '../../services/settings/account';

export default {
  namespace: 'account',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getUsers({ payload: { restParams } }, { call, put }) {
      const response = yield call(getUsers, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getUserRoles({ payload: { restParams } }, { call }) {
      const response = yield call(getUserRoles, { restParams });
      return response;
    },
    *setUserRoles({ payload: { params, restParams } }, { call }) {
      const response = yield call(setUserRoles, { params, restParams });
      return response;
    },
    *saveUser({ payload: { params, restParams } }, { call }) {
      const response = yield call(saveUser, { params, restParams });
      return response;
    },
    *createUser({ payload: { params, restParams } }, { call }) {
      const response = yield call(createUser, { params, restParams });
      return response;
    },
    *setUserStatus({ payload: { params, restParams } }, { call }) {
      const response = yield call(setUserStatus, { params, restParams });
      return response;
    },
    *getRoles({ payload: { restParams } }, { call }) {
      const response = yield call(getRoles, { restParams });
      return response;
    },
    *getRole({ payload: { restParams } }, { call }) {
      const response = yield call(getRole, { restParams });
      return response;
    },
    *addRole({ payload: { params, restParams } }, { call }) {
      const response = yield call(postRole, { params, restParams });
      return response;
    },
    *updateRole({ payload: { params, restParams } }, { call }) {
      const response = yield call(putRole, { params, restParams });
      return response;
    },
    *deleteRole({ payload: { restParams } }, { call }) {
      const response = yield call(delRole, { restParams });
      return response;
    },
    *getRoleFunctions({ payload: { restParams } }, { call }) {
      const response = yield call(getRoleFunctions, { restParams });
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
