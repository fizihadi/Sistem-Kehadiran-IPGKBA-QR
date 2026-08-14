const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRLXBGSxjCn8jiNY-t1LRYU0-7t4VdlRs__E2ydmSqv_DO_8_wxrWd7HIvVSCpvbJMWw/exec";
let qrRefreshInterval = null;

function fetchPass() {
  let matric = document.getElementById("matricInput").value.trim();
  let errorDiv = document.getElementById("errorMessage");
  let nameDiv = document.getElementById("studentName");
  let qrDiv = document.getElementById("qrcode");

  // Clear existing interval
  if (qrRefreshInterval) clearInterval(qrRefreshInterval);

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
        nameDiv.innerText = "HI, " + data.name + "!";
          
        // Generate dynamic timed QR
        function generateTimedQR() {
          qrDiv.innerHTML = "";
          let timedPayload = data.uniqueCode + "|" + Date.now();
          new QRCode(qrDiv, { 
            text: timedPayload, 
            width: 180, 
            height: 180 
          });
        }

        // Generate immediately
        generateTimedQR();

        // Auto-refresh QR code every 30 seconds
        qrRefreshInterval = setInterval(generateTimedQR, 60000);

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

// Enable pressing "Enter" key
document.getElementById("matricInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    fetchPass();
  }
});

// Prevent paste on IC input
document.getElementById("matricInput").addEventListener("paste", function(e) {
  e.preventDefault();
  alert("Tak boleh copy & paste yee");

});
