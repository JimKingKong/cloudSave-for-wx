const fetch = require('./util').fetch;
const HOME = require('./api').HOME;
const Detail = require('./api').Detail;

const getHomeData = () => {
 return fetch({
    url: HOME
  })
}
const getDetailData = (goodId) => {
  return fetch({
    url:Detail+goodId
  })
}

module.exports = {
  getHomeData: getHomeData,
  getDetailData
}