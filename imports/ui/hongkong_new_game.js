import { Players } from '../api/players.js';

Template.hongkong_new_game.onCreated( function() {
	this.hand_type = new ReactiveVar( "dealin" );

	this.hands = new ReactiveArray();

	this.hands.push(
		{ 
			hand_type: "dealin",
		  	round: 1,
		  	bonus: 0,
			points: 1,
		  	east_delta: -2, 
		  	south_delta: 4,
		  	west_delta: -1,
		  	north_delta: -1,
		},
		{
			hand_type: "selfdraw",
		  	round: 2,
		  	bonus: 0,
			points: 5,
		  	east_delta: -32, 
		  	south_delta: 96,
		  	west_delta: -32,
		  	north_delta: -32,
		},
		{
			hand_type: "nowin",
		  	round: 2,
		  	bonus: 1,
			points: 0,
		  	east_delta: 0, 
		  	south_delta: 0,
		  	west_delta: 0,
		  	north_delta: 0,
		},
	);

	Session.set("current_east", "Select East!");
	Session.set("current_south", "Select South!");
	Session.set("current_west", "Select West!");
	Session.set("current_north", "Select North!");

	Session.set("round_winner", "no one");
	Session.set("round_loser", "no one");

	Session.set("current_round", 1);
	Session.set("current_bonus", 0);
	Session.set("current_points", "-1");
});

Template.hongkong_new_game.helpers({
	hand_type() {
		return Template.instance().hand_type.get();
	},
	players() {
		return Players.find({}, {sort: { name: 1}});
	},
	hands() {
		return Template.instance().hands.get();
	},
	get_east() {
		return Session.get("current_east");
	},
	get_south() {
		return Session.get("current_south");
	},
	get_west() {
		return Session.get("current_west");
	},
	get_north() {
		return Session.get("current_north");
	}
});

Template.render_hand.helpers({
	is_dealin(hand_type) {
		return hand_type == "dealin";
	},
	is_selfdraw(hand_type) {
		return hand_type == "selfdraw";
	},
	is_nowin(hand_type) {
		return hand_type == "nowin";
	},
	is_restart(hand_type) {
		return hand_type == "restart";
	},
	is_east_round(round) {
		return round <= 4;
	},
	is_south_round(round) {
		return (round > 4 && round <= 8);
	},
	is_west_round(round) {
		return (round > 8 && round <= 12);
	},
	is_north_round(round) {
		return (round > 12);
	}
})

Template.points.helpers({
	possible_points: [
		{ point: 1 },
		{ point: 2 },
		{ point: 3 },
		{ point: 4 },
		{ point: 5 },
		{ point: 6 },
		{ point: 7 },
		{ point: 8 },
		{ point: 9 },
		{ point: 10 }
	],
});

Template.dealin.helpers({
	get_east() {
		return Session.get("current_east");
	},
	get_south() {
		return Session.get("current_south");
	},
	get_west() {
		return Session.get("current_west");
	},
	get_north() {
		return Session.get("current_north");
	}

})

Template.selfdraw.helpers({
	get_east() {
		return Session.get("current_east");
	},
	get_south() {
		return Session.get("current_south");
	},
	get_west() {
		return Session.get("current_west");
	},
	get_north() {
		return Session.get("current_north");
	}
})

