<template>
    <div>
        <div class="section-head ps-0">
            <h3>Làm sao để liên hệ với bạn ?</h3>
        </div>
        <Form  :validation-schema="schema">
            <div class="form-group pb-2">
                <Field placeholder="Số điện thoại" @change="setPhone" type="phone" :value="phone" name="phone_number" class="form-control" />
                <ErrorMessage class=" text-danger" name="phone_number" />
            </div>
            <div class="form-group pb-2">
                <Field placeholder="Facebook" @change="setSocial" :value="social" type="text" name="facebook" class="form-control" />
                <ErrorMessage class=" text-danger" name="facebook" />
            </div>
        </Form>
    </div>
</template>

<script >
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
export default {
    components: {
            Form,
            Field,
            ErrorMessage
    } ,
    data() {
        return {
            schema : yup.object({
                phone_number: yup.string().matches(
                    /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    'Số điện thoại không hợp lệ'
                ).required(),
                facebook: yup.string().required()
            }),
           
        };
    },
    mounted() {
      
    },

    computed: {
    },
    methods: {
        setPhone(e) {
            this.$emit('setPhone', e.target.value);
        },
        setSocial(e) {
            this.$emit('setSocial', e.target.value);
        }
    },
    props: {
        phone: String,
        social: String,
    }
}
</script>

<style lang="css" scoped>

</style>