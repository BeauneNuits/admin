import { get }         from '../../lib/fetch';
import queryString     from '../../lib/queryString';
import routeToRelation from '../../lib/routeToRelation';

/**
 * Purchases actions
 */

export function getPurchases({ commit, dispatch }, fields) {
    const q = [];

    q.push(`event=${fields.event.id}`);

    if (fields.point) {
        q.push(`point=${fields.point.id}`);
    }

    if (fields.fundation) {
        q.push(`fundation=${fields.fundation.id}`);
    }

    if (fields.period) {
        q.push(`period=${fields.period.id}`);
    } else {
        if (fields.dateIn) {
            q.push(`dateIn=${fields.dateIn}`);
        }

        if (fields.dateOut) {
            q.push(`dateOut=${fields.dateOut}`);
        }
    }

    const qString = q
        .join('&');

    return get(`services/treasury/purchases?${qString}`)
        .then((purchases) => {
            commit('CLEAROBJECT', 'purchases');
            const purchasesWT = purchases.map((purchase) => {
                const newPurchase   = Object.assign({}, purchase);
                newPurchase.totalWT = newPurchase.totalTI - newPurchase.totalVAT;

                return newPurchase;
            });
            dispatch('checkAndAddObjects', { route: 'purchases', objects: purchasesWT });
        });
}

/**
 * Treasury actions
 */

export function getTreasury({ commit, dispatch }, fields) {
    const q  = [];
    const qt = [];

    if (fields.point) {
        q.push(`point=${fields.point.id}`);
    }

    if (fields.dateIn) {
        q.push(`dateIn=${fields.dateIn}`);

        qt.push({
            field: 'created_at',
            ge   : fields.dateIn,
            date : true
        });
    }

    if (fields.dateOut) {
        q.push(`dateOut=${fields.dateOut}`);

        qt.push({
            field: 'created_at',
            le   : fields.dateOut,
            date : true
        });
    }

    const qString = q
        .join('&');

    let orQt = queryString(qt);

    if (orQt) {
        orQt = `&q=${orQt}`;
    }

    return get(`services/treasury/reloads?${qString}`)
        .then((reloads) => {
            commit('CLEAROBJECT', 'reloads');
            const idReloads = reloads.map((reload) => {
                const newReload = Object.assign({}, reload);
                newReload.id    = newReload.type;

                return newReload;
            });

            dispatch('checkAndAddObjects', { route: 'reloads', objects: idReloads });

            return get(`services/treasury/refunds?${qString}`);
        })
        .then((refunds) => {
            commit('CLEAROBJECT', 'refunds');
            const idRefunds = refunds.map((refund) => {
                const newRefund = Object.assign({}, refund);
                newRefund.id    = newRefund.type;

                return newRefund;
            });

            dispatch('checkAndAddObjects', { route: 'refunds', objects: idRefunds });

            const relEmbed = routeToRelation('transfers');

            return get(`transfers?embed=${relEmbed}${orQt}`);
        })
        .then((transfers) => {
            commit('CLEAROBJECT', 'transfers');
            dispatch('checkAndAddObjects', { route: 'transfers', objects: transfers });
        });
}
