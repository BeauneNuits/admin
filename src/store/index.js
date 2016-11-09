import Vue  from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';

import app        from './modules/app';
import cardBlock  from './modules/cardBlock';
import global     from './modules/global';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    modules: {
        app,
        cardBlock,
        global
    }
});
