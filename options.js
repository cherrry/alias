/* eslint-env browser */
/* global chrome, Vue */

const normalizeAlias = function(alias) {
  return alias.trim().replace(/([a-z]+)\/?/, '$1/');
};

const normalizeDest = function(dest) {
  if (!dest.endsWith('/')) {
    dest = dest + '/';
  }
  if (dest.indexOf('://') === -1) {
    dest = 'https://' + dest;
  }
  return dest;
};

Vue.component('alias-input', {
  props: ['alias', 'dest'],
  computed: {
    aliasError: function() {
      const alias = normalizeAlias(this.alias);
      return alias !== '' && !/^[a-z]+\/?$/.test(alias);
    },
    destError: function() {
      if (this.dest === '') {
        return false;
      }
      const dest = normalizeDest(this.dest);
      try {
        new URL(dest);
      } catch (err) {
        return true;
      }
      return false;
    },
  },
  template: '#alias-input-tmpl',
});

const app = new Vue({
  el: '#app',
  data: {
    aliases: [],
    newAlias: {alias: '', dest: ''},
  },
  methods: {
    save: function() {
      let {aliases, newAlias} = this;
      if (newAlias.alias !== '' && newAlias.dest !== '') {
        aliases = aliases.concat([newAlias]);
        newAlias = {alias: '', dest: ''};
      }
      this.aliases = aliases.map(({alias, dest}) => {
        return {alias: normalizeAlias(alias), dest: normalizeDest(dest)};
      }).filter(({alias, dest}) => {
        return alias !== '' && dest !== '';
      }).sort((a1, a2) => {
        const al1 = a1.alias;
        const al2 = a2.alias;
        return al1 < al2 ? -1 : (al1 > al2 ? 1 : 0);
      });
      this.newAlias = newAlias;
      chrome.storage.sync.set({aliases: this.aliases});
    },
  },
});

chrome.storage.sync.get(['aliases'], function({aliases}) {
  app.aliases = aliases || [];
});
