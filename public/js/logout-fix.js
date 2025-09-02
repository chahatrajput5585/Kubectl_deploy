// Enhanced logout functionality for AWS Kubernetes environment
// This file should be included in all pages that have logout functionality

function enhancedLogout(event) {
  if (event) {
    event.preventDefault();
  }

  console.log("🚪 Starting enhanced logout process...");

  // Step 1: Clear any client-side storage
  try {
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    console.log("✅ Client-side storage cleared");
  } catch (e) {
    console.warn("⚠️ Could not clear storage:", e);
  }

  // Step 2: Clear cookies via JavaScript (limited effectiveness but helps)
  try {
    const domain = window.location.hostname;
    const cookiesToClear = [
      `jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`,
      `jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain};`,
      `jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`,
      `jwt=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`,
    ];

    cookiesToClear.forEach((cookie) => {
      document.cookie = cookie;
    });
    console.log("✅ JavaScript cookie clearing attempted");
  } catch (e) {
    console.warn("⚠️ JavaScript cookie clearing failed:", e);
  }

  // Step 3: Make logout request to server
  fetch("/api/users/signout", {
    method: "GET",
    credentials: "include",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })
    .then((response) => {
      console.log("✅ Server logout completed");
      // Force page reload to clear any cached state
      window.location.href = "/";
      setTimeout(() => {
        window.location.reload(true);
      }, 100);
    })
    .catch((error) => {
      console.error("❌ Server logout failed:", error);
      // Even if server logout fails, force redirect
      window.location.href = "/";
      setTimeout(() => {
        window.location.reload(true);
      }, 100);
    });
}

// Alternative AJAX logout method
function ajaxLogout() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users/signout", true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("✅ AJAX logout successful");
        resolve();
      } else {
        console.warn("⚠️ AJAX logout failed with status:", xhr.status);
        resolve(); // Resolve anyway to continue with redirect
      }
    };

    xhr.onerror = function () {
      console.error("❌ AJAX logout error");
      resolve(); // Resolve anyway to continue with redirect
    };

    xhr.send();
  });
}

// Force logout with multiple strategies
async function forceLogout() {
  console.log("🔄 Starting force logout...");

  // Clear client-side data
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.warn("Storage clear failed:", e);
  }

  // Try multiple logout strategies
  try {
    await Promise.race([
      fetch("/api/users/signout", { method: "GET", credentials: "include" }),
      ajaxLogout(),
      new Promise((resolve) => setTimeout(resolve, 2000)), // Timeout after 2 seconds
    ]);
  } catch (e) {
    console.warn("All logout methods failed, forcing redirect");
  }

  // Force navigation
  window.location.replace("/");
}

// Enhanced logout event handler
function handleLogout(event) {
  if (event) {
    event.preventDefault();
  }

  // Show user feedback
  if (confirm("Are you sure you want to logout?")) {
    enhancedLogout(event);
  }
}

// Auto-bind logout links when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Only bind logout functionality if user is logged in
  const logoutLinks = document.querySelectorAll(
    'a[href*="signout"], a[href*="logout"]'
  );

  if (logoutLinks.length > 0) {
    logoutLinks.forEach((link) => {
      // Remove existing event listeners and add enhanced one
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener("click", handleLogout);
      console.log("✅ Enhanced logout bound to:", newLink.href);
    });

    // Add keyboard shortcut for logout (Ctrl+L) only if logged in
    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        const isLoggedIn = document.querySelector('a[href*="signout"]');
        if (isLoggedIn) {
          handleLogout();
        }
      }
    });
  }
});

// Export for global access
window.enhancedLogout = enhancedLogout;
window.forceLogout = forceLogout;
window.handleLogout = handleLogout;

console.log("🔧 Enhanced logout system loaded");
