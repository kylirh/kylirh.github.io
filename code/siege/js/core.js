(function() {
	var input = $("#input"),
		output = $("#output"),
		next = null,
		w = window;


	w.clear = function() {
		output.html("");
	}

	w.print = function(text) {
		output.append("<p>" + text + "</p");
	}

	w.next = function(fn) {
		next = fn;
	}

	w.execute = function() {
		var text = input.val().toLowerCase();
		input.val("");
		if (typeof next === "function") {
			var current = next;
			next = null;
			current(text);
		}
	}

	$("#go").click(w.execute);
})();
