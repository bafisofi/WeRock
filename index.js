// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  get,
  off,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://we-rock-6bdd3-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");
const endorsementGallery = document.getElementById("endorsement-gallery");
const btnToggleMode = document.getElementById("btn-toggle-mode");
const textEndorsement = document.getElementById("text-endorsement");
const inputFrom = document.getElementById("input-from");
const inputTo = document.getElementById("input-to");
const container = document.getElementById("container");

let lightMode = true;

function loadImage() {
  let img = new Image();
  let img2 = new Image();
  img.src =
    "https://github.com/bafisofi/WeRock/blob/main/assets/img-rock-dark-mode.png";
  img2.src = "assets/img-rock-dark-mode.png";
  console.log(img, img2);
}

loadImage();

window.addEventListener("load", function () {
  const endorsementsRef = ref(database, "endorsements");
  get(endorsementsRef).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childRef = childSnapshot.ref;
      update(childRef, { isLiked: false });
    });
  });
});

container.addEventListener("click", function (e) {
  console.log(e.target.id);
  if (e.target.dataset.like) {
    handleClick(e.target.dataset.like);
  } else if (
    e.target.id === "btn-toggle-mode" ||
    e.target.id === "icon-toggle-mode"
  ) {
    e.preventDefault();
    toggleMode();
  } else if (e.target.id === "btn-publish") {
    saveEndorsementsInDB();
    updateModeGallery();
    clearFields();
  }
});

function updateModeGallery() {
  const cards = endorsementGallery.children;
  const typeEndorsementMode = lightMode
    ? "endorsement-light-mode"
    : "endorsement-dark-mode";
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.classList.remove("endorsement-dark-mode");
    card.classList.add(typeEndorsementMode);
  }
}
function handleClick(endorsementID) {
  const endorsementLocation = ref(database, `endorsements/${endorsementID}`);
  const iconLikes = document.getElementById("icon-likes");

  console.log(iconLikes);

  get(endorsementLocation).then((snapshot) => {
    endorsementGallery.innerHTML = "";
    if (snapshot.exists()) {
      const endorsementData = snapshot.val();

      if (!endorsementData.isLiked) {
        const newLikes = endorsementData.likes + 1;
        const newIsliked = true;

        update(endorsementLocation, { likes: newLikes, isLiked: newIsliked });
      } else {
        const newLikes = endorsementData.likes - 1;
        const newIsliked = false;
        iconLikes.classList.remove("liked");
        update(endorsementLocation, { likes: newLikes, isLiked: newIsliked });
      }
    }

    updateModeGallery();
  });
}

function clearFields() {
  inputFrom.value = "";
  inputTo.value = "";
  textEndorsement.value = "";
}

function toggleMode() {
  const mode = document.body;
  const imgRock = document.getElementById("img-rock");
  const iconToggleMode = document.getElementById("icon-toggle-mode");
  const endorsementGallery = document.getElementById("endorsement-gallery");
  const cards = Array.from(endorsementGallery.children);

  cards.forEach((card) => {
    card.classList.toggle("endorsement-dark-mode");
  });

  btnToggleMode.classList.toggle("btn-dark-mode");
  mode.classList.toggle("dark-mode");
  inputFrom.classList.toggle("dark-gray-mode");
  inputTo.classList.toggle("dark-gray-mode");
  textEndorsement.classList.toggle("dark-gray-mode");

  if (imgRock.getAttribute("src") === "/assets/img-rock-409747ac.png") {
    console.log("paso");
    imgRock.setAttribute(
      // "src",
      // "https://we-super-rock.netlify.app/assets/img-rock-dark-mode-ddadb43c.png"
      "src",
      "assets/img-rock-dark-mode.png"
    );
  } else {
    imgRock.setAttribute("src", "/assets/img-rock-409747ac.png");
  }

  if (iconToggleMode.classList.contains("fa-moon")) {
    iconToggleMode.classList.remove("fa-moon");
    iconToggleMode.classList.add("fa-sun");
    iconToggleMode.style.color = "#F2C744";

    lightMode = false;
  } else {
    iconToggleMode.classList.remove("fa-sun");
    iconToggleMode.classList.add("fa-moon");
    iconToggleMode.style.color = "#4B1C50";
    lightMode = true;
  }
}

function saveEndorsementsInDB() {
  const objEndorsement = {
    from: inputTo.value,
    to: inputFrom.value,
    endorsement: textEndorsement.value,
    likes: 0,
    isLiked: false,
  };
  if (
    objEndorsement.from.trim() !== "" ||
    objEndorsement.to.trim() !== "" ||
    objEndorsement.endorsement.trim() !== ""
  ) {
    push(endorsementsInDB, objEndorsement);
  }
}
function appendItemEndorsements(
  currentItemID,
  currentItemFromValue,
  currentItemToValue,
  currentItemEndorsementValue,
  currentItemLikesValue,
  currentItemisLikedValue
) {
  let likeIcon = "";

  if (currentItemisLikedValue) {
    likeIcon = "liked";
  }

  let endorsementCard = document.createElement("div");
  endorsementCard.id = "endorsement-card";
  endorsementCard.className = `endorsement-card endorsement-light-mode `;

  let toParagraph = document.createElement("p");
  toParagraph.className = "endorsement-to";
  toParagraph.innerText = `${currentItemToValue}`;
  endorsementCard.appendChild(toParagraph);

  let endorsementText = document.createElement("p");
  endorsementText.className = "endorsement-text";
  endorsementText.innerText = `${currentItemEndorsementValue}`;
  endorsementCard.appendChild(endorsementText);

  let endorsementFromDetails = document.createElement("div");
  endorsementFromDetails.className = "endorsement-from-details";
  endorsementCard.appendChild(endorsementFromDetails);

  let fromParagraph = document.createElement("p");
  fromParagraph.className = "endorsement-from";
  fromParagraph.innerText = `${currentItemFromValue}`;
  endorsementFromDetails.appendChild(fromParagraph);

  let endorsementFromLikes = document.createElement("span");
  endorsementFromLikes.className = `endorsement-from-likes`;
  endorsementFromDetails.appendChild(endorsementFromLikes);

  let iconLikes = document.createElement("i");
  iconLikes.className = `fa-solid fa-heart icon-likes ${likeIcon} `;
  iconLikes.id = "icon-likes";
  endorsementFromLikes.appendChild(iconLikes);
  iconLikes.setAttribute("data-like", currentItemID);

  let endorsementFromNumberLikes = document.createElement("span");
  endorsementFromNumberLikes.className = "endorsement-from-number-likes";
  endorsementFromNumberLikes.id = "endorsement-from-number-likes";
  endorsementFromNumberLikes.innerText = `${currentItemLikesValue}`;
  endorsementFromDetails.appendChild(endorsementFromNumberLikes);

  endorsementGallery.prepend(endorsementCard);
}

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    endorsementGallery.innerHTML = "";
    itemsArray.forEach(function (currentItem) {
      let currentItemID = currentItem[0];
      let currentItemFromValue = currentItem[1].from;
      let currentItemToValue = currentItem[1].to;
      let currentItemEndorsementValue = currentItem[1].endorsement;
      let currentItemLikesValue = currentItem[1].likes;
      let currentItemisLikedValue = currentItem[1].isLiked;

      appendItemEndorsements(
        currentItemID,
        currentItemFromValue,
        currentItemToValue,
        currentItemEndorsementValue,
        currentItemLikesValue,
        currentItemisLikedValue
      );
    });
  }
});
