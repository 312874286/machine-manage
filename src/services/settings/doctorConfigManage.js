import fetch from '../../utils/fetch';
import api from './api';

/**
 * 获取医生配置信息列表.
 */
export async function list({ restParams }) {
  return fetch.get(api.getDocotorConfigs, {
    restParams,
  });
}
/**
 * 添加医生配置.
 */
export async function addItem({ params, restParams }) {
  return fetch.postJSON(api.addDoctorConfig, {
    body: JSON.stringify(params),
    restParams,
  });
}
/**
 * 更新医生配置.
 */
export async function updateItem({ params, restParams }) {
  return fetch.put(api.updateDoctorConfig, {
    body: JSON.stringify(params),
    restParams,
  });
}
/**
 * 更新医生配置状态
 */
export async function updateItemStatus({ restParams }) {
  return fetch.put(api.updateDoctorConfigStatus, { restParams });
}
