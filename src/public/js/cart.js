const ckeckout = async (id) => {
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
  const response = await fetch(`/api/carts/${id}/purchase`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const json = await response.json();
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
};
