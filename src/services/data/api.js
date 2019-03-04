import { map } from '../../utils/fetch/apiData';
// import { map2 } from "../../utils/fetch/api";
// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  templateDelete: '/statistics/TemplateDelete',
  templateExecute: '/statistics/TemplateExecute',
  templateInsert: '/statistics/TemplateInsert',
  templateUpdate: '/statistics/TemplateUpdate',
  templateQuery: '/statistics/TemplateQuery',
  templateList: '/statistics/TemplateList',

  userInfo:'/extra/UserInfos',
  getActivityList: '/project/activity/getList',

  getReportActivity: '/report/Activity?activityId={activityId}&goodsId={goodsId}&merchantId={merchantId}&city={city}&startTime={startTime}&endTime={endTime}&pageNo={pageNo}&pageSize=20&outputType={outputType}&keyword={keyword}',
  getActivitySearchParams: '/report/ActivitySearchParams',
  getReportActivityExcel: '/report/Activity'
});

export default api;
