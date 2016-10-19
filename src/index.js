
class ProgressBar {

  constructor (id, initialValue = 0, limit = 100){
    this.id = id;
    this.value = initialValue;
    this.limit = limit;
  }

  buildElement(){
    this.el = document.createElement("div");
    this.el.id = this.id;
    this.el.classList.add("progress-bar");
    this.el.innerHTML =`
      <div class="bar"></div>
      <div class="level"></div>
      <div class="text">${this.value} %</div>
    `;

    this.levelEl = this.el.querySelector(".level");
    this.textEl = this.el.querySelector(".text");

    this.onChange();
  }

  convertValue(num){
    return parseInt (100*num/this.limit, 10);
  }

  onChange(){
    this.textEl.innerText = `${this.convertValue(this.value)} %`;
    this.levelEl.style.width = `${this.convertValue(this.value)}%`;
  }


  setValue(num){
    // validate the number type and range
    if (typeof num === "number" && num >= 0 && num <=this.limit){
      this.value = num;
      this.onChange();
    }
  }

  incValueBy(num){
    let newValue = this.value + num;
    if (newValue > this.limit){
      newValue = this.limit
    } else if (newValue <0){
      newValue = 0;
    }
    this.setValue(newValue);
  }

  render (containerEl){

    if (!containerEl)
      throw new Error("Container element not found: " + containerSelector);

    this.buildElement();
    containerEl.appendChild(this.el);
  }


}


// Build the HTML

let data = null;
let progressBars = [];

fetch('https://pb-api.herokuapp.com/bars')
.then(function(response) {
  return response.json().then( json => {
    data = json;
    setupBars();
    setupActionButtons();
  });
});


function setupBars(){
  // Render progress bars
  const barsContainerEl = document.querySelector(".progress-bars-container");

  data.bars.forEach((initialVal, i) => {
    let bar = new ProgressBar(`progress${i+1}`, initialVal, data.limit);
    bar.render(barsContainerEl);
    progressBars[bar.id] = bar;
  });

}

function setupActionButtons(){
  // Render action buttons
  const actionContainerEl = document.querySelector(".actions");

  // render select options
  const selectEl = document.querySelector("select");
  Object.keys(progressBars).forEach(barId => {
    let bar = progressBars[barId];
    let optionEl = document.createElement("option");
    optionEl.setAttribute("value", bar.id);
    optionEl.innerText = bar.id;
    selectEl.appendChild(optionEl);
  });

  data.buttons.forEach(num => {
    let btn = document.createElement('button');
    btn.setAttribute("value", num);
    btn.innerText = num;
    actionContainerEl.appendChild(btn);
  });

  actionContainerEl.addEventListener("click", event => {
    let target = event.target;
    if (event.target instanceof HTMLButtonElement){
      progressBars[selectEl.value].incValueBy(parseInt(target.value, 10));
    }
  });
}








