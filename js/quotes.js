// ========== QUOTES WIDGET ==========

// List of static quotes
const quotes = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Make it simple, but significant.", author: "Don Draper" },
  { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  { text: "Stay close to anything that makes you glad you are alive.", author: "Hafez" },
  { text: "Dreams don’t work unless you do.", author: "John C. Maxwell" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
  { text: "Noir is not dark; it’s depth.", author: "NoirWave" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Style is a way to say who you are without speaking.", author: "Rachel Zoe" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteText").textContent = `"${quote.text}"`;
  document.getElementById("quoteAuthor").textContent = `– ${quote.author}`;
}

const quoteApp = document.getElementById("quotesApp");
const quotePopup = document.getElementById("quotePopup");
const closeQuotePopup = document.getElementById("closeQuotePopup");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

// Open popup on clicking Quotes icon — use the already defined 'quotes' array of objects
quoteApp.addEventListener("click", () => {
  const randomQuoteObj = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = `"${randomQuoteObj.text}"`;
  if (quoteAuthor) quoteAuthor.textContent = `– ${randomQuoteObj.author}`;
  quotePopup.classList.remove("hidden");
  window.showBlur(); // 👈 Turn blur ON
});

// Close popup
closeQuotePopup.addEventListener("click", () => {
  quotePopup.classList.add("hidden");
  window.hideBlur(); // 👈 Turn blur OFF
});
