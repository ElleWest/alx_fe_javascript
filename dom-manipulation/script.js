// Dynamic Quote Generator - Advanced DOM Manipulation, Web Storage, and JSON Handling
// Author: GitHub Copilot Assistant
// Project: ALX Frontend JavaScript - DOM Manipulation

// Global variables
let quotes = [];
let filteredQuotes = [];
let selectedCategory = "all";
let lastSyncTime = null;

// Initial quotes data
const initialQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "motivation",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    category: "innovation",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    category: "life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    category: "inspiration",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "success",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    category: "motivation",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    category: "opportunity",
  },
];

// DOM Elements
let quoteDisplay,
  newQuoteBtn,
  categoryFilter,
  lastSyncTimeElement,
  notification;

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  quoteDisplay = document.getElementById("quoteDisplay");
  newQuoteBtn = document.getElementById("newQuote");
  categoryFilter = document.getElementById("categoryFilter");
  lastSyncTimeElement = document.getElementById("lastSyncTime");
  notification = document.getElementById("notification");

  // Initialize the application
  initializeApp();

  // Add event listeners
  setupEventListeners();

  // Start periodic server sync (every 30 seconds)
  setInterval(syncQuotes, 30000);
});

/**
 * Initialize the application
 * Load quotes from localStorage or use initial quotes
 */
function initializeApp() {
  loadQuotes();
  populateCategories();
  restoreUserPreferences();
  displayRandomQuote();
  updateLastSyncTime();
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Add keyboard support
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.id === "newQuoteText") {
      addQuote();
    }
  });
}

/**
 * Task 0: Advanced DOM Manipulation - Display Random Quote
 * Creates dynamic content and manipulates DOM elements
 */
function showRandomQuote() {
  displayRandomQuote();
}

function displayRandomQuote() {
  if (filteredQuotes.length === 0) {
    displayNoQuotesMessage();
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // Clear existing content
  quoteDisplay.innerHTML = "";

  // Create quote elements dynamically
  const quoteContainer = document.createElement("div");

  const quoteText = document.createElement("div");
  quoteText.className = "quote-text";
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("div");
  quoteCategory.className = "quote-category";
  quoteCategory.textContent = `Category: ${quote.category}`;

  // Append elements to container
  quoteContainer.appendChild(quoteText);
  quoteContainer.appendChild(quoteCategory);

  // Add container to display area with animation
  quoteDisplay.appendChild(quoteContainer);

  // Add fade-in animation
  quoteContainer.style.opacity = "0";
  setTimeout(() => {
    quoteContainer.style.transition = "opacity 0.5s ease-in";
    quoteContainer.style.opacity = "1";
  }, 10);

  // Store last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

/**
 * Task 0: Advanced DOM Manipulation - Create Add Quote Form
 * Dynamically creates form elements for adding new quotes
 */
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");
  if (!formContainer) {
    const newFormContainer = document.createElement("div");
    newFormContainer.id = "addQuoteForm";
    newFormContainer.className = "form-section";

    const title = document.createElement("h3");
    title.textContent = "Add New Quote";

    const inputContainer = document.createElement("div");

    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";
    textInput.style.width = "300px";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";
    categoryInput.style.width = "200px";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.onclick = addQuote;

    inputContainer.appendChild(textInput);
    inputContainer.appendChild(categoryInput);
    inputContainer.appendChild(addButton);

    newFormContainer.appendChild(title);
    newFormContainer.appendChild(inputContainer);

    document.querySelector(".container").appendChild(newFormContainer);
  }
}

/**
 * Task 0 & 1: Add new quote with localStorage integration
 * Advanced DOM manipulation combined with web storage
 */
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory =
    document.getElementById("newQuoteCategory").value.trim() || "general";

  if (newQuoteText === "") {
    showNotification("Please enter a quote text.", "error");
    return;
  }

  // Create new quote object
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory.toLowerCase(),
    id: Date.now(), // Simple ID generation
    timestamp: new Date().toISOString(),
  };

  // Add to quotes array
  quotes.push(newQuote);

  // Save to localStorage
  saveQuotes();

  // Update categories and filter
  populateCategories();
  filterQuotes();

  // Clear form inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Show success message
  showNotification("Quote added successfully!", "success");

  // Optionally show the new quote
  if (selectedCategory === "all" || selectedCategory === newQuote.category) {
    // Find and display the new quote
    const quoteIndex = filteredQuotes.findIndex((q) => q.id === newQuote.id);
    if (quoteIndex !== -1) {
      displaySpecificQuote(quoteIndex);
    }
  }
}

