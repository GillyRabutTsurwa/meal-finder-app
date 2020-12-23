const myDOM = (function () {
  const elements = {
    search: document.getElementById("search"),
    submit: document.getElementById("submit"),
    random: document.getElementById("random"),
    mealsEl: document.getElementById("meals"),
    resultHeading: document.getElementById("result-heading"),
    single_mealEl: document.getElementById("single-meal"),
  };
  return elements;
})();

// =================================== UI Rendering FUNCTIONS ===================================
const makeMealCard = (mealImage, mealName, mealID) => {
  return `
  <div class="meal">
    <img src="${mealImage}" alt="${mealName}"/>
    <div class="meal-info" data-mealID="${mealID}">
      <a href="#single-meal-info">${mealName}</a>
    </div>
  </div>`;
};

// QUESTION: the parametres for this function are too many, puis-je le réparer dans à venir ?

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

// Fetch random meal
// We will refactor this code later on after putting in the logic
const getRandomMeal = async () => {
  // clear previous meals and headings; the ones already painted to the DOM
  myDOM.mealsEl.innerHTML = "";
  myDOM.resultHeading.innerHTML = "";
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    console.log(data);
    // NOTE: this is an array with one object containing all our info. a bit unorthodox mais its ok
    const meal = data.meals[0];
    console.log(meal);

    const { idMeal, strMeal, strMealThumb, strCategory, strArea, strInstructions } = meal;
    // I will put this in (a) separate function(s)
    const ingredients = [];
    const ingredientLimit = 20; // made a variable for the limit of the for-loop. small minour change.
    // making some of these variables into an array that i will use in the renderRandomMeal() call in line 08. Just to make things look a bit cleaner
    // I'm this code here specifically because I need to access ingredients and I can't do it before initialisation (the name of the error when I tried to put it above)
    const renderRandomMealArgs = [strMeal, strMealThumb, strCategory, strArea, strInstructions, ingredients];

    for (let i = 1; i <= ingredientLimit; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    myDOM.single_mealEl.innerHTML = renderRandomMeal(...renderRandomMealArgs);

    console.log(ingredients);
    console.log(`ID # of the meal is ${idMeal}`);
    console.log(`The name of this meal is ${strMeal}`);
    console.log(`The type of dish is ${strCategory}`);
    console.log(`The origin of this meal is ${strArea}`);
  } catch (error) {
    console.log(`Error fetching random meal: ${error}`);
  } finally {
    console.log("There's your rando,.. chicken like rambo");
  }
};

myDOM.submit.addEventListener("submit", searchMeal);
myDOM.random.addEventListener("click", getRandomMeal);
