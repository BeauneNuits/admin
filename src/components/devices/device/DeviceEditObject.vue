<template>
    <div>
        <h5>Modifier l'équipement {{ focusedDevice.name }}</h5>
        <form @submit.prevent="updateDevice(focusedDevice)">
            <mdl-textfield floating-label="Nom" :value="focusedDevice.name" @input="updateDeepestFocusedElement({ field: 'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>

            <h6>Options de l'équipement</h6>
            <b-detailedswitch label="Équipement administrateur" icon="perm_device_information" :value="focusedDevice.isUser" @input="updateDeepestFocusedElement({ field: 'isUser', value: $event })">
                Rend le certificat SSL généré pour cet équipement utilisable sur l'interface d'administration.
            </b-detailedswitch>

            <b-detailedswitch label="Badgeage avant achat" icon="done_all" :value="focusedDevice.doubleValidation" @input="updateDeepestFocusedElement({ field: 'doubleValidation', value: $event })">
                Oblige l'acheteur à badger une première fois, afin de permettre au vendeur de connaître les articles et tarifs disponibles pour celui-ci, ainsi que de connaître son solde ou vérifier son identité, avant de prendre sa commande. Si cette option n'est pas activée, les tarifs du groupe par défaut défini dans le point de vente sera utilisé.
            </b-detailedswitch>

            <b-detailedswitch label="Avertissement alcool" icon="local_drink" :value="focusedDevice.alcohol" @input="updateDeepestFocusedElement({ field: 'alcohol', value: $event })">
                Affiche un avertissement lors de la vente d'alcool à un utilisateur lorsque celui-ci a atteint ou dépassé la limite d'unité alcool définie pour l'événement.
            </b-detailedswitch>

            <b-detailedswitch label="Afficher l'image utilisateur" icon="person" :value="focusedDevice.showPicture" @input="updateDeepestFocusedElement({ field: 'showPicture', value: $event })">
                Affiche l'image personnelle (avatar) de l'utilisateur ayant badgé, lorsque que le badgeage avant achat est activé.
            </b-detailedswitch>

            <mdl-button colored raised>Modifier</mdl-button>
        </form>
    </div>
</template>

<script>
import pick from 'lodash.pick';
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateDeepestFocusedElement',
            'notify',
            'notifyError'
        ]),

        updateDevice(device) {
            const fields = ['id', 'name', 'doubleValidation', 'alcohol', 'showPicture', 'isUser'];

            this.updateObject({ route: 'devices', value: pick(device, fields) })
                .then(() => this.notify({ message: 'L\'équipement a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'équipement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            focusedDevice: state => state.app.focusedElements[0]
        })
    }
};
</script>
