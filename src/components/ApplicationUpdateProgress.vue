<template>
	<div class="overview-download">
		<nav class="level">
			<!-- Left side -->
			<div
				v-if="totalReceived || totalToReceive"
				class="level-left"
			>
				<p class="level-item">
					{{ totalReceived }}/{{ totalToReceive }}
				</p>
			</div>
			<!-- Right side -->
			<div class="level-right">
				<p class="level-item">
					{{ speed }}
				</p>
			</div>
		</nav>
		<div class="update-progress">
			<b-progress
				class="update-progress-bar"
				type="is-primary"
				:precision="2"
				:value="percentage"
				show-value
				format="percent"
			/>
			<!--
            <a class="update-progress-control">
                <b-icon pack="fas" icon="pause" size="is-medium" type="is-primary"></b-icon>
            </a>
            -->
		</div>
	</div>
</template>

<script>
import humanize from 'humanize'
import {
    eventBus
} from '@/services/services'
export default {
    data() {
        return {
            percentage: 0,
            totalReceived: null,
            totalToReceive: null,
            speed: 0
        }
    },
    mounted: async function () {
        eventBus.subscribe('on-update-progress', this.onProgress);
        eventBus.subscribe('on-update-finish', this.onFinish);
    },
    methods: {
        onProgress(progress) {
            if (progress) {
                this.percentage = progress.downloadedSize / progress.totalFileSize * 100;
                this.totalReceived = humanize.filesize(progress.downloadedSize);
                this.speed = humanize.filesize(progress.speed) + '/s';
                this.totalToReceive = humanize.filesize(progress.totalFileSize);
            }
        },
        onFinish(progress) {
            this.onProgress(progress);
        }
    }
};
</script>
