// include 

const PRICE_AXIS_START = 620;
const TURN_AXIS_START = 100;
const PRICE_AXIS_END = 100;
const TURN_AXIS_END = 1100; //REFACTOR: with 100 time segments of 10, full size of graphs
const MY_WIDTH = 1130;
const MY_HEIGHT = 720;

const WORKING_HEIGHT = Math.abs(PRICE_AXIS_END - PRICE_AXIS_START);
//NB: The X-axis is 'reversed' in HTML canvas
const WORKING_LENGTH = TURN_AXIS_START - TURN_AXIS_END;

const INITIAL_PORTFOLIO = 10000;
let p_value;

function updatePValue() {
  portfolio_el.innerHTML = "Net worth: $" + p_value;
  if(p_value - last_net_worth > 0)
  {
    net_worth_arrow.innerHTML = "▲";
    net_worth_arrow.className = "stock-arrow positive";
  } else if(p_value - last_net_worth < 0)
  {
    net_worth_arrow.innerHTML = "▼";
    net_worth_arrow.className = "stock-arrow negative";
  } else {
    net_worth_arrow.innerHTML = "";
    net_worth_arrow.className = "stock-arrow positive";
  }
}

const START_OIL_TICKER = 80;
let oil_ticker;

let MAX_PRICE = 160;//start price * 2

function updateOilPrice() {
  oil_el.innerHTML = "Current price ($): " + oil_ticker;

  if(oil_ticker - last_price >= 0) {
    arrow_el.className = "stock-arrow positive";
  } else {
    arrow_el.className = "stock-arrow negative";
  }

  if (oil_ticker - last_price >= 15) {
    arrow_el.innerHTML = "▲▲▲";
  } else if (oil_ticker - last_price >= 10) {
    arrow_el.innerHTML = "▲▲";
  } else if (oil_ticker - last_price >= 5) {
    arrow_el.innerHTML = "▲";
  } else if (oil_ticker - last_price > -5) {
    arrow_el.innerHTML = "";
  } else if (oil_ticker - last_price > -10) {
    arrow_el.innerHTML = "▼";
  } else if (oil_ticker - last_price > -15) {
    arrow_el.innerHTML = "▼▼";
  } else {
    arrow_el.innerHTML = "▼▼▼";
  }
}

let last_net_worth;
let last_price;

function updateLastPrice() {
  last_price_el.innerHTML = "Previous price ($): " + last_price;
}

let ipos;

function updatePosition() {
  if(ipos > 0)
  {
    position_el.innerHTML = "My position: LONG " + ipos;
  } else if(ipos === 0) {
    position_el.innerHTML = "My position: No position";
  } else {
    position_el.innerHTML = "My position: SHORT " + Math.abs(ipos);
  }
}

let turns_left;

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

  flag_game_over = false;
  initialize();
  updatePValue();
  updatePosition();
  updateOilPrice();
  updateLastPrice();
  updateTurnsLeft();
  show_how_to_play();

  btn_plus.addEventListener("click", increase);
  btn_minus.addEventListener("click", decrease);
  btn_start.disabled = true;
  stock_tips_btn.disabled = true;
  market_type_btn.disabled = true;
  investment_phase();
}

let de_container = document.createElement("div");
de_container.className = "ST-container day";
document.body.appendChild(de_container);

let title_container = document.createElement("div");
title_container.className = "title-container day";
de_container.appendChild(title_container);

let title = document.createElement("p");
title.className = "title";
title.innerHTML = "StockTrader - Beat The Market!";
title_container.appendChild(title);


let settings_container = document.createElement("div");
settings_container.className = "settings-container";
de_container.appendChild(settings_container);

mode_container = document.createElement("span");
mode_container.className = "mode-container";
settings_container.appendChild(mode_container);

let btn_day = document.createElement("BUTTON");
btn_day.innerHTML = "Day Mode";
btn_day.addEventListener("click", set_day_mode);
btn_day.className = "day";
mode_container.appendChild(btn_day);

let btn_night = document.createElement("BUTTON");
btn_night.innerHTML = "Night Mode";
btn_night.addEventListener("click", set_night_mode);
btn_night.className = "day";
mode_container.appendChild(btn_night);

let hacks_container = document.createElement("span");
hacks_container.className = "hacks-container";
settings_container.appendChild(hacks_container);

let stock_tips_container = document.createElement("span");
stock_tips_container.className = "stock-tips-container";
hacks_container.appendChild(stock_tips_container);

