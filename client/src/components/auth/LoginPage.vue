<template>
    <section class="h-screen" v-cloak>
        <div class="container">
            <div class="account-area">
                <div class="section-head ps-0">
                    <h3 class="text-centr">Đăng nhập ngay</h3>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-group pb-2">
                        <input
                            type="text"
                            v-model="email"
                            class="form-control"
                            :class="{ 'is-invalid': submitted && !email }"
                            placeholder="Email"
                        />
                        <div
                            v-show="submitted && !email"
                            class="invalid-feedback"
                        >
                            Email is required
                        </div>
                    </div>
                    <div class="form-group">
                        <input
                            type="password"
                            v-model="password"
                            class="form-control"
                            :class="{ 'is-invalid': submitted && !password }"
                            placeholder="Mật khẩu"
                        />
                        <div
                            v-show="submitted && !password"
                            class="invalid-feedback"
                        >
                            Password is required
                        </div>
                    </div>
                    <div class="footer fixed bg-white">
                        <div class="container">
                            <button
                                type="submit"
                                class="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl mb-2"
                            >
                                Đăng nhập
                            </button>
                            <div class="w-100 d-flex justify-content-center">
                                <router-link to="/register" class="text-center"
                                    >Đăng ký ngay</router-link
                                >
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    data() {
        return {
            email: "",
            password: "",
            submitted: false,
        };
    },
    computed: {
        ...mapState("auth", ["user"]),
    },
    created() {
        this.logout();
    },
    methods: {
        ...mapActions("auth", ["login", "logout"]),
        handleSubmit() {
            this.submitted = true;
            const { email, password } = this;
            if (email && password) {
                this.login({ email, password });
            }
        },
    },
};
</script>
