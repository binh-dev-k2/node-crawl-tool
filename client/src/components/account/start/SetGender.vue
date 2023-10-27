
<template>
    <div>
        <div class="section-head ps-0">
            <h3>Thông tin cơ bản ?</h3>
        </div>
        <div class="radio style-2">
            <label>Giới tính</label>
            <label class="radio-label">
                <input type="radio" @click="setGender(1)" :checked="gender == 1" name="radio2">
                <span class="checkmark">
                    <span class="text">Nữ</span>
                    <span class="check"></span>
                </span>
            </label>
            <label class="radio-label">
                <input type="radio" @click="setGender(2)" :checked="gender == 2" name="radio2">
                <span class="checkmark">
                    <span class="text">Nam</span>
                    <span class="check"></span>
                </span>
            </label>
        </div>
        <div class="form-group mt-2">
            <label for="exampleInputEmail1">Ngày sinh</label>
            <VueDatePicker v-model="date" :enable-time-picker="false"></VueDatePicker>
        </div>
        <div class="form-group mt-2">
            <label for="exampleInputEmail1">Sở thích</label>
            <MultiSelect v-model="selected" :value="hobbies"  :options="options" optionLabel="name" placeholder="Chọn sở thích của bạn" :maxSelectedLabels="3"
            class="w-100 py-2" />
            <div>
                <span class="badge badge-primary m-2" v-for="hobbie in hobbies" :key="hobbie.id">{{ hobbie.name }}</span>
            </div>
        </div>
        <div class="form-group mt-2">
            <Textarea v-model="description" class=" w-100" placeholder="Mô tả về bản thân" autoResize rows="5" cols="30" />
        </div>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import {listHobbies} from '../../../helpers'
export default {
    components: {
        VueDatePicker,
        MultiSelect,
        Textarea
    },
    data() {
        return {
            date: new Date(),
            options: listHobbies,
            selected: null,
            description: ""
        };
    },
    mounted() {
        this.listHobbies = this.hobbies
        this.date = this.birth
        this.description = this.des
    },
    watch: {
        date: function (newVal) {
            console.log(newVal);
            this.$emit('setBirth', newVal);
        },
        selected: function (newVal) {
            this.$emit('setHobbies', newVal);
        },
        description: function(newVal) {
            this.$emit('setDescription', newVal);
        }
    },

    computed: {
        
    },
    methods: {
        setGender(gender) {
            this.$emit('setGender', gender);
        },
        setHobbi(e) {
            console.log(e.target);
        }
    },
    props: {
        gender: Number,
        hobbies: Object,
        birth: Date,
        des: String,
    }
}
</script>

<style lang="scss" scoped></style>