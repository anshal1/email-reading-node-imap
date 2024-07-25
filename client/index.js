const Email = async () => {
  const data = await fetch("http://localhost:5000", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const res = await data.json();
  console.log(res);
};
Email();
