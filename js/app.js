
$(document).ready(function () {
    loadContent("home");

    $("#homeLink").on("click", function (e) {
        e.preventDefault();
        loadContent("home");
    });

    $("#contactLink").on("click", function (e) {
        e.preventDefault();
        loadContent("contacto");
    });

    $("#searchBox").on("input", function () {
        const searchText = $(this).val().toLowerCase();
        loadProducts(searchText);
    });
});

function loadContent(page) {
    $.getJSON("data/data.json", function (data) {
        const $content = $("#content");
        if (page === "home") {
            $content.html(`
                <h1>${data.home.title}</h1>
                <p>${data.home.description}</p>
                <div id="productList" class="product-grid"></div>
            `);
            loadProducts();
        } else if (page === "contacto") {
            $content.html(`
                <h1>${data.contacto.title}</h1>
                <p>${data.contacto.description}</p>
                <form id="contactForm">
                    <label>${data.contacto.form.name}:</label>
                    <input type="text" id="name" required><br>
                    <label>${data.contacto.form.email}:</label>
                    <input type="email" id="email" required><br>
                    <label>${data.contacto.form.message}:</label>
                    <textarea id="message" required></textarea><br>
                    <button type="submit">Enviar</button>
                </form>
            `);
            $("#contactForm").on("submit", handleContactForm); 
        }
    }).fail(function () {
        console.error("Error loading content");
    });
}

function loadProducts(searchText = "") {
    $.getJSON("data/productos.json", function (products) {
        const $productList = $("#productList");
        $productList.empty();

        products
            .filter(product => {
                const isHiddenInMainList =
                    product.nombre === "Campera Adidas River" ||
                    product.nombre === "Zapatillas Urbanas adidas Superstar" ||
                    product.nombre === "Gorra Nike" ||
                    product.nombre === "Zapatillas Puma Mayze" ||
                    product.nombre === "Pantalón Nike Margarita";
                return searchText ? product.nombre.toLowerCase().includes(searchText) : !isHiddenInMainList;
            })
            .forEach(product => {
                const $productDiv = $(`
                    <div class="product">
                        <img src="${product.imagen}" alt="${product.nombre}">
                        <h2>${product.nombre}</h2>
                        <p>${product.descripcion}</p>
                        <p>Precio: $${product.precio}</p>
                        <button onclick="agregarAlCarrito('${product.nombre}', ${product.precio})">Agregar al carrito</button>
                    </div>
                `);
                $productList.append($productDiv);
            });
    }).fail(function () {
        console.error("Error loading products");
    });
}

let carrito = [];
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    $("#cartCount").text(carrito.reduce((total, item) => total + item.cantidad, 0));
}

$("#carritoBtn").on("click", () => {
    let carritoContenido = "Carrito de compras:\n";
    carrito.forEach(item => {
        carritoContenido += `${item.nombre} - $${item.precio} x ${item.cantidad} = $${item.precio * item.cantidad}\n`;
    });
    alert(carritoContenido);
});

function handleContactForm(event) {
    event.preventDefault();

    const $name = $("#name");
    const $email = $("#email");
    const $message = $("#message");

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!$name.val().trim().match(nameRegex)) {
        alert("Error: El nombre solo debe contener letras y espacios.");
        $name.focus();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!$email.val().trim().match(emailRegex)) {
        alert("Error: Por favor, ingresa un correo electrónico válido.");
        $email.focus();
        return;
    }

    if ($message.val().trim() === "") {
        alert("Error: El mensaje no puede estar vacío.");
        $message.focus();
        return;
    }

    alert(`Gracias por contactarnos, ${$name.val().trim()}! Te responderemos pronto a ${$email.val().trim()}.`);
}
