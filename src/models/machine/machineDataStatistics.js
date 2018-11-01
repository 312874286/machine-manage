import { machineStatisticsList } from '../../services/machine/machineDataStatistics';

export default {
  namespace: 'machineDataStatistics',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *machineStatisticsList({ payload: { restParams } }, { call, put }) {
      const response = yield call(machineStatisticsList, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      let list = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          // console.log('item', item, index)
          list.push({
            id: item[0],
            activityName: item[1],
            activityId: item[2],
            date: item[3],
            machineCode: item[4],
            point: item[5],
            uv: item[6],
            pv: item[7],
            order: item[8],
            shipment: item[9],
            fans: item[10],
            concern: item[11],
            visitor: item[12]
          })
        })
      }
      return {
        ...state,
        list,
        unColumn: unColumn
      };
    },
  },
};
