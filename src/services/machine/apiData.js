import { map } from "../../utils/fetch/apiData";
// API Doc: https://wiki.72solo.com/pages/viewpage.action?pageId=2328228
const api = map({
  machineDataStatistic: "/statistics/TemplateExecute?startDate={startDate}&endDate={endDate}&machineCode={machineCode}&name=按时间机器查询统计数据&outputType=1"
});

export default api;
