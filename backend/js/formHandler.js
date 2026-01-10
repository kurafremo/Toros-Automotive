

document.getElementById("contact-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    if (res.ok) {
      document.getElementById("form-success").classList.remove("hidden");
      document.getElementById("form-fail").classList.add("hidden");
      document.getElementById("contact-form").reset();
    } else {
      throw new Error("Sunucu hatası");
    }
  } catch (err) {
    document.getElementById("form-fail").classList.remove("hidden");
    document.getElementById("form-success").classList.add("hidden");
  }
  
});
