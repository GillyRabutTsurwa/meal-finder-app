// This branch is the same as the previous one, but using async/await instead of fetch
// A more detailed notes are in branch 2-fetching-meals-using-API, because they are the same, except for the implementation of async/await on this one and .then() on that one. Thus, I deleted all duplicate notes.
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

// fetch all meals based on submission of input
const searchMeal = async (e) => {
  e.preventDefault();

  const term = myDOM.search.value;

  if (term.trim()) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
      console.log(response);
      const data = await response.json();
      const mealsArr = data.meals;

      // We are rendering the divs of a single meal inside the meals container
      myDOM.mealsEl.innerHTML = mealsArr
        .map((currentMealObj) => {
          return `
        <div class="meal">
          <img src="${currentMealObj.strMealThumb}" alt="${currentMealObj.strMeal}"/>
          <div class="meal-info" data-mealID="${currentMealObj.idMeal}">
            <a href="#single-meal-info">${currentMealObj.strMeal}</a>
          </div>
        </div>`;
        })
        // If we don't put .join(""), it still renders, but the markup is still weird because it is still an array (you'll notice the commas). So we have to append the join() to form the array to a string. if you want to test, console.log myDOM.mealsEl with the join() and without it, and go to the console and see the difference
        .join("");

      console.log(myDOM.mealsEl);
    } catch (error) {
      console.log(`Error fetching meals: ${error}`);
    } finally {
      myDOM.search.value = "";
    }
  } else {
    alert("Hakuna kitu was typed");
    // For the LOLs
    let blankInputMsg = confirm("Anyways, is Gilbert the best chef?");
    blankInputMsg ? console.log("Yes. You damn right") : console.log("Wrong. No");
  }
};

// Fetch random meal
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
