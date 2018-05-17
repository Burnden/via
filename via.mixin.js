function closePolygon() {
	// injected polygon close shortcut that mimic the mouse click on the first polygon point

	// if user is not edting a polygon, exit.
	if (!_via_is_user_drawing_polygon) return;

	var currentRegion = _via_canvas_regions[_via_canvas_regions.length - 1];
	var computedX0 = currentRegion.shape_attributes.all_points_x[0];
	var computedY0 = currentRegion.shape_attributes.all_points_y[0];

	var bbox = _via_reg_canvas.getBoundingClientRect();

	// hack the mousedown because via checks it
	_via_reg_canvas.dispatchEvent(new MouseEvent('mousedown', { clientX: computedX0 + bbox.x, clientY: computedY0 + bbox.y }));
	_via_reg_canvas.dispatchEvent(new MouseEvent('mouseup', { clientX: computedX0 + bbox.x, clientY: computedY0 + bbox.y }));
	alertify.success("Polygon path closed");

}

// scroll by wsad
function wsadScroll(top, left) {
	window.scrollBy({ left: left, top: top, behavior: 'smooth' });
}

function injectScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.async = true;
		script.src = src;
		script.addEventListener('load', resolve);
		script.addEventListener('error', () => reject('Error loading script.'));
		script.addEventListener('abort', () => reject('Script loading aborted.'));
		document.head.appendChild(script);
	});
}

function injectAlertifyCss() {
	var link = document.createElement("link");
	link.href = "alertify.css";
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
}

function assertKey(e, keycode) {
	if (keycode >= 97 && keycode <= 122) {
		return (e.which == keycode || e.keyCode == keycode || e.keyCode == keycode - 32 || e.which == keycode - 32);
	}

	if (keycode >= 65 && keycode <= 90) { // A to Z
		return (e.which == keycode || e.keyCode == keycode || e.keyCode == keycode + 32 || e.which == keycode + 32);
	}

	return e.which == keycode || e.keyCode == keycode;

}
function shortCutHandler(e) {
	e = e || window.event;
	if (assertKey(e, 67) && e.ctrlKey) {
		// Ctrl + C
		closePolygon();
	}

	if (assertKey(e, 87)) {
		// W
		wsadScroll(-200, 0);
	};

	if (assertKey(e, 83)) {
		// S
		wsadScroll(200, 0);
	};

	if (assertKey(e, 65)) {
		// A
		wsadScroll(0, -200);
	};

	if (assertKey(e, 68)) {
		// D
		wsadScroll(0, 200);
	};
}

function patchZoom() {
	_zoom_in = zoom_in.bind({});

	zoom_in = function () {
		if (!_via_is_user_drawing_polygon && !_via_is_user_drawing_region)
			_zoom_in();
	}

	_zoom_out = zoom_out.bind({});

	zoom_out = function () {
		if (!_via_is_user_drawing_polygon && !_via_is_user_drawing_region)
			_zoom_out();
	}
}

function injectionMain() {
	injectAlertifyCss();
	injectScript("alertify.js").then(() => {
		alertify.logPosition("top right");
		alertify.success("Via mixin has been injected!");
	});


	// inject shortcuts
	window.addEventListener('keydown', shortCutHandler);

	// zooming during drawing will cause unexpected behavior;
	patchZoom();

}
injectionMain();


