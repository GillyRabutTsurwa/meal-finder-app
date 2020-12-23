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

      const mealsArrTemplate = mealsArr.map((currentMealObj) => {
        let { strMealThumb, strMeal, idMeal } = currentMealObj;
        return makeMealCard(strMealThumb, strMeal, idMeal);
      });
      // NOTE: just making it to another variable (mealsArrTemplate). Still same code base
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

    for (let i = 1; i <= 20; i++) {
      // I'm not destructuring these
      // NOTE: if the current meal ingredient property exists / does not equate to an empty string (I'm assuming an empty string is false)
      if (meal[`strIngredient${i}`]) {
        // push the value of the meal ingredient property and the meal measurements property
        // this is beacause they both have 20 and they both coorelate to one another
        // so if meal[strIngredient1] = sugar and meal[strMeasure1] = sugar. This is translates to 1 cup of sugar.
        // Also, if a particular meal only has 14 ingredients, it will consequently only have 14 measurements as well. This is why we are breaking once we start finding empty ingredients and measurement values.
        //console.log the fetch data if this is still confusing. You will see these properties
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    // UI markup ici. will put it into its own UI function in the next branch
    myDOM.single_mealEl.innerHTML = `
    <div id="single-meal-info" class="single-meal">
      <h1>${strMeal}</h1>
      <img src="${strMealThumb}"/>
      <div class="single-meal-info">
        ${strCategory ? `<p>${strCategory}</p>` : ""}
        ${strArea ? `<p>${strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((currentIngredient) => `<li>${currentIngredient}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
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