let stock_tips_description = document.createElement("span");
stock_tips_description.innerHTML = "Stock tips:  ";
stock_tips_description.className = "day";
stock_tips_container.appendChild(stock_tips_description);

let stock_tips_btn = document.createElement("button");
stock_tips_btn.innerHTML = "No";
stock_tips_btn.className = "day";
stock_tips_btn.addEventListener("click", set_stock_tip);
stock_tips_container.appendChild(stock_tips_btn);

let market_type_container = document.createElement("span");
market_type_container.className = "market-type-container";
hacks_container.appendChild(market_type_container);

let market_type_description = document.createElement("span");
market_type_description.innerHTML = "Market type:  ";
market_type_description.className = "day";
market_type_container.appendChild(market_type_description);

let market_type_btn = document.createElement("button");
market_type_btn.innerHTML = "Neutral";
market_type_btn.className = "day";
market_type_btn.addEventListener("click", set_market_type);
market_type_container.appendChild(market_type_btn);

let btn_start = document.createElement("BUTTON");
btn_start.innerHTML = "Start Game";
btn_start.addEventListener("click", game_loop);
btn_start.className = "day";
settings_container.appendChild(btn_start);


let game_over_display_container = document.createElement("div");
game_over_display_container.className = "game-over-display-container day";
game_over_display_container.style.display = "none";
de_container.appendChild(game_over_display_container);

let game_over_message = document.createElement("p");
game_over_message.className = "day";
game_over_display_container.appendChild(game_over_message);

function set_market_type(){
  if (market_type_btn.innerHTML === "Neutral") {
    market_type_btn.innerHTML = "Hot";
  } else if (market_type_btn.innerHTML === "Hot") {
    market_type_btn.innerHTML = "Cold";
  } else if (market_type_btn.innerHTML === "Cold") {
    market_type_btn.innerHTML = "Neutral";
  }
}

function set_day_mode() {

  btn_start.className = "day";
  btn_day.className = "day";
  btn_night.className = "day";
  stock_tips_description.className = "day";
  stock_tips_btn.className = "day";
  market_type_description.className = "day";
  market_type_btn.className = "day";

  btn_plus.className = "day";
  btn_minus.className = "day";

  title_container.className = "title-container day";

  portfolio_el.className = "day";
  oil_el.className = "day";
  last_price_el.className = "day";
  position_el.className = "day";
  turns_el.className = "day";
  info_el.className = "day";

  how_to_play_btn.className = "day";
  stock_terminology_btn.className = "day";
  instructional_text.className = "day";

  canvas.className = "day";

  re_render();

  copyright_section.className = "day";
  linked_in_link.className = "day";
  github_link.className = "day";
  st_link.className = "day";

  game_over_display_container.className = "game-over-display-container day";
  game_over_message.className = "day";

  de_container.className = "ST-container day";
}

function set_night_mode() {
  btn_start.className = "night";
  btn_day.className = "night";
  btn_night.className = "night";
  stock_tips_btn.className = "night";
  stock_tips_description.className = "night";
  market_type_description.className = "night";
  market_type_btn.className = "night";

  btn_plus.className = "night";
  btn_minus.className = "night";

  title_container.className = "title-container night";

  portfolio_el.className = "night";
  oil_el.className = "night";
  last_price_el.className = "night";
  position_el.className = "night";
  turns_el.className = "night";
  info_el.className = "night";

  how_to_play_btn.className = "night";
  stock_terminology_btn.className = "night";
  instructional_text.className = "night";

  canvas.className = "night";

  re_render();

  game_over_display_container.className = "game-over-display-container night";
  game_over_message.className = "night";

  copyright_section.className = "night";
  linked_in_link.className = "night";
  github_link.className = "night";
  st_link.className = "night";

  de_container.className = "ST-container night";
}

let seconds_left;

function investment_phase()
{
  ipos = 0;
  updatePosition();
  if(flag_game_over === false)
  {
    seconds_left = 10;
    if(turns_left === 10) {
      info_el.innerHTML = "Get ready to invest!<br />Investment phase start!"
    } else if(stock_tip === true && (turns_left === 8 || turns_left === 1)){
      info_el.innerHTML = "HOT TIP: BUY NOW!<br />Investment phase start!";
    }
    else {
    info_el.innerHTML = "Investment phase start!";
    }
    setTimeout(() => {interval = setInterval(update_timer, 1000)}, 700);
    setTimeout(enter_tick, 11700);
  }
}

function update_timer(){
  if (stock_tip === true && (turns_left === 8 || turns_left === 1)) {
    info_el.innerHTML =
      `HOT TIP: BUY NOW! <br />You have ${seconds_left} seconds left to invest.`;
  } else {
    info_el.innerHTML = `You have ${seconds_left} seconds left to invest.`;
  }
    seconds_left--;
}

