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
