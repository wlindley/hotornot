window.main = function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}

	personalDataRatedThreshold = 20;
	selectionTime = 4 * 1000; //4 seconds
	interval = 100; //in milliseconds
	timeRemaining = 0;
	intervalFuncHandle = null;
	friendList = [];
	firstFriendData = null;
	secondFriendData = null;
	numRatedThisSession = 0;
	
	function selectUser(chosenUserData, nonChosenUserData) {
		clearInterval(intervalFuncHandle);
		numRatedThisSession++;
		$.ajax("/?ajax=vote&upvote=" + chosenUserData.id);
		hideImages();
		showNextPair();
		if (personalDataRatedThreshold <= numRatedThisSession) {
			showPersonalData();
		}
	}

	function showPersonalData() {
		$("div#personalInfo").show();
	}
	
	$("img#firstImg").click(function() {
		selectUser(firstFriendData, secondFriendData);
	});
	$("img#secondImg").click(function() {
		selectUser(secondFriendData, firstFriendData);
	});
	$("img#firstImg").load(function() {
		$("img#firstImg").show();
	});
	$("img#secondImg").load(function() {
		$("img#secondImg").show();
	});

	function hideImages() {
		$("img#firstImg").hide();
		$("img#secondImg").hide();
	}

	function updateTimer() {
		timeRemaining -= interval;
		secondsRemaining = (timeRemaining / 1000).toFixed(1);
		$("td#timer").html("Time remaining: " + secondsRemaining + " seconds");
		if (timeRemaining <= 0) {
			clearInterval(intervalFuncHandle);
			showNextPair();
		}
	}

	function showNextPair() {
		firstIndex = Math.floor(Math.random() * friendList.length);
		secondIndex = -1;
		do {
			secondIndex = Math.floor(Math.random() * friendList.length);
		} while(firstIndex == secondIndex);
		firstFriendData = friendList[firstIndex];
		secondFriendData = friendList[secondIndex];
		firstUrl = "https://graph.facebook.com/" + friendList[firstIndex].id + "/picture?type=large";
		secondUrl = "https://graph.facebook.com/" + friendList[secondIndex].id + "/picture?type=large";
		$("td#firstName").html('<b>' + friendList[firstIndex].name + '</b>');
		$("td#secondName").html('<b>' + friendList[secondIndex].name + '</b>');
		$("img#firstImg").attr("src", firstUrl);
		$("img#secondImg").attr("src", secondUrl);
		timeRemaining = selectionTime;
		intervalFuncHandle = setInterval(updateTimer, interval);
	}

	function friendLoad(data) {
		friendList = data.data;
		showNextPair();
		$("div#loading").hide();
		$("div#selector").show();
	}

	FB.api("/me/friends", friendLoad);
};
