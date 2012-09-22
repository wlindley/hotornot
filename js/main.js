window.main = function() {
	function log(text) {
		if (undefined !== console) {
			console.log(text);
		}
	}
	log("hello main");

	$("div#hello").show();

	function friendLoad(data) {
		log("ajax friend load");
		log(data);
		friendHtml = "";
		for (friend in data.data) {
			friendHtml += data.data[friend].name + '<img src="https://graph.facebook.com/' + data.data[friend].id + '/picture"/>'  + '<br>';
		}
		$("div#friendlist").html(friendHtml);
	}

	FB.api("/me/friends", friendLoad);
};
