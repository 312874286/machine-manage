import { isUrl } from '../utils/utils';
import { getMenus } from '../utils/authority';

const menus = [

];

function formatter(data, parentPath = '') {
  if (!data || data.length === 0) {
    return [];
  }
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(getMenus() || menus);
