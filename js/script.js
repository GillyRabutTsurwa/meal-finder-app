// DOM ELEMENTS
const myDOM = (function() {
  const elements = {
    search: document.getElementById("search"),
    submit: document.getElementById("submit"),
    random: document.getElementById("random"),
    mealsEl: document.getElementById("meals"),
    resultHeading: document.getElementById("result-heading"),
    single_mealEl: document.getElementById("single-meal")
  }
  return elements;
})();

// Search meal and fetch from the API
const searchMeal = async (e) => {
  e.preventDefault();

  // TODO: Clear single meal
  myDOM.single_mealEl.innerHTML = "";
  //TODO: Get search term
  const term = myDOM.search.value;

  // Check if something was typed or not prior to submission
  if (term.trim()) { //Nice little String method.
    // Make our fetch request

    //NOTE: This works. But let's use async/await
    // fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    // .then((response) => response.json())
    // .then((data) => console.log(data))

    // Exact same thing as above but with async/await. Much cleaner.
    //IMPORTANT: DON'T FORGET TO PUT ASYNC KEYWORD IN FUNCTION
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await response.json();
    // console.log(data);
    // console.log(data.meals);
    myDOM.resultHeading.innerHTML = `<h2>Search Results for: '${term}'</h2>`;

    // check if there are meals come up upon search. ie, if results are not null
    if (data.meals === null) {
      myDOM.resultHeading.innerHTML = `<p>There are no search results for ${term}. Try Again</p>`
    }


    // ALL CODE ABOVE THIS COMMENT IS FINE
    else {
      myDOM.mealsEl.innerHTML = data.meals.map((currentMeal) => {
          return `
          <div class="meal">
            <img src="${currentMeal.strMealThumb}" alt="${currentMeal.strMeal}"/>
            <div class="meal-info" data-mealID="${currentMeal.idMeal}">
              <a href="#single-meal-info">${currentMeal.strMeal}</a>
            </div>
          </div>`
      })
      .join("");
      // console.log(myDOM.mealsEl)
    }
    // Clear Search Text
    myDOM.search.value = "";
  }
  else {
    alert("NO-thing was typed");
  }
}


const renderMeal = (meal) => { //NOTE: meal parametre is an array with 1 object in it
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    }
    else { 
      break;
    }
  }
  myDOM.single_mealEl.innerHTML = `
    <div id="single-meal-info" class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}"/>
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((currentIngredient) => `<li>${currentIngredient}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}


// Fetch meal by ID
const getMealByID = async (mealID) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  const data = await response.json();
  // console.log(data);
  const meal = data.meals[0];
  console.log(meal)
  renderMeal(meal);
}

// Fetch random meal
const getRandomMeal = async () => {
  // clear meals and heading
  myDOM.mealsEl.innerHTML = "";
  myDOM.resultHeading.innerHTML = "";
  // fetch meal randomly
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const data = await response.json(); // This data is an array with one object (meal) inside
  // console.log(data); 
  const meal = data.meals[0];

  renderMeal(meal);

}











// EVENT LISTENERS

myDOM.submit.addEventListener("submit", searchMeal);
myDOM.random.addEventListener("click", getRandomMeal);

myDOM.mealsEl.addEventListener("click", (e) => {
  const mealInfoPath = e.path; //NEW: an ARRAY with the path from the element, up to the Window
  const mealInfo = mealInfoPath.find((currentItem) => {
    // If the item has a class
    if (currentItem.classList) {
      return currentItem.classList.contains("meal-info");
    }
    else {
      return false;
    }
  });
  if(mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
    
  }
});




const toggler = document.getElementById("toggle");

toggler.addEventListener("click", () => {
  toggler.classList.toggle("active");
  document.querySelector("body").classList.toggle("dark");

});

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 2000
});

// document.querySelector("body").addEventListener("click", (e) => {
//   console.log(e)
//   console.log(e.target);

// })