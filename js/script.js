const myDOM = (function () {
  const elements = {
    search: document.querySelector("#search"),
    submit: document.querySelector("#submit"),
    random: document.querySelector("#random"),
    mealsEl: document.querySelector("#meals"),
    resultHeading: document.querySelector("#result-heading"),
    single_mealEl: document.querySelector("#single-meal"),
    //NEW:
    toggler: document.querySelector("#toggle"),
    body: document.querySelector("body"),
  };
  return elements;
})();

// =================================== UI Rendering FUNCTIONS ===================================
const makeMealCard = (mealImage, mealName, mealID) => {
  return `
  <div class="meal">
    <img src="${mealImage}" alt="${mealName}"/>
    <div class="meal-info" data-mealid="${mealID}">
      <a href="#single-meal-info">${mealName}</a>
    </div>
  </div>`;
};

const renderRandomMeal = (mealName, mealImage, mealCategory, mealOrigin, mealInstructions, ingredientsArr) => {
  return `
  <div id="single-meal-info" class="single-meal">
    <h1>${mealName}</h1>
    <img src="${mealImage}"/>
    <div class="single-meal-info">
      ${mealCategory ? `<p>${mealCategory}</p>` : ""}
      ${mealOrigin ? `<p>${mealOrigin}</p>` : ""}
    </div>
    <div class="main">
      <p>${mealInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredientsArr.map((currentIngredient) => `<li>${currentIngredient}</li>`).join("")}
      </ul>
    </div>
  </div>
  `;
};

const searchMeal = async (e) => {
  e.preventDefault();
  const term = myDOM.search.value;

  if (term.trim()) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
      console.log(response);
      const data = await response.json();
      const mealsArr = data.meals;

      let mealExistsMsg = `<h2>Search Results for: ${term}</h2>`;
      let mealDoesntExistMsg = `<p>There are no search results for ${term}. Try Again</p>`;
      myDOM.resultHeading.innerHTML = data.meals !== null ? mealExistsMsg : mealDoesntExistMsg;

      const mealsArrTemplate = mealsArr.map((currentMealObj) => {
        let { strMealThumb, strMeal, idMeal } = currentMealObj;
        return makeMealCard(strMealThumb, strMeal, idMeal);
      });

      myDOM.mealsEl.innerHTML = mealsArrTemplate.join("");
      console.log(myDOM.mealsEl);
    } catch (error) {
      console.log(`Error fetching meals: ${error}`);
    } finally {
      myDOM.search.value = "";
    }
  } else {
    alert("Hakuna kitu was typed");
  }
};

const getRandomMeal = async () => {
  myDOM.mealsEl.innerHTML = "";
  myDOM.resultHeading.innerHTML = "";
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    console.log(data);

    const meal = data.meals[0];
    console.log(meal);

    const { idMeal, strMeal, strMealThumb, strCategory, strArea, strInstructions } = meal;
    // ? QUESTION: Should I put this (code in lines 92-100) in (a) separate function(s)
    const ingredients = [];
    const ingredientLimit = 20;

    const renderRandomMealArgs = [strMeal, strMealThumb, strCategory, strArea, strInstructions, ingredients];

    for (let i = 1; i <= ingredientLimit; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    myDOM.single_mealEl.innerHTML = renderRandomMeal(...renderRandomMealArgs);
  } catch (error) {
    console.warn(`Error fetching random meal: ${error}`);
  } finally {
    console.log("I will have better functionality for this finally block");
  }
};

const getMealByID = async (mealID) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  const data = await response.json();
  console.log(data);
  console.log(typeof data);

  const meal = data.meals[0];
  console.log(data.meals);
  console.log(meal);
};

myDOM.submit.addEventListener("submit", searchMeal);
myDOM.random.addEventListener("click", getRandomMeal);

myDOM.mealsEl.addEventListener("click", (e) => {
  const mealInfoPath = e.path;
  console.log(mealInfoPath);

  const mealInfo = mealInfoPath.find((currentElement) => {
    if (currentElement.classList) {
      return currentElement.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  console.log(mealInfo);
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    console.log(mealID);
    getMealByID(mealID);
  }
});

//NEW: event listener for dark mode.
// not using an arrow function because I want to access this element object using this
myDOM.toggler.addEventListener("click", function () {
  console.dir(this);
  this.classList.toggle("active");
  myDOM.body.classList.toggle("dark");
});
