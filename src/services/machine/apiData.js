import { map } from "../../utils/fetch/apiData";
// API Doc: https://wiki.72solo.com/pages/viewpage.action?pageId=2328228
const api = map({
  machineDataStatistic: "/machine/statistics?startDate={startDate}&endDate={endDate}&machineCode={machineCode}"
});

export default api;
