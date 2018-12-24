import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getOrdersList: '/order/list?pageNo={pageNo}&keyword={keyword}&areaCode={areaCode}&payStatus={payStatus}&goodsStatus={goodsStatus}',

  historydayGoodsCount: '/supply/channel/history/dayGoodsCount?pageNo={pageNo}&beginTime={beginTime}&endTime={endTime}&keyword={keyword}',
  dayGoodsCountExcel: '/supply/channel/history/dayGoodsCountExcel',
  getBaseDict: '/project/dictionary/getBaseDict',  
  getRefundList: '/order/refund/list', // 退款列表
  refundAudit: '/order/refund/refundAudit', // 审核
  refundUpdate: '/order/refund/update', // 编辑备注/线下退款/再次退款
  refundDetail: '/order/refund/detail', // 退款详情
  orderDetail: '/order/detail?id={id}',
});

export default api;
