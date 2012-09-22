$(function() {
	console.log("on ready");
	$("div#hello").show();

	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}
	
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

	//$.ajax("http://graph.facebook.com/me/friends", {"success" : friendLoadSuccess, "error" : friendLoadFailure});
	log("ajax call for friends fired");
});
