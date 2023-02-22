
class InputTest {
	constructor(props) {
		// console.log(options)
		this.data = {
			shopList: [],
			carList: [],
			timer: null
		}

		this.el = props.el;
		this.success = props.success;

		this.list = [];//数据
		this.menu = new Map();//菜单
		this.brand = new Set();//品牌
		// // var height = document
		this.menuNodeSelected = [];//菜单选中
		this.shopListNode = []; // 商品选中
		this.carListNode = []; //购物车选中
		this.selectNode = [];	// tr 选中
		this.getRequest();
		this.bindEvent();
	}
	initEvent() {
		let that = this;
		that.setData(that.data);
		initBrand();

		// document.getElementById('container').style.height = document.body.offsetHeight + 'px';
		// 常用菜单
		var menuTab = document.getElementById('menuTab');
		menuTab.onclick = function () {
			document.getElementById('menuTabChild').style.display = 'flex';
			document.getElementById('menuTab').style.fontWeight = 'bolder';
			document.getElementById('actionTabChild').style.display = 'none';
			document.getElementById('action').style.fontWeight = 'normal';
		}

		// 快捷操作
		var quickTab = document.getElementById('action');
		quickTab.onclick = function () {
			document.getElementById('menuTabChild').style.display = 'none';
			document.getElementById('menuTab').style.fontWeight = 'normal';
			document.getElementById('actionTabChild').style.display = 'block';
			document.getElementById('action').style.fontWeight = 'bolder';
		}



		//所有商品 收起展开 id
		var all = document.getElementById("expandAll")
		//所有商品列表
		var menuEl = document.getElementById('menu');

		//所有商品点击事件
		all.onclick = function () {

			// 展开
			if (all.innerText == '+') {
				all.innerText = "-";
				let menuEl = document.getElementById('menu');

				that.menu.forEach((value, key, map) => {

					let box = document.createElement('div');
					let menubox = document.createElement("div");
					menubox.setAttribute("class", "secondmenu")

					//title 
					let titleElement = document.createElement('div');
					titleElement.setAttribute("class", "title");

					// 图标
					let iconElement = document.createElement('span');
					iconElement.setAttribute("class", "expand");
					iconElement.setAttribute("id", "expand");
					iconElement.innerText = '+';
					// label
					let contentElement = document.createElement('div');
					contentElement.innerText = key;

					titleElement.appendChild(iconElement);//添加 图标
					titleElement.appendChild(contentElement);// 添加 label

					box.appendChild(titleElement);
					box.appendChild(menubox);

					//label 选中，高亮
					contentElement.onclick = function () {
						changeMenuSelected(contentElement);
					}
					// 双击
					contentElement.ondblclick = function () {
						changeMenuSelected(contentElement);
						//搜索条件
						let params = {
							class: that.menuNodeSelected[0] ? that.menuNodeSelected[0].innerText : '',
							brand: document.getElementById('brand').value || '',
							num: document.getElementById('num').value || '',
							autoSearch: document.getElementById('autoSearch').value || '',
							searchText: document.getElementById("searchContent").value || '',
							selectAndNum: document.getElementById('selectAndNum').checked,
							noStock: document.getElementById('noStock').checked

						}
						that.search(params, 'dbclick');
					}
					//收起展开
					iconElement.onclick = function () {
						addListener(iconElement, menubox, key, value);
					}



					menuEl.appendChild(box);

				})
				// addListener();
			} else if (all.innerText == '-') {
				all.innerText = '+';
				menuEl.innerHTML = ''

			}
		}


		//label 菜单名选中
		var titleLabel = document.getElementById('titleLabel');
		titleLabel.onclick = function () {
			changeMenuSelected(titleLabel)
		}
		//所有商品双击事件
		titleLabel.ondblclick = function () {
			// console.log(that.list)
			that.data.shopList = that.list;
			that.setData(that.data);
		}
		//切换菜单，选中高亮
		function changeMenuSelected(node) {
			if (that.menuNodeSelected[0]) {
				that.menuNodeSelected[0].className = '';
			}
			node.className = 'menuActived'
			// node.style.backgroundColor = 'menuActived';
			that.menuNodeSelected.splice(0, 1, node);
		}
		// 一级分类点击事件实现
		function addListener(iconElement, secondmenu, key, value) {
			if (iconElement.innerText == '+') {
				iconElement.innerText = "-";
				value.forEach((element, index) => {
					let contentElement = document.createElement('div');
					contentElement.innerText = element;
					secondmenu.appendChild(contentElement);// 添加 label

					// TODO
					contentElement.onclick = function () {
						changeMenuSelected(contentElement);
					}
				})
			} else if (iconElement.innerText == '-') {
				iconElement.innerText = '+';
				secondmenu.innerHTML = '';

			}
		}





		function initBrand() {
			that.brand.forEach((value, key, set) => {
				let element = document.createElement('option');
				element.value = value;
				element.innerText = value;
				document.getElementById('brand').appendChild(element);
			})
		}

		var carTable = document.getElementById('buy-tab');//购物车
		var msgContent = document.getElementById('msg-tab');//执行讯息

		// 购物车切换
		carTable.onclick = function () {
			carTable.style.fontWeight = 'bolder';
			msgContent.style.fontWeight = 'normal';
			document.getElementById('car-content').style.display = 'block';
			document.getElementById('msg-content').style.display = 'none';
		}

		// 执行讯息切换

		msgContent.onclick = function () {
			carTable.style.fontWeight = 'normal';
			msgContent.style.fontWeight = 'bolder';
			document.getElementById('car-content').style.display = 'none';
			document.getElementById('msg-content').style.display = 'block';
		}

		var searchBtn = document.getElementById('searchBtn');
		searchBtn.onclick = function () {
			//搜索条件
			let params = {
				class: that.menuNodeSelected[0] ? (that.menuNodeSelected[0].innerText != '所有商品' ? that.menuNodeSelected[0].innerText : '') : '',
				brand: document.getElementById('brand').value || '',
				num: document.getElementById('num').value || '',
				autoSearch: document.getElementById('autoSearch').value || '',
				searchText: document.getElementById("searchContent").value || '',
				selectAndNum: document.getElementById('selectAndNum').checked,
				noStock: document.getElementById('noStock').checked

			}
			that.search(params, 'searchBtn');
		}



		// 自动搜索监听 
		var searchContent = document.getElementById('searchContent');
		searchContent.oninput = function (e) {
			let time = document.getElementById('autoSearch').value;
			if (time > 0) {
				// TODO
				//定时器节流函数
				let fn = throttled(function () {
					let shoplist = [];
					let map = new Map();
					if (searchContent.value == '') {
						shoplist = that.list;
					} else {
						that.list.forEach((item, index) => {
							if (item.DescSpec_.indexOf(searchContent.value) > -1) {
								if (!map.has(item.Code_)) {
									map.set(item.Code_, item);
								}
							}
						})

						map.forEach((value, key, map) => {
							shoplist.push(value);
						})
					}
					that.data.shopList = shoplist;
					that.setData(that.data);
				}, time * 1000)
				fn();
			}
		}
		function throttled(fn, delay = 500) {
			// console.log(typeof fn, delay)
			return function () {
				if (that.data.timer) {
					clearTimeout(that.data.timer)
					that.data.timer = null;
				}
				that.data.timer = setTimeout(() => {
					// console.log("22", that)
					fn.apply(that)
					that.data.timer = null
				}, delay);
			}
		}


	}



