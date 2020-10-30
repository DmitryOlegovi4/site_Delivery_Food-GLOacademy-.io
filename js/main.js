'use script';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const btnAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const btnCloseAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const btnOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.swiper-container');
const containerRestaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const menuHeader = document.querySelector('.menu-header');
const inputSearch = document.querySelector('.input-search');
const modalBodyCart = document.querySelector('.modal-body-cart');
const modalTotalPrice = document.querySelector('.modal-pricetag');
const btnClearCart = document.querySelector('.clear-cart');
const goodsList = [];
const cart = [];

let login = localStorage.getItem('loginFood');

const getData = async function (url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
    }
    return await response.json();
}

function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    if (modalAuth.classList.contains('is-open')) {
        disableScroll();
    } else {
        enableScroll();
    }
}

function authorized() {
    function logOut() {
        login = null;
        btnAuth.style.display = '';
        userName.style.display = '';
        btnOut.style.display = '';
        cartButton.style.display = '';
        btnOut.removeEventListener('click', logOut)
        localStorage.removeItem('loginFood');
        checkAuth();
    }

    btnAuth.style.display = 'none';
    userName.textContent = login;
    userName.style.display = 'flex';
    btnOut.style.display = 'flex';
    cartButton.style.display = 'flex';
    btnOut.addEventListener('click', logOut)
}

function notAuthorized() {
    function logIn(e) {
        let logVal = loginInput.value.trim();
        let pasVal = passInput.value.trim();
        e.preventDefault();
        if (!logVal && !pasVal) {
            alert('Заполните, пожалуйста, поля "логин" и "пароль"')
        } else if (!pasVal) {
            // alert('Введите, пожалуйста, пароль')
            passInput.value = '';
            passInput.style.border = '2px solid red';
            passInput.setAttribute('placeholder', 'Введите, пожалуйста, пароль');
        } else if (!logVal) {
            // alert('Введите, пожалуйста, логин')
            loginInput.value = '';
            loginInput.style.border = '2px solid red';
            loginInput.setAttribute('placeholder', 'Введите, пожалуйста, логин');
        } else {
            login = logVal;
            localStorage.setItem('loginFood', login);
            toggleModalAuth();
            btnAuth.removeEventListener('click', toggleModalAuth);
            btnCloseAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn)
            loginInput.value = '';
            passInput.value = '';
            checkAuth();
        }
    }

    btnAuth.addEventListener('click', toggleModalAuth);
    btnCloseAuth.addEventListener('click', toggleModalAuth);
    btnCloseAuth.addEventListener('click', function () {
        loginInput.value = '';
        loginInput.style.border = '';
        passInput.value = '';
        passInput.style.border = '';
        loginInput.removeAttribute('placeholder');
        passInput.removeAttribute('placeholder');
    });
    logInForm.addEventListener('submit', logIn)
    loginInput.addEventListener('click', function () {
        loginInput.style.border = '';
        loginInput.removeAttribute('placeholder');
    })
    passInput.addEventListener('click', function () {
        passInput.style.border = '';
        passInput.removeAttribute('placeholder');
    })
    modalAuth.addEventListener('click', function (e) {
        if (e.target.classList.contains('is-open')) {
            toggleModalAuth();
        }
    })
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

checkAuth();

function createCardRestaurant(restaurant) {
    const {name, time_of_delivery, stars, price, kitchen, image, products} = restaurant;
    const card = `
        <a class="card card-restaurant" 
        data-products="${products}"
        data-name="${name}"
        data-stars="${stars}"
        data-price="${price}"
        data-kitchen="${kitchen}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${time_of_delivery} мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `;
    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardFoodHeader({kitchen, name, stars, price}) {
    let priceVal = price ? `От ${price} ₽` : '';
    const card = `
        <button class="btn-back">&#10096;&#10096; НАЗАД</button>
        <h2 class="section-title restaurant-title">${name}</h2>
        <div class="card-info">
            <div class="rating">
                ${stars}
            </div>
            <div class="price">${priceVal}</div>
            <div class="category">${kitchen}</div>
        </div>
    `;
    menuHeader.insertAdjacentHTML('beforeend', card);
    const btnBack = document.querySelector('.btn-back');
    btnBack.addEventListener("click", function () {
        containerPromo.classList.remove('hide');
        containerRestaurants.classList.remove('hide');
        menu.classList.add('hide');
        location.hash = '';
    });

}

function createCardFood(goods) {
    const {id, name, description, price, image} = goods;
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
            <img src="${image}" alt="image ${id}" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${description}
                    </div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart" id=${id}>
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price card-price-bold">${price} ₽</strong>
                </div>
            </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(e) {
    if (login) {
        const target = e.target;
        const restaurant = target.closest('.card-restaurant');
        if (restaurant) {
            cardsMenu.textContent = '';
            menuHeader.textContent = '';
            containerPromo.classList.add('hide');
            containerRestaurants.classList.add('hide');
            menu.classList.remove('hide');
            createCardFoodHeader(restaurant.dataset);
            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardFood);
            });
            location.hash = `#${restaurant.dataset.name}`;
        }
    } else {
        toggleModalAuth();
    }
}

