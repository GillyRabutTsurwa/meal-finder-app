const myDOM = {
    search: document.getElementById("search"),
    submit: document.getElementById("submit"),
    random: document.getElementById("random"),
    mealsEl: document.getElementById("meals"),
    resultHeading: document.getElementById("result-heading"),
    single_mealEl: document.getElementById("single-meal"),
  },
  makeMealCard = (mealImage, mealName, mealID) =>
    `\n  <div class="meal">\n    <img src="${mealImage}" alt="${mealName}"/>\n    <div class="meal-info" data-mealID="${mealID}">\n      <a href="#single-meal-info">${mealName}</a>\n    </div>\n  </div>`,
  renderRandomMeal = (mealName, mealImage, mealCategory, mealOrigin, mealInstructions, ingredientsArr) =>
    `\n  <div id="single-meal-info" class="single-meal">\n    <h1>${mealName}</h1>\n    <img src="${mealImage}"/>\n    <div class="single-meal-info">\n      ${
      mealCategory ? `<p>${mealCategory}</p>` : ""
    }\n      ${
      mealOrigin ? `<p>${mealOrigin}</p>` : ""
    }\n    </div>\n    <div class="main">\n      <p>${mealInstructions}</p>\n      <h2>Ingredients</h2>\n      <ul>\n        ${ingredientsArr
      .map((currentIngredient) => `<li>${currentIngredient}</li>`)
      .join("")}\n      </ul>\n    </div>\n  </div>\n  `,
  searchMeal = async (e) => {
    e.preventDefault();
    const term = myDOM.search.value;
    if (term.trim())
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        console.log(response);
        const data = await response.json(),
          mealsArr = data.meals;
        let mealExistsMsg = `<h2>Search Results for: ${term}</h2>`,
          mealDoesntExistMsg = `<p>There are no search results for ${term}. Try Again</p>`;
        myDOM.resultHeading.innerHTML = null !== data.meals ? mealExistsMsg : mealDoesntExistMsg;
        const mealsArrTemplate = mealsArr.map((currentMealObj) => {
          let { strMealThumb: strMealThumb, strMeal: strMeal, idMeal: idMeal } = currentMealObj;
          return `\n  <div class="meal">\n    <img src="${strMealThumb}" alt="${(mealName = strMeal)}"/>\n    <div class="meal-info" data-mealID="${idMeal}">\n      <a href="#single-meal-info">${mealName}</a>\n    </div>\n  </div>`;
          var mealName;
        });
        (myDOM.mealsEl.innerHTML = mealsArrTemplate.join("")), console.log(myDOM.mealsEl);
      } catch (error) {
        console.log(`Error fetching meals: ${error}`);
      } finally {
        myDOM.search.value = "";
      }
    else alert("Hakuna kitu was typed");
  },
  getRandomMeal = async () => {
    (myDOM.mealsEl.innerHTML = ""), (myDOM.resultHeading.innerHTML = "");
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
        data = await response.json();
      console.log(data);
      const meal = data.meals[0];
      console.log(meal);
      const {
          idMeal: idMeal,
          strMeal: strMeal,
          strMealThumb: strMealThumb,
          strCategory: strCategory,
          strArea: strArea,
          strInstructions: strInstructions,
        } = meal,
        ingredients = [],
        ingredientLimit = 20,
        renderRandomMealArgs = [strMeal, strMealThumb, strCategory, strArea, strInstructions, ingredients];
      for (let i = 1; i <= ingredientLimit && meal[`strIngredient${i}`]; i++)
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      (myDOM.single_mealEl.innerHTML = renderRandomMeal(...renderRandomMealArgs)),
        console.log(ingredients),
        console.log(`ID # of the meal is ${idMeal}`),
        console.log(`The name of this meal is ${strMeal}`),
        console.log(`The type of dish is ${strCategory}`),
        console.log(`The origin of this meal is ${strArea}`);
    } catch (error) {
      console.log(`Error fetching random meal: ${error}`);
    } finally {
      console.log("There's your rando,.. chicken like rambo");
    }
  };
myDOM.submit.addEventListener("submit", searchMeal), myDOM.random.addEventListener("click", getRandomMeal);