	// 立即查询 双击菜单文本立即查询 type = dbclick，常规条件查询 type  = searchBtn
	// type = autoSearch 自动搜索；
	search(params, type) {

		// 双击菜单 立即搜索
		if (type == 'dbclick') {
			let shoplist = []
			this.list.forEach((item, index) => {
				if (params.class == item.Class1_) {
					shoplist.push(item)
				}
			})
			this.data.shopList = shoplist;
		}

		// 
		if (type == 'searchBtn') {
			// 自动搜索
			let map = new Map();
			let list;
			console.log("params", params)
			if (params.class == '' &&
				params.brand == '' &&
				params.num == '0' &&
				params.searchText == '' &&
				params.noStock == false) {
				list = this.list;
			} else {
				list = this.list.filter((item, index, arr) => {
					let flag = (params.class ? (item.Class1_.indexOf(params.class) > -1) : true) &&
						(params.brand ? (item.brand.indexOf(params.brand) > -1) : true) &&
						(params.noStock ? item.Stock_ > 0 : true) &&
						(params.searchText ? (item.brand.indexOf(params.searchText) > -1 ||
							item.Class1_.indexOf(params.searchText) > -1) : true);
					// console.log(item, flag)
					return flag;
				})
			}


			console.log("list", list);
			// console.log("this.list", this.list)
			this.data.shopList = list;
			// this.setData(this.data);
		}

		//自动搜索
		if (type == 'autoSearch') {
			// console.log("autoSearch", params)
			let shoplist = [];
			let map = new Map();
			if (params == '') {
				shoplist = this.list;
			} else {
				this.list.forEach((item, index) => {
					if (item.Class1_.indexOf(params) > -1) {
						if (!map.has(item.Code_)) {
							map.set(item.Code_, item);
						}
					}
					if (item.brand.indexOf(params) > -1) {
						if (!map.has(item.Code_)) {
							map.set(item.Code_, item);
						}
					}
				})

				map.forEach((value, key, map) => {
					shoplist.push(value);
				})
			}

			this.data.shopList = shoplist;
		}

		this.setData(this.data);

	}
	bindEvent() {
		// console.log(this.el)
		let that = this;
		// console.log(that)
		let btn = document.getElementById(this.el);
		// console.log(document.getElementById(this.el))
		btn.onclick = function () {
			let html = `
	<div class="view">
        <div id="container" class="container">
            <div id="left" class="left">
                <div id="tab" class="tab-select">
                    <div id="menuTab" class="tab actived">常用菜单</div>
                    <div id="action" class="tab">快捷操作</div>
                </div>
                <div id="menuTabChild" class="labelCalss">
                    <div id="all" class="title">
                        <span id="expandAll" class="expand">+</span>
                        <div id="titleLabel">所有商品</div>
                    </div>
                    <div id="menu" class="menu"></div>
                </div>
                <div id="actionTabChild" style="display: none; font-size: 1rem; ">
					在输入搜索条件后：<br>
					Enter: 自动查询<br>
					Space: 回到搜索条件<br>
					Esc: 取消<br>
					Alt + Enter: 确定<br>
					在商品查询表格中：<br>
					W/S: 光标上下移动<br>
					方向键上/下: 光标上下移动<br>
					Enter: 增加商品数量<br>
					D: 回到选中商品表格<br>
					Delete: 删除选中的商品<br>
					在选中商品表格中：<br>
					Enter: 光标定位数量显示更改数量<br>
					Enter: 光标定位赠品是否需要赠品<br>
					Enter: 光标定位备注显示更改备注<br>
					A: 回到商品查询表格中<br>
					方向键左/右（只在选中的商品中生效）：光标左右移动<br>
					W/S: 光标上下移动<br>
					方向键上/下： 光标上下移动<br>
					1-9: 更改录入数量<br>
					0: 当前录入数量<br>
					Delete: 删除选中商品<br>
                </div>

            </div>
            <div id="main" class="main">
                <div id="search" class="search">
                    <div class="form">
                        <div class="where">
                            <div style="padding: 4px;display: flex;align-items: center;">

                                <span class="width-3p5vw">商品品牌：</span>
                                <select id="brand" class="width-6vw">
                                    <option value=""></option>
                                </select>
                                <div class="inlink-block width-1vw"> </div>
                                <span class="width-3p5vw">载入笔数:</span>
                                <select id="num" class="width-6vw">
                                    <option value="0"></option>
                                    <option value="100">100</option>
                                    <option value="50">50</option>
                                    <option value="20">20</option>
                                    <option value="10">10</option>
                                </select>
                                <div class="inlink-block width-1vw"> </div>
                                <span class="width-3p5vw">自动搜索：</span>
                                <select id="autoSearch" class="width-6vw">
                                    <option value="0">从不</option>
                                    <!-- <option value="0">0s</option> -->
                                    <option value="1">1s</option>
                                    <option value="2">2s</option>
                                    <option value="3">3s</option>
                                </select>

                                <div class="inlink-block width-1vw"> </div>
                                <input id="showRow" class="showRow" type="button" value="显示购物车行数"></button>
                                <!-- <input type="button" id="showRow" value=""></input> -->

                            </div>
                            <div class="search-input">
                                <span class="width-3p5vw">搜索商品：</span>
                                <input class="width-15vw test" id="searchContent" type="text">
                                <i class="icon-search">
                                    <img src="./search.png" style="width: 1rem;height:1rem" alt="" srcset="">
                                </i>
                                </input>
                                <div class="inlink-block width-1vw"></div>
                                <input type="checkbox" id="selectAndNum" value="1" />选择商品时,同时输入数量
                                <div class="inlink-block width-1vw"> </div>
                                <input type="checkbox" id="noStock" value="1" />库存不等于0
                            </div>

                        </div>
                        <div class="input-btn">
                            <input id="searchBtn" class="btn" type="button" value="查询">
                        </div>
                    </div>

                </div>
                <div id="main-center" class="main-center">

                    <div>
                        <table id="search-table" class="table" border="0">
                            <thead>
                                <tr id="table-head" class="table-head">
                                    <th class="width-8vw">选中</th>
                                    <th class="width-8vw">品牌</th>
                                    <th class="width-20vw">商品类别</th>
                                    <th class="width-8vw">品名规格</th>
                                    <th class="width-8vw">单位</th>
                                    <th class="width-8vw">库存量</th>
                                    <th class="width-8vw">单价</th>
                                    <th class="width-8vw">赠品</th>
                                </tr>
                            </thead>
                            <tbody id="shoplist-data">
                            </tbody>


                        </table>

                    </div>
                </div>
                <div id="buy-car" class="buy-car">
                    <div id="main-tab" class="main-tab">
                        <span id="buy-tab" class="cursor-pointer"
                            style="font-weight: bolder; padding-right: 16px">购物车</span>
                        <span id="msg-tab" class="cursor-pointer">执行讯息</span>
                    </div>
                    <div id="car-content" class="car-content">
                        <table id="car-table" class="table" border="0">
                            <thead>
                                <tr id="table-head" class="table-head">
                                    <th class="width-8vw">序号</th>
                                    <th class="width-20vw">品名规格</th>
                                    <th class="width-8vw">单位</th>
                                    <th class="width-8vw">数量</th>
                                    <th class="width-8vw">单价</th>
                                    <th class="width-8vw">赠品</th>
                                    <th class="width-8vw">备注</th>
                                    <th class="width-8vw">操作</th>
                                </tr>
                            </thead>
                            <tbody id="carlist-data">
								
                                
                            </tbody>



                        </table>

                    </div>
                    <div id="msg-content" class="msg-content" style="display: none;">
                        <div>执行讯息。执行讯息。执行讯息。执行讯息。执行讯息。</div>

                    </div>
                </div>
            </div>
        </div>
        <div id="footer" class="footer">
            <div>执行自动搜索</div>
            <div>
                <button id="confirm">确定</button>
                <button id="cancel">取消</button>
            </div>
        </div>
    </div>`
			if (!document.getElementById('dialog')) {
				let node = document.createElement("div");
				node.setAttribute("id", "dialog");
				node.className = "dialog";
				node.innerHTML = html;
				document.body.appendChild(node);
				that.initEvent();
			}

		}


	}
	// 调接口  初始化 initDom()
	getRequest() {
		console.log("getRequest", this.el, this.list, this.menuNodeSelected);
		let that = this;
		$.ajax({
			url: "data.json",
			dataType: "json",
			success: function (data) {
				if (data === undefined) { return false; }
				that.list = data.data;
				that.data.shopList = that.list;
				that.list.forEach((element, index) => {
					if (that.menu.get(element.Class1_)) {
						let value = JSON.parse(JSON.stringify(that.menu.get(element.Class1_)));
						if (!value[element.brand]) {
							that.menu.set(element.Class1_, [...value, element.brand])
						}
					} else {
						that.menu.set(element.Class1_, [element.brand])
					}
					//品牌
					that.brand.add(element.brand);
				});


			}
		})

	}

