<template>
  <el-dialog
    :title="modalProperties.title"
    v-model="modalVisibility"
    :destroy-on-close="true"
    width="50%"
    :before-close="closeModal">
    <component :is="modals[modalProperties.type]" :modalProperties="modalProperties" />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';

import modals from './modals';

export default defineComponent({
  name: 'ModalBasic',
  components: { ...modals },
  data() {
    return { modals };
  },
  computed: {
    ...mapState('utilities', ['modalVisibility', 'modalProperties']),
  },
  methods: {
    ...mapMutations('utilities', ['SET_MODAL_VISIBILITY']),
    closeModal() {
      this.SET_MODAL_VISIBILITY();
    },
  },
});
</script>