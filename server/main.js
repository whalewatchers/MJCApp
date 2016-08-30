import { Meteor } from 'meteor/meteor';

import { Players } from '../imports/api/players.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (Players.find().count() === 0) {
  	Players.insert({name: "Kevin Chow", japanese_elo: 1500, hongkong_elo: 1500});
  	Players.insert({name: "Victor Li", japanese_elo: 1500, hongkong_elo: 1500});
  }

});
