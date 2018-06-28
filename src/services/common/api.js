import { map } from '../../utils/fetch/api';

const api = map({
  // 根据省份获取城市[GET][Param:parentCode]
  getCitysByProvince: '/merchant/open/getDistrictObj.json?parentCode={parentCode}',
  uploadFile: '/fileUpload/upload?fileType={fileType}',
});

export default api;
