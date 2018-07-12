
import { uploadFile, getProvinceCityAreaTradeArea } from '../../services/common';
import {queryRule} from "../../services/api";

export default {
  namespace: 'common',
  state: {
    list: [],
    page: {},
    datas: {},
  },
  effects: {
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    },
    *getProvinceCityAreaTradeArea({ payload: { restParams } }, { call }) {
      const response = yield call(getProvinceCityAreaTradeArea, { restParams });
      let { code, data } = response
      if (code !== 0) return
      let arr = []
      if (data) {
        let isLeaf = false;
        if (data[0].level === 4) {
          isLeaf = true;
        }
        for (let i = 0; i < data.length; i++) {
          let a = { value: data[i].code, label: data[i].name, isLeaf: isLeaf, title: data[i].name, key: data[i].code, level: data[i].level, province: data[i].province }
          arr.push(a);
        }
      }
      return arr;
    },
  },
  reducers: {
    saveList(state, { payload: { data } }) {
      return {
        ...state,
        list: arr,
      };
    },
  },
};
