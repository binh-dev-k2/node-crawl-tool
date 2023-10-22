<template>
    <div>
        <div>
            <div v-if="alert.message" :class="`alert ${alert.type}`">
                {{ alert.message }}
            </div>
            <!-- <div id="preloader">
                <div class="loader">
                    <div class="load-circle">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div> -->
            <div class="page-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "App",
    computed: {
        ...mapState({
            alert: (state) => state.alert,
        }),
    },
    methods: {
        ...mapActions({
            clearAlert: "alert/clear",
        }),
    },
    watch: {
        $route(to, from) {
            this.clearAlert();
            console.log(from, to);
        },
    },
};

</script>

