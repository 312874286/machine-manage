import { taskList, taskDelete, taskAdd, taskUpdate, taskSelectAppList, taskDetail, taskSelectAreaMachines } from '../../services/machine/taskSetting';
import {selectAreaMachines} from "../../services/project/scheduleSetting";

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
      return response.data;
    },
    *taskDetail({ payload: { params } }, { call }) {
      const response = yield call(taskDetail, { params });
      return response;
    },
    *taskSelectAreaMachines({ payload: { params } }, { call }) {
      const response = yield call(taskSelectAreaMachines, { params });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false, disabled = false, machines = [], title, canUseNum;
        for (let i = 0; i < data.length; i++) {
          machines = data[i].machines
          title = data[i].name
          canUseNum = data[i].canUseNum + '/' + data[i].totalNum
          if (data[0].level === 4) {
            isLeaf = true;
          }
          if (data[i].machines.length === 0) {
            disabled = true;
          } else {
            disabled = false;
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
            label: `${data[i].name}${canUseNum}`,
            isLeaf: isLeaf,
            title: title,
            key: i,
            level: data[i].level,
            province: data[i].province,
            // machines: machines,
            // machineCode: title,
            // machineId: data[i].code,
            // state: 0,
            // disabledFlag: disabled,
            // canUseNum: canUseNum,
            // disabled: disabled,
            code: data[i].code,
            name: data[i].name,
            planed: data[i].planed,
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
