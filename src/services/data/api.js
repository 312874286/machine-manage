import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  templateDelete: '/statistics/TemplateDelete?name={name}',
  templateExecute: '/statistics/TemplateExecute',
  templateInsert: '/statistics/TemplateInsert',
  templateUpdate: '/statistics/TemplateUpdate',
  templateQuery: '/statistics/TemplateQuery?pageNo={pageNo}&keyword={keyword}'
});

export default api;
