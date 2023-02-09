let productos = [];
let carrito = [];
let dinero = 25000;
let fondosDiv = document.querySelector("#fondos");
fondosDiv.innerHTML = `
<p> Fondos: $${dinero}`;
let total = 0;

const mostrarProductos = async () => {
  const respuesta = await fetch("/productos.json");
  productos = await respuesta.json();

  const productosDiv = document.querySelector("#productos");
  productosDiv.innerHTML = "";

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("card", "col-lg-4", "col-md-6", "col-sm-12");
    productoDiv.innerHTML = `
        <span class="badge bg-secondary mb-3 mt-3">${producto.categoria}</span>
        <h4 class="card-title">${producto.titulo}</h4>
        <img class="img-fluid" src="${producto.imagen}" alt="${producto.titulo}" />
        <h5 class="card-text mt-2">$${producto.precio}</h5>
        <button class="btn btn-primary mt-2 mb-4" onclick="agregarAlCarrito('${producto.titulo}')">Agregar al carrito</button>
      `;
    productosDiv.appendChild(productoDiv);
  });
};

const filtrarProductos = () => {
  const inputBusqueda = document.querySelector("#inputBusqueda").value;
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.titulo.toLowerCase().includes(inputBusqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(inputBusqueda.toLowerCase())
  );

  const productosDiv = document.querySelector("#productos");
  productosDiv.innerHTML = "";

  productosFiltrados.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("card", "col-lg-4", "col-md-6", "col-sm-12");
    productoDiv.innerHTML = `
        <span class="badge bg-secondary mb-3 mt-3">${producto.categoria}</span>
        <h4 class="card-title">${producto.titulo}</h4>
        <img class="img-fluid" src="${producto.imagen}" alt="${producto.titulo}" />
        <h5 class="card-text mt-2">$${producto.precio}</h5>
        <button class="btn btn-primary mt-2 mb-4" onclick="agregarAlCarrito('${producto.titulo}')">Agregar al carrito</button>
      `;
    productosDiv.appendChild(productoDiv);
  });
};

const agregarAlCarrito = (titulo) => {
  const producto = productos.find((p) => p.titulo === titulo);
  carrito.push(producto);
  mostrarCarrito();
};

const mostrarCarrito = () => {
  const carritoDiv = document.querySelector("#carrito");
  carritoDiv.innerHTML = "";

  let total = 0;
  const productosEnCarrito = {};
  carrito.forEach((producto) => {
    if (!productosEnCarrito[producto.titulo]) {
      productosEnCarrito[producto.titulo] = producto;
      productosEnCarrito[producto.titulo].cantidad = 1;
    } else {
      productosEnCarrito[producto.titulo].cantidad++;
    }
  });

  Object.values(productosEnCarrito).forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.innerHTML = `
      <h6>${producto.titulo}</h6>
      <p>Cantidad: ${producto.cantidad}</p>
      <p>$${producto.precio}</p>
      <button class="btn btn-danger mb-2" onclick="eliminarDelCarrito('${producto.titulo}')">X</button>
    `;
    total += producto.precio * producto.cantidad;
    carritoDiv.appendChild(productoDiv);
  });

  carritoDiv.innerHTML += `
    <p>Total: $${total}</p>
    <button class="btn btn-danger" onclick="vaciarCarrito()">Vaciar carrito</button>
    <button class="btn btn-success"onclick="pagar()">Pagar</button>
`;
};

const pagar = () => {
  const total = calcularTotal();
  if (total <= dinero) {
    Swal.fire(
      "¡El producto es tuyo!",
      "Ya esta disponible en tu biblioteca de juegos para que lo puedas descargar.",
      "success"
    );
  } else {
    Swal.fire(
      "No tenes fondos suficientes :(",
      "Revisa tu billetera y volvé a intentar.",
      "error"
    );
  }
};

const calcularTotal = () => {
  let total = 0;
  carrito.forEach((producto) => {
    total += producto.precio;
  });
  return total;
};

const eliminarDelCarrito = (titulo) => {
  carrito = carrito.filter((producto) => producto.titulo !== titulo);
  mostrarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  mostrarCarrito();
};

mostrarProductos();
