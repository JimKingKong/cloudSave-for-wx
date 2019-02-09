//1.定义一个Good类
class Good{
  constructor(goodId, title, counts, price, imgurl, isSelect){
    this.goodId = goodId || -1;
    this.title = title || '';
    this.counts = counts || 0;

    this.price = price || 0;
    this.imgurl = imgurl || '';
    this.isSelect = isSelect || false;
  }
}


//2.使用js 定义一个单例类
class CacheCart {
  constructor(data) {
    //1.在新建对象时，如果没有创建过就创建该类
    if (CacheCart.prototype.Instance === undefined) {
      this.data = data;
      CacheCart.prototype.Instance = this;
    }

    /**定义一个有两个商品的购物车
     * goods:
     * 
     * [
     *    { goodId:1000, title:'小米1', counts:2, price:799, imgurl:'htpp://xxx', isSelect:false },
     *    { goodId:2000, title:'小米2', counts:3, price:100, imgurl:'htpp://xxx', isSelect:ture },
     *    { goodId:3000, title:'小米3', counts:1, price:300, imgurl:'htpp://xxx', isSelect:true },
     *    { goodId:4000, title:'小米4', counts:2, price:899, imgurl:'htpp://xxx', isSelect:false },
     * ]
     *
     *  */
    this.cart={
      goods:[
        { goodId: 1000, title: "标题，例：红米Note 5A 高配版", counts: 1, price: 799, imgurl: "http://47.93.30.78:8080/XiaoMiShop/image/detail/1000/note5-1.jpg", isSelect:true },
        { goodId: 2000, title: "标题，例：红米Note 5A 高配版", counts: 3, price: 799, imgurl: "http://47.93.30.78:8080/XiaoMiShop/image/detail/2000/note5-1.jpg", isSelect: true },
      ],
    };

    //2.如果已经创建过就直接返回
    return CacheCart.prototype.Instance;
  }




  /**
   * 1.查找一个商品
   */
  findGood(goodId){
    let goods = this.cart.goods;
    for (let i = 0; i < this.cart.goods.length;i++){
      let good = goods[i];
      if (goodId == good.goodId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 2.修改商品的数量
   */
  editGoodCounts(goodId,counts){

    let goods = this.cart.goods;
    for (let i = 0; i < this.cart.goods.length; i++) {
      let good = goods[i];
      if (goodId == good.goodId) {
        good.counts = good.counts + counts;
        console.log(this.cart.goods)
        return true;
      }
    }
    console.log(this.cart.goods)
    return false;
  }

  /**
   * 3.添加一个商品到购物车
   * { goodId:1000, title:'红米高配版', counts:2, price:799, imgurl: 'htpp://xxx', isSelect:false }
   */
  addGood(good) {
    let result = this.findGood(good.goodId);
    console.log(result,'===');
    if (result) {
      this.editGoodCounts(good.goodId, good.counts);
    } else {
      this.cart.goods.push(good);
    }
    console.log(this.cart.goods)
  }

  /**4.删除数据中指定的数据 */
  removeGood(index) {
    this.cart.goods.splice(index, 1);
  }

  /**5.获取购物车所有的商品 */
  getGoods(){
    return this.cart.goods;
  }

  /**
   * 6.统计选中商品的总价格
   */
  getAccount(){
    let sumPrice = 0; 
    this.cart.goods.forEach((value,index)=>{
      //已勾选的商品
      if (value.isSelect){
        //1.购买的数量
        let counts = value.counts;
        //2.商品的单价
        let price = value.price;
        sumPrice += (counts * price)
      }

    })
    return sumPrice;
  }

  /**
   * 7.选中所有的商品
   */
  selectAllGoods(isSelect){
    this.cart.goods.forEach((value, index) => {
      //已勾选的商品
      value.isSelect =isSelect;
    })
  }


  /**
 * 8.仅选中指定选中的商品
 */
  selectOnlySelect(goodIds) {

    //代表没有选中的商品
    if(goodIds.length == 0){
      this.selectAllGoods(false);
      console.log(this.cart.goods);
      return ;
    }

    //先取消所有的选中
    this.selectAllGoods(false);

    //在this.cart.goods找到了，就设为true
    goodIds.forEach((goodId, index) => {
      this.cart.goods.forEach((value, i) => {
        //仅仅比较goodId的值
        if (value.goodId == goodId) {
          //已勾选的商品
          value.isSelect = true;
        }
      })
    })
    console.log(this.cart.goods);
  }

  /**
   * 9.判断是否全选
   */
  isAllSelect(){
    let goods = this.cart.goods;
    for (let i = 0; i < this.cart.goods.length; i++) {
      let good = goods[i];
      //如果存在一个没有选中的，就返回false
      if (!good.isSelect) {
        return false;
      }
    }
    return true;
  }



}

module.exports = { 
  CacheCart: CacheCart,
  Good: Good,
};

// 使用案例：
/**
 * let CacheCart = require('../../CacheCart').CacheCart;
 * 
 * let c1 = new CacheCart();
 * let c1 = new CacheCart();
 * 
 */