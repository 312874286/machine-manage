
import { uploadFile, getProvinceCityAreaTradeArea, getUserArea } from '../../services/common';

export default {
  namespace: 'common',
  state: {
    areaList: [],
  },
  effects: {
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    },
    *getProvinceCityAreaTradeArea({ payload: { restParams } }, { call }) {
      const response = yield call(getProvinceCityAreaTradeArea, { restParams });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false;
        if (data[0].level === 3) {
          isLeaf = true;
        }
        for (let i = 0; i < data.length; i++) {
          const a = {
            value: data[i].code,
            label: data[i].name,
            isLeaf,
            title: data[i].name,
            key: data[i].code,
            level: data[i].level,
            province: data[i].province
          };
          arr.push(a);
        }
      }
      return arr;
    },
    *getProvinceCity({ payload: { restParams } }, { call }) {
      const response = yield call(getProvinceCityAreaTradeArea, { restParams });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false;
        if (data[0].level === 2) {
          isLeaf = true;
        }
        for (let i = 0; i < data.length; i++) {
          const a = { value: data[i].code, label: data[i].name, isLeaf, title: data[i].name, key: data[i].code, level: data[i].level, province: data[i].province };
          arr.push(a);
        }
      }
      return arr;
    },
    *getUserArea({ payload: { restParams } }, { call }) {
      const response = yield call(getUserArea, { restParams });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false;
        if (data[0].level === 2) {
          isLeaf = true;
        }
        for (let i = 0; i < data.length; i++) {
          const a = { value: data[i].code, label: data[i].name, isLeaf, title: data[i].name, key: data[i].code, level: data[i].level, province: data[i].province };
          arr.push(a);
        }
      }
      return arr;
    },
    *getStaffArea({ payload: { restParams } }, { call }) {
      const response = yield call(getProvinceCityAreaTradeArea, { restParams });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false;
        if (data[0].level === 3) {
          isLeaf = true;
        }
        for (let i = 0; i < data.length; i++) {
          const a = {
            value: data[i].code,
            label: data[i].name,
            isLeaf, title: data[i].name,
            key: data[i].code,
            code: data[i].code,
            level: data[i].level,
            province: data[i].province,
            name: data[i].name,
            city: data[i].city,
            district: data[i].district,
            tableName: `${data[i].province}-${data[i].city ? data[i].city : ''}-${data[i].district ? data[i].district : ''}`
          };
          arr.push(a);
        }
      }
      return arr;
    },
  },
  reducers: {
  },
};
