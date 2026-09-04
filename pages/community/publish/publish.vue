<template>
	<view class="page">
		<u-textarea v-model="content" placeholder="写下你的自律心得/晨间感悟"></u-textarea>
		<u-upload :file-list="imgList" max-count="9" @after-read="afterRead" @delete="del"></u-upload>
		<u-button type="primary" @click="submit">发布动态</u-button>
	</view>
</template>
<script>
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
	data(){
		return {
			content:'',
			imgList:[]
		}
	},
	methods:{
		afterRead(res){
			this.imgList.push({url:res.file.url})
		},
		del(idx){
			this.imgList.splice(idx,1)
		},
		submit(){
			if(!this.content.trim() && this.imgList.length===0){
				return uni.showToast({title:'请填写内容或上传图片',icon:'none'})
			}
			let user = getStorage('userInfo')
			let post = {
				id:new Date().getTime(),
				nickName:user.nickName||'匿名',
				avatar:user.avatarUrl||'',
				content:this.content,
				imgs:this.imgList.map(i=>i.url),
				createTime:new Date().getTime()
			}
			let list = getStorage('communityPost')||[]
			list.unshift(post)
			setStorage('communityPost',list)
			uni.showToast({title:'发布成功'})
			setTimeout(()=>uni.navigateBack(),1200)
		}
	}
}
</script>
<style scoped>
.page{padding:30rpx;}
</style>
