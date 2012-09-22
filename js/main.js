window.main = function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}

	friendList = [];

	function showNextPair() {
		firstIndex = Math.floor(Math.random() * friendList.length);
		secondIndex = -1;
		do {
			secondIndex = Math.floor(Math.random() * friendList.length);
		} while(firstIndex == secondIndex);
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