function addToCart(e) {
    const target = e.target;
    const btnAddToCart = target.closest('.button-add-cart');
    if (btnAddToCart) {
        const card = target.closest('.card');
        const name = card.querySelector('.card-title-reg').textContent;
        const price = card.querySelector('.card-price').textContent;
        const id = btnAddToCart.id;
        const food = cart.find(function (item) {
            return item.id === id
        });
        if (food) {
            food.count++
        } else {
            cart.push({id, name, price, count: 1});
        }
    }
}

function renderCart() {
    modalBodyCart.textContent = '';
    cart.forEach(function (item) {
        const price = parseFloat(item.price);
        const itemCart = `
        <div class="food-row">
            <span class="food-name">${item.name}</span>
            <strong class="food-price">${price} ₽</strong>
            <div class="food-counter">
                <button class="counter-button counter-minus" data-id="${item.id}">-</button>
                <span class="counter">${item.count}</span>
                <button class="counter-button counter-plus" data-id="${item.id}">+</button>
            </div>
        </div>
        `;
        localStorage.setItem(`${item.name}`, `${item.count}`);
        modalBodyCart.insertAdjacentHTML('afterbegin', itemCart)
    });
    const totalPrice = cart.reduce(function (res, item) {
        return res + parseFloat(item.price) * item.count;
    }, 0)
    localStorage.setItem(`totalPrice`, `${totalPrice}`);
    modalTotalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(e) {
    const target = e.target;
    if (target.classList.contains('counter-minus')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        food.count--;
        if (food.count === 0) {
            cart.splice(cart.indexOf(food), 1);
            localStorage.removeItem(`${food.name}`);
        }
        renderCart();
    }
    if (target.classList.contains('counter-plus')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        food.count++;
        renderCart();
    }
}

(function init() {
    getData('./db/partners.json')
        .then(function (data) {
            data.forEach(createCardRestaurant);
            return data.map(function (partner) {
                return partner.products;
            })
        })
        .then(function (linkProducts) {
            linkProducts.forEach(function (link) {
                getData(`./db/${link}`)
                    .then(function (data) {
                        data.forEach(function (item) {
                            goodsList.push(item);
                        })

                    })
            })
            setTimeout(function () {
                if (localStorage.getItem('totalPrice')) {
                    for (let i = 0; i < localStorage.length; i++) {
                        const res = goodsList.filter(item => item.name === localStorage.key(i))
                        if (res.length > 0) {
                            res[0].count = localStorage.getItem(localStorage.key(i));
                            cart.push(res[0]);
                        }
                    }
                }
            }, 1000)

        });

    cardsRestaurants.addEventListener('click', openGoods)
    cartButton.addEventListener("click", function () {
        renderCart();
        toggleModal();
    });
    close.addEventListener("click", toggleModal);
    cardsMenu.addEventListener('click', addToCart);
    modalBodyCart.addEventListener('click', changeCount)
    btnClearCart.addEventListener('click', function () {
        cart.forEach(function (item) {
            localStorage.removeItem(item.name);
        })
        cart.length = 0;
        renderCart();
    })
// Slider
    new Swiper('.swiper-container', {
        sliderPerView: 1,
        loop: true,
        autoplay: true,
        effect: 'cube',
        cubeEffect: {shadow: false},
        speed: 500,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });

    // Поиск по меню
    inputSearch.addEventListener('keypress', function (e) {
        if (e.code === 'Enter') {
            const value = e.target.value.trim();
            if (value) {
                getData('./db/partners.json')
                    .then(function (data) {
                        return data.map(function (partner) {
                            return partner.products;
                        })
                    })
                    .then(function (linkProducts) {
                        cardsMenu.textContent = '';
                        menuHeader.textContent = '';
                        const headerList = {
                            kitchen: `${value}`,
                            name: 'Результат поиска',
                            stars: '',
                            price: ''
                        };
                        createCardFoodHeader(headerList);
                        linkProducts.forEach(function (link) {
                            getData(`./db/${link}`)
                                .then(function (data) {
                                    const resultSearch = data.filter(function (item) {
                                        const name = item.name.toLowerCase();
                                        return name.includes(value.toLowerCase());
                                    });
                                    containerPromo.classList.add('hide');
                                    containerRestaurants.classList.add('hide');
                                    menu.classList.remove('hide');
                                    resultSearch.forEach(createCardFood);
                                    e.target.value = '';
                                });
                        })
                    });
            } else {
                e.target.style.backgroundColor = 'orangered';
                e.target.value = '';
                setTimeout(function () {
                    e.target.style.backgroundColor = '';
                }, 1500)
            }

        }
    })
})()

