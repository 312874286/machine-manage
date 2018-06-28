import { map } from '../../utils/fetch/api';

const api = map({
  getLogList: '/merchant/log/findLogs?code={code}&pageNo={pageNo}&type={type}',
});

export default api;
