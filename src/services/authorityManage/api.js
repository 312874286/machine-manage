import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getSystemUserList: '/system/user/list?keyword={keyword}&pageNo={pageNo}',
  getSystemRoleList: '/system/role/list?keyword={keyword}&pageNo={pageNo}',
  getSystemDeptList: '/system/dept/list?keyword={keyword}&pageNo={pageNo}',
  getSystemFunctionList: '/system/function/list?keyword={keyword}&pageNo={pageNo}',
  getSystemRoleAll: '/system/role/all',
  getSystemUserAuth: '/system/user/auth?userId={userId}&roleIds={roleIds}',
  getSystemFunctionAll: '/system/function/all?roleId={roleId}',
  getSystemRoleAdd: '/system/role/add?name={name}&auths={auths}',
  getSystemRoleUpdate: '/system/role/update?id={id}&name={name}&auths={auths}',
  getSystemRoleDelete: '/system/role/delete?id={id}',
  getSystemUserQueryUserRoles: '/system/user/queryUserRoles?userId={userId}',

  updateFunctionArea: '/user/function/area/updateFunctionArea',
  getFunctionArea: '/user/function/area/list?userId={userId}',
  updateFunctionData: '/user/function/data/updateFunctionData',
  getFunctionData: '/user/function/data/list?userId={userId}'

});

export default api;