function enter_tick(){
  clearInterval(interval);
  info_el.innerHTML = "Trading start!";
  tick();
}

let last_point;
const TIME_SEGMENT = 10;//10px


function investment_ticker_update(last) {
  p_value = p_value + ipos * (oil_ticker - last);
}

let flag_game_over;

function gameOver() {
  btn_plus.removeEventListener("click", increase);
  btn_minus.removeEventListener("click", decrease);
  if(p_value >= (INITIAL_PORTFOLIO * 2))
  {
    info_el.innerHTML = "You won!";
    game_over_message.innerHTML = "You won!";
  } else if (p_value <= 0)
  {
    info_el.innerHTML = "You lost!";
    game_over_message.innerHTML = "You lost!";
  } else {
    info_el.innerHTML = "Game over!";
    game_over_message.innerHTML = "Game over!";
  }
  btn_start.disabled = false;
  stock_tips_btn.disabled = false;
  market_type_btn.disabled = false;
  game_over_display_container.style.display = "block";
  flag_game_over = true;
}

let stock_tip = false;

function set_stock_tip() {//flip based on button display
  if(stock_tips_btn.innerHTML === "No")
  {
    stock_tips_btn.innerHTML = "Yes";
    stock_tip = true;
  } else {
      stock_tips_btn.innerHTML = "No";
      stock_tip = false;
  }
}

let prev_ticker;

function get_the_threshold()
{
  if(stock_tip === true && (turns_left === 8 || turns_left === 1))
  {
    return 0.35;
  }

  if(market_type_btn.innerHTML === "Cold")
  {
    return 0.6;
  } else if(market_type_btn.innerHTML === "Hot")
  {
    return 0.4;
  } else {
    return 0.5;
  }
}

