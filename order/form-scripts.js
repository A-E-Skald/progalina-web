function renderDishes() {
    const container = document.getElementById('dishes');
    allLists = [soups, meals, drinks, salads, desserts];
    console.log(allKeys);

    container.innerHTML = "";
    for (let dishlist of allLists) {
        for (let dish of dishlist) {
            if (allKeys.includes(dish.keyword)) {
                const dishHTML = `
                <div class="dish">
                    <div class="dish-name">${dish.name}</div>
                    <img class = "img-dish" src="${dish.img}" alt="блюдо">
                    <div class="dish-price">${dish.price} петабайт</div>
                    <p class="p-order">${dish.desc}</p>
                    <a href="#" class="add" onclick="(''); return false;">Добавить</a>
                </div>
                `;
                container.insertAdjacentHTML('beforeend', dishHTML);
            }
        }
    }
}

function findDict(keyword) {
    for (let dishlist of allLists) {
        for (let dish of dishlist) {
            if (keyword==dish.keyword) {
                return(dish);
            }
        }
    }
}

function renderList() {
    const container = document.getElementById('renderList');
    totalprice = 0;
    columnHTML = `<h1>Ваш заказ</h1>`;
    if (allKeys[0] != '') {
        let dish = findDict(allKeys[0])
        columnHTML += `
        <label for="soup">Суп</label>
        <p>${dish.name}, ${dish.price} петабайт</p>
        `;
        totalprice += dish.price;
    }
    if (allKeys[1] != '') {
        let dish = findDict(allKeys[1])
        columnHTML += `
        <label for="soup">Блюдо</label>
        <p>${dish.name}, ${dish.price} петабайт</p>
        `;
        totalprice += dish.price;
    }
    if (allKeys[2] != '') {
        let dish = findDict(allKeys[2])
        columnHTML += `
        <label for="soup">Напиток</label>
        <p>${dish.name}, ${dish.price} петабайт</p>
        `;
        totalprice += dish.price;
    }
    if (allKeys[3] != "") {
        let dish = findDict(allKeys[3])
        columnHTML += `
        <label for="soup">Салат</label>
        <p>${dish.name}, ${dish.price} петабайт</p>
        `;
        totalprice += dish.price;
    }
    if (allKeys[4] != "") {
        let dish = findDict(allKeys[4])
        columnHTML += `
        <label for="soup">Дессерт</label>
        <p>${dish.name}, ${dish.price} петабайт</p>
        `;
        totalprice += dish.price;
    }
    columnHTML += `
    <label>Cтоимость заказа</label>
    <p>Общая стоимость: ${totalprice} петабайт</p>
    `;

    columnHTML += `
    <label for="comments">Комментарии к заказу</label>
    <textarea id="comments" name="comments" rows="8" cols="50" placeholder=""></textarea>
    `;

    container.innerHTML = "";
    container.insertAdjacentHTML('beforeend', columnHTML);
}

async function sendOrder() {
    const apiKey = 'cff8ac16-8306-46e8-92c0-02dbd4dd28bd';
    const apiUrl = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`;

    const fullName = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("tel").value;
    const address = document.getElementById("address").value;
    const subscribe = document.querySelector('input[name="wants_delivery"]').checked ? 1 : 0;
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value === "rightnow" ? "now" : "by_time";
    const comment = document.getElementById("comments").value;

    let deliveryTime = null;
    if (deliveryType === "by_time") {
        deliveryTime = document.getElementById("delivery_time").value;
    }

    const orderData = {
        full_name: fullName,
        email: email,
        phone: phone,
        delivery_address: address,
        delivery_type: deliveryType,
        comment: comment,
        subscribe: subscribe,
        // soup_id: allKeys[0],
        // meal_id: allKeys[1],
        // salad_id: allKeys[2],
        // drink_id: allKeys[3],
        // dessert_id: allKeys[4]
        soup_id: 1,
        meal_id: 11,
        salad_id: 111,
        drink_id: 1111,
        dessert_id: 11111,
    };

    console.log(orderData);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Ошибка при отправке заказа: " + error.error);
            return;
        }

        alert("Заказ успешно отправлен!");
        // localStorage.removeItem("chosenDishes");

    } catch (error) {
        alert("Произошла ошибка при отправке запроса: " + error.message);
    }
}

const allKeys = JSON.parse(localStorage.getItem("chosenKeywords"));

renderDishes();
renderList();

document.getElementById("openModal").addEventListener("click", function(event) {
    event.preventDefault(); 
    sendOrder(); 
});

async function checkOrders() {
    const apiKey = "cff8ac16-8306-46e8-92c0-02dbd4dd28bd";

    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`);
        
        if (!response.ok) {
            throw new Error("Ошибка при получении заказов");
        }

        const orders = await response.json();
        console.log("Ваши заказы:", orders);
    } catch (error) {
        console.error("Не удалось получить заказы:", error);
        alert("Ошибка при загрузке заказов");
    }
}

checkOrders();

