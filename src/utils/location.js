export function getQueryData(search, key) {
  if (search && key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
    const result = search.substr(1).match(reg);
    if (result != null) return unescape(result[2]);
  }
  return null;
}

export function getQueryDatas(search) {
  const result = {};
  if (search) {
    const pattern = /(\w+)=(\w+)/ig; // 定义正则表达式
    search.replace(pattern, (a, b, c) => {
      result[b] = c;
    });
  }
  return result;
}

export function getUrlParams() {
  let url = window.location.search;
  url = decodeURI(url);
  let strs = [];
  const theRequest = {};
  if (url.indexOf('?') !== -1) {
    const str = url.substr(1);
    strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}
