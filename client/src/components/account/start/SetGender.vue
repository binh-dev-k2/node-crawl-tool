<template>
    <div>
        <div class="section-head ps-0">
            <h3>Chọn giới tính của bạn ?</h3>
        </div>
        <div class="radio style-2">
            <label class="radio-label">
                <input type="radio" @click="setGender(1)" :checked="gender == 1" name="radio2">
                <span class="checkmark">
                    <span class="text">Nữ</span>
                    <span class="check"></span>
                </span>
            </label>
            <label class="radio-label">
                <input type="radio" @click="setGender(2)" :checked="gender == 2"  name="radio2">
                <span class="checkmark">
                    <span class="text">Nam</span>
                    <span class="check"></span>
                </span>
            </label>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
           
        };
    },
    mounted() {
      
    },
   
    computed: {
    },
    methods: {
        setGender(gender) {
            this.$emit('setGender', gender);
        }
    },
    props: {
        gender: Number
    }
}
</script>

<style lang="scss" scoped></style>