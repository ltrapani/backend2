const socket = io();
const container = document.querySelector("#tbody-products");
const file1 = document.querySelector("#file1");
const file2 = document.querySelector("#file2");
const file3 = document.querySelector("#file3");
const productSelect = document.querySelector("#productSelect");

socket.on("realTimeProducts", (data) => {
  let products = "";
  data.forEach((p) => {
    products += `
    <tr>
      <td>${p.title}</td>
      <td>${p.code}</td>
      <td>$${p.price}</td>
      <td>${p.stock}</td>
      <td>${p.status}</td>
      <td>${p.category}</td>
      <td>${p.owner}</td>
      <td><button
        class="btn btn-outline-danger btn-sm"
        onclick="deleteProduct('${p._id}')"
      >x</button></td>
    </tr>`;
  });
  container.innerHTML = products;
});

const addProduct = document.querySelector("#addProduct");
const formAddProduct = document.querySelector("#formAddProduct");

addProduct.addEventListener("click", async (e) => {
  e.preventDefault();

  const product = {
    title: formAddProduct.title.value,
    description: formAddProduct.description.value,
    code: formAddProduct.code.value,
    price: formAddProduct.price.value,
    stock: formAddProduct.stock.value,
    category: formAddProduct.category.value,
  };
  const response = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const jsonProduct = await response.json();
  if (jsonProduct.status === "error") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `${jsonProduct.message}`,
      icon: "error",
    });
  }
  if (jsonProduct.status === "success") {
    if (!file1.files.length && !file2.files.length && !file3.files.length) {
      formAddProduct.reset();
      return await Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `Producto agregado`,
        icon: "success",
      });
    }

    const formData = new FormData();

    formData.append("products", file1.files[0]);
    formData.append("products", file2.files[0]);
    formData.append("products", file3.files[0]);

    const pid = jsonProduct.response._id;
    const uid = jsonProduct.user._id;

    const data = await fetch(
      `/api/users/${uid}/documents?storage=products&pid=${pid}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const jsonFiles = await data.json();
    if (jsonFiles.status === "success") {
      formAddProduct.reset();
      await Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        text: `Producto agregado`,
        icon: "success",
      });
    }
    if (jsonFiles.status === "error") {
      await Swal.fire({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        title: `Error`,
        text: `${jsonFiles?.message}`,
        icon: "error",
      });
    }
  }
});

const deleteProduct = async (id) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (json.status === "success") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto borrado`,
      icon: "success",
    });
  }
  if (json.status === "error") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `${json.message}`,
      icon: "error",
    });
  }
};