	initDom() {
		let that = this;
		let shopListDoms = [];
		let carListDoms = [];

		//检查 shoplist-data 是否有子节点

		// id = shoplist-data  渲染商品列表
		if (this.data.shopList.length > 0) {
			shopListDoms = this.data.shopList.map((value, index, arr) => {
				let dom = document.createElement("tr");
				dom.setAttribute("id", String(value.Code_));
				let html = `
				<td class="center width-8vw">
					<input type="checkbox" />
				</td>
				<td class="center width-8vw">${value.brand}</td>
				<td class="center width-20vw">${value.Class1_}</td>
				<td class="center width-8vw">${value.DescSpec_}</td>
				<td class="center width-8vw">${value.Unit_}</td>
				<td class="center width-8vw">${value.Stock_}</td>
				<td class="center width-8vw">${value.OriUP_}</td>
				<td class="center width-8vw"></td>`
				dom.innerHTML = html;

				//检查 是否存在购物车
				if (that.checkCarList(String(value.Code_))) {
					// console.log("checkClass")
					let checkNode = dom.getElementsByTagName("input");
					checkNode[0].checked = true;
					dom.className = "checkedClass";
				}
				//当前最新选中状态
				if (this.selectNode.length > 0 && dom.id == this.selectNode[0].id) {
					// console.log("select class")
					dom.className = "selectClass";
				}
				return dom;
			});
		}
		let shoplistParentDom = document.getElementById('shoplist-data');
		while (shoplistParentDom.children.length > 0) {
			shoplistParentDom.removeChild(shoplistParentDom.children[0]);
		}
		shopListDoms.forEach((item, index) => {
			shoplistParentDom.appendChild(item);
			item.onclick = function () {
				that.shopClickEvent(item, "commodity");
			}
			let giftNode = item.children[item.children.length - 1];
			giftNode.onclick = function (event) {
				event.stopPropagation();
				that.shopClickEvent(item, "gift");
			}

		})


		// 购物车列表
		if (this.data.carList.length > 0) {
			carListDoms = this.data.carList.map((value, index, arr) => {
				let dom = document.createElement("tr");
				dom.setAttribute("id", String(value.carId));
				let html = `
				<td class="center width-8vw">${index + 1}</td>
				<td class="center width-8vw">${value.DescSpec_}</td>
				<td class="center width-20vw">${value.Unit_}</td>
				<td class="center width-8vw">${value.carNum}</td>
				<td class="center width-8vw">${value.OriUP_}</td>
				<td class="center width-8vw">${value.isGift}</td>
				<td class="center width-8vw">${value.remark}</td>
				<td class="center width-8vw">
				<i>
				<img src="./delete.svg" style="width: 1rem;height:1rem" alt="" srcset="">
				</i>
				</td>`
				dom.innerHTML = html;

				//当前选中
				if (this.selectNode.length > 0 && dom.id == this.selectNode[0].id) {
					dom.className = "selectClass";
				}

				return dom;
			});
		}
		let carListParentDom = document.getElementById('carlist-data');
		// console.log("carlist",carListParentDom.children,carListParentDom.children.length)
		while (carListParentDom.children.length > 0) {
			carListParentDom.removeChild(carListParentDom.children[0]);
		}
		carListDoms.forEach((item, index) => {
			carListParentDom.appendChild(item);
			//TODO 购物车添加绑定事件
			item.onclick = function () {
				that.carClickEvent(item);
			}
			let carDel = item.children[item.children.length - 1];
			carDel.onclick = function (event) {
				console.log("carDel click")
				event.stopPropagation();
				that.removeCarList(item)
			}

		})


	}

