import { stringify } from "qs";
import fetch from "../../utils/fetch/index";
import api from "./api";
import apiData from "./apiData";

export async function interactLists({ restParams }) {
  return fetch.get(api.interactLists, {
    restParams
  });
}
export async function interactAdd({ params }) {
  return fetch.post(api.interactAdd, {
    body: stringify(params)
  });
}
export async function merchantAdd({ params }) {
  return fetch.postJSON(api.merchantAdd, {
    body: JSON.stringify(params)
  });
}
export async function shopsAdd({ params }) {
  return fetch.postJSON(api.shopsAdd, {
    body: JSON.stringify(params)
  });
}
export async function goodsAdd({ params }) {
  return fetch.postJSON(api.goodsAdd, {
    body: JSON.stringify(params)
  });
}
export async function interactNext({ restParams }) {
  return fetch.get(api.interactNext, {
    restParams
  });
}
export async function interactUpdate({ params }) {
  return fetch.post(api.interactUpdate, {
    body: stringify(params)
  });
}
export async function updateGoods({ params }) {
  return fetch.postJSON(api.updateGoods, {
    body: JSON.stringify(params)
  });
}
export async function updateMerchant({ params }) {
  return fetch.post(api.updateMerchant, {
    body: stringify(params)
  });
}
export async function updateShops({ params }) {
  return fetch.post(api.updateShops, {
    body: stringify(params)
  });
}
export async function deleteGoods({ params }) {
  return fetch.post(api.deleteGoods, {
    body: stringify(params)
  });
}
export async function deleteMerchant({ params }) {
  return fetch.post(api.deleteMerchant, {
    body: stringify(params)
  });
}
export async function deleteShops({ params }) {
  return fetch.post(api.deleteShops, {
    body: stringify(params)
  });
}
export async function getInteractGoodsList({ params }) {
  return fetch.post(api.getInteractGoodsList, {
    body: stringify(params)
  });
}
export async function getInteractMerchantList({ params }) {
  return fetch.post(api.getInteractMerchantList, {
    body: stringify(params)
  });
}
export async function getInteractShopsList({ params }) {
  return fetch.post(api.getInteractShopsList, {
    body: stringify(params)
  });
}
export async function interactDetail({ params }) {
  return fetch.post(api.interactDetail, {
    body: stringify(params)
  });
}
export async function getMerchantDetail({ params }) {
  return fetch.post(api.getMerchantDetail, {
    body: stringify(params)
  });
}
export async function getShopsDetail({ params }) {
  return fetch.post(api.getShopsDetail, {
    body: stringify(params)
  });
}
export async function getGoodsDetail({ params }) {
  return fetch.post(api.getGoodsDetail, {
    body: stringify(params)
  });
}
export async function getInteractMachinePlanList({ params }) {
  return fetch.post(api.getInteractMachinePlanList, {
    body: stringify(params)
  });
}

export async function addInteractMachine({ params }) {
  return fetch.postJSON(api.addInteractMachine, {
    body: JSON.stringify(params)
  });
}

export async function addInteractMachineGoods({ params }) {
  return fetch.postJSON(api.addInteractMachineGoods, {
    body: JSON.stringify(params)
  });
}
export async function deleteInteractMachine({ params }) {
  return fetch.post(api.deleteInteractMachine, {
    body: stringify(params)
  });
}
export async function getInteractAllGoodsList({ restParams }) {
  return fetch.post(api.getInteractAllGoodsList, {
    restParams
  });
}
export async function getInteractMachineGoodsList({ restParams }) {
  return fetch.post(api.getInteractMachineGoodsList, {
    restParams
  });
}
export async function ruleInteract({ params }) {
  return fetch.postJSON(api.ruleInteract, {
    body: JSON.stringify(params)
  });
}
export async function getChannelSettingList({ params, restParams }) {
  return fetch.get(api.getChannelSettingList, {
    body: stringify(params),
    restParams
  });
}

export async function getMerchantTree({ restParams }) {
  return fetch.get(api.merchantTree, {
    restParams
  });
}

export async function getMachineTree({ params }) {
  return fetch.post(api.getMachineTree, {
    body: stringify(params)
  });
}

export async function getGameList({ params }) {
  return fetch.post(api.getGameList, {
    body: stringify(params)
  });
}
export async function getChannelsList({ restParams }) {
  return fetch.get(api.getChannelsList, {
    restParams
  });
}

export async function getInteractHavingMachineList({ params }) {
  return fetch.post(api.getInteractHavingMachineList, {
    body: stringify(params)
  });
}

export async function getInteractMachineGoods({ params }) {
  return fetch.post(api.getInteractMachineGoods, {
    body: stringify(params)
  });
}

export async function getInteractMachineList({ params }) {
  return fetch.post(api.getInteractMachineList, {
    body: stringify(params)
  });
}

export async function deleteInteractMachineGoods({ params }) {
  return fetch.post(api.deleteInteractMachineGoods, {
    body: stringify(params)
  });
}

export async function getInteractMachineDetail({ params }) {
  return fetch.post(api.getInteractMachineDetail, {
    body: stringify(params)
  });
}

export async function updateInteractMachineGoods({ params }) {
  return fetch.postJSON(api.updateInteractMachineGoods, {
    body: JSON.stringify(params)
  });
}
// 添加优惠券时获取要关联的商品列表
export async function couponGetList({ restParams }) {
  return fetch.get(api.couponGetList, {
    restParams
  });
}
// 统计
export async function getOrderStatistics({ params }) {
  return fetch.postJSON(apiData.machineStatistic, {
    body: JSON.stringify(params),
  });
}

export async function getGoodsStatistics({ params }) {
  return fetch.postJSON(apiData.machineStatistic, {
    body: JSON.stringify(params),
  });
}

export async function activityExcel({ restParams }) {
  window.location.href = `${api.activityExcel}?activityId=${restParams.activityId}&activityType=${restParams.activityType}`;
}
//  // 获取客户
export async function checkMerchantUser({ restParams }) {
  return fetch.get(api.checkMerchantUser, {
    restParams
  });
}
//   // 获取待添加商户
export async function checkMerchant({ params }) {
  return fetch.post(api.checkMerchant, {
    body: JSON.stringify(params),
  });
}
//   // 获取待添加的店铺
export async function checkShops({ params }) {
  return fetch.post(api.checkShops, {
    body: JSON.stringify(params),
  });
}

export async function getBaseDict({ params }) {
  return fetch.get(api.getBaseDict, {
    body: JSON.stringify(params),
  });
}
