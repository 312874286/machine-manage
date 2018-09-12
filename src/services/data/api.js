import { map } from '../../utils/fetch/apiData';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  templateDelete: '/statistics/TemplateDelete?name={name}',
  templateExecute: '/statistics/TemplateExecute',
  templateInsert: '/statistics/TemplateInsert',
  templateUpdate: '/statistics/TemplateUpdate',
  templateQuery: '/statistics/TemplateQuery?name={name}',
  templateList: '/statistics/TemplateList?name={name}',

  getActivityList: '/project/activity/getList',
});

export default api;
