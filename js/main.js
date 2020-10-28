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
const containerPromo = document.querySelector('.container-promo');
const containerRestaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('loginFood');


function toggleModal() {
    modal.classList.toggle("is-open");
}
function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    if(modalAuth.classList.contains('is-open')){
        disableScroll();
    } else{
        enableScroll();
    }
}
function authorized() {
  function logOut(){
    login = null;
    btnAuth.style.display = '';
    userName.style.display = '';
    btnOut.style.display = '';
    btnOut.removeEventListener('click', logOut)
    localStorage.removeItem('loginFood');
    checkAuth();
  }
    btnAuth.style.display = 'none';
    userName.textContent = login;
    userName.style.display = 'flex';
    btnOut.style.display = 'flex';
    btnOut.addEventListener('click', logOut)
}
function notAuthorized() {
    function logIn(e) {
      let logVal = loginInput.value.trim();
      let pasVal = passInput.value.trim();
      e.preventDefault();
      if(!logVal&&!pasVal){
        alert('Заполните, пожалуйста, поля "логин" и "пароль"')
      } else if(!pasVal){
        // alert('Введите, пожалуйста, пароль')
        passInput.value = '';
        passInput.style.border = '2px solid red';
        passInput.setAttribute('placeholder', 'Введите, пожалуйста, пароль');
      } else if (!logVal){
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
        if(e.target.classList.contains('is-open')){
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
function createCardRestaurant(){
    const card = `
        <a class="card card-restaurant">
            <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">Пицца плюс</h3>
                    <span class="card-tag tag">50 мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От 900 ₽</div>
                    <div class="category">Пицца</div>
                </div>
            </div>
        </a>
    `;
    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}
createCardRestaurant();
function createCardFood(){
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
            <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">Пицца Везувий</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
                        «Халапенье», соус «Тобаско», томаты.
                    </div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price-bold">545 ₽</strong>
                </div>
            </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card);
}
function openGoods(e){
    if(login){
        const target = e.target;
        const restaurant = target.closest('.card-restaurant');
        if(restaurant){
            cardsMenu.textContent='';
            containerPromo.classList.add('hide');
            containerRestaurants.classList.add('hide');
            menu.classList.remove('hide');
            createCardFood();
        }
    } else {
        toggleModalAuth();
    }
}


cardsRestaurants.addEventListener('click', openGoods)
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
logo.addEventListener("click", function () {
    containerPromo.classList.remove('hide');
    containerRestaurants.classList.remove('hide');
    menu.classList.add('hide');
});
