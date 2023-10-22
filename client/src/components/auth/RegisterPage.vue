<template>
    <section class="h-screen" v-cloak>
        <div class="container">
            <div class="account-area">
                <div class="section-head ps-0">
                    <h3>Đăng ký</h3>
                </div>
                <Form @submit="handleSubmit" :validation-schema="schema">
                    <div class="form-group pb-2">
                        <Field 
                            placeholder="Username"
                            type="text"
                            name="user_name"
                            class="form-control"
                        />
                        <ErrorMessage class=" text-danger" name="user_name" />
                    </div>

                    <div class="form-group pb-2">
                        <Field 
                            placeholder="Email"
                            type="text"
                            name="email"
                            class="form-control"
                        />
                        <ErrorMessage class=" text-danger" name="email"  />
                    </div>
                    <div class="form-group">
                        <Field 
                            placeholder="Password"
                            type="password"
                           
                            name="password"
                            class="form-control"
                        />
                        <ErrorMessage class=" text-danger" name="password" />
                    </div>
                    <div class="footer fixed bg-white">
                        <div class="container">
                            <button
                            :disabled="submitted"
                                type="submit"
                                class="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl mb-2"
                            >
                                Đăng ký
                            </button>
                            <img v-show="submitted" />
                            <div class="w-100 d-flex justify-content-center">
                                <router-link to="/login" class="btn btn-link"
                                    >Quay lại</router-link
                                >
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </section>
</template>

<script setup>
import {  ref } from 'vue'
import { Form, Field, ErrorMessage  } from 'vee-validate';
import * as yup from 'yup';
import {  useStore  } from 'vuex'

const schema = yup.object({
    user_name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(8),
});
const store = useStore();
const submitted = ref(false)

// const { status } = mapState('account', ['status'])

function handleSubmit(value) {
    store.dispatch("auth/register",value)
}
</script>
