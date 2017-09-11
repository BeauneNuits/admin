<template>
    <div>
        <h5>Configurer l'évenement</h5>
        Cet utilitaire va vous permettre de configurer votre événement afin qu'il réponde le mieux à vos besoins.<br />
        <form @submit.prevent="updateEvent(modObject)">
            <b-detailedswitch label="Groupes d'utilisateurs" icon="group" :value="modObject.config.hasGroups" @input="updateModObject({ field: 'config.hasGroups', value: $event })">
                Les groupes d'utilisateurs permettent d'associer des tarifs différents selon l'appartenance d'un client à un groupe.<br />
                <strong>Exemple:</strong> Ils peuvent être pratiques pour interdire la vente d'alcool aux mineurs, ou proposer des prix plus bas aux membres de votre équipe.<br />
                <strong>Note:</strong> Les groupes peuvent-être ré-utilisés d'un événement sur l'autre.

                <div v-if="modObject.config.hasGroups && !modObject.DefaultGroup_id">
                    <br />
                    Un groupe par défaut (non supprimable) du nom de l'événement va être automatiquement créé. Ce groupe contiendra tous les utilisateurs créés au sein de l'événement. Il sera réutilisable via d'autres événements.
                </div>
            </b-detailedswitch>

            <b-detailedswitch label="Fondations" icon="local_atm" :value="modObject.config.hasFundations" @input="updateModObject({ field: 'config.hasFundations', value: $event })">
                Les fondations permettent de répartir l'argent des ventes via le système entre plusieurs comptes virtuels.<br />
                <strong>Exemple:</strong> Si vous avez deux associations sur un même stand, et qu'elles souhaitent toutes les deux vendre leurs articles sur une même borne de vente, il est possible d'assigner les ventes d'une partie des articles à une association, et le reste à l'autre.<br />
                <strong>Note:</strong> Les fondations peuvent-être ré-utilisées d'un événement sur l'autre.

                <div v-if="modObject.config.hasFundations && !modObject.DefaultFundation_id">
                    <br />
                    Une fondation par défaut du nom de l'événement va être automatiquement créée. Vous pourrez la modifier par la suite.
                </div>
            </b-detailedswitch>

            <b-detailedswitch label="Périodes" icon="alarm" :value="modObject.config.hasPeriods" @input="updateModObject({ field: 'config.hasPeriods', value: $event })">
                    Les périodes permettent d'établir des droits, ou des prix sur des laps de temps donnés.<br />
                    <strong>Exemple:</strong> Mettre en place des happy hours sur une certaine durée, donner les droits de vente sur une certaine durée.<br />
                    <strong>Note:</strong> Une période est propre à un événement.

                    <div v-if="modObject.config.hasPeriods && !modObject.DefaultPeriod_id">
                        <br />
                        Une période par défaut (non supprimable), d'une durée de 100 ans et du nom de l'événement, va être automatiquement créée pour cet événement. Vous pourrez l'utiliser lorsque vous souhaitez assigner des éléments qui devront durer toute la durée de l'événement.
                    </div>
            </b-detailedswitch>

            <mdl-button colored raised>Configurer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'updateModObject',
            'expandObject',
            'notify',
            'notifyError'
        ]),
        updateEvent(event) {
            const steps     = [];
            const stepsName = [];

            if ((event.config.hasFundations === false && !event.DefaultFundation_id) || this.fundations.length === 0) {
                steps.push(this.createObject({ route: 'fundations', value: { name: event.name } }));
                stepsName.push('fundations');
            }

            if (!event.DefaultGroup_id) {
                steps.push(this.createObject({ route: 'groups', value: { name: event.name } }));
                stepsName.push('groups');
            }

            if (!event.DefaultPeriod_id) {
                const start     = new Date();
                const end       = new Date().setFullYear(start.getFullYear() + 100);
                const newPeriod = {
                    name    : this.modObject.name,
                    start,
                    end,
                    Event_id: this.modObject.id
                };

                steps.push(this.createObject({ route: 'periods', value: newPeriod }));
                stepsName.push('periods');
            }

            Promise.all(steps)
                .then((values) => {
                    values.forEach((value, index) => {
                        switch (stepsName[index]) {
                            case 'fundations':
                                event.DefaultFundation_id = value.id;
                                break;
                            case 'groups':
                                event.DefaultGroup_id = value.id;
                                break;
                            default:
                                event.DefaultPeriod_id = value.id;
                        }
                    });

                    return this.updateObject({ route: 'events', value: event });
                })
                .then(() => {
                    this.notify({ message: 'L\'événement a bien été configuré' });
                    this.expandObject({ route: 'events', value: this.modObject });
                })
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la configuration de l\'événement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            modObject : state => state.app.modObject,
            fundations: state => state.objects.fundations
        })
    }
};
</script>