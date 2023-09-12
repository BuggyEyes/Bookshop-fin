import './styles/main.scss'
// import './pics/banner.png'
// import './pics/arrow.png'
// import './pics/banner 2.png'
// import './pics/banner 3.png'
//import "./style.scss";
document.addEventListener("DOMContentLoaded", function () {
    let startIndex = 0;
    const maxResults = 6;
    let currentCategory = "architecture";
    const apiKey = "AIzaSyC8uKDQ-CId1T1KC1G5MQLTYfQZFvIGLlw";

    function fetchBooks(category) {
        const bookList = document.getElementById("bookList");
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                bookList.innerHTML = "";

                data.items.forEach((item) => {
                    const book = document.createElement("div");
                    book.className = "book";

                    const bookImage = document.createElement("img");
                    if (
                        item.volumeInfo.imageLinks &&
                        item.volumeInfo.imageLinks.thumbnail
                    ) {
                        bookImage.src = item.volumeInfo.imageLinks.thumbnail;
                    } else {
                        bookImage.src = "placeholder.jpg";
                    }
                    book.appendChild(bookImage);

                    const bookInfo = document.createElement("div");
                    bookInfo.className = "book-info";

                    if (item.volumeInfo.authors) {
                        const bookAuthors = document.createElement("p");
                        bookAuthors.className = "book-description";
                        bookAuthors.textContent = `${item.volumeInfo.authors.join(", ")}`;
                        bookInfo.appendChild(bookAuthors);
                    }

                    const bookTitle = document.createElement("h3");
                    bookTitle.className = "book-title";
                    bookTitle.textContent = item.volumeInfo.title;
                    bookInfo.appendChild(bookTitle);

                    if (
                        item.saleInfo &&
                        item.saleInfo.listPrice &&
                        item.saleInfo.listPrice.amount
                    ) {
                        const price = item.saleInfo.listPrice.amount;
                        const currencyCode = item.saleInfo.listPrice.currencyCode;
                        const bookPrice = document.createElement("p");
                        bookPrice.className = "price";
                        bookPrice.textContent = `Price: ${price} ${currencyCode}`;
                        bookInfo.appendChild(bookPrice);
                    } else {
                        const notForSale = document.createElement("p");
                        notForSale.className = "not-for-sale";
                        notForSale.textContent = "Not for sale";
                        bookInfo.appendChild(notForSale);
                    }

                    if (item.volumeInfo.averageRating && item.volumeInfo.ratingsCount) {
                        const rating = Math.round(item.volumeInfo.averageRating);
                        const ratingsCount = item.volumeInfo.ratingsCount;
                        const bookRating = document.createElement("p");
                        bookRating.className = "book-description";
                        const MAX_RATING = 5;
                        const YELLOW_STARS = rating;
                        const GRAY_STARS = MAX_RATING - rating;

                        const yellowStars = "★".repeat(YELLOW_STARS);
                        const grayStars = "☆".repeat(GRAY_STARS);

                        bookRating.innerHTML = `<span style="color: #F2C94C">${yellowStars}</span><span style="color: gray">${grayStars}</span> (${ratingsCount} reviews)`;
                        bookInfo.appendChild(bookRating);
                    }

                    if (item.volumeInfo.description) {
                        const description =
                            item.volumeInfo.description.length > 150
                                ? `${item.volumeInfo.description.substring(0, 150)}...`
                                : item.volumeInfo.description;
                        const bookDescription = document.createElement("p");
                        bookDescription.className = "book-description";
                        bookDescription.textContent = description;
                        bookInfo.appendChild(bookDescription);
                    }

                    const buyButton = document.createElement("button");
                    buyButton.className = "buy-button";
                    buyButton.href = "#";
                    buyButton.textContent = "Buy now";
                    bookInfo.appendChild(buyButton);

                    book.appendChild(bookInfo);
                    bookList.appendChild(book);

                    // Проверка наличия товара в корзине при загрузке
                    const bookId = item.id;
                    if (isBookInCart(bookId)) {
                        buyButton.classList.add("added");
                        buyButton.textContent = "Remove from cart";
                    }

                    // Добавление/удаление товара в корзину при клике на кнопку "Buy now"
                    buyButton.addEventListener("click", () => {
                        if (buyButton.classList.contains("added")) {
                            removeBookFromCart(bookId);
                            buyButton.classList.remove("added");
                            buyButton.textContent = "Buy now";
                        } else {
                            addBookToCart(bookId);
                            buyButton.classList.add("added");
                            buyButton.textContent = "Remove from cart";
                        }
                        updateCartCount(); // Обновляем число позиций в корзине
                    });
                });

                startIndex += maxResults;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    function loadMore() {
        fetchBooks(currentCategory);
    }

    function changeCategory(event) {
        const clickedCategory = event.target.dataset.category;
        if (clickedCategory && clickedCategory !== currentCategory) {
            const activeCategory = document.querySelector(".list-point.active");
            activeCategory.classList.remove("active");
            event.target.classList.add("active");
            currentCategory = clickedCategory;
            startIndex = 0;
            fetchBooks(currentCategory);
        }
    }

    // Добавление товара в корзину
    function addBookToCart(bookId) {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        if (!cartItems.includes(bookId)) {
            cartItems.push(bookId);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }

    // Удаление товара из корзины
    function removeBookFromCart(bookId) {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        if (cartItems.includes(bookId)) {
            cartItems = cartItems.filter((item) => item !== bookId);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }

    // Проверка наличия товара в корзине
    function isBookInCart(bookId) {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        return cartItems.includes(bookId);
    }

    // Обновление числа позиций в корзине
    function updateCartCount() {
        const circle = document.getElementById("circle");
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        circle.textContent = cartItems.length;
    }

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const categoryList = document.querySelector(".categories");

    loadMoreBtn.addEventListener("click", loadMore);
    categoryList.addEventListener("click", changeCategory);

    window.addEventListener("load", function () {
        updateCartCount();
        fetchBooks(currentCategory);
    });
    const slider = document.getElementById("slider");
    const images = slider.getElementsByTagName("img");
    const dotsContainer = document.querySelector(".dots-container");
    const dots = dotsContainer.getElementsByClassName("dot");

    let currentSlideIndex = 0;
    let slideInterval;

    function showSlide(index) {
        for (let i = 0; i < images.length; i++) {
            images[i].classList.remove("active");
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }

        images[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlideIndex = index;
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % images.length;
        showSlide(currentSlideIndex);
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", () => {
            showSlide(i);
        });
    }

    // Запускаем интервал для автоматической прокрутки слайдов каждые 5 секунд
    slideInterval = setInterval(nextSlide, 5000);

    // Активируем первый слайд и первую точку
    showSlide(0);
});