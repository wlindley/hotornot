function initFB(){	// Load the SDK Asynchronously

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '428182577238462', // App ID
			//		channelUrl : 'www.HotUrNotFacebookappUrlWhereverWePutIt.xxx/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
		FB.login(function(response) {
			if (response.authResponse) {
				var accessToken = response.authResponse.accessToken;
				window.main();
			}
		});
	}

	(function(d){
	 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement('script'); js.id = id; js.async = true;
	 js.src = "//connect.facebook.net/en_US/all.js";
	 ref.parentNode.insertBefore(js, ref);
	 }(document)
	);
}
