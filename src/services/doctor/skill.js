import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getSkillList({ restParams }) {
  return fetch.get(api.getSkillList, { restParams });
}

export async function delSkill({ restParams, params }) {
  return fetch.post(api.delSkill, {
    restParams,
    body: stringify(params),
  });
}

export async function addSkill({ restParams, params }) {
  return fetch.post(api.addSkill, {
    restParams,
    body: stringify(params),
  });
}

export async function moveSkill({ restParams, params }) {
  return fetch.post(api.moveSkill, {
    restParams,
    body: stringify(params),
  });
}

export async function editSkill({ restParams, params }) {
  return fetch.post(api.editSkill, {
    restParams,
    body: stringify(params),
  });
}

export async function getSkill({ restParams }) {
  return fetch.get(api.getSkill, {
    restParams,
  });
}
