
## 流程

+ import input.js

+ 创建实例 
```js
    new InputTest({
        el: 'btn',
        success: (res) => {
            // TODO
        }
    }); 
    //传递两个参数,el：button的id值，回调函数
```

+ class InputTest() 执行逻辑

>>+ this.getRequest() 调用接口初始化菜单，查询条件
    调用一次initDom();商品区渲染dom。  
>>
>>+ this.bindEvent();将传入进来的el值，绑定点击事件，绑定点击事件创建弹窗Dom并加载到body中，再调用this.initevent(),对创建好的dom节点做相应的事件绑定。


## 商品列表点击事件

+ 商品列表checkbox 为true； (**完成**)

+ 购物车对应商品数量加一； （**完成**）

+ 点击的对应的row backgroud-color 为 #6699ff 

## 商品搜索 (type = dbclick / searchBtn)

type = dblick 双击菜单栏，立即搜索  
type = searchBtn 常规条件搜索

+ 双击菜单栏 选中 并 自动搜索

+ 点击 收起 展开 图标 （**完成**）

+ 单击选中 （**完成**）

## 菜单栏

+ 点击 +/- 实现收起展开 （**完成**）

+ 单机文本选中，可用于查询 （**完成**）

+ 双击文本，立即查询 

+ 常用菜单/快捷操作切换 （**完成**）






