const socket = io();
const container = document.querySelector("#tbody-products");
const file1 = document.querySelector("#file1");
const file2 = document.querySelector("#file2");
const file3 = document.querySelector("#file3");
const productSelect = document.querySelector("#productSelect");

socket.on("realTimeProducts", (data) => {
  let products = "";
  let selectList = `<option value="">Select a product</option>`;
  data.forEach((p) => {
    products += `
    <tr>
      <td>${p._id}</td>
      <td>${p.title}</td>
      <td>${p.description}</td>
      <td>${p.code}</td>
      <td>${p.price}</td>
      <td>${p.status}</td>
      <td>${p.category}</td>
      <td>${p.owner}</td>
      <td><button
        class="btn btn-outline-danger btn-sm"
        onclick="deleteProduct('${p._id}')"
      >x</button></td>
    </tr>`;

    selectList += `
    <option value="${p._id}">
      ${p.title} - ${p._id}
    </option>
    `;
  });
  container.innerHTML = products;
  productSelect.innerHTML = selectList;
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
  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const json = await response.json();
  if (json.status === "success") {
    formAddProduct.reset();
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Producto agregado`,
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
});

const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
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
      willClose: () => {
        window.location.reload();
      },
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

const uploadProductFiles = async (uid) => {
  if (!productSelect.value) {
    return await Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      title: `Error`,
      text: `You must select a product!`,
      icon: "error",
    });
  }
  const formData = new FormData();

  formData.append("products", file1.files[0]);
  formData.append("products", file2.files[0]);
  formData.append("products", file3.files[0]);

  const data = await fetch(
    `/api/users/${uid}/documents?storage=products&pid=${productSelect.value}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const json = await data.json();
  if (json.status === "success") {
    await Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      text: `Uploaded files success!`,
      icon: "success",
      willClose: () => {
        window.location.reload();
      },
    });
  }
  if (json.status === "error") {
    await Swal.fire({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      title: `Error`,
      text: `${json?.message}`,
      icon: "error",
    });
  }
};
