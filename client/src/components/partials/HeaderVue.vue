<template>
	<header class="header header-fixed border-0">
		<div class="container">
			<div class="header-content">
				<div class="left-content">
					<a href="javascript:void(0);" class="menu-toggler">
						<img :src="user.images ? user.images[0] : 'fail'" class="img-thumbnail" alt="...">
					</a>
				</div>
				<div class="mid-content header-logo">
					<a href="home.html">
						<img src="assets/images/logo.png" alt="">
					</a>
				</div>
				<div class="right-content">
					<a href="/list-love" class="menu-toggler">
						<i class="flaticon flaticon-bell"></i>
					</a>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore()
const user = computed(() => store.getters['user/getUser']);

</script>

<style lang="scss" scoped></style>