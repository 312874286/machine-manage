import { setSessionData, getSessionData, removeSessionData } from '../utils/utils';

// use localStorage to store the authority info, which might be sent from server in actual project.
// export function getAuthority() {
//   return localStorage.getItem('antd-pro-authority') || 'admin';
// }

export function getAuthority() {
  const userInfo = getUser();
  return userInfo ? 'authorized' : 'guest';
}

function setToken(data) {
  if (data) {
    setSessionData('token', data);
  }
}

function setUser(data) {
  if (data) {
    setSessionData('userInfo', data);
  }
}

function parseMenuData(source, pid) {
  const result = [];
  const filter = pid ? item => item.parentId === pid : item => item.functionLevel === 1;
  if (source && source.length > 0) {
    source.filter(filter)
      .forEach((item) => {
        if (item) {
          const menu = {
            name: item.functionDepict,
            path: item.functionPath,
            icon: item.icon,
            color: item.color,
          };
          if (item.functionIcon) {
            menu.icon = item.functionIcon;
          }
          if (source.some(s => s.parentId === item.functionId)) {
            menu.children = parseMenuData(source, item.functionId);
          }
          result.push(menu);
        }
      });
  }
  return result;
}

function setMenus(data) {
  if (data) {
    setSessionData('siteMenu', parseMenuData(data));
  }
}

export function setLogin(loginInfo) {
  if (loginInfo) {
    const { user, token, functions } = loginInfo;
    setToken(token);
    setUser(user);
    setMenus(functions);
  }
}

export function getToken() {
  return getSessionData('token');
}

export const SMID = '01f255928130429993743e647b848d4e';

export function getUser() {
  return getSessionData('userInfo');
}

export function getMenus() {
  return getSessionData('siteMenu');
}

export function setLogout() {
  removeSessionData('token');
  removeSessionData('userInfo');
  removeSessionData('siteMenu');
}
