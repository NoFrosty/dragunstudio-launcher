<template>
  <span>
    <b-icon v-if="showIcon" pack="fab" :icon="toIcon(operatingSystem)" /> <template v-if="showText">{{toText(operatingSystem)}}</template>
  </span>
</template>

<script>
import { GetPlatformText, GetPlatformIcon } from "@/models/Platforms"

export default {
  name: 'PlatformLabel',
  props: {
    operatingSystem: {
      type: Number,
      default: () => 0
    },
    showIcon: {
      type: Boolean,
      default: () => true
    },
    showText: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    toIcon(osType) { return GetPlatformIcon(osType); },
    toText(osType) { return GetPlatformText(osType); }
  }
}
</script>
