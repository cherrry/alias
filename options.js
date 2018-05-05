/* eslint-env browser */
/* global Vue */

new Vue({
  el: '#app',
  data: {
    aliases: [
      {alias: 'c/', dest: 'calendar.google.com'},
      {alias: 'm/', dest: 'mail.google.com'},
    ],
    newAlias: {alias: '', dest: ''},
  },
  methods: {
    save: function() {
      let {aliases, newAlias} = this;
      if (newAlias.alias !== '' && newAlias.dest !== '') {
        aliases = aliases.concat([newAlias]);
        newAlias = {alias: '', dest: ''};
      }
      this.aliases = aliases.filter(({alias, dest}) => {
        return alias !== '' && dest !== '';
      }).sort((a1, a2) => {
        const al1 = a1.alias;
        const al2 = a2.alias;
        return al1 < al2 ? -1 : (al1 > al2 ? 1 : 0);
      });
      this.newAlias = newAlias;
    },
  },
});
