<template>
	<view class="page">
		<view v-if="myPost.length===0" class="empty">暂无个人发布记录</view>
		<view v-for="(item,idx) in myPost" :key="idx" class="card">
			<view>{{item.content}}</view>
			<u-button size="mini" type="error" @click="delPost(idx)">删除</u-button>
		</view>
	</view>
</template>
<script>
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			myPost:[]
		}
	},
	onShow(){
		 let allPost = getStorage('communityPost')||[]
		 let user = getStorage('userInfo')
		 if(!user) return
		 this.myPost = allPost.filter(p=>p.nickName === user.nickName)
	},
	methods:{
		delPost(index){
			let allPost = getStorage('communityPost')||[]
			let user = getStorage('userInfo')
			let uidPost = allPost.filter(p=>p.nickName===user.nickName)
			let targetId = uidPost[index].id
			let finalList = allPost.filter(p=>p.id!==targetId)
			setStorage('communityPost',finalList)
			uni.showToast({title:'删除成功'})
			this.onShow()
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
.card{background:#fff;padding:30rpx;border-radius:20rpx;margin-bottom:20rpx;display:flex;justify-content:space-between;align-items:center;}
.empty{text-align:center;padding:100rpx;color:#888;}
</style>
