var vm = new Vue({
	el: '#refreshContainer',

	data: {
		list: [], // 列表数据
		page: 1, // 页码
		pageSize: 2, // 每页显示条数
		pages: 3, // 一共的页数
	},

	methods: {
		/**
		 * 下拉刷新
		 */
		downFn: function() {
			// 重置页码
			this.page = 1;
			
			// 重置上拉加载更多
			mui('#refreshContainer').pullRefresh().refresh(true);
			
			// 做一个ajax 请求
			this.getList(function() {
				mui('#refreshContainer').pullRefresh().endPulldown();
			});

		},
		
		/**
		 * 上拉加载更多
		 */
		upFn: function() {
			var that = this;
			this.page++;
			this.getList(function() {
				// 需要判断 是否还有更多的数据
				if (that.page >= that.pages) {
					//没有更多
					mui('#refreshContainer').pullRefresh().endPullup(true);
				} else {
					mui('#refreshContainer').pullRefresh().endPullup();	
				}
			}, true)
		},

		/**
		 * 获取数据
		 * @param {Function} callback 回调函数
		 * @param {Boolean} isMore 是否加载更多
		 */
		getList: function(callback, isMore) {
			var that = this;
			mui.get('http://route.showapi.com/341-2', {
				// 请求参数
				showapi_appid: 26444,
				showapi_sign: 'e6ed68d43d734b78892a649fedd90cbe',
				page: that.page,
				maxResult: that.pageSize
			}, function(result) {

				if(result.showapi_res_code === 0) {
					if (isMore) {
						that.list = that.list.concat(result.showapi_res_body.contentlist);
					} else {
						that.list = result.showapi_res_body.contentlist;	
					}					
					
					// 将一共多少页做赋值
//					that.pages = result.showapi_res_body.allPages;
				} else {
					mui.toast(result.showapi_res_error);
				}
				console.log(result);

				// 上面的操作做完了之后，
				callback();
			})
		},
		
		/**
		 * 去详情
		 * @param {String} imgUrl 大图的url地址
		 */
		goDetail: function (imgUrl) {
			console.log('点击事件触发了没有');
			console.log(imgUrl);
			// 打开详情页
			// 自定义事件
			
			var detailWebViewObj = plus.webview.getWebviewById('detail.html');
			
			console.log(detailWebViewObj);
			
			mui.fire(detailWebViewObj, 'laiImgle', imgUrl);
			
			mui.openWindow({
				id: 'detail.html'
			})
			
		}
	}
})

mui.init({
	preloadPages: [
		{
			url: 'detail.html',
			id: 'detail.html'
		}
	],
	
	pullRefresh: {
		container: '#refreshContainer',
		down: {
			height: 50, //可选,默认50.触发下拉刷新拖动距离,
			auto: true, //可选,默认false.首次加载自动下拉刷新一次
			contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: vm.downFn //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: vm.upFn //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
})