# muc-presence-probe

This plugin will wait until MAM messages have been fetched for a MUC and then
sends out an IQ stanza that requests presence information for all the authors
of the returned MAM messages.

The goal of such a probe is to fetch presence-related information (such as
[XEP-317 Hats](https://xmpp.org/extensions/xep-0317.html).

Individual MUC presence probes are described in [XEP-0045 section 17.3](https://xmpp.org/extensions/xep-0045.html#bizrules-presence),
but sending out an IQ stanza to query presences in bulk is not (yet) documented
in any XEP.

Generally, this plugin will only make sense when you've disabled presences in a
MUC, but stil want to fetch presence-related metadata for message authors.

This plugin requires [mod_muc_batched_probe](https://modules.prosody.im/mod_muc_batched_probe.html) on Prosody.


# Changelog

## 0.0.9 (2020-10-26)

- Handle `converse` being on `event.detail` in Converse 7

## 0.0.6 (2020-07-15)

- Handle promises being received from the `MAMResult` event

## 0.0.5 (2020-07-15)

- Don't nest `<item>` nodes in the outgoing IQ stanza

## 0.0.4 (2020-05-07)

- Add support for IQ request to probe multiple presences
