import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function interactLists({ restParams }) {
  return fetch.get(api.interactLists, {
    restParams,
  });
}
export async function interactAdd({ params }) {
  return fetch.post(api.interactAdd, {
    body: stringify(params),
  });
}
export async function merchantAdd({ params }) {
  return fetch.post(api.merchantAdd, {
    body: stringify(params),
  });
}
export async function shopsAdd({ params }) {
  return fetch.post(api.shopsAdd, {
    body: stringify(params),
  });
}
export async function goodsAdd({ params }) {
  return fetch.post(api.goodsAdd, {
    body: stringify(params),
  });
}
export async function interactNext({ restParams }) {
  return fetch.get(api.interactNext, {
    restParams,
  });
}
export async function updateGoods({ params }) {
  return fetch.post(api.updateGoods, {
    body: stringify(params),
  });
}
export async function updateMerchant({ params }) {
  return fetch.post(api.updateMerchant, {
    body: stringify(params),
  });
}
export async function updateShops({ params }) {
  return fetch.post(api.updateShops, {
    body: stringify(params),
  });
}
export async function deleteGoods({ params }) {
  return fetch.post(api.deleteGoods, {
    body: stringify(params),
  });
}
export async function deleteMerchant({ params }) {
  return fetch.post(api.deleteMerchant, {
    body: stringify(params),
  });
}
export async function deleteShops({ params }) {
  return fetch.post(api.deleteShops, {
    body: stringify(params),
  });
}
export async function getInteractGoodsList({ restParams }) {
  return fetch.get(api.getInteractGoodsList, {
    restParams,
  });
}
export async function getInteractMerchantList({ restParams }) {
  return fetch.post(api.getInteractMerchantList, {
    restParams,
  });
}
export async function getInteractShopsList({ restParams }) {
  return fetch.post(api.getInteractShopsList, {
    restParams,
  });
}
export async function getInteractMachinePlanList({ restParams }) {
  return fetch.post(api.getInteractMachinePlanList, {
    restParams,
  });
}

export async function addInteractMachine({ params }) {
  return fetch.postJSON(api.addInteractMachine, {
    body: JSON.stringify(params),
  });
}

export async function addInteractMachineGoods({ params }) {
  return fetch.postJSON(api.addInteractMachineGoods, {
    body: JSON.stringify(params),
  });
}
export async function deleteInteractMachine({ params }) {
  return fetch.post(api.deleteInteractMachine, {
    body: stringify(params),
  });
}
export async function getInteractAllGoodsList({ restParams }) {
  return fetch.post(api.getInteractAllGoodsList, {
    restParams,
  });
}
export async function getInteractMachineGoodsList({ restParams }) {
  return fetch.post(api.getInteractMachineGoodsList, {
    restParams,
  });
}
export async function ruleInteract({ params }) {
  return fetch.postJSON(api.ruleInteract, {
    body: stringify(params),
  });
}
export async function getChannelSettingList({ params, restParams }) {
  return fetch.get(api.getChannelSettingList, {
    body: stringify(params),
    restParams,
  });
}
