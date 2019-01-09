import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

// 获取渠道列表
export async function getBaseDict({ params }) {
  return fetch.post(api.getBaseDict, {
    body: stringify(params),
  });
}
// 退款列表
export async function getRefundList({ params }) {
  return fetch.post(api.getRefundList, {
    body: stringify(params),
  });
}
// 订单详情
export async function getOrderDetail({ restParams }) {
  
  return fetch.get(api.orderDetail, {
    restParams,
  });
}
// 审核
export async function refundAudit({ params }) {
  return fetch.post(api.refundAudit, {
    body: stringify(params),
  });
}
// 编辑备注/线下退款/再次退款
export async function refundUpdate({ params }) {
  return fetch.post(api.refundUpdate, {
    body: stringify(params),
  });
}
// 退款详情
export async function refundDetail({ params }) {
  return fetch.post(api.refundDetail, {
    body: stringify(params),
  });
}
