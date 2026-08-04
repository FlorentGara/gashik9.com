/**
 * Gashi-k9 Firebase Integration — Generic Collection Manager
 * Supports: dogs, dogs_for_sale, expecting, puppies, clients
 */

var GASHI_DB = 'https://gashik9com-default-rtdb.firebaseio.com';

window.GashiDB = {
  // Get all items from a collection
  getAll: function(collection) {
    return fetch(GASHI_DB + '/' + collection + '.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data) return [];
        return Object.entries(data).map(function(e) {
          return Object.assign({}, e[1], { _key: e[0] });
        }).sort(function(a,b){ return (b.addedAt||'').localeCompare(a.addedAt||''); });
      });
  },
  // Add item to collection
  add: function(collection, data) {
    data.addedAt = new Date().toISOString();
    return fetch(GASHI_DB + '/' + collection + '.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  },
  // Update item in collection
  update: function(collection, key, data) {
    return fetch(GASHI_DB + '/' + collection + '/' + key + '.json', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
  },
  // Delete item from collection
  remove: function(collection, key) {
    return fetch(GASHI_DB + '/' + collection + '/' + key + '.json', {
      method: 'DELETE'
    });
  },
  // Legacy aliases
  getDogs: function() { return this.getAll('dogs'); },
  addDog: function(d) { return this.add('dogs', d); },
  deleteDog: function(k) { return this.remove('dogs', k); }
};
