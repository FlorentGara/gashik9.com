/**
 * Gashi-k9 Firebase Integration
 * Uses Firebase Realtime Database REST API — no npm or build step needed.
 * All dogs added from the dashboard are visible to ALL visitors in real-time.
 */

var GASHI_DB = 'https://gashik9com-default-rtdb.firebaseio.com';

window.GashiDB = {

  // Get all dogs from Firebase
  getDogs: function() {
    return fetch(GASHI_DB + '/dogs.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data) return [];
        return Object.entries(data).map(function(entry) {
          return Object.assign({}, entry[1], { firebaseKey: entry[0] });
        });
      });
  },

  // Save a new dog to Firebase
  addDog: function(dogData) {
    return fetch(GASHI_DB + '/dogs.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dogData)
    }).then(function(r) { return r.json(); });
  },

  // Delete a dog by Firebase key
  deleteDog: function(firebaseKey) {
    return fetch(GASHI_DB + '/dogs/' + firebaseKey + '.json', {
      method: 'DELETE'
    });
  }
};