/**
 * Task 1: Web Storage - Save quotes to localStorage
 */
function saveQuotes() {
  try {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    localStorage.setItem("lastModified", new Date().toISOString());
  } catch (error) {
    console.error("Error saving quotes to localStorage:", error);
    showNotification("Error saving quotes. Storage may be full.", "error");
  }
}

/**
 * Task 1: Web Storage - Load quotes from localStorage
 */
function loadQuotes() {
  try {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    } else {
      // First time loading - use initial quotes
      quotes = [...initialQuotes];
      saveQuotes();
    }
    filteredQuotes = [...quotes];
  } catch (error) {
    console.error("Error loading quotes from localStorage:", error);
    quotes = [...initialQuotes];
    filteredQuotes = [...quotes];
  }
}

/**
 * Task 1: JSON Export functionality
 */
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `quotes-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
    showNotification("Quotes exported successfully!", "success");
  } catch (error) {
    console.error("Error exporting quotes:", error);
    showNotification("Error exporting quotes.", "error");
  }
}

/**
 * Task 1: JSON Import functionality
 */
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      // Validate imported data
      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid file format. Expected an array of quotes.");
      }

      // Validate each quote object
      const validQuotes = importedQuotes.filter(
        (quote) =>
          quote &&
          typeof quote.text === "string" &&
          typeof quote.category === "string"
      );

      if (validQuotes.length === 0) {
        throw new Error("No valid quotes found in the imported file.");
      }

      // Add unique IDs and timestamps if missing
      validQuotes.forEach((quote) => {
        if (!quote.id) quote.id = Date.now() + Math.random();
        if (!quote.timestamp) quote.timestamp = new Date().toISOString();
      });

      // Add imported quotes to existing quotes
      quotes.push(...validQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();

      showNotification(
        `Successfully imported ${validQuotes.length} quotes!`,
        "success"
      );

      // Clear the file input
      event.target.value = "";
    } catch (error) {
      console.error("Error importing quotes:", error);
      showNotification(`Error importing quotes: ${error.message}`, "error");
    }
  };

  fileReader.onerror = function () {
    showNotification("Error reading file.", "error");
  };

  fileReader.readAsText(file);
}

/**
 * Task 2: Dynamic Content Filtering - Populate Categories
 */
function populateCategories() {
  const categories = [...new Set(quotes.map((quote) => quote.category))].sort();

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add category options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore selected category
  categoryFilter.value = selectedCategory;
}

/**
 * Task 2: Dynamic Content Filtering - Filter Quotes
 */
function filterQuotes() {
  selectedCategory = categoryFilter.value;

  if (selectedCategory === "all") {
    filteredQuotes = [...quotes];
  } else {
    filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  }

  // Save filter preference to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  // Update display
  if (filteredQuotes.length === 0) {
    displayNoQuotesMessage();
  } else {
    displayRandomQuote();
  }
}

/**
 * Task 2: Restore User Preferences from localStorage
 */
function restoreUserPreferences() {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    selectedCategory = savedCategory;
    categoryFilter.value = selectedCategory;
    filterQuotes();
  }

  // Restore last viewed quote from session storage
  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    try {
      const quote = JSON.parse(lastViewed);
      // You could display this as a "Continue where you left off" feature
    } catch (error) {
      console.log("Could not restore last viewed quote");
    }
  }
}

/**
 * Task 3: Server Sync Simulation
 */
async function syncQuotes() {
  try {
    showNotification("Syncing with server...", "info");

    // Simulate server fetch with JSONPlaceholder-like API
    const mockServerQuotes = await fetchQuotesFromServer();

    // Simple conflict resolution: merge server quotes with local quotes
    const mergedQuotes = mergeQuotes(quotes, mockServerQuotes);

    if (mergedQuotes.length !== quotes.length) {
      quotes = mergedQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();

      const newQuotesCount = mergedQuotes.length - quotes.length;
      if (newQuotesCount > 0) {
        showNotification(
          `Sync completed! Added ${newQuotesCount} new quotes from server.`,
          "success"
        );
      } else {
        showNotification("Sync completed! No new quotes from server.", "info");
      }
    } else {
      showNotification("Sync completed! Your quotes are up to date.", "info");
    }

    lastSyncTime = new Date();
    localStorage.setItem("lastSyncTime", lastSyncTime.toISOString());
    updateLastSyncTime();
  } catch (error) {
    console.error("Sync error:", error);
    showNotification("Sync failed. Please try again later.", "error");
  }
}

/**
 * Task 3: Simulate fetching quotes from server
 */
async function fetchQuotesFromServer() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock server quotes (simulating JSONPlaceholder-like response)
  const serverQuotes = [
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      category: "wisdom",
      id: "server_1",
      timestamp: "2024-01-01T00:00:00.000Z",
    },
    {
      text: "Your limitation—it's only your imagination.",
      category: "motivation",
      id: "server_2",
      timestamp: "2024-01-02T00:00:00.000Z",
    },
  ];

  return serverQuotes;
}

/**
 * Task 3: Merge local and server quotes with conflict resolution
 */
function mergeQuotes(localQuotes, serverQuotes) {
  const merged = [...localQuotes];

  serverQuotes.forEach((serverQuote) => {
    // Check if quote already exists (by ID or text)
    const existingIndex = merged.findIndex(
      (quote) => quote.id === serverQuote.id || quote.text === serverQuote.text
    );

    if (existingIndex >= 0) {
      // Conflict resolution: server takes precedence for existing quotes
      const existing = merged[existingIndex];
      if (new Date(serverQuote.timestamp) > new Date(existing.timestamp)) {
        merged[existingIndex] = { ...serverQuote, resolved: true };
      }
    } else {
      // Add new quote from server
      merged.push({ ...serverQuote, fromServer: true });
    }
  });

  return merged;
}

/**
 * Utility Functions
 */

function displayNoQuotesMessage() {
  quoteDisplay.innerHTML = `
    <div style="text-align: center; color: #666; font-style: italic;">
      No quotes available for the selected category. Try adding some quotes or selecting a different category.
    </div>
  `;
}

function displaySpecificQuote(index) {
  if (index >= 0 && index < filteredQuotes.length) {
    const quote = filteredQuotes[index];

    quoteDisplay.innerHTML = "";

    const quoteContainer = document.createElement("div");

    const quoteText = document.createElement("div");
    quoteText.className = "quote-text";
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("div");
    quoteCategory.className = "quote-category";
    quoteCategory.textContent = `Category: ${quote.category}`;

    // Add indicators for server quotes
    if (quote.fromServer) {
      const serverIndicator = document.createElement("div");
      serverIndicator.style.fontSize = "12px";
      serverIndicator.style.color = "#28a745";
      serverIndicator.textContent = "✓ From Server";
      quoteContainer.appendChild(serverIndicator);
    }

    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
    quoteDisplay.appendChild(quoteContainer);
  }
}

function showNotification(message, type = "info") {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";

  // Auto-hide notification after 3 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function updateLastSyncTime() {
  const savedSyncTime = localStorage.getItem("lastSyncTime");
  if (savedSyncTime) {
    const syncTime = new Date(savedSyncTime);
    lastSyncTimeElement.textContent = `Last sync: ${syncTime.toLocaleString()}`;
  }
}

/**
 * Additional utility functions for enhanced functionality
 */

// Export specific category
function exportCategoryToJson(category) {
  const categoryQuotes = quotes.filter((quote) => quote.category === category);
  const dataStr = JSON.stringify(categoryQuotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `quotes-${category}-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);
}

// Search quotes by text
function searchQuotes(searchTerm) {
  if (!searchTerm.trim()) {
    filterQuotes();
    return;
  }

  const term = searchTerm.toLowerCase();
  filteredQuotes = quotes.filter(
    (quote) =>
      quote.text.toLowerCase().includes(term) ||
      quote.category.toLowerCase().includes(term)
  );

  if (filteredQuotes.length === 0) {
    displayNoQuotesMessage();
  } else {
    displayRandomQuote();
  }
}

// Clear all quotes (with confirmation)
function clearAllQuotes() {
  if (
    confirm(
      "Are you sure you want to clear all quotes? This action cannot be undone."
    )
  ) {
    quotes = [];
    filteredQuotes = [];
    saveQuotes();
    populateCategories();
    displayNoQuotesMessage();
    showNotification("All quotes cleared.", "info");
  }
}

// Get quote statistics
function getQuoteStats() {
  const stats = {
    total: quotes.length,
    categories: [...new Set(quotes.map((quote) => quote.category))].length,
    averageLength:
      quotes.reduce((sum, quote) => sum + quote.text.length, 0) /
        quotes.length || 0,
  };
  return stats;
}

console.log("Dynamic Quote Generator loaded successfully!");
console.log(
  "Features: Advanced DOM Manipulation, Web Storage, JSON Handling, Server Sync"
);
