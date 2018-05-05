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
      const newAlias = this.newAlias;
      if (newAlias.alias !== '' && newAlias.dest !== '') {
        this.aliases = this.aliases.concat([newAlias]);
        this.newAlias = {alias: '', dest: ''};
      }
    },
  },
});
