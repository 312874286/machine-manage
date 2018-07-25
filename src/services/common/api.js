import { map } from '../../utils/fetch/api';

const api = map({
  // 根据省份获取城市[GET][Param:parentCode]
  getCitysByProvince: '/merchant/open/getDistrictObj.json?parentCode={parentCode}',
  uploadFile: '/share/uploadImage?fileType={fileType}&type={type}',
  getProvinceCityAreaTradeArea: '/admin/area/list?code={code}',
});

export default api;
