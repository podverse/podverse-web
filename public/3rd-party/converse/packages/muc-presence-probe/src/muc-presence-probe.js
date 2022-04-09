// A Converse.js plugin
//
// Note, this plugin assumes that the "converse" object is globally defined.

const plugin = {
    // Dependencies are other plugins which might be
    // overridden or relied upon, and therefore need to be loaded before
    // this plugin. They are optional because they're not required to be
    // available (in which case any overrides applicable to them will be ignored).
    //
    // It's possible to make them required by setting
    // "strict_plugin_dependencies" to true,
    // An error will then be raised if the plugin is not found.
    dependencies: ['converse-muc', 'converse-status'],

    // Converse.js's plugin mechanism will call the initialize
    // method on any plugin (if it exists) as soon as all the plugin
    // have been loaded.
    initialize () {
        const { Strophe, $iq, u } = converse.env;
        const { _converse } = this;
        const { api, log } = _converse;
        log.info("The muc-presence-probe plugin is being initialized");


        api.listen.on('MAMResult', async data => {
            // Whenever we receive a batch of MAM messages, we check for
            // unknown authors and send an IQ stanza to probe for their hats in bulk.
            const { chatbox } = data;
            let messages = data.messages;
            if (chatbox.get('type') !== _converse.CHATROOMS_TYPE) {
                return;
            }
            messages = await Promise.all(messages);
            const known_nicknames = chatbox.occupants.pluck('nick');
            const muc_jid = chatbox.get('jid');
            const jids_to_probe = [...new Set(messages
                .filter(m => !known_nicknames.includes(m.nick))
                .map(m => `${muc_jid}/${m.nick}`)
            )];
            if (jids_to_probe.length === 0) {
                return;
            }
            const iq = $iq({'type': 'get', 'to': chatbox.get('jid')})
                .c('query', {'xmlns': Strophe.NS.MUC_USER});

            jids_to_probe.forEach(jid => iq.c('item', { jid }).up());

            const iq_result = await api.sendIQ(iq, 2000, false);
            if (iq_result === null) {
                const err_msg = "Timeout while doing a batched presence probe.";
                log.error(err_msg);
            } else if (u.isErrorStanza(iq_result)) {
                log.error("Error stanza while doing a batched presence probe.");
                log.error(iq_result);
            }
        });
    }
}

let converse = window.converse;

if (typeof converse === "undefined") {
    window.addEventListener(
        'converse-loaded',
        (ev) => {
            converse = ev.detail?.converse || ev.converse;
            converse.plugins.add("muc-presence-probe", plugin)
        }
    );
} else {
    converse.plugins.add("muc-presence-probe", plugin);
}
