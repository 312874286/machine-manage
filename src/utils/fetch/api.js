import environment from '../../environments/environment';

const { host } = environment;

export default host;
export function map(params) {
  const result = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      result[key] = environment.host + params[key];
    }
  }
  return result;
}
