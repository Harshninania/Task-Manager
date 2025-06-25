const emailInput = document.getElementById('email');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const otpInput = document.getElementById('otpInput');
const registerBtn = document.getElementById('registerBtn');
let otpVerified = false;

// Helper: check for IITR email
function isIITREmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.iitr\.ac\.in$/.test(email);
}
const testMode = true; 
// Send OTP
sendOtpBtn.onclick = async () => {
  const email = emailInput.value.trim();

if (!testMode && !isIITREmail(email)) {
  alert("Only IITR emails are allowed.");
  return;
}
  try {
    const res = await fetch("http://localhost:8000/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (data.success) {
      alert("OTP sent to your email.");
      otpInput.style.display = "block";
      verifyOtpBtn.style.display = "inline-block";
    } else {
      alert(data.message || "Failed to send OTP.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error while sending OTP.");
  }
};

// Verify OTP
verifyOtpBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const otp = otpInput.value.trim();

  try {
    const res = await fetch("http://localhost:8000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (data.success) {
      alert("OTP verified!");
      otpVerified = true;
    } else {
      alert(data.message || "Invalid OTP.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error verifying OTP.");
  }
};

// Final registration
document.getElementById("signupForm").onsubmit = async function (e) {
  e.preventDefault();

  const name = document.getElementById('enrollment').value.trim();
  const email = emailInput.value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (!otpVerified) {
    alert("Please verify your OTP first.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (data.success) {
      alert("Account created successfully!");
      window.location.href = "../index.html";
    } else {
      alert(data.message || "Signup failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error during signup.");
  }
};