	/*
		移除购物车 
		params: Object() node 节点 
	*/
	removeCarList(node) {
		// console.log(node.id)

		// console.log(node);

		let list = this.data.carList.filter((item, index, arr) => {
			return node.id !== item.carId
		})
		// console.log(list);
		this.data.carList = list;
		this.setData(this.data);


	}

	// 检车购物车
	checkCarList(code) {
		let flag = false
		this.data.carList.forEach((item, index) => {
			if (code == item.Code_) {
				flag = true;
			}
		})
		return flag;
	};
	// 商品列表 行 点击事件 购物车数量加一
	shopClickEvent(node, type) {
		// this.shopListNode = [node] // 存储选中的商品
		// this.carListNode = []	// 购物车选中
		this.selectNode = [node]   // 保存选中的节点
		let commodity = {}
		this.list.forEach((item, index) => {
			if (node.id == item.Code_) {
				commodity = JSON.parse(JSON.stringify(item));//深度拷贝
			}
		})
		let exitedCar = false;

		// 商品添加至购物车
		if (type == 'commodity') {
			commodity.carId = "c" + commodity.Code_;
			console.log("commodity add car", commodity, this.data.carList)
			if (this.data.carList.length > 0) {
				for (let i = 0; i < this.data.carList.length; i++) {
					if (this.data.carList[i].carId == commodity.carId) {
						exitedCar = true;
						this.data.carList[i].carNum += 1;
					}
				}
				if (!exitedCar) {
					commodity.carNum = 1;
					commodity.isGift = "";
					commodity.remark = "";
					this.data.carList.push(commodity);
				}
			} else {
				commodity.carNum = 1;
				commodity.isGift = "";
				commodity.remark = "";
				this.data.carList.push(commodity);

			}

		}

		// 赠品添加至购物车
		if (type == 'gift') {


			commodity.carId = "g" + commodity.Code_;
			console.log("gift add car", commodity, this.data.carList)
			if (this.data.carList.length > 0) {
				for (let i = 0; i < this.data.carList.length; i++) {
					if (this.data.carList[i].carId == commodity.carId) {
						exitedCar = true;
						this.data.carList[i].carNum += 1;
					}
				}
				if (!exitedCar) {
					commodity.carNum = 1;
					commodity.isGift = "Yes";
					commodity.remark = "";
					this.data.carList.push(commodity);
				}
			} else {
				commodity.carNum = 1;
				commodity.isGift = "Yes";
				commodity.remark = "";
				this.data.carList.push(commodity);

			}
		}
		this.setData(this.data);
	}

	// 购物车列表 行 点击事件 
	carClickEvent(node) {
		console.log(node);
		// this.carListNode = [node] // 存储选中的商品
		// this.shopListNode = [] //
		this.selectNode = [node] //保存选中的节点
		this.initDom();

	}

	setData({ shopList, carList }) {
		this.data = { shopList, carList }
		this.initDom();
	}

}

export default InputTest;