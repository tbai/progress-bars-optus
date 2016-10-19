"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressBar = function () {
  function ProgressBar(id) {
    var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

    _classCallCheck(this, ProgressBar);

    this.id = id;
    this.value = initialValue;
    this.limit = limit;
  }

  _createClass(ProgressBar, [{
    key: "buildElement",
    value: function buildElement() {
      this.el = document.createElement("div");
      this.el.id = this.id;
      this.el.classList.add("progress-bar");
      this.el.innerHTML = "\n      <div class=\"bar\"></div>\n      <div class=\"level\"></div>\n      <div class=\"text\">" + this.value + " %</div>\n    ";

      this.levelEl = this.el.querySelector(".level");
      this.textEl = this.el.querySelector(".text");

      this.onChange();
    }
  }, {
    key: "convertValue",
    value: function convertValue(num) {
      return parseInt(100 * num / this.limit, 10);
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.textEl.innerText = this.convertValue(this.value) + " %";
      this.levelEl.style.width = this.convertValue(this.value) + "%";
    }
  }, {
    key: "setValue",
    value: function setValue(num) {
      // validate the number type and range
      if (typeof num === "number" && num >= 0 && num <= this.limit) {
        this.value = num;
        this.onChange();
      }
    }
  }, {
    key: "incValueBy",
    value: function incValueBy(num) {
      var newValue = this.value + num;
      if (newValue > this.limit) {
        newValue = this.limit;
      } else if (newValue < 0) {
        newValue = 0;
      }
      this.setValue(newValue);
    }
  }, {
    key: "render",
    value: function render(containerEl) {

      if (!containerEl) throw new Error("Container element not found: " + containerSelector);

      this.buildElement();
      containerEl.appendChild(this.el);
    }
  }]);

  return ProgressBar;
}();

// Build the HTML

var data = null;
var progressBars = [];

fetch('https://pb-api.herokuapp.com/bars').then(function (response) {
  return response.json().then(function (json) {
    data = json;
    setupBars();
    setupActionButtons();
  });
});

function setupBars() {
  // Render progress bars
  var barsContainerEl = document.querySelector(".progress-bars-container");

  data.bars.forEach(function (initialVal, i) {
    var bar = new ProgressBar("progress" + (i + 1), initialVal, data.limit);
    bar.render(barsContainerEl);
    progressBars[bar.id] = bar;
  });
}

function setupActionButtons() {
  // Render action buttons
  var actionContainerEl = document.querySelector(".actions");

  // render select options
  var selectEl = document.querySelector("select");
  Object.keys(progressBars).forEach(function (barId) {
    var bar = progressBars[barId];
    var optionEl = document.createElement("option");
    optionEl.setAttribute("value", bar.id);
    optionEl.innerText = bar.id;
    selectEl.appendChild(optionEl);
  });

  data.buttons.forEach(function (num) {
    var btn = document.createElement('button');
    btn.setAttribute("value", num);
    btn.innerText = num;
    actionContainerEl.appendChild(btn);
  });

  actionContainerEl.addEventListener("click", function (event) {
    var target = event.target;
    if (event.target instanceof HTMLButtonElement) {
      progressBars[selectEl.value].incValueBy(parseInt(target.value, 10));
    }
  });
}
//# sourceMappingURL=index.js.map
