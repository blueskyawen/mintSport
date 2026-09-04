<script>
	import initApp from '@/common/appInit.js';
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			initApp();
			await uniIdPageInit();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";
	/*每个页面公共css */
	@import "./uni.scss";
</style>
