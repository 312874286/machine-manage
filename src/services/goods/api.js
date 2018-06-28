import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getOperationList: '/paas/newGoodsOperation/getGoodsOperations?pageNo={pageNo}&parameters={parameters}',
  addOrEditGoodsOperation: '/paas/newGoodsOperation/addOrEditGoodsOperation',
  getOperationItemDetail: '/paas/newGoodsOperation/getGoodsOperationDetail?id={id}',
  delOperationItem: '/paas/newGoodsOperation/updateGoodsOperationStatus',
  getServiceList: '/paas/newGoodsServiceItem/queryNewGoodsServiceItems?arrangeState={arrangeState}&tag={tag}&sellState={sellState}&searchKey={searchKey}&doctorGroup={doctorGroup}&area={area}&useType={useType}&pageNo={pageNo}',
  getServiceItemTags: '/paas/newGoodsCommon/getServiceItemTag',
  getDoctorReportDept: '/paas/newGoodsCommon/getDoctorReportDept',
  getDoctorGroup: '/paas/newGoodsCommon/getDoctorGroup',
  uploadFile: '/fileUpload/upload?fileType={fileType}',
  addOrUpdateServiceItemBaseInfo: '/paas/newGoodsServiceItem/addOrUpdateServiceItemBaseInfo',
  getServiceItemDetail: '/paas/newGoodsServiceItem/queryNewGoodsServiceItemById?id={id}',
  updateState: '/paas/newGoodsServiceItem/updateState',
  updateConnect: '/paas/newGoodsServiceItem/updateServiceItemOperationsInfo',
  delServiceItem: '/paas/newGoodsServiceItem/delete',
  getCompositList: '/paas/newGoodsCombinig/getList?sellState={sellState}&selectParams={selectParams}&areaId={areaId}&pageNo={pageNo}',
  addOrEditRule: '/paas/newGoodsCombinig/addOrEditRule',
  getCompositDetail: '/paas/newGoodsCombinig/getDetail?id={id}',
  updateCompositSellState: '/paas/newGoodsCombinig/updateSellState',
  delComposit: '/paas/newGoodsCombinig/deleteRule',
  saveDianThirdData: '/paas/thirdData/saveThirdData',
});

export default api;
