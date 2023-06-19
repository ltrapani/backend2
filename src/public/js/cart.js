const checkout = async (id) => {
  const response = await Swal.fire({
    title: "Do you want to checkout the cart?",
    showConfirmButton: true,
    confirmButtonText: "Ckeckout",
    showCancelButton: true,
  });
  if (response.isConfirmed) {
    Swal.fire({
      title: "Wait...",
      html: "<strong>Process cart</strong>",
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const data = await fetch(`/api/carts/${id}/purchase`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const json = await data.json();
    if (json.status === "success") {
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: true,
        title: `Purchase success.`,
        text: `${json.message}`,
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
        showConfirmButton: true,
        title: `Purchase with error.`,
        text: `${json.message}`,
        icon: "error",
        willClose: () => {
          location.reload();
        },
      });
    }
  }
};

const removeItem = async (cid, pid) => {
  const response = await Swal.fire({
    title: "Do you want to delete this product?",
    showConfirmButton: true,
    confirmButtonText: "Delete",
    showCancelButton: true,
  });
  if (response.isConfirmed) {
    const data = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const json = await data.json();
    if (json.status === "success") {
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 1500,
        title: `Delete success.`,
        text: `${json.message}`,
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
        timer: 1500,
        title: `Delete with error.`,
        text: `${json.message}`,
        icon: "error",
        willClose: () => {
          location.reload();
        },
      });
    }
  }
};

const emptyCart = async (cid) => {
  const response = await Swal.fire({
    title: "Do you want to empty the cart?",
    showConfirmButton: true,
    confirmButtonText: "Empty",
    showCancelButton: true,
  });
  if (response.isConfirmed) {
    Swal.fire({
      title: "Wait...",
      html: "<strong>Process cart</strong>",
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const data = await fetch(`/api/carts/${cid}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const json = await data.json();
    if (json.status === "success") {
      Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: true,
        title: `Empty success.`,
        text: `${json.message}`,
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
        showConfirmButton: true,
        title: `Ther was an error.`,
        text: `${json.message}`,
        icon: "error",
        willClose: () => {
          location.reload();
        },
      });
    }
  }
};
