window.main = function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}

	personalDataRatedThreshold = 20;
	selectionTime = 6 * 1000; //in milliseconds
	interval = 100; //in milliseconds
	timeRemaining = 0;
	intervalFuncHandle = null;
	friendList = [];
	firstFriendData = null;
	secondFriendData = null;
	numRatedThisSession = 0;
	hasLoadedPersonalData = false;
	userId = "";

	FB.api("/me", function(response) {
		if (undefined !== response['error']) {
			return;
		}
		userId = response['id'];
	});
	
	function selectUser(chosenUserData, nonChosenUserData) {
		clearInterval(intervalFuncHandle);
		numRatedThisSession++;
		$.ajax("/?ajax=vote&upvote=" + chosenUserData.id + "&fbid=" + userId);
		hideImages();
		if (personalDataRatedThreshold <= numRatedThisSession) {
			loadPersonalData();
		}
		showNextPair();
	}
	
	function loadPersonalData() {
		if (!hasLoadedPersonalData) {
			$.ajax("?ajax=getDetailedInfo&fbid=" + userId).done(showPersonalData);
			hasLoadedPersonalData = true;
		}
	}

	function showPersonalData(response) {
		data = $.parseJSON(response);
		personalInfoHtml = "";
		dedupedData = {};
		for (i in data) {
			fbid = data[i];
			if (fbid in dedupedData) {
				dedupedData[fbid]++;
			} else {
				dedupedData[fbid] = 1;
			}
		}
		for (fbid in dedupedData) {
			personalInfoHtml += getNameFromFbid(fbid) + ' voted for you ' + dedupedData[fbid] + ' times<br>';
		}
		$("div#personalData").html(personalInfoHtml);
		$("div#personalInfo").show();
	}

	function getNameFromFbid(fbid) {
		for (i in friendList) {
			if (fbid == friendList[i].id) {
				return friendList[i].name;
			}
		}
		return "Unknown friend";
	}
	
	$("img#firstImg").click(function() {
		selectUser(firstFriendData, secondFriendData);
	});
	$("img#secondImg").click(function() {
		selectUser(secondFriendData, firstFriendData);
	});
	$("img#firstImg").load(function() {
		$("img#firstImg").show();
		$("td#firstName").show();
	});
	$("img#secondImg").load(function() {
		$("img#secondImg").show();
		$("td#secondName").show();
	});

	function hideImages() {
		$("td#firstName").hide();
		$("td#secondName").hide();
		$("img#firstImg").hide();
		$("img#secondImg").hide();
	}

	function updateTimer() {
		timeRemaining -= interval;
		secondsRemaining = (timeRemaining / 1000).toFixed(1);
		$("td#timer").html("Time remaining: " + secondsRemaining + " seconds");
		if (timeRemaining <= 0) {
			clearInterval(intervalFuncHandle);
			hideImages();
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
		
		$("span#firstUpvotes").html("");
		$("span#secondUpvotes").html("");
		
		$.ajax("?ajax=getVotes&id=" + firstFriendData.id).done(function(response){
			$("span#firstUpvotes").html(response);
		});

		$.ajax("?ajax=getVotes&id=" + secondFriendData.id).done(function(response){
			$("span#secondUpvotes").html(response);
		});

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
