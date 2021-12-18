<template>
	<b-dropdown
		v-if="applications"
		v-model="currentApplication"
		aria-role="list"
	>
		<button
			v-if="currentApplication"
			slot="trigger"
			class="button is-danger"
			type="button"
		>
			<template>
				<b-icon
					pack="fas"
					icon="gamepad"
				/>
				<span>{{ currentApplication.name }}</span>
			</template>
			<b-icon icon="menu-down" />
		</button>

		<b-dropdown-item
			v-for="application in applications"
			:key="application.applicationid"
			:value="application"
			aria-role="listitem"
			@click="changeApplication"
		>
			<div class="media">
				<b-icon
					class="media-left"
					pack="fas"
					icon="user"
				/>
				<div class="media-content">
					<h3>{{ application.name }}</h3>
					<small />
				</div>
			</div>
		</b-dropdown-item>
	</b-dropdown>
</template>

<script>
import {
    applicationLibrary
} from '@/services/services';

export default {
    props: {},
    data() {
        return {
            currentApplication: null,
            applications: null,
        }
    },
    async mounted() {
        this.applications = await applicationLibrary.getAllGameList();
        if (!this.$store.state.selectedApplicationId)
            this.$store.commit('setSelectedApplicationId', this.applications[0].applicationId);
        this.currentApplication = this.applications.find(x => x.applicationId == this.$store.state.selectedApplicationId)
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'setSelectedApplicationId') {
                if (state.selectedApplicationId != this.currentApplication.applicationId)
                    this.changeApplication();
            }
        });
    },
    methods: {
        changeApplication: function () {
            this.$store.commit('setSelectedApplicationId', this.currentApplication.applicationId);
        },
    }
}
</script>
