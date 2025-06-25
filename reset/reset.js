const step1Form = document.getElementById('step1-form');
const step2Form = document.getElementById('step2-form');
const messageBox = document.getElementById('message');

if (!step1Form || !step2Form || !messageBox) {
  alert("One or more required elements are missing from the page (form or message box).");
}
let currentUsername = '';

step1Form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = step1Form.elements['username'].value;

  try {
    const res = await fetch('http://localhost:8000/request-reset', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    messageBox.textContent = data.message;

    if (data.success) {
      currentUsername = username;
      step1Form.style.display = 'none';
      step2Form.style.display = 'block';
    }
  } catch (err) {
    console.error('Reset OTP error:', err);
    messageBox.textContent = 'Something went wrong while requesting OTP.';
  }
});


step2Form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const otp = step2Form.elements['otp'].value;
  const newPassword = step2Form.elements['newPassword'].value;

  const res = await fetch('http://localhost:8000/verify-reset', {

    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUsername, otp, newPassword })
  });

  const data = await res.json();
  messageBox.textContent = data.message;

  if (data.success) {
    step2Form.reset();
    messageBox.textContent += ' You can now log in.';
  }
});
