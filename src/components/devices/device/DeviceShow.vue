<template>
    <div class="b-devices b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: '', name: 'Détails', exact: true }, { route: 'edit', name: 'Édition' }, { route: 'ssl', name: 'Certificat SSL' }]"
                :inCard="true"
                :goBack="true"
                :level="2">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            focusedDevice: state => state.app.focusedElements[0]
        }),

        title() {
            return `Équipement ${this.focusedDevice.name}`;
        }
    }
};
</script>
