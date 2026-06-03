# 🧠 NoirWave JavaScript Cheatsheet (Explained for Beginners)

## 🔹 VARIABLES — Storing Data
```js
const clock = document.getElementById("clockCanvas");
```
**const** → fixed value, cannot be reassigned.  
Used for things that won’t change (like DOM elements, canvas references).

```js
let currentTheme = "dark";
```
**let** → can be changed later.  
Used for values that update (like user settings, time, etc.).

```js
var oldVariable = "deprecated";
```
**var** → older JavaScript syntax (avoid in modern code).

---

## 🔹 DATA TYPES
| Type | Example | Description |
|------|----------|-------------|
| String | "Hello" | Text |
| Number | 25 | Numbers |
| Boolean | true / false | On / Off |
| Array | ["Sun", "Mon", "Tue"] | List of values |
| Object | {name: "Sunny", age: 23} | Group of key-value pairs |

---

## 🔹 DOM SELECTION — Finding HTML Elements
```js
document.getElementById("clockCanvas");
```
Finds element by its **id**.

```js
document.querySelector(".clock-widget");
```
Finds **first** element matching a CSS selector.

```js
document.querySelectorAll(".app-icon");
```
Finds **all** elements matching a selector (returns a list).

---

## 🔹 CHANGING ELEMENT CONTENT
```js
element.textContent = "25°C";
```
Changes the text inside an element.

```js
element.innerHTML = "<b>Sunny</b>";
```
Inserts HTML code inside an element.

---

## 🔹 MODIFYING CLASSES
```js
element.classList.add("hidden");
element.classList.remove("hidden");
element.classList.toggle("active");
```
Used for showing, hiding, or toggling styles.

---

## 🔹 EVENTS — Making Things Interactive
```js
button.addEventListener("click", changeTheme);
```
Runs `changeTheme` when the button is clicked.

```js
element.addEventListener("mouseover", () => {
  element.style.color = "blue";
});
```
Runs code when hovering over an element.

---

## 🔹 FUNCTIONS — Reusable Code Blocks
```js
function drawClock() {
  // code that draws clock
}
drawClock();
```

### Arrow Function (shorter version)
```js
const updateTime = () => {
  console.log("Tick...");
};
```

---

## 🔹 CONDITIONALS — If / Else Logic
```js
if (theme === "dark") {
  enableDarkMode();
} else {
  enableLightMode();
}
```

---

## 🔹 LOOPS — Repeating Code
```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

---

## 🔹 TIMERS — Running Repeatedly
```js
setInterval(drawClock, 1000);
setTimeout(showPopup, 2000);
```
`setInterval` runs repeatedly; `setTimeout` runs once after a delay.

---

## 🔹 CANVAS — Used in Analog Clock
```js
const ctx = clockCanvas.getContext("2d");
ctx.beginPath();
ctx.arc(100, 100, 50, 0, 2 * Math.PI);
ctx.stroke();
```

---

## 🔹 STORAGE — Remembering User Settings
```js
localStorage.setItem("clockStyle", "digitalRetro");
const saved = localStorage.getItem("clockStyle");
```

---

## 🔹 THEMES — Changing Appearance Dynamically
```js
document.body.classList.toggle("dark-mode");
```

---

## 🔹 COMMON CONSOLE TOOLS
```js
console.log("Debug info");
console.error("Something went wrong!");
```

---

## 🔹 COMMENTS
```js
// Single line comment
/* Multi-line comment */
```

---

## 🧭 QUICK SUMMARY
| Keyword | Meaning | Example |
|----------|----------|----------|
| const | fixed | const clock = … |
| let | changeable | let style = "digital" |
| function | define code block | function drawClock(){} |
| => | short function | () => {} |
| if / else | conditional | check states |
| addEventListener | respond to events | click, hover, etc. |
| localStorage | remember data | save settings |
| setInterval | repeat | every second |
