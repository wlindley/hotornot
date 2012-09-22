$(document).ready(function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}

	$("div#hello").show();

	function friendLoadSuccess(data) {
		log("ajax friend load success");
		friendHtml = "";
		for (friend in data.data) {
			friendHtml += friend.name + "<br>";
		}
		$("div#friendlist").html(friendHtml);
	}

	function friendLoadFailure(data) {
		log("ajax friend load failed");
	}

	$.ajax("https://graph.facebook.com/me/friends", {"success" : friendLoadSuccess, "error" : friendLoadFailure});
	log("ajax call for friends fired");
});
