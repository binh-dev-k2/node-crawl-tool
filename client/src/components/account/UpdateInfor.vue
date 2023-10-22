<template>
    <section v-cloak>
        <div class="container">

            <div class="account-area">
                <Transition mode="out-in" name="fade">
                    <a v-if="step > 0 && step < 3" @click="step--" class="back-btn dz-flex-box">
                        <i class="icon feather icon-chevron-left"></i>
                    </a>
                    <p v-else class=" pt-2"></p>
                </Transition>
                <Transition mode="out-in" name="fade">
                    <SetGenderVue :gender="user.gender" @setGender="(gender) => { user.gender = gender }" v-if="step == 0">
                    </SetGenderVue>
                    <SetSocialVue :phone="user.phone" @setPhone="(phone) => { user.phone = phone }"
                        @setSocial="social => { user.social = social }" :social="user.social" v-else-if="step == 1">
                    </SetSocialVue>
                    <SetImagesVue @setImage="setImage" v-else-if="step == 2" ></SetImagesVue>
                    <CompleteStartVue v-else-if="step == 3"></CompleteStartVue>
                </Transition>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer fixed bg-white">
            <div class="container">
                <button @click="nextStep()" v-if="step != 3"
                    class="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Tiếp tục</button>
                <button v-else class="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Nhấn để có người yêu
                    !!!</button>
            </div>
        </div>
        <!-- Footer -->
    </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import SetGenderVue from "./start/SetGender.vue";
import SetSocialVue from "./start/SetSocial.vue";
import SetImagesVue from "./start/SetImages.vue";
import CompleteStartVue from "./start/CompleteStart.vue";
import { useStore } from "vuex";
import * as yup from 'yup';


const step = ref(0);
const store = useStore()
// const emit = defineEmits(['saveGenderEvent'])
const user = reactive({
    gender: 1,
    phone: "",
    social: "",
    images: {
        main:"",
        first:"",
        second:""
    }
})
const schema = yup.object({
    phone: yup.string().matches(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        'Số điện thoại không hợp lệ'
    ).required(),
    social: yup.string().required()
})
// store.dispatch("user/getUsers");
// let user = computed(() => store.state.user.user).value;
const setImage = (listImage) => {
    
    user.images = listImage;
}
const nextStep = () => {
    switch (step.value) {
        case 0:
            if (user.gender) {
                step.value++;
            }
            break;
        case 1:
            
            if (schema.isValidSync({phone: user.phone, social: user.social})) {
                step.value++;
                store.dispatch('alert/clear');
            } else {
                store.dispatch('alert/error', "Hãy nhập đầy đủ thông tin");
            }
            break;
        case 2: 
            store.dispatch("user/updateUser", user);
            step.value++;
            break;
        default:
            break;
    }
}
</script>

<style lang="css" scoped>
.fade-enter-active {
    transition: all 0.5s ease-out;
}

.fade-leave-active {
    transition: all 0.3s ease-out;
}

.fade-enter-from {
    opacity: 0;

}

.fade-leave-to {
    opacity: 0;
}
</style>