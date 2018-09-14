import environment from '../../environments/environment';

const { hostxxx } = environment

export default hostxxx;
export function map(params) {
  const result = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      result[key] = environment.hostxxx + params[key];
    }
  }
  return result;
}
