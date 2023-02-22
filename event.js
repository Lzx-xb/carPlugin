
    $(function () {
        var list;
        var menu = new Map();//菜单
        var brand = new Set();//品牌
        // var height = document
        var menuNodeSelected = [];
        getData();

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



        //所有商品
        var all = document.getElementById("expandAll")
        //所有商品列表
        let menuEl = document.getElementById('menu');

        //所有商品点击事件
        all.onclick = function () {

            // 展开
            if (all.innerText == '+') {
                all.innerText = "-";
                let menuEl = document.getElementById('menu');

                menu.forEach((value, key, map) => {

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
        //切换菜单，选中高亮
        function changeMenuSelected(node) {
            node.style.backgroundColor = '#01a9fd';
            if (menuNodeSelected[0] && menuNodeSelected[0].parentNode.innerText != node.parentNode.innerText) {

                menuNodeSelected[0].style.backgroundColor = '#fff';
            } else if (menuNodeSelected[0]) {
                menuNodeSelected[0].style.backgroundColor = '#fff';
            }
            menuNodeSelected.splice(0, 1, node);

            console.log(menuNodeSelected)
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

        function getData() {
            $.ajax({
                url: "data.json",
                dataType: "json",
                success: function (data) {
                    if (data === undefined) { return false; }
                    list = data.data;
                    let left = document.getElementById("#left")
                    list.forEach((element, index) => {
                        // console.log(element)
                        if (menu.get(element.Class1_)) {
                            // console.log("true")
                            let value = JSON.parse(JSON.stringify(menu.get(element.Class1_)));
                            // console.log(value);
                            if (!value[element.brand]) {
                                // value.push(element.brand)
                                menu.set(element.Class1_, [...value, element.brand])
                            }
                        } else {
                            menu.set(element.Class1_, [element.brand])
                        }
                        //品牌
                        brand.add(element.brand);
                    });
                    initBrand();

                }
            })
        }

        function initBrand() {
            brand.forEach((value, key, set) => {
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

    });
