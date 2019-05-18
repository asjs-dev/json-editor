# json-editor
This is a solution for create forms from JSON source automatically (with some minor constraints, like the enum values)

## Demo
https://codepen.io/iroshan/pen/ReZxZy

## Example
HTML:
```html
<div id="json-container"></div>
```

CSS:
```css
/* THEME */

.json-editor-container {
	transition: all 0.5s ease-in-out;
	border: none;
	border-left: 1px solid rgba(255, 255, 255, 0.2);
	background: #282c34;
	margin: 0;
	padding: 3px;
	padding-left: 15px;
	max-height: 10000px;
}

.json-editor-container:last-child {
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 0 0 0 5px;
}

.json-editor-container.root {
	padding: 3px;
	margin: 0;
	border: none;
	border-radius: 5px;
}

.json-editor-container.root > .json-editor-container {
	border-left: none;
	padding-left: 3px;
}

.json-editor-container.root > .json-editor-container:last-child {
	border-bottom: none;
}

.json-editor-container.hidden-property {
	opacity: 0.3;
	max-height: 40px;
}

.json-editor-container input[type="checkbox"] {
	vertical-align: top;
	margin-top: 13px;
	margin-left: 5px;
}

.json-editor-container label {
	color: #d19a66;
	height: 22px;
	vertical-align: top;
	margin-top: 13px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: calc(30% - 25px);
}

.json-editor-container.root > label {
	width: calc(100% - 10px);
}

.json-editor-container input[type="text"],
.json-editor-container select {
	vertical-align: top;
	width: calc(70% - 25px);
	border-radius: 5px;
	padding: 5px;
	height: 20px;
	background: rgba(255, 255, 255, 0.8);
}

.json-editor-container select {
	height: 30px;
	width: calc(70% - 15px);
}

.json-editor-container input[type="checkbox"]:focus,
.json-editor-container input[type="text"]:focus,
.json-editor-container select:focus {
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.2);
}

@media screen and (max-width: 600px) {
	.json-editor-container {
		margin: 1px;
		padding: 1px;
		padding-left: 5px;
	}
}
```

Javascript:
```javascript
var json = {
  object: {
    first: 0,
    second: 1
  },
  int: 0,
  float: 0.1,
  string: "hello",
  boolean: {
    type: "enum",
    values: ["True", "False"]
  },
  enum: { // special type
    type: "enum",
    values: [
      "A",
      "B",
      "C"
    ]
  },
  person: {
    name: "Adam",
    age: 35,
    children: [
      {
        name: "Adam",
        age: 4
      },
      {
        name: "Eve",
        age: 3
      }
    ]
  },
  array: [
    0,
    1,
    2
  ]
};

var container = document.querySelector("#json-container");
var editor = new JSONEditor();
editor.setTitle("Edit JSON");
editor.setJSON(container, json);
container.addEventListener("change", function() {
  console.clear();
  console.log(editor.getJSON());
});
```
