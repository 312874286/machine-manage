import { getUserList, getUserMachineDetailList, getUserDetail, saveUser, updateUser, selectMachine } from '../../services/polling/personnelManagement';

export default {
  namespace: 'user',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getUserList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getUserList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getUserMachineDetailList({ payload: { restParams } }, { call }) {
      const response = yield call(getUserMachineDetailList, { restParams });
      return response.data;
    },
    *getUserDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getUserDetail, { restParams });
      return response.data;
    },
    *saveUser({ payload: { params } }, { call }) {
      const response = yield call(saveUser, { params });
      return response;
    },
    *updateUser({ payload: { params } }, { call }) {
      const response = yield call(updateUser, { params });
      return response;
    },
    *selectMachine({ payload: { params } }, { call }) {
      const response = yield call(selectMachine, { params });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false, disabled = false, machines = [], title, canUseNum;
        for (let i = 0; i < data.length; i++) {
          machines = data[i].machines
          title = data[i].name
          canUseNum = data[i].machines.length
          // if ((data[0].level === 4 || data[0].level === 5) && data[i].machines.length === 0) {
          //   isLeaf = true;
          // }
          if (data[0].level === 4) {
            isLeaf = true;
          }
          if (data[i].machines.length === 0) {
            disabled = true;
          }
          if (data[0].level === 5) {
            machines = [{
              machineCode: '',
              machineId: data[i].code,
              state: 0}]
            title = data[i].name;
            canUseNum = 1;
          }
          const a = {
            value: data[i].code,
            label: data[i].name + '(' + canUseNum + ')',
            isLeaf: isLeaf,
            title: title,
            key: i,
            level: data[i].level,
            province: data[i].province,
            // machines: machines,
            machineCode: title,
            machineId: data[i].code,
            state: 0,
            disabledFlag: disabled,
            canUseNum: canUseNum,
            disabled: disabled,
          };
          arr.push(a);
        }
      }
      return arr;
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
