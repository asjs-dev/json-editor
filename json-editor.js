var JSONEditor = function() {
	var _scope = {};

	var EDITOR_ID = "json_editor";
	var ROOT_NAME = "json";
	var BASE_ID   = EDITOR_ID + "-" + ROOT_NAME;

	var createElement = document.createElement.bind(document);

	var _json;
	var _jsonFormContainer;
	var _title;
	var _tabIndex;

	(function constructor() {
		_jsonFormContainer = document.createElement("div");
		_jsonFormContainer.id = EDITOR_ID;
	})();

	_scope.setTitle = function(title) {
		_title = title;
		trySetTitle();
	}

	_scope.setJSON = function(container, value) {
		_json = value;

		_jsonFormContainer.innerHTML = "";
		container.appendChild(_jsonFormContainer);

		_tabIndex = -1;

		parse(_jsonFormContainer, ROOT_NAME, _json);
		trySetTitle();
	}

	_scope.getJSON = function() {
		return getJSON(_json, BASE_ID);
	}

	function trySetTitle() {
		if (!_title) return;
		if (!(baseContainer = _jsonFormContainer.querySelector("#" + BASE_ID))) return;
		if (!(baseLabel = baseContainer.querySelector("label"))) return;
		baseLabel.innerText = _title;
		baseLabel.setAttribute("title", _title);
	}

	function parse(container, name, values) {
		var key;
		var parent = createContainer(container, name, container.id + "-" + name);

		for (key in values) {
			var value = values[key];
			switch (getType(value)) {
				case "object" : parse(parent, key, value);                 break;
				case "enum"   : createDropDown(parent, key, value.values); break;
				case "array"  : createArray(parent, key, value);           break;
				default       : createTextInput(parent, key, value);       break;
			}
		}
	}

	function getJSON(values, id) {
		var key;
		var out = {};

		for (key in values) {
			var newId = id + "-" + key;
			if (!isUseableValue(newId)) continue;
			var value = values[key];
			var response;
			switch (getType(value)) {
				case "object" : response = getJSON(value, newId); break;
				case "array"  : response = getArrayValue(newId);  break;
				default       : response = getValue(newId);       break;
			}
			out[key] = response;
		}
		return out;
	}

	function getType(value) {
		var type = typeof(value);
		if (type === "object") {
			if (value.type === "enum") return "enum";
			if (Array.isArray(value))  return "array";
		}
		return type;
	}

	function isUseableValue(id) {
		return _jsonFormContainer.querySelector("input#checkbox-" + id).checked;
	}

	function getTypedValue(value) {
		var numericValue = parseFloat(value);
		return value == numericValue ? numericValue : value;
	}

	function getValue(id) {
		return getTypedValue(_jsonFormContainer.querySelector("#input-" + id).value);
	}

	function getArrayValue(id) {
		return JSON.parse("[" + getValue(id) + "]");
	}

	function createBox(parent, id) {
		var box           = createElement("div");
			box.id        = id;
			box.className = "json-editor-container" + (id === BASE_ID ? " root" : "");

		parent.appendChild(box);

		return box;
	}

	function createCheckbox(parent, id) {
		if (id === BASE_ID) return;

		var checkbox          = createElement("input");
			checkbox.id       = "checkbox-" + id;
			checkbox.type     = "checkbox";
			checkbox.checked  = true;
			checkbox.tabIndex = ++_tabIndex;
			checkbox.addEventListener("change", function() {
				parent.className = parent.className.replace("hidden-property", "");
				if (!this.checked) parent.className += " hidden-property";
			});

		parent.appendChild(checkbox);
	}

	function createLabel(parent, name) {
		var label           = createElement("label");
			label.innerText = name;
			label.setAttribute("title", name);

		parent.appendChild(label);

		return label;
	}

	function createContainer(parent, name, id) {
		var box = createBox(parent, id);

		createCheckbox(box, id);
		createLabel(box, name);

		return box;
	}

	function createTextInput(parent, name, value) {
		var id        = parent.id + "-" + name;
		var container = createContainer(parent, name, id);

		var textInput          = createElement("input");
			textInput.id       = "input-" + id;
			textInput.type     = "text";
			textInput.value    = value;
			textInput.tabIndex = ++_tabIndex;

		container.appendChild(textInput);
	}

	function createDropDown(parent, name, value) {
		var id        = parent.id + "-" + name;
		var container = createContainer(parent, name, id);

		var dropDown          = createElement("select");
			dropDown.id       = "input-" + id;
			dropDown.tabIndex = ++_tabIndex;

		var i = -1;
		var l = value.length;

		var fragment = document.createDocumentFragment();
		while (++i < l) {
			var option = createElement("option");
				option.innerText = option.value = value[i];
			fragment.appendChild(option);
		}
		dropDown.appendChild(fragment);

		container.appendChild(dropDown);
	}
  
	function createArray(parent, key, values) {
		var value = [];
		var i = -1;
		var l = values.length;
		while (++i < l) value.push(JSON.stringify(values[i]));
		createTextInput(parent, key, value.join(","));
	}

	return _scope;
}
