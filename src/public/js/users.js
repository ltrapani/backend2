const form = document.querySelector("#updateRoleForm");
const idUser = document.querySelector("#idUser");
const role = document.querySelector("#role");
const listUsers = document.querySelector("#listUsers");
const selectUser = document.querySelector("#selectUser");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const idUser = selectUser.value;

  fetch(`/api/users/premium/${idUser}`, {
    method: "POST",
    body: JSON.stringify({ role: role.value }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => {
    data.json().then((result) => {
      if (result.status === "success") {
        idUser.value = "";
        role.value = "";
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          text: `${result.message}`,
          icon: "success",
          willClose: () => {
            location.reload();
          },
        });
      }
      if (result.status === "error") {
        Swal.fire({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          title: `Error`,
          text: `${result?.message}`,
          icon: "error",
        });
      }
    });
  });
});

const deleteUser = async (id) => {
  try {
    const response = await Swal.fire({
      title: `Do you want to delete the user ID:${id}`,
      showConfirmButton: true,
      confirmButtonText: "Delete",
      showCancelButton: true,
    });
    if (response.isConfirmed) {
      Swal.fire({
        title: "Wait...",
        html: "<strong>Wait...</strong>",
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const data = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const json = await data.json();
      if (json.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          title: `${json.message}`,
          icon: "success",
          willClose: () => {
            location.reload();
          },
        });
      }
      if (json.status === "error") {
        Swal.fire({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          title: `Failed to delete user.`,
          text: `${json.message}`,
          icon: "error",
          willClose: () => {
            location.reload();
          },
        });
      }
    }
  } catch (error) {
    Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: true,
      title: `ERROR.`,
      text: `${error.message}`,
      icon: "error",
    });
  }
};

const deleteInactiveUsers = async () => {
  try {
    const response = await Swal.fire({
      title: `Do you want to delete all inactive users???`,
      showConfirmButton: true,
      confirmButtonText: "Delete",
      showCancelButton: true,
    });
    if (response.isConfirmed) {
      Swal.fire({
        title: "Wait...",
        html: "<strong>Wait...</strong>",
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const data = await fetch(`/api/users`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const json = await data.json();
      if (json.status === "success") {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          title: `${json.message}`,
          icon: "success",
          willClose: () => {
            location.reload();
          },
        });
      }
      if (json.status === "error") {
        Swal.fire({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          title: `ERROR.`,
          text: `${json.message}`,
          icon: "error",
          willClose: () => {
            location.reload();
          },
        });
      }
    }
  } catch (error) {
    Swal.fire({
      toast: true,
      position: "center",
      showConfirmButton: true,
      title: `ERROR.`,
      text: `${error.message}`,
      icon: "error",
    });
  }
};

const getUser = async () => {
  const data = await fetch(`/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { users } = await data.json();
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${moment(user.last_connection).format("DD MM YYYY - h:mm:ss a")}</td>
      <td>
        <button 
          class="btn btn-sm btn-danger"
          onclick="deleteUser('${user._id}')"
        >
          x
        </button> 
      </td>     
    `;
    listUsers.append(tr);

    const option = document.createElement("option");
    option.value = user._id;
    option.innerText = user.email;
    selectUser.append(option);
  });
};

getUser();
