document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const suggestionText = document.getElementById("suggestion").value.trim();
    const recommend = document.querySelector('input[name="recommend"]:checked');
    const visitDate = document.getElementById("visitDate").value;

    if (!name || !email) {
      alert("Please fill out all required fields.");
      return;
    }

    if (rating === 0) {
      alert("Please provide a star rating.");
      return;
    }

    if (!recommend) {
      alert("Please select if you would recommend us.");
      return;
    }

    // Show thank you message
    document.getElementById("thankYouMessage").style.display = "block";

    // Add new review to the review section
    addReview({
      name: name,
      feedback: suggestionText || "No suggestions provided.",
      stars: rating,
    });

    // Reset form and UI
    this.reset();
    updateStarDisplay(0);
    rating = 0;
    charCount.textContent = "0 / 300";
  });

function addReview({ name, feedback, stars }) {
  const container = document.querySelector(".box-container");

  // Create box div
  const box = document.createElement("div");
  box.classList.add("box");

  // Quote image
  const quoteImg = document.createElement("img");
  quoteImg.src = "images/quote-img.png";
  quoteImg.alt = "Quote";
  quoteImg.classList.add("quote");
  box.appendChild(quoteImg);

  // Feedback paragraph
  const p = document.createElement("p");
  p.textContent = feedback;
  box.appendChild(p);

  // User image (placeholder)
  const userImg = document.createElement("img");
  userImg.src = "images/pic-1.png"; // you can randomize or change this
  userImg.alt = name;
  userImg.classList.add("user");
  box.appendChild(userImg);

  // User name
  const h3 = document.createElement("h3");
  h3.textContent = name;
  box.appendChild(h3);

  // Stars container
  const starsDiv = document.createElement("div");
  starsDiv.classList.add("stars");

  // Add star icons according to rating
  for (let i = 1; i <= 5; i++) {
    const starIcon = document.createElement("i");
    starIcon.classList.add("fas", "fa-star");
    if (i > stars) {
      starIcon.style.color = "#555"; // unfilled star color
    } else {
      starIcon.style.color = "gold"; // filled star color
    }
    starsDiv.appendChild(starIcon);
  }

  box.appendChild(starsDiv);

  // Append the new review box
  container.appendChild(box);
}
