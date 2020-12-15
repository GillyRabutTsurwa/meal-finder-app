// fetching all our DOM ELEMENTS
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

// Search meal using form and fetch from the API
const searchMeal = async (e) => {
  e.preventDefault();

  //TODO: Get search term
  const term = myDOM.search.value;

  // Check if something was typed or not prior to submission
  if (term.trim()) {
    // Make our fetch request
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((response) => response.json())
      .then((data) => {
        // data is an array of objects, containing our meals.
        console.log(data);
        // check if there are meals come up upon search. ie, if results are not null
        if (data.meals === null) {
          console.log(`There are no search results for ${term}. Try Again`);
        }
        // ALL CODE ABOVE THIS COMMENT IS FINE
        else {
          data.meals.forEach((currentMeal) => {
            console.log(currentMeal);
          });
        }
      })
      .catch((error) => {
        console.log(`Error fetching meals: ${error}`);
      });
    // Clear Search Text
    myDOM.search.value = "";
  }
  // else, if the input was left blank:
  else {
    alert("Hakuna kitu was typed");
    // For the LOLs
    let blankInputMsg = confirm("Anyways, is Gilbert the best chef?");
    blankInputMsg ? console.log("Yes. You damn right") : console.log("Wrong. No");
  }
};

// Fetch random meal
const getRandomMeal = async () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // This is an array with one object, which contains the meal info
      // It'd be more convienient if it was an object right away, but it's okay
      const meal = data.meals[0];
      console.log(meal);

      // using destructuring to get some properties of the object and putting them into variables; playing around
      const { idMeal, strMeal, strCategory, strArea } = meal;
      console.log(`ID # of the meal is ${idMeal}`);
      console.log(`The name of this meal is ${strMeal}`);
      console.log(`The type of dish is ${strCategory}`);
      console.log(`The origin of this meal is ${strArea}`);
    })
    .catch((error) => {
      console.log(`Error fetching random meal: ${error}`);
    });
};

myDOM.submit.addEventListener("submit", searchMeal);
myDOM.random.addEventListener("click", getRandomMeal);