function tick() {
  btn_plus.removeEventListener("click", increase);
  btn_minus.removeEventListener("click", decrease);
  btn_day.removeEventListener("click", set_day_mode);
  btn_night.removeEventListener("click", set_night_mode);
  prev_ticker = [oil_ticker];
  last_price = oil_ticker;
  last_net_worth = p_value;
  render_axes();
  let interval = setInterval(() => {
    let oil_prev_ticker = oil_ticker;
    if (Math.random() > get_the_threshold()) {
      oil_ticker += 1;
    } else {
      oil_ticker -= 1;
    }
    updateOilPrice();
    prev_ticker.push(oil_ticker);
    investment_ticker_update(oil_prev_ticker);
    updatePValue();
    render_tick();
  }, 20);
  setTimeout(() => {
    clearInterval(interval);
    btn_plus.addEventListener("click", increase);
    btn_minus.addEventListener("click", decrease);
    btn_day.addEventListener("click", set_day_mode);
    btn_night.addEventListener("click", set_night_mode);
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

function re_render()
{
    if(prev_ticker.length > 0)
    {
      render_these_axes(prev_ticker[0]);
      // last_point = [
      //   TURN_AXIS_START, 
      //   draw_this_price(prev_ticker[0])];
      for(let i = 1; i < prev_ticker.length; i++)
      {
        ctx.beginPath();
        if (canvas.className === "day") {
          ctx.strokeStyle = "orangered";
        } //night
        else {
          ctx.strokeStyle = "lime";
        }
        ctx.lineWidth = 3;
        ctx.moveTo(last_point[0], last_point[1]);
        ctx.lineTo(
          last_point[0] + TIME_SEGMENT, 
          draw_this_price(prev_ticker[i]));
        ctx.stroke();
        last_point = [
          last_point[0] + TIME_SEGMENT,
          draw_this_price(prev_ticker[i]),
        ];
      }
    } else 
    {
      render_axes();
    }
}


function draw_the_price(){
  let distance_from_max = ((last_price + START_OIL_TICKER / 2.0 - oil_ticker ) * 1.0 /(START_OIL_TICKER)) * WORKING_HEIGHT;
  return PRICE_AXIS_END + distance_from_max;
}

function draw_this_price(price)
{
  let distance_from_max =
    (((last_price + START_OIL_TICKER / 2.0 - price) * 1.0) /
      START_OIL_TICKER) *
    WORKING_HEIGHT;
  return PRICE_AXIS_END + distance_from_max;
}

let game_container = document.createElement("div");
game_container.className = "game-container";
de_container.appendChild(game_container);

let canvas_container = document.createElement("div");
canvas_container.className = "canvas-container";
game_container.appendChild(canvas_container);

let canvas = document.createElement("canvas");
canvas.setAttribute("width", MY_WIDTH);
canvas.setAttribute("height", MY_HEIGHT);
canvas.className = "day";
let ctx=canvas.getContext("2d");
render_axes();
canvas_container.appendChild(canvas);
  

function render_axes()
{
  ctx.clearRect(0, 0, MY_WIDTH, MY_HEIGHT);
  ctx.beginPath();
  ctx.lineWidth = 3;
  if(canvas.className === "day")
  {
    ctx.strokeStyle = "black";
  } else //night
  {
    ctx.strokeStyle = "white";
  }
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_END, PRICE_AXIS_START);
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_START, PRICE_AXIS_END);
  ctx.stroke();
  //render axis labels
  MAX_PRICE = oil_ticker + (START_OIL_TICKER/2.0);
  MIN_PRICE = oil_ticker - (START_OIL_TICKER/2.0);
  ctx.font="24px Tahoma";
  if (canvas.className === "day") {
    ctx.fillStyle = "black";
  } //night
  else {
    ctx.fillStyle = "white";
  }
  ctx.fillText(MAX_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_END);
  ctx.fillText(MIN_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_START);
  ctx.fillText("Price", TURN_AXIS_START - 70, (PRICE_AXIS_END + PRICE_AXIS_START) / 2)
  //reset last_point
  last_point = [TURN_AXIS_START, draw_the_price()];
  //
}

function render_these_axes(price) {
  ctx.clearRect(0, 0, MY_WIDTH, MY_HEIGHT);
  ctx.beginPath();
  ctx.lineWidth = 3;
  if (canvas.className === "day") {
    ctx.strokeStyle = "black";
  } //night
  else {
    ctx.strokeStyle = "white";
  }
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_END, PRICE_AXIS_START);
  ctx.moveTo(TURN_AXIS_START, PRICE_AXIS_START);
  ctx.lineTo(TURN_AXIS_START, PRICE_AXIS_END);
  ctx.stroke();
  //render axis labels
  MAX_PRICE = price + START_OIL_TICKER / 2.0;
  MIN_PRICE = price - START_OIL_TICKER / 2.0;
  ctx.font = "24px Tahoma";
  if (canvas.className === "day") {
    ctx.fillStyle = "black";
  } //night
  else {
    ctx.fillStyle = "white";
  }
  ctx.fillText(MAX_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_END);
  ctx.fillText(MIN_PRICE, TURN_AXIS_START - 50, PRICE_AXIS_START);
  ctx.fillText(
    "Price",
    TURN_AXIS_START - 70,
    (PRICE_AXIS_END + PRICE_AXIS_START) / 2
  );
  //reset last_point
  last_point = [TURN_AXIS_START, draw_this_price(price)];
  //
}


function render_tick(){
  ctx.beginPath();
    if (canvas.className === "day") {
      ctx.strokeStyle = "orangered";
    } //night
    else {
      ctx.strokeStyle = "lime";
    }
  ctx.lineWidth = 3;
  ctx.moveTo(last_point[0], last_point[1]);
  ctx.lineTo(last_point[0] + TIME_SEGMENT, draw_the_price());
  ctx.stroke();
  last_point =  [last_point[0] + TIME_SEGMENT, draw_the_price()];
}

let data_container = document.createElement("div");
data_container.className = "data-container";
game_container.appendChild(data_container);

let info_container = document.createElement("div");
info_container.className = "info-container";
data_container.appendChild(info_container);

let info_el = document.createElement("p");
info_el.className = "day";
info_el.innerHTML = "Welcome to StockTrader!<br /> Press START GAME to begin.";
info_container.appendChild(info_el);

let trader_container = document.createElement("div");
trader_container.className = "trader-container";
data_container.appendChild(trader_container);

let net_worth_container = document.createElement("div");
net_worth_container.className = "net-worth-container";
trader_container.appendChild(net_worth_container);

let portfolio_el = document.createElement("p");
portfolio_el.className = "day";
net_worth_container.appendChild(portfolio_el);

let net_worth_arrow = document.createElement("p");
net_worth_arrow.className = "stock-arrow positive";
net_worth_arrow.innerHTML = "";
net_worth_container.appendChild(net_worth_arrow);

initialize();

updatePValue();


let position_el = document.createElement("p");
position_el.className = "day";
updatePosition();
trader_container.appendChild(position_el);

let btn_plus = document.createElement("BUTTON");
btn_plus.innerHTML = "LONG 100";
btn_plus.className = "day";
trader_container.appendChild(btn_plus);

