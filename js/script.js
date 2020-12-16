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

const searchMeal = async (e) => {
  e.preventDefault();
  const term = myDOM.search.value;

  if (term.trim()) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
      console.log(response);
      const data = await response.json();
      const mealsArr = data.meals;

      //NEW:
      let mealExistsMsg = `<h2>Search Results for: ${term}</h2>`;
      let mealDoesntExistMsg = `<p>There are no search results for ${term}. Try Again</p>`;
      myDOM.resultHeading.innerHTML = data.meals !== null ? mealExistsMsg : mealDoesntExistMsg;

      myDOM.mealsEl.innerHTML = mealsArr
        .map((currentMealObj) => {
          // Here was are using destructuring to extract the object properties that we need
          let { strMealThumb, strMeal, idMeal } = currentMealObj;
          // And we are using thouse in our makeMealCard().
          // This makeMealCard() returns the markup that we have been using
          // So it's the samething as last time. We are just returning a function that returns the markup
          return makeMealCard(strMealThumb, strMeal, idMeal);
        })
        .join("");
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
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    console.log(data);
    const meal = data.meals[0];
    console.log(meal);

    const { idMeal, strMeal, strCategory, strArea } = meal;
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