Template.hongkong_new_game.events({
	//Selecting who the east player is
	'change select[name="east_player"]'(event) {
		Session.set("current_east", event.target.value);
	},
	//Selecting who the south player is
	'change select[name="south_player"]'(event) {
		Session.set("current_south", event.target.value);
	},
	//Selecting who the west player is
	'change select[name="west_player"]'(event) {
		Session.set("current_west", event.target.value);
	},
	//Selecting who the north player is
	'change select[name="north_player"]'(event) {
		Session.set("current_north", event.target.value);
	},
	//Selecting who the winner is for a dealin or tsumo
	'click .winner'(event) {
		if ( !$( event.target ).hasClass( "disabled" )) {
			if ( $( event.target ).hasClass( "active" )) {
				$( event.target ).removeClass( "active" );
				$( ".winner_buttons button" ).not( event.target ).removeClass( "disabled" );
			} else {
				$( event.target ).addClass( "active" );
				$( ".winner_buttons button" ).not( event.target ).addClass( "disabled" );
			}
		}
		Session.set("round_winner", event.target.innerHTML);
	},
	//Selecting who the loser is for a dealin
	'click .loser'(event) {
		if ( !$( event.target ).hasClass( "disabled" )) {
			if ( $( event.target ).hasClass( "active" )) {
				$( event.target ).removeClass( "active" );
				$( ".loser_buttons button" ).not( event.target ).removeClass( "disabled" );
			} else {
				$( event.target ).addClass( "active" );
				$( ".loser_buttons button" ).not( event.target ).addClass( "disabled" );
			}
		}
		Session.set("round_loser", event.target.innerHTML);
	},
	//Submission of a hand
	'click .submit_hand_button'(event, template) {
		var pnt = Number(Session.get("current_points"));
		console.log(pnt);

		event.preventDefault();

		if (template.hand_type.get() == "dealin") {
			if (Session.get("current_east") != "Select East!" && 
				Session.get("current_south") != "Select South!" && 
				Session.get("current_west") != "Select West!" && 
				Session.get("current_north") != "Select North!") {
				var win_direc = player_to_direction(Session.get("round_winner"));
				var lose_direc = player_to_direction(Session.get("round_loser"));
				template.hands.push( {
					hand_type: "dealin",
		  			round: Session.get("current_round"),
		  			bonus: Session.get("current_bonus"),
					points: Session.get("current_points"),
				  	east_delta: dealin_delta(pnt, "east", win_direc, lose_direc),
				  	south_delta: dealin_delta(pnt, "south", win_direc, lose_direc),
				  	west_delta: dealin_delta(pnt, "west", win_direc, lose_direc),
				  	north_delta: dealin_delta(pnt, "north", win_direc, lose_direc),
					}
				);

				if (win_direc == round_to_direction(Session.get("current_round")))
					Session.set("current_bonus", Number(Session.get("current_bonus")) + 1);
				else {
					Session.set("current_bonus", 0);
					Session.set("current_round", Number(Session.get("current_round")) + 1)
				}
			}
		}
		else if (template.hand_type.get() == "selfdraw") {
			console.log("Selfdraw submit");
		}
		else if (template.hand_type.get() == "nowin") {
			console.log("Tenpai submit");
		}
		else if (template.hand_type.get() == "restart") {
			template.hands.push( 
				{
					hand_type: "restart",
		  			round: Session.get("current_round"),
		  			bonus: Session.get("current_bonus"),
					points: 0,
				  	east_delta: 0,
				  	south_delta: 0,
				  	west_delta: 0,
				  	north_delta: 0,
				}
			);
			Session.set("current_bonus", Number(Session.get("current_bonus")) + 1);
		}
		else {
			console.log(template.hand_type);
		}
	},
	//Remove the last submitted hand
	'click .delete_hand_button'(event) {
		console.log();
		Template.instance().hands.pop();
		if (Session.get("current_bonus") > 0)
			Session.set("current_bonus", Number(Session.get("current_bonus")) - 1);
		else if (Session.get("current_round") > 1)
			Session.set("current_round", Number(Session.get("current_round")) - 1);
	},
	//Toggle between different round types
	'click .nav-pills li'( event, template ) {
		var hand_type = $( event.target ).closest( "li" );

		hand_type.addClass( "active" );
		$( ".nav-pills li" ).not( hand_type ).removeClass( "active" );

		template.hand_type.set( hand_type.data( "template" ) );
	},
});

function player_to_direction(player) {
	if (player == Session.get("current_east")) return "east";
	if (player == Session.get("current_south")) return "south";
	if (player == Session.get("current_west")) return "west";
	if (player == Session.get("current_north")) return "north";
}

function round_to_direction(round) {
	if (round % 4 == 1) return "east";
	if (round % 4 == 2) return "south";
	if (round % 4 == 3) return "west";
	if (round % 4 == 0) return "north";
}

function dealin_delta(points, player, winner, loser) {
	var exponent = points - 1;
	var direction = -1;

	if ( player == winner ) {
		direction = 1;
		exponent += 2;
	} 
	else if ( player == loser ) {
		exponent++;
	}
	var retval = direction * Math.pow(2, exponent);
	return retval;
}

Template.points.events({
	'click .point_value'(event) {
		Session.set("current_points", event.target.value);
	}
})