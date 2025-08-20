// Enhanced Collapsible with smooth animations
const coll = document.getElementsByClassName("collapsible");
const chatContainer = document.querySelector('.chat-bar-collapsible');

for (const element of coll) {
  element.addEventListener("click", function () {
    this.classList.toggle("active");
    chatContainer.classList.toggle("active");
    let content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      setTimeout(() => {
        content.style.opacity = "0";
      }, 200);
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      setTimeout(() => {
        content.style.opacity = "1";
      }, 100);
    }
  });
}

function getTime() {
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  return hours + ":" + minutes;
}

// Enhanced First Bot Message with Quick Replies
function firstBotMessage() {
  let firstMessage =
    "Welcome to Cafe Caffeine! ☕✨<br/>" +
    "I'm your virtual assistant and I'm here to help you with:";

  // Add typing simulation for first message
  setTimeout(() => {
    typeMessage("botStarterMessage", firstMessage, () => {
      // Add quick reply buttons after message is typed
      addQuickReplies();
    });
    $("#chat-timestamp").append(getTime());
  }, 500);
}

// Add Quick Reply Buttons
function addQuickReplies() {
  const quickReplies = [
    { text: "📋 View Menu", value: "menu" },
    { text: "ℹ️ About Us", value: "about" },
    { text: "📞 Contact", value: "contact" },
    { text: "📍 Location", value: "location" },
    { text: "🛒 How to Order", value: "how to order" }
  ];

  const quickRepliesDiv = document.createElement('div');
  quickRepliesDiv.className = 'quick-replies';
  
  quickReplies.forEach((reply, index) => {
    const button = document.createElement('button');
    button.className = 'quick-reply-btn';
    button.textContent = reply.text;
    button.style.animationDelay = `${index * 0.1}s`;
    
    button.onclick = () => {
      handleQuickReply(reply.value, reply.text);
      quickRepliesDiv.remove();
    };
    
    quickRepliesDiv.appendChild(button);
  });

  document.getElementById("chatbox").appendChild(quickRepliesDiv);
  scrollToBottom();
}

// Handle Quick Reply Selection
function handleQuickReply(value, displayText) {
  // Show user message
  let userHtml = '<p class="userText"><span>' + displayText + "</span></p>";
  $("#chatbox").append(userHtml);
  scrollToBottom();
  
  // Show typing indicator and then bot response
  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      getHardResponse(value);
    }, 1500);
  }, 500);
}

firstBotMessage();

