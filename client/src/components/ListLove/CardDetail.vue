<template>
    <div>
        <!-- PWA Offcanvas -->

        <div class="offcanvas offcanvas-bottom " style="max-height: 90%;" v-cloak tabindex="-1" id="offcanvasBottom">
            <div class="container">
                <div class="offcanvas-body small">
                    <div class="detail-area">
                        <div class="dz-media-card style-2">
                            <div class="dz-media">
                                <img :src="'http://localhost:3000' + user?.images[0]" alt="">
                            </div>
                            <div class="dz-content">
                                <div class="left-content">
                                    <h4 class="title">{{ user?.user_name }}</h4>
                                    <p class="mb-0">{{ 'Ngày sinh: ' + new Date(user?.birth).toLocaleDateString("vi-VN") }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="detail-bottom-area">
                            <div class="about">
                                <h6 class="title">Giới thiệu</h6>
                                <p class="para-text">{{ user?.description }}</p>
                            </div>
                            <div class="about mb-2">
                                <h6 class="title">Số điện thoại</h6>
                                <a :href="'tel:' + user?.phone">{{ user?.phone }}</a>
                            </div>
                            <div class="about mb-2">
                                <h6 class="title">Facebook</h6>
                                <a v-if="user?.social && checkUrl(user.social)" :href="user?.social">Xem facebook</a>
                                <p class="para-text" v-else> {{ user?.social }}</p>
                            </div>
                            <div class="intrests mb-3">
                                <h6 class="title">Sở thích</h6>
                                <ul class="dz-tag-list">
                                    <li v-for="hobbie in user?.hobbies" :key="hobbie.id">
                                        <div class="dz-tag">
                                            <span>{{ hobbie.name }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="mb-3">
                                <h6 class="title">Ảnh </h6>
                                <div v-for="image in user?.images" :key="image" class="col-md-6 col-12">
                                    <div class="dz-media-card style-3">
                                        <div class="dz-media">
                                            <img :src="'http://localhost:3000' + image" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="offcanvas-backdrop pwa-backdrop"></div>
        <!-- PWA Offcanvas End -->
    </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    user: Object
})

const { user } = toRefs(props)

const checkUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
</script>

<style lang="scss" scoped></style>