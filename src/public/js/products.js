const addToCart = async (cid, pid) => {
  const data = await fetch(
    `http://localhost:8080/api/carts/${cid}/product/${pid}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  const response = await data.json();
  if (response.status === "success") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `${response.message}`,
      icon: "success",
    });
  }
  if (response.status === "error") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: `Error`,
      text: `${response.message}`,
      icon: "error",
    });
  }
};
