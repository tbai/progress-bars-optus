
class ProgressBar {

  constructor (id){
    this.id = id;
    this.value = 50;
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
  }

  onChange(){
    // calculate the size of the bar leve element
    this.levelEl.style.width = "500px";
    this.textEl.innerText = `${this.value} %`;
  }

  setValue(num){
    // validate the number type and range
    if (typeof num === "number" && num >= 0 && num <=100){
      this.value = num;
      this.onChange();
    }
  }

  incValueBy(num){
    let newValue = this.value + num;
    if (newValue > 100){
      newValue = 100
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


// Render progress bars
const barsContainerEl = document.querySelector(".progress-bars-container");

// append 3 progress bar elements
const progressBars = [];
for (let i=0, bar; i<3; i++){
  bar = new ProgressBar(`progress${i+1}`);
  bar.render(barsContainerEl);
  progressBars[bar.id] = bar;
}

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

function getSelectedBar (){
  return progressBars[selectEl.value];
}

actionContainerEl.addEventListener("click", event => {
  let target = event.target;
  if (event.target instanceof HTMLButtonElement){
    getSelectedBar().incValueBy(parseInt(target.value, 10));
  }
});




