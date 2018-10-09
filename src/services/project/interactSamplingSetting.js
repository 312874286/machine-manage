import { stringify } from "qs";
import fetch from "../../utils/fetch/index";
import api from "./api";

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
  return fetch.post(api.merchantAdd, {
    body: stringify(params)
  });
}
export async function shopsAdd({ params }) {
  return fetch.post(api.shopsAdd, {
    body: stringify(params)
  });
}
export async function goodsAdd({ params }) {
  return fetch.post(api.goodsAdd, {
    body: stringify(params)
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
  return fetch.post(api.updateGoods, {
    body: stringify(params)
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

export async function getMachineTree({ restParams }) {
  return fetch.get(api.getMachineTree, {
    restParams
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