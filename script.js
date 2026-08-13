const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6MRHQgzAI_QJOtn2s9EyBPmVp8BoK3ECKrAAVLibFvRQLN4_HTt3LIvF8FudYFI3uBQ/exec";

function fetchPass() {
  let matric = document.getElementById("matricInput").value.trim();
  let errorDiv = document.getElementById("errorMessage");
  let nameDiv = document.getElementById("studentName");
  let qrDiv = document.getElementById("qrcode");

  // Reset UI elements
  errorDiv.innerText = "";
  nameDiv.innerText = "Menyemak Data...";
  qrDiv.innerHTML = "";

  if (!matric) {
    errorDiv.innerText = "Isikan Nombor Kad Pengenalan Tanpa -";
    nameDiv.innerText = "";
    return;
  }

  fetch(GOOGLE_SCRIPT_URL + "?action=lookup&matric=" + encodeURIComponent(matric))
    .then(res => res.json())
    .then(data => {
      if (data.found) {
        nameDiv.innerText = "Selamat Datang, " + data.name + "!";
        
        // Generate QR code
        new QRCode(qrDiv, { 
          text: data.uniqueCode, 
          width: 180, 
          height: 180 
        });
      } else {
        nameDiv.innerText = "";
        errorDiv.innerText = "❌ Nombor Kad Pengenalan tidak dijumpai!";
      }
    })
    .catch(err => {
      nameDiv.innerText = "";
      errorDiv.innerText = "Error searching database: " + err.message;
    });
}

// Enable pressing "Enter" key to generate QR code automatically
document.getElementById("matricInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    fetchPass();
  }
});