/* -------------------------------
   ENHANCED BOT RESPONSE LOGIC
-------------------------------- */
function getBotResponse(input) {
  input = input.toLowerCase();

  if (input.includes("menu")) {
    return {
      message: "🍽️ Here's our delicious menu:<br/><br/>" +
               "☕ **Beverages:**<br/>" +
               "• Coffee (₹15-85) ☕<br/>" +
               "• Tea varieties (₹45+) 🍃<br/><br/>" +
               "🍪 **Snacks:**<br/>" +
               "• Fresh Cookies (₹15.99) 🍪<br/>" +
               "• Dosa (₹15.99) 🥞<br/>" +
               "• Paratha (₹15.99) 🫓<br/><br/>" +
               "🍚 **Main Course:**<br/>" +
               "• Fried Rice (₹45.99) 🍚<br/><br/>" +
               "Visit our <a href='/menu' style='color: #667eea; font-weight: bold;'>menu page</a> for complete details!",
      showQuickReplies: true,
      replies: [
        { text: "🛒 How to Order", value: "how to order" },
        { text: "📞 Contact", value: "contact" },
        { text: "📍 Location", value: "location" }
      ]
    };
  } else if (input.includes("about")) {
    return {
      message: "🏪 **About Cafe Caffeine**<br/><br/>" +
               "We are a passionate family-owned cafeteria that has been serving the community since 1999! ❤️<br/><br/>" +
               "✨ **Our Mission:**<br/>" +
               "To provide fresh, healthy, and delicious food in a warm and welcoming environment.<br/><br/>" +
               "🌟 **Why Choose Us:**<br/>" +
               "• Fresh ingredients daily 🥬<br/>" +
               "• Home-style cooking 👨‍🍳<br/>" +
               "• Affordable prices 💰<br/>" +
               "• Friendly service 😊",
      showQuickReplies: true,
      replies: [
        { text: "📋 View Menu", value: "menu" },
        { text: "📞 Contact Us", value: "contact" },
        { text: "📍 Find Us", value: "location" }
      ]
    };
  } else if (input.includes("contact")) {
    return {
      message: "📞 **Get In Touch**<br/><br/>" +
               "**Phone:** +91 98765 43210 📱<br/>" +
               "**Email:** info@cafecaffeine.com 📧<br/>" +
               "**Hours:** Mon-Sun, 7:00 AM - 10:00 PM 🕐<br/><br/>" +
               "💬 You can also reach us through our <a href='/feedback' style='color: #667eea; font-weight: bold;'>feedback page</a>!",
      showQuickReplies: true,
      replies: [
        { text: "📍 Location", value: "location" },
        { text: "📋 Menu", value: "menu" },
        { text: "ℹ️ About", value: "about" }
      ]
    };
  } else if (input.includes("location")) {
    return {
      message: "📍 **Find Us Here**<br/><br/>" +
               "**Address:** MG Road, New Delhi, India 🏢<br/><br/>" +
               "🚗 **Getting Here:**<br/>" +
               "• Metro: Nearest station is Central Secretariat 🚇<br/>" +
               "• Bus: Route 101, 205, 501 🚌<br/>" +
               "• Parking: Available on-site 🅿️<br/><br/>" +
               "Check our <a href='/#contact' style='color: #667eea; font-weight: bold;'>interactive map</a> for directions!",
      showQuickReplies: true,
      replies: [
        { text: "📞 Contact", value: "contact" },
        { text: "🛒 How to Order", value: "how to order" },
        { text: "📋 Menu", value: "menu" }
      ]
    };
  } else if (input.includes("how to order") || input.includes("order")) {
    return {
      message: "🛒 **Easy Ordering Process**<br/><br/>" +
               "**Step 1:** Browse our <a href='/menu' style='color: #667eea; font-weight: bold;'>menu</a> 📋<br/>" +
               "**Step 2:** Visit us in-person or call us 📞<br/>" +
               "**Step 3:** Place your order with our staff 👨‍🍳<br/>" +
               "**Step 4:** Enjoy your fresh meal! ✅<br/><br/>" +
               "⏰ **Order Timings:**<br/>" +
               "• Breakfast: 7:00 AM - 11:00 AM 🌅<br/>" +
               "• Lunch & Dinner: 11:00 AM - 10:00 PM 🌙<br/><br/>" +
               "💡 **Pro Tip:** Call ahead during peak hours to avoid waiting!",
      showQuickReplies: true,
      replies: [
        { text: "📋 View Menu", value: "menu" },
        { text: "📞 Call Us", value: "contact" },
        { text: "📍 Visit Us", value: "location" }
      ]
    };
  } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
    const greetings = [
      "Hello there! 👋 Welcome to Cafe Caffeine! How can I brighten your day?",
      "Hi! 😊 Great to see you! What would you like to know about our cafe?",
      "Hey! ☕ Ready for some delicious food and drinks? How can I help?",
      "Hello! 🌟 Welcome to our digital cafe! What can I assist you with today?"
    ];
    return {
      message: greetings[Math.floor(Math.random() * greetings.length)],
      showQuickReplies: true,
      replies: [
        { text: "📋 Menu", value: "menu" },
        { text: "ℹ️ About", value: "about" },
        { text: "📞 Contact", value: "contact" },
        { text: "📍 Location", value: "location" }
      ]
    };
  } else if (input.includes("thanks") || input.includes("thank you")) {
    const thankResponses = [
      "You're very welcome! 😊 Is there anything else I can help you with?",
      "My pleasure! ❤️ Feel free to ask me anything else!",
      "Glad I could help! ✨ What else would you like to know?",
      "You're welcome! 🌟 Always here to help!"
    ];
    return {
      message: thankResponses[Math.floor(Math.random() * thankResponses.length)],
      showQuickReplies: true,
      replies: [
        { text: "📋 Menu", value: "menu" },
        { text: "📞 Contact", value: "contact" },
        { text: "🛒 Order Info", value: "how to order" }
      ]
    };
  } else if (input.includes("bye") || input.includes("goodbye")) {
    return {
      message: "Goodbye! 👋 Thanks for visiting Cafe Caffeine! We hope to see you soon! ☕✨<br/>Don't forget to try our special coffee! 😊",
      showQuickReplies: false
    };
  } else {
    return {
      message: "Hmm, I didn't quite catch that! 😅<br/><br/>" +
               "I can help you with:<br/>" +
               "🔹 Our menu and food items<br/>" +
               "🔹 Restaurant information<br/>" +
               "🔹 Contact details and location<br/>" +
               "🔹 How to place orders<br/><br/>" +
               "Try clicking one of the buttons below! 👇",
      showQuickReplies: true,
      replies: [
        { text: "📋 Menu", value: "menu" },
        { text: "ℹ️ About", value: "about" },
        { text: "📞 Contact", value: "contact" },
        { text: "📍 Location", value: "location" }
      ]
    };
  }
}

/* -------------------------------
   TYPING SIMULATION & ANIMATIONS
-------------------------------- */
let typingSpeed = 30; // milliseconds per character
let currentTypingTimeout;

