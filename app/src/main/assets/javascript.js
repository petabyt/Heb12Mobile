var books = [ "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1st Samuel", "2nd Samuel", "1st Kings", "2nd Kings", "1st Chronicles", "2nd Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1st Corinthians", "2nd Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1st Thessalonians", "2nd Thessalonians", "1st Timothy", "2nd Timothy", "Titus", "Philemon", "Hebrews", "James", "1st Peter", "2nd Peter", "1st John", "2nd John", "3rd John", "Jude", "Revelation" ];
var currentBookNumber = 1;
var currentTranslation = eval(bbe);
var session = {
	breakAfterVerse:true,
	mouseDown:false
}

// When the page loads
window.onload = function() {
	document.getElementById('loadingMessage').style.display = "none";

	// Fill the selects
	for (var i = 0; i < books.length; i++) {
		document.getElementById('book').innerHTML += "<option>" + books[i] + "</option>";
	}

	for (var i = 1; i <= 55; i++) {
		document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
	}

	// load Hebrews 12
	document.getElementById('page').innerHTML = load("Hebrews", 12);
}

// Function to get verse or verses from the json files
function load(book,chapter,verse) {

	// Load all verses into a list.
	var page;
	var booky;
	for (var i = 0; i < books.length; i++) {
		if (books[i] == book) {
			page = currentTranslation[i].chapters[chapter - 1];
			booky = currentTranslation[i].chapters.length;
			currentBookNumber = i;
		}
	}

	document.getElementById('chapter').innerHTML = "";

	// Make accurate chapter length
	for (var i = 1; i <= booky; i++) {
		document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
	}

	document.getElementById('book').value = book;
	document.getElementById('chapter').value = chapter;

	var finalResult = "";

	// Return verse or verses
	if (isNaN(verse)) {
		for (var i = 0; i < page.length; i++) {
			if (session.breakAfterVerse) {
				finalResult += " <b id='verse' onclick='notify(" + '"verse-' + (i + 1) + '"' + ")'>" + (i + 1) + "</b> " + page[i] + "<br>";
			} else {
				finalResult += " <b id='verse' onclick='notify(" + '"verse-' + (i + 1) + '"' + ")'>" + (i + 1) + "</b> " + page[i];
			}
		}
	} else {
		finalResult = page[verse - 1];
	}

	// Remove wierd things inserted inside text in Offline KJV version
	finalResult = finalResult.replace(/\{[a-zA-Z0-9 .,;]+: or, [a-zA-Z0-9 .,;]+\}/g,"");
	finalResult = finalResult.replace(/:/g,"");
	finalResult = finalResult.replace(/\}/g,"");
	finalResult = finalResult.replace(/\{/g,"");
	finalResult = finalResult.replace(/\.\.\./g,"");

	return finalResult;
}

// Notify function, can only be used once at a time.
function notify(text) {
	document.getElementsByClassName("popup")[0].style.display = "block";
	if (text == "welcome") {
		document.getElementById("popup").innerHTML = "<h2>Welcome to Heb12 Mobile!</h2><br><span><b>Tip</b>: Tap on the bold number in front of a verse to get some info about it.</span>";
	} else if (text.startsWith("verse")) {

		// Popup for showing a single verse
		var book = document.getElementById('book').value;
		var chap = document.getElementById('chapter').value;
		var verse = text.split("-")[1];
		var entire = book + " " + chap + ":" + verse;
		document.getElementById("popup").innerHTML = "<h2>" + entire + "</h2><span>" + load(book, chap, verse) + "</span><br><span><div style='width:200px;' class='button' onclick='search(" + '"' + entire + '"' + ")'><span>Search verse on Google</span></div></span>";
	} else if (text == "translation") {
		document.getElementById("popup").innerHTML = '<h2>Translation</h2> <br> <span><b>B</b>ible in <b>B</b>asic <b>English</b> (BBE)</span>  <div class="button"> Use This One </div>';
	} else {
		document.getElementById("popup").innerHTML = text;
	}
}

// Function to handle page updates
function update(option) {
	var book = document.getElementById('book').value;
	var chapter = Number(document.getElementById('chapter').value);
	var translation = document.getElementById('translation').value;

	if (translation.startsWith("BBE")) {
		currentTranslation = eval(bbe);
	} else if (translation.startsWith("KJV") && translation.endsWith("(Offline)")) {
		currentTranslation = eval(kjv);
	} else if (translation.startsWith("KJV") && translation.endsWith("(Online)")) {
		document.getElementById('kjvOnline').style.display = "block";
		// Not actually loading anything
		currentTranslation = eval(bbe);
	} else {
		document.getElementById('kjvOnline').style.display = "none";
	}

	// If the user goes back at the first chapter of a book, go back to the previous book
	if (option == "next") {
		if (currentTranslation[currentBookNumber].chapters.length == Number(document.getElementById('chapter').value)) {
			if (book == "Revelation" && chapter == 22) {
				console.log("End of Bible :-/");
			} else {
				book = books[currentBookNumber + 1];
				chapter = 1;
			}
		} else {
			chapter++;
		}
	} else if (option == "previous") {
		if (chapter !== 1) {
			chapter--;
		} else {
			book = books[currentBookNumber - 1];
			chapter = currentTranslation[currentBookNumber - 1].chapters.length;
		}
	}
	if (translation.startsWith("KJV") && translation.endsWith("(Online)")) {
		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;
		document.getElementById('kjvOnline').src = "http://labs.bible.org/api/?passage=" + book + " " + chapter + " && formatting=full"
	} else {
		document.getElementById('page').innerHTML = load(book, chapter);
	}
	
}

// A simple function to search somthing on Google
function search(thing) {
	window.open("https://www.google.nl/search?q=" + thing);
}

// Function to close settings menu
function settings(action) {
	if (action == "close") {
		document.getElementById('settings').style.display = "none";
	} else {
		document.getElementById('settings').style.display = "block";
	}
}
