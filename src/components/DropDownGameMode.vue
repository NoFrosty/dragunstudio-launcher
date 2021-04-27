<template>
  <b-dropdown
    v-model="currentGameMode"
    class="is-up"
    aria-role="list"
    :value="value"
    position="is-bottom-left"
    expanded
    @change="onChange"
  >
    <button
      slot="trigger"
      class="button is-medium is-dark is-fullwidth"
      type="button"
    >
      <template>
        <b-icon
          pack="fas"
          :icon="GAME_MODE_ICONS[currentGameMode]"
        />
        <span>Public</span>
      </template>
    </button>
    <b-dropdown-item
      v-for="mode in GameModeKeys"
      :key="mode"
      :value="GAME_MODE[mode]"
      aria-role="listitem"
    >
      <div class="media">
        <b-icon
          class="media-left"
          pack="fas"
          :icon="GAME_MODE_ICONS[GAME_MODE[mode]]"
        />
        <div class="media-content">
          <h3>{{ GAME_MODE_NAME[GAME_MODE[mode]] }}</h3>
          <small>Version : 1.2.2</small>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
    import { GAME_MODE, GAME_MODE_ICONS, GAME_MODE_NAME } from '@/services/constants.ts'

    export default {
        props: {
            value: null
        },
        data() {
            return {
                currentGameMode: this.value
            }
        },
        computed: {
            GAME_MODE: () => GAME_MODE,
            GAME_MODE_ICONS: () => GAME_MODE_ICONS,
            GAME_MODE_NAME: () => GAME_MODE_NAME,
            GameModeKeys: () => Object.keys(GAME_MODE)
        },
        methods: {
            onChange: function(value) {
                this.$emit('input', value)
                this.$emit('game-mode-changed', value)
            }
        }
    }
</script>

<style scoped>
.button{
    justify-content: flex-start;
}
</style>