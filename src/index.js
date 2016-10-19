
import ProgressBar from 'progress-bar';






// ********************************************************************************
// Build the HTML and setup the components
// ********************************************************************************

let data = null;
let progressBars = [];



// fetch the data from the api and setup the components
fetch('https://pb-api.herokuapp.com/bars')
.then(function(response) {
  return response.json().then( json => {
    data = json;
    setupBars();
    setupActionButtons();
  });
});




// Render progress bars
function setupBars(){

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

  // create the action buttons
  data.buttons.forEach(num => {
    let btn = document.createElement('button');
    btn.setAttribute("value", num);
    btn.innerText = num;
    actionContainerEl.appendChild(btn);
  });

  // setup the event listeners
  actionContainerEl.addEventListener("click", event => {
    let target = event.target;
    if (event.target instanceof HTMLButtonElement){
      progressBars[selectEl.value].incValueBy(parseInt(target.value, 10));
    }
  });
}








