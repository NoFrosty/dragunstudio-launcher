<template>
    <section>
        <b-tabs position="is-centered" class="block">
            <b-tab-item label="Overview"></b-tab-item>
            <b-tab-item label="Activities"></b-tab-item>
            <b-tab-item label="Achievments"></b-tab-item>
        </b-tabs>
        <UserMiniature/>
    </section>
</template>

<script>
import UserMiniature from './UserMiniature.vue';
export default {
    components:{
        UserMiniature
    }
}
</script>