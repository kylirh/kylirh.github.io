/*

 ______            _        _______  _______  _______  _       
(  __  \ |\     /|( (    /|(  ____ \(  ____ \(  ___  )( (    /|
| (  \  )| )   ( ||  \  ( || (    \/| (    \/| (   ) ||  \  ( |
| |   ) || |   | ||   \ | || |      | (__    | |   | ||   \ | |
| |   | || |   | || (\ \) || | ____ |  __)   | |   | || (\ \) |
| |   ) || |   | || | \   || | \_  )| (      | |   | || | \   |
| (__/  )| (___) || )  \  || (___) || (____/\| (___) || )  \  |
(______/ (_______)|/    )_)(_______)(_______/(_______)|/    )_)
                                                               
 _______ _________ _______  _______  _______ 
(  ____ \\__   __/(  ____ \(  ____ \(  ____ \
| (    \/   ) (   | (    \/| (    \/| (    \/
| (_____    | |   | (__    | |      | (__    
(_____  )   | |   |  __)   | | ____ |  __)   
      ) |   | |   | (      | | \_  )| (      
/\____) |___) (___| (____/\| (___) || (____/\
\_______)\_______/(_______/(_______)(_______/
                                             

*/

// Written By: YOUR NAME GOES HERE
// Date: May 15, 2013

var haveAxe = false;

function start() {
	clear();
	haveAxe = false;
	print("You find yourself in a dark and dreary dungeon. On the right is a battle axe. Do you pick it up? Type YES or NO.");
	next(first);
}

function first(input) {
	if (input == "yes") {
		haveAxe = true;
		print("Right on! You've got an AXE now! Do you want to fight the dragon?");
		next(fightDragon);
	}
	else {
		haveAxe = false;
		print("Alright, no axe. That's fine. Do you want to fight the dragon?")
		next(fightDragon);
	}
}

function fightDragon(input) {
	if (input == "yes") {
		if (haveAxe == true) {
			print("You fight the dragon and win! Congratulations! Start over?");
			next(start);
		}
		else {
			print("You try your best to fight this dragon, but you don't have an axe. And he eats you. Oh well! Start over?")
			next(start);
		}
	}
	else {
		print("You run away, screaming like a little girl. Nice job. Start over?");
		next(start);
	}
}
