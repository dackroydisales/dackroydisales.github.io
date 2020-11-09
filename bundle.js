/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// include 

const PRICE_AXIS_START = 620;
const TURN_AXIS_START = 100;
const PRICE_AXIS_END = 100;
const TURN_AXIS_END = 1100; //REFACTOR: with 100 time segments of 10, full size of graphs
const MY_WIDTH = 1280;
const MY_HEIGHT = 720;

const WORKING_HEIGHT = Math.abs(PRICE_AXIS_END - PRICE_AXIS_START);
//NB: The X-axis is 'reversed' in HTML canvas
const WORKING_LENGTH = TURN_AXIS_START - TURN_AXIS_END;

const INITIAL_PORTFOLIO = 100000;
let p_value = INITIAL_PORTFOLIO;

function updatePValue() {
  portfolio_el.innerHTML = "Portfolio: $" + p_value;
}

const START_OIL_TICKER = 400;
let oil_ticker = START_OIL_TICKER;

let MAX_PRICE = 800;//start price * 2

function updateOilPrice() {
  oil_el.innerHTML = "Current commodity price: " + oil_ticker;
}

let last_price = oil_ticker;

function updateLastPrice() {
  last_price_el.innerHTML = "Previous commodity price: " + last_price;
}

let ipos = 0;

function updatePosition() {
  if(ipos > 0)
  {
    position_el.innerHTML = "Current position: LONG " + ipos;
  } else if(ipos === 0) {
    position_el.innerHTML = "Current position: No position";
  } else {
    position_el.innerHTML = "Current position: SHORT " + Math.abs(ipos);
  }
}

let turns_left = 10;

function updateTurnsLeft() {
  turns_el.innerHTML = "Turns left: " + turns_left;
}

function consume_turn() {
  turns_left -= 1;
}

function increase() {
  ipos += 100;
  updatePosition();
}

function decrease() {
  ipos -= 100;
  updatePosition();
}

function game_loop(){
  btn_plus.addEventListener("click", increase);
  btn_minus.addEventListener("click", decrease);
  document.body.removeChild(btn_start);
  investment_phase();
}



let seconds_left;

function investment_phase()
{
  ipos = 0;
  updatePosition();
  if(flag_game_over === false)
  {
    seconds_left = 10;
    info_el.innerHTML = "Investment phase start!";
    setTimeout(() => {interval = setInterval(update_timer, 1000)}, 700);
    setTimeout(enter_tick, 11700);
  }
}

function update_timer(){
    info_el.innerHTML = `You have ${seconds_left} seconds left to invest.`;
    seconds_left--;
}

function enter_tick(){
  clearInterval(interval);
  info_el.innerHTML = "Trading start!";
  tick();
}

let last_point = [TURN_AXIS_START, draw_the_price()];
const TIME_SEGMENT = 10;//10px


function investment_ticker_update(last) {
  p_value = p_value + ipos * (oil_ticker - last);
}

let flag_game_over = false;

function gameOver() {
  btn_plus.removeEventListener("click", increase);
  btn_minus.removeEventListener("click", decrease);
  if(p_value >= (INITIAL_PORTFOLIO * 2))
  {
    info_el.innerHTML = "You win!";
  } else if (p_value <= 0)
  {
    info_el.innerHTML = "You lose!";
  } else {
    info_el.innerHTML = "Game over!";
  }
  flag_game_over = true;
}

//ratio of 250/10 = the graph exceeds its limits after a 75/25 result, very rare

function tick() {
  btn_plus.removeEventListener("click", increase);
  btn_minus.removeEventListener("click", decrease);
  last_price = oil_ticker;
  render_axes();
  let interval = setInterval(() => {
    let oil_prev_ticker = oil_ticker;
    if (Math.random() > 0.5) {
      oil_ticker += 10;
    } else {
      oil_ticker -= 10;
    }
    updateOilPrice();
    investment_ticker_update(oil_prev_ticker);
    updatePValue();
    render_tick();
  }, 20);
  setTimeout(() => {
    clearInterval(interval);
    btn_plus.addEventListener("click", increase);
    btn_minus.addEventListener("click", decrease);
    consume_turn();
    updateLastPrice();
    updateTurnsLeft();

    if (turns_left === 0 || p_value <= 0 || p_value >= INITIAL_PORTFOLIO * 2) {
      gameOver();
    } else {
      investment_phase();
    }
  }, 2000);
}


function draw_the_price(){
  let distance_from_max = (1 - (START_OIL_TICKER + oil_ticker - last_price) * 1.0 /(2* START_OIL_TICKER)) * WORKING_HEIGHT;
  return PRICE_AXIS_END + distance_from_max;
}

let canvas = document.createElement("canvas");
canvas.setAttribute("width", MY_WIDTH);
canvas.setAttribute("height", MY_HEIGHT);
let ctx=canvas.getContext("2d");
render_axes();
document.body.appendChild(canvas);
  

function render_axes()
{
  ctx.clearRect(0, 0, MY_WIDTH, MY_HEIGHT);
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_END, PRICE_AXIS_START);
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_START, PRICE_AXIS_END);
  ctx.stroke();
  //render axis labels
  MAX_PRICE = oil_ticker + START_OIL_TICKER;
  MIN_PRICE = oil_ticker - START_OIL_TICKER;
  ctx.font="20px Tahoma";
  ctx.fillText(MAX_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_END);
  ctx.fillText(MIN_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_START);
  ctx.fillText("Price", TURN_AXIS_START - 70, (PRICE_AXIS_END + PRICE_AXIS_START) / 2)
  //reset last_point
  last_point = [TURN_AXIS_START, draw_the_price()];
  //
}


function render_tick(){
  ctx.beginPath();
  ctx.strokeStyle = "#FF0000";
  ctx.moveTo(last_point[0], last_point[1]);
  ctx.lineTo(last_point[0] + TIME_SEGMENT, draw_the_price());
  ctx.stroke();
  last_point =  [last_point[0] + TIME_SEGMENT, draw_the_price()];
}

let portfolio_el = document.createElement("p");
portfolio_el.className = "portfolio";
updatePValue();
document.body.appendChild(portfolio_el);

let oil_el = document.createElement("p");
updateOilPrice();
document.body.appendChild(oil_el);

let last_price_el = document.createElement("p");
updateLastPrice();
document.body.appendChild(last_price_el);

let position_el = document.createElement("p");
updatePosition();
document.body.appendChild(position_el);

let btn_plus = document.createElement("BUTTON");
btn_plus.innerHTML = "LONG 100";
document.body.appendChild(btn_plus);

let btn_minus = document.createElement("BUTTON");
btn_minus.innerHTML = "SHORT 100";
document.body.appendChild(btn_minus);

let btn_start = document.createElement("BUTTON");
btn_start.innerHTML = "START GAME";
btn_start.addEventListener("click", game_loop);
document.body.appendChild(btn_start);

let turns_el = document.createElement("p");
updateTurnsLeft();
document.body.appendChild(turns_el);

let info_el = document.createElement("p");
info_el.innerHTML = "Welcome to StockTrader! Press START GAME to begin.";
document.body.appendChild(info_el);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map