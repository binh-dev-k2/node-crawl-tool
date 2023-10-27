<template>
	<header class="header header-fixed border-0">
		<div class="container">
			<div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
				<div class="offcanvas-header">
					<h5 id="offcanvasTopLabel">Đăng xuất</h5>
					<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
						aria-label="Close"></button>
				</div>
				<div class="offcanvas-body">
					<div class="card-body">
						<h5>Hello {{ user?.user_name }}</h5>
						<p class="card-text">Bạn có muốn đăng xuất không ???</p>
						<a href="#" v-on:click="store.dispatch('auth/logout')" class="btn btn-primary">Có</a>
					</div>
				</div>
			</div>
			<div class="header-content">
				<div class="left-content">
					<a href="javascript:void(0);" class="menu-toggler" data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
						<img :src="user?.images ? user?.images[0] : 'fail'" class="img-thumbnail" alt="...">
					</a>
				</div>
				<div class="mid-content header-logo">
					<a v-on:click="router.push('/')">
						<i class="flaticon flaticon-house"></i>
					</a>
				</div>
				<div class="right-content">
					<button v-on:click="router.push('/list-love')" class="menu-toggler">
						<i class="flaticon flaticon-bell"></i>
						<p v-if="listUsers.length != 0">{{ listUsers.length }}</p>
					</button>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import router from "@/routes/router";
const store = useStore()
const user = computed(() => store.getters['user/getUser']);

setInterval(() => {
	store.dispatch("user/getLoveUser")
},10000)
let listUsers = computed(() => {
	let list = store.getters['user/getLoveUser'];
	if (list && list.length > 0) {
		return list;
	}
	return [];
});

</script>

<style lang="scss" scoped></style>