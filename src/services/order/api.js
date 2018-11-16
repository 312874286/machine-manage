import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getOrdersList: '/order/list?pageNo={pageNo}&keyword={keyword}&areaCode={areaCode}&payStatus={payStatus}&goodsStatus={goodsStatus}',

  historydayGoodsCount: '/supply/channel/history/dayGoodsCount?pageNo={pageNo}&beginTime={beginTime}&endTime={endTime}&keyword={keyword}',
  dayGoodsCountExcel: '/supply/channel/history/dayGoodsCountExcel'
});

export default api;
