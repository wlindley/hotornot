window.main = function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}

	friendList = [];
	firstFriendData = null;
	secondFriendData = null;
	
	function selectUser(chosenUserData, nonChosenUserData) {
		log("Selecting user named " + chosenUserData.name);
		$.ajax("/?ajax=vote&upvote=" + chosenUserData.id);
		hideImages();
		showNextPair();
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
	}

	function friendLoad(data) {
		friendList = data.data;
		showNextPair();
		$("div#loading").hide();
		$("div#selector").show();
	}

	FB.api("/me/friends", friendLoad);
};
