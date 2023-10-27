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
                    <SetGenderVue :gender="user.gender" :birth="user.birth" :hobbies="user.hobbies" :des="user.description" @setDescription="setDescription" @setGender="(gender) => { user.gender = gender }" @setBirth="setBirth" @setHobbies="setHobbies" v-if="step == 0">
                    </SetGenderVue>
                    <SetSocialVue :phone="user.phone" @setPhone="(phone) => { user.phone = phone }" 
                        @setSocial="social => { user.social = social }" :social="user.social" v-else-if="step == 1">
                    </SetSocialVue>
                    <SetImagesVue @setImage="setImage"  v-else-if="step == 2" ></SetImagesVue>
                    <CompleteStartVue v-else-if="step == 3"></CompleteStartVue>
                </Transition>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer fixed bg-white">
            <div class="container">
                <button @click="nextStep()" v-if="step != 3"
                    class="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Tiếp tục</button>
                <button @click="redirectHome" v-else class="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Nhấn để có người yêu
                    !!!</button>
            </div>
        </div>
        <!-- Footer -->
    </section>
</template>

<script setup>
import { reactive, ref,computed, watch } from "vue";
import SetGenderVue from "./start/SetGender.vue";
import SetSocialVue from "./start/SetSocial.vue";
import SetImagesVue from "./start/SetImages.vue";
import CompleteStartVue from "./start/CompleteStart.vue";
import { useStore } from "vuex";
import * as yup from 'yup';
import router from '@/routes/router';


const step = ref(0);
const store = useStore()
// const emit = defineEmits(['saveGenderEvent'])
const user = reactive({
    gender: 1,
    phone: "",
    birth:Date.now,
    social: "",
    hobbies:"",
    description:"",
    images:[]
})
const schema = yup.object({
    phone: yup.string().matches(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        'Số điện thoại không hợp lệ'
    ).required(),
    social: yup.string().required()
})
// store.dispatch("user/getUsers");
let userNow = computed(() => store.state.user.user);
watch(userNow, (newVal) => {
   if(newVal.phone) {
    router.push('/')
   }
})
const setImage = (listImage) => {
    let images =[];
    for (const key in listImage) {
        if (Object.hasOwnProperty.call(listImage, key)) {
            const element = listImage[key];
           if(element) {
                images.push(element)
           }
        }
    }
    user.images = images;
}
const nextStep = () => {
    switch (step.value) {
        case 0:
            if (user.gender && user.hobbies && user.birth) {
                step.value++;
                console.log(user);
                store.dispatch('alert/clear');
            }else {
                store.dispatch('alert/error', "Hãy nhập đầy đủ thông tin");
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
const setBirth = (birth) => {
    user.birth = birth;
}
const setHobbies = (hobbies) => {
    user.hobbies = hobbies;
}
const setDescription = (description) => {
    user.description = description;
}
const redirectHome = () => {
    router.push('/')
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