// Type message with realistic typing effect
function typeMessage(elementId, message, callback) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let index = 0;
  let displayText = "";
  
  function typeChar() {
    if (index < message.length) {
      // Handle HTML tags without typing them character by character
      if (message[index] === '<') {
        let tagEnd = message.indexOf('>', index);
        if (tagEnd !== -1) {
          displayText += message.substring(index, tagEnd + 1);
          index = tagEnd + 1;
        } else {
          displayText += message[index];
          index++;
        }
      } else {
        displayText += message[index];
        index++;
      }
      
      element.innerHTML = '<p class="botText"><span>' + displayText + '<span class="typing-cursor">|</span></span></p>';
      
      // Vary typing speed for more realistic effect
      let delay = typingSpeed + Math.random() * 20;
      if (message[index - 1] === '.' || message[index - 1] === '!' || message[index - 1] === '?') {
        delay += 300; // Pause after sentences
      }
      
      currentTypingTimeout = setTimeout(typeChar, delay);
    } else {
      // Remove typing cursor when done
      element.innerHTML = '<p class="botText"><span>' + displayText + '</span></p>';
      if (callback) callback();
    }
  }
  
  typeChar();
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  
  document.getElementById("chatbox").appendChild(typingDiv);
  scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Enhanced scroll to bottom
function scrollToBottom() {
  const chatContainer = document.querySelector('.chat-container');
  const chatBottom = document.getElementById("chat-bar-bottom");
  
  if (chatBottom) {
    chatBottom.scrollIntoView({ behavior: 'smooth', block: 'end' });
  } else if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Enhanced bot response with typing simulation and quick replies
function getHardResponse(userText) {
  const response = getBotResponse(userText);
  
  // Create temporary element for typing
  const tempId = 'temp-bot-message-' + Date.now();
  const tempDiv = document.createElement('div');
  tempDiv.id = tempId;
  document.getElementById("chatbox").appendChild(tempDiv);
  
  // Type the message
  typeMessage(tempId, typeof response === 'string' ? response : response.message, () => {
    // Add quick replies if needed
    if (typeof response === 'object' && response.showQuickReplies && response.replies) {
      addQuickRepliesFromResponse(response.replies);
    }
    scrollToBottom();
  });
}

// Add quick replies from bot response
function addQuickRepliesFromResponse(replies) {
  const quickRepliesDiv = document.createElement('div');
  quickRepliesDiv.className = 'quick-replies';
  
  replies.forEach((reply, index) => {
    const button = document.createElement('button');
    button.className = 'quick-reply-btn';
    button.textContent = reply.text;
    button.style.animationDelay = `${index * 0.1}s`;
    
    button.onclick = () => {
      handleQuickReply(reply.value, reply.text);
      // Remove all quick reply buttons
      document.querySelectorAll('.quick-replies').forEach(el => el.remove());
    };
    
    quickRepliesDiv.appendChild(button);
  });

  document.getElementById("chatbox").appendChild(quickRepliesDiv);
  scrollToBottom();
}

// Enhanced response handling
function getResponse() {
  let userText = $("#textInput").val().trim();

  if (userText === "") return;

  // Clear input and disable while processing
  $("#textInput").val("").prop('disabled', true);
  
  // Remove existing quick replies
  document.querySelectorAll('.quick-replies').forEach(el => el.remove());
  
  // Add user message
  let userHtml = '<p class="userText"><span>' + escapeHtml(userText) + "</span></p>";
  $("#chatbox").append(userHtml);
  scrollToBottom();

  // Show typing indicator and then bot response
  setTimeout(() => {
    showTypingIndicator();
    
    // Simulate thinking time based on message length
    const thinkingTime = Math.max(1000, Math.min(3000, userText.length * 50));
    
    setTimeout(() => {
      hideTypingIndicator();
      getHardResponse(userText);
      
      // Re-enable input
      setTimeout(() => {
        $("#textInput").prop('disabled', false).focus();
      }, 500);
    }, thinkingTime);
  }, 300);
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Enhanced send button with loading state
function sendButton() {
  const sendIcon = document.getElementById('send-icon');
  const inputBox = document.getElementById('textInput');
  
  if (inputBox.disabled) return; // Prevent multiple sends
  
  // Add loading animation
  sendIcon.className = 'fa fa-fw fa-spinner fa-spin';
  
  setTimeout(() => {
    sendIcon.className = 'fa fa-fw fa-paper-plane';
  }, 1000);
  
  getResponse();
}

// Enhanced enter key listener
$("#textInput").keypress(function (e) {
  if (e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    sendButton();
  }
});

// Auto-focus input when chat opens
$(document).on('click', '.collapsible', function() {
  if ($(this).hasClass('active')) {
    setTimeout(() => {
      $('#textInput').focus();
    }, 400);
  }
});

// Add some CSS for typing cursor
if (!document.getElementById('typing-cursor-style')) {
  const style = document.createElement('style');
  style.id = 'typing-cursor-style';
  style.textContent = `
    .typing-cursor {
      animation: blink 1s infinite;
      font-weight: bold;
      color: var(--primary-color, #667eea);
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
