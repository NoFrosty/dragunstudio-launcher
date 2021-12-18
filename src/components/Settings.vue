<template>
	<div class="popup">
		<a
			class="modal-close-btn"
			@click="$parent.close()"
		><b-icon
			pack="fas"
			icon="times"
			size="is-small"
			type="is-white"
		/></a>
		<div class="popup-inner install">
			<div class="popup-inner-text">
				<h1>{{ $t('settings') }}</h1>
				<div class="installation-form">
					Test : <b-icon
						pack="fas"
						icon="times-square"
					/>
					<b-field
						:label="$t('installation-size')"
						custom-class="has-text-white"
					>
						Settings
					</b-field>
					<b-field
						:label="$t('download-size')"
						custom-class="has-text-white"
					>
						Settings
					</b-field>
					<b-field
						:label="$t('options')"
						custom-class="has-text-white"
					>
						<b-checkbox
							:value="true"
							type="is-primary"
						>
							{{ $t('keep-game-updated') }}
						</b-checkbox>
					</b-field>
					<b-field custom-class="has-text-white">
						<b-checkbox
							:value="true"
							type="is-primary"
						>
							{{ $t('add-desktop-shortcut') }} Settings
						</b-checkbox>
					</b-field>
				</div>
				<b-button
					type="is-primary"
					expanded
				>
					{{ $t('install') }}
				</b-button>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        props:{
        },
        data() {
            return {
            }
        },
        methods:{
            
        }
    }
</script>
<style lang="scss">
.modal .animation-content {
    z-index: 1;
    /* padding: 105px 90px 91px; */
    /* border-radius: 1.5rem; */
}
.popup{
    display: flex;
    flex-direction: row;
    .popup-inner{
        display: flex;
        flex-direction: row;
        .popup-inner-photo{
            height: 100%;
            width: 40%;
        }
        .popup-inner-text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 60%;
            height: 100%;
            padding: 2rem;
            h1{
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 2rem;
                text-transform: uppercase;
                color: #ffffff;
            }
            p{
                font-size: .875rem;
                color: #ffffff;
                line-height: 1.5;
            }
        }
    }
}
</style>