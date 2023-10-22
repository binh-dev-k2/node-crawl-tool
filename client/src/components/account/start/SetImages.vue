<template>
    <div class="">
        <div class="section-head ps-0">
            <h3>Hãy chọn những bức ảnh đẹp nhất của bạn nào</h3>
        </div>
        <div class="row g-3 grid_image" data-masonry='{"percentPosition": true }'>
            <div class="col-8">
                <div class="dz-drop-box">
                    <div class="drop-bx bx-lg">
                        <div class="imagePreview" :style="dropStyle">
                            <img :src="Image.main || ''" alt="">
                            <div class="remove-img remove-btn" @click="removeImage('main')"
                                :class="Image.main ? '' : 'd-none'"><i class="icon feather icon-x"></i></div>
                            <input type='file' @change="previewImage" ref="mainImage"
                                class="form-control d-none imageUpload" id="MainImage" accept=".png, .jpg, .jpeg">
                            <label for="MainImage"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="dz-drop-box">
                            <div class="drop-bx">
                                <div class="imagePreview" :style="dropStyle">
                                    <img :src="Image.first || ''" alt="">
                                    <div class="remove-img remove-btn " @click="removeImage('first')"
                                        :class="Image.first ? '' : 'd-none'"><i class="icon feather icon-x"></i></div>
                                    <input type='file' @change="previewImage" ref="firstImage"
                                        class="form-control d-none imageUpload" id="firstImage" accept=".png, .jpg, .jpeg">
                                    <label for="firstImage"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="dz-drop-box">
                            <div class="drop-bx">
                                <div class="imagePreview" :style="dropStyle">
                                    <img :src="Image.second || ''" alt="">
                                    <div class="remove-img remove-btn" @click="removeImage('second')"
                                        :class="Image.second ? '' : 'd-none'"><i class="icon feather icon-x"></i></div>
                                    <input type='file' @change="previewImage" ref="secondImage"
                                        class="form-control d-none imageUpload" id="secondImage" accept=".png, .jpg, .jpeg">
                                    <label for="secondImage"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dropBx from "@/assets/images/recent-pic/drop-bx.png"
import { reactive, ref } from "vue"

const emit = defineEmits(['setImage'])

const dropStyle = {
    backgroundImage: `url(${dropBx})`
}
const Image = reactive({
    main: "",
    first: "",
    second: ""
})
const listImage = reactive({
    main: null,
    first: null,
    second:null
})
const mainImage = ref(null)

const previewImage = (e) => {
    const file = e.target.files[0];
    const id = e.target.id;
    const theReader = new FileReader();
    theReader.onloadend = async () => {
        if (id == "MainImage") {
            listImage.main = file
            Image.main = await theReader.result;
        } else if (id == "firstImage") {
            listImage.first = file
            Image.first = await theReader.result;
        } else {
            listImage.second = file
            Image.second = await theReader.result;
        }
    };
    if (id == "MainImage") {
        listImage.main = file
    } else if (id == "firstImage") {
        listImage.first = file
    } else {
        listImage.second = file
    }
    console.log(listImage);
    emit("setImage", listImage)
    theReader.readAsDataURL(file);
}
const removeImage = (imageRemove) => {
    if (imageRemove == "main") {
        listImage.main = null
        Image.main = null;
    } else if (imageRemove == "first") {
        listImage.first = null
        Image.first = null;
    } else {
        listImage.second = null
        Image.second = null;
    }
    
    emit("setImage", listImage)
}
</script>

<style lang="css" scoped>
.grid_image {
    height: 256px;
}

.grid_image .row.g-3 {
    height: 100%;
}
</style>