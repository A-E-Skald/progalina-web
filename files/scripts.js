// вывод (с фильтром или без)

function renderDishes(dishes, containerId, chooseFunctionName, filter) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    for (let dish of dishes) {
        if((dish.kind == filter) || (filter == null)) {
            const dishHTML = `
            <div class="dish">
                <div class="dish-name">${dish.name}</div>
                <img class = "img-dish" src="${dish.img}" alt="блюдо">
                <div class="dish-price">${dish.price} петабайт</div>
                <p class="p-order">${dish.desc}</p>
                <a href="#" class="add" onclick="${chooseFunctionName}('${dish.keyword}'); return false;">Добавить</a>
            </div>
            `;
            container.insertAdjacentHTML('beforeend', dishHTML);
        }
    }
}

// начальный рендер без фильтров, массив берем из json файла с репозитория по заданию из лабы

async function loadDishes() {
    let response = await fetch('https://a-e-skald.github.io/progalina-web/files/meal_data.json');
    let online_data = await response.json();

    soups = online_data.soups;
    meals = online_data.meals;
    drinks = online_data.drinks;
    salads = online_data.salads;
    desserts = online_data.desserts;

    renderDishes(soups, "soups", "chooseSoup", null);
    renderDishes(meals, "meals", "chooseMeal", null);
    renderDishes(drinks, "drinks", "chooseDrink", null);
    renderDishes(salads, "salads", "chooseSalad", null);
    renderDishes(desserts, "desserts", "chooseDessert", null);
}

//рассчет стоимости

function calculateTotal() {
    console.log(soups);

    const soupValue = document.getElementById("soup").value;
    const mealValue = document.getElementById("meal").value;
    const drinkValue = document.getElementById("drink").value;
    const saladValue = document.getElementById("salad").value;
    const dessertValue = document.getElementById("dessert").value;

    function findDish(arr, keyword) {
        return arr.find(dish => dish.keyword === keyword);
    }

    console.log(soups);

    const soup = findDish(soups, soupValue);
    const meal = findDish(meals, mealValue);
    const drink = findDish(drinks, drinkValue);
    const salad = findDish(salads, saladValue);
    const dessert = findDish(desserts, dessertValue);

    let total = 0;
    if (soup) total += soup.price;
    if (meal) total += meal.price;
    if (drink) total += drink.price;
    if (salad) total += salad.price;
    if (dessert) total += dessert.price;

    document.getElementById("total").innerText = "Общая стоимость: " + total + " петабайт";
}

soups = null;
meals = null;
drinks = null;
salads = null;
desserts = null;

loadDishes();


// чтобы при нажатии кнопки добавить в выпадающем списке выбиралась опция

document.getElementById("soup").addEventListener("change", calculateTotal);
document.getElementById("meal").addEventListener("change", calculateTotal);
document.getElementById("drink").addEventListener("change", calculateTotal);
document.getElementById("salad").addEventListener("change", calculateTotal);
document.getElementById("dessert").addEventListener("change", calculateTotal);

// для работы кнопок с фильтром

async function main() {
    await loadDishes(); // мне нужны значения массива который подгружается в loadDishes
    const buttons = document.getElementsByClassName("filter");
    const dict_func = {
        soups: "chooseSoup",
        meals: "chooseMeal",
        drinks: "chooseDrink",
        salads: "chooseSalad",
        desserts: "chooseDessert",
    }

    const data = {
        'soups': soups,
        'meals': meals,
        'drinks': drinks,
        'salads': salads,
        'desserts': desserts,
    }

    for (let button of buttons) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            const button_category = button.parentElement.dataset.category;
            const arr_name = data[button_category];
            const kind = button.dataset.kind;
            const func_name = dict_func[button_category];

            console.log(data);

            if (button.classList.contains("active")) {
                button.classList.remove("active");
                renderDishes(arr_name, button_category, func_name, null);
            }
            else {
                const parent = button.closest(".filters");
                const allButtons = parent.querySelectorAll(".filter");
                allButtons.forEach(b => b.classList.remove("active"));

                button.classList.add("active");
                renderDishes(arr_name, button_category, func_name, kind);
            }

        });

    }
    }

main();



// для работы окна с уведомлением 

const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.getElementById('modalOverlay');

openBtn.addEventListener('click', () => {
    const keywords = [document.getElementById("soup").value, document.getElementById("meal").value, document.getElementById("drink").value, document.getElementById("salad").value, document.getElementById("dessert").value];
    const soupBin = (!keywords[0] == "");
    const mealBin = (!keywords[1] == "");
    const drinkBin = (!keywords[2] == "");
    const saladBin = (!keywords[3] == "");
    const dessertBin = (!keywords[4] == "");

    console.log(soupBin,mealBin,drinkBin,saladBin,dessertBin);
    console.log((soupBin && !mealBin) , (soupBin && !saladBin));


    if (!soupBin && !mealBin && !saladBin && !drinkBin && !dessertBin){
        document.getElementById('replacable-text').innerText = 'Ничего не выбрано. Выбирите блюда для заказа.';
        overlay.style.display = 'flex';
    }

    else if ((soupBin && mealBin && saladBin && !drinkBin) || (soupBin && saladBin && !drinkBin) || (mealBin && !drinkBin) || (soupBin && mealBin && !drinkBin) || (mealBin && saladBin && !drinkBin)) {
        document.getElementById('replacable-text').innerText = 'Выберите напиток.';
        overlay.style.display = 'flex';
    }

    else if ((soupBin && !mealBin) && (soupBin && !saladBin)) {
        document.getElementById('replacable-text').innerText = 'Выберите главное блюдо / салат.';   
        overlay.style.display = 'flex';
    }

    else if((saladBin && !mealBin) && (saladBin && !soupBin)) {
        document.getElementById('replacable-text').innerText = 'Выберите главное блюдо / суп.';   
        overlay.style.display = 'flex';
    }

    else if((!soupBin && !mealBin && !saladBin && drinkBin) || (!soupBin && !mealBin && !saladBin && !drinkBin && dessertBin)) {
        document.getElementById('replacable-text').innerText = 'Выберите главное блюдо.';   
        overlay.style.display = 'flex';
    }

    else {
        localStorage.setItem("chosenKeywords", JSON.stringify(keywords));
        window.location.href = "form order.html";
    }
});

closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});

