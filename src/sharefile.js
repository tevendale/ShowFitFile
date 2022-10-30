jQuery(document).ready(function($) {
	// Get a reference to the 'Preparing File...' text at the top of the post
	var $loading = $('#preparingFile').hide();

	// Listen for the 'click' event on the element with the class 'shareRouteLink'
	$(".shareRouteLink").click(function(event) {
		// Show the 'Preparing' text
		$loading.show();
		// Prevent the <a href...> link from scrolling to the top of the page when its clicked on
		// We want to use a proper <a href=...> link so that it picks up the correct styling from the WP Theme
		event.preventDefault();
		// Data from the data-id='xxxx' field in the element
		var id = $(this).data("id");
		var postURL = $(this).data("url");
		// Send a POST request to the php function set in my_ajax_obj.
		// my_ajax_obj and its class members are defined in the PHP glue code
		$.post(export_ajax_obj.ajax_url, {
			_ajax_nonce: export_ajax_obj.nonce,
			// The action (target php function) is set using the WordPress wp_ajax_nopriv_gpxexport in an Add_Action function call
			// The action ISN'T the function name, but the name assigned to it in the add_action call.
			action: "gpxexport",
			// Data is passed as an array of POST items
			file: id,
			postURL: postURL
			},
			// Callback function receives all the echo'ed data from the php action function call
			function(data) {
				// In this case, we take all the data returned by the function and save it
				saveFile('route.gpx', "data:application/gpx+xml", data);
				//Hide the 'Preparing' text
				$loading.hide();
			}
		);
	} );

	function saveFile (name, type, data) {
		if (data !== null && navigator.msSaveBlob)
			return navigator.msSaveBlob(new Blob([data], { type: type }), name);
		var a = $("<a style='display: none;'/>");
		var url = window.URL.createObjectURL(new Blob([data], {type: type}));
		a.attr("href", url);
		a.attr("download", name);
		$("body").append(a);
		a[0].click();
		window.URL.revokeObjectURL(url);
		a.remove();
	}

});