let btn_minus = document.createElement("BUTTON");
btn_minus.innerHTML = "SHORT 100";
btn_minus.className = "day";
trader_container.appendChild(btn_minus);

let price_container = document.createElement("div");
price_container.className = "price-container";
data_container.appendChild(price_container);

let ticker_div = document.createElement("div");
ticker_div.className = "ticker-div";
price_container.appendChild(ticker_div);

let oil_el = document.createElement("p");
oil_el.className = "day";
ticker_div.appendChild(oil_el);

let arrow_el = document.createElement("p");
arrow_el.className = "stock-arrow positive";
arrow_el.innerHTML = "";
ticker_div.appendChild(arrow_el);

updateOilPrice();

let last_price_el = document.createElement("p");
last_price_el.className = "day";
updateLastPrice();
price_container.appendChild(last_price_el);

let instructional_container = document.createElement("div");
instructional_container.className = "instructional-container";
data_container.appendChild(instructional_container);

let turns_el = document.createElement("p");
turns_el.className = "day";
updateTurnsLeft();
instructional_container.appendChild(turns_el);

function show_how_to_play() {
  let text_string =
    "How to play: <br /><br />\
  Choose a LONG or SHORT investment position during the investment phase, \
  and watch your portfolio's value rise and fall during the trading phase. <br /><br />\
  Double your starting investment of $10,000 within 10 turns, but don't run out of money \
  or the game is over!";
  instructional_text.innerHTML = text_string;
}

function show_stock_terminology() {
  let text_string =
    " Investing terminology:<br /><br />\
      \
      LONG 100: Gain $100 for each $1 increase in the stock price. \
      Lose $100 for each $1 decrease in the stock price.<br /><br />\
      SHORT 100: Lose $100 for each $1 increase in the stock price. \
      Gain $100 for each $1 decrease in the stock price.<br /><br /> \
      Click the LONG button repeatedly to increase your position on a rise in price, or \
      to hedge your SHORT position on a fall in price.<br /><br />\
      Click the SHORT button repeatedly to increase your position on a fall in price, or \
      to hedge your LONG position on a rise in price.";
  instructional_text.innerHTML = text_string;
}

let instructional_btns_container = document.createElement("div");
instructional_btns_container.className = "instructional-btns";
instructional_container.appendChild(instructional_btns_container);

let how_to_play_btn = document.createElement("button");
how_to_play_btn.className = "day";
how_to_play_btn.innerHTML = "How to play?";
how_to_play_btn.addEventListener("click", show_how_to_play);
instructional_btns_container.appendChild(how_to_play_btn);

let stock_terminology_btn = document.createElement("button");
stock_terminology_btn.className = "day";
stock_terminology_btn.innerHTML = "LONG 100???";
stock_terminology_btn.addEventListener("click", show_stock_terminology);
instructional_btns_container.appendChild(stock_terminology_btn);

let instructional_text = document.createElement("p");
instructional_text.className = "day";
show_how_to_play();
instructional_container.appendChild(instructional_text);

function initialize() {
  p_value = INITIAL_PORTFOLIO;
  oil_ticker = START_OIL_TICKER;
  last_net_worth = p_value;
  last_price = oil_ticker;
  ipos = 0;
  turns_left = 10;
  last_point = [TURN_AXIS_START, draw_the_price()];
  game_over_display_container.style.display = "none";
  flag_game_over = false;
  prev_ticker = [];
  re_render();
}

let about_container = document.createElement("div");
about_container.className = "about-container";
de_container.appendChild(about_container);

let copyright_section = document.createElement("span");
copyright_section.className = "day";
copyright_section.innerHTML = "© Daniel Ackroyd-Isales 2020";
about_container.appendChild(copyright_section);

let linked_in_link = document.createElement("a");
linked_in_link.className = "day";
linked_in_link.href = "https://www.linkedin.com/in/daniel-ackroyd-isales/";
linked_in_link.target = "_blank";
linked_in_link.innerHTML = "LinkedIn";
about_container.appendChild(linked_in_link);

let github_link = document.createElement("a");
github_link.className = "day";
github_link.href = "https://github.com/dackroydisales/";
github_link.target = "_blank";
github_link.innerHTML = "Github";
about_container.appendChild(github_link);

let st_link = document.createElement("a");
st_link.className = "day";
st_link.href = "https://github.com/dackroydisales/stocktrader";
st_link.target = "_blank";
st_link.innerHTML = "StockTrader Repo";
about_container.appendChild(st_link);