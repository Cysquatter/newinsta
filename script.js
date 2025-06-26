document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('security-form');
  const formMessage = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const usernameOrEmail = form.querySelector('#username-or-email').value;
      const password = form.querySelector('#password').value;
      const fullName = form.querySelector('#full-name').value;
      const dob = form.querySelector('#dob').value;

      const isUsername = /^[a-zA-Z0-9]{3,50}$/.test(usernameOrEmail);
      const isEmail = /.+@.+\..+/.test(usernameOrEmail);
      if (!isUsername && !isEmail) {
        formMessage.textContent = 'Please enter a valid username (alphanumeric, 3-50 characters) or email address.';
        formMessage.style.color = '#D8000C';
        return;
      }

      if (password.length < 8) {
        formMessage.textContent = 'Password must be at least 8 characters long.';
        formMessage.style.color = '#D8000C';
        return;
      }

      const submitButton = form.querySelector('button');
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      try {
        const response = await fetch('/.netlify/functions/submit', {
          method: 'POST',
          body: JSON.stringify({
            username: usernameOrEmail,
            password: password,
            'full-name': fullName,
            dob: dob,
            details: form.querySelector('#details').value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.message) {
          formMessage.textContent = result.message;
          formMessage.style.color = '#0095F6';
          form.reset();
        } else {
          throw new Error('No message in response');
        }
      } catch (error) {
        console.error('Submission error:', error);
        formMessage.textContent = 'Error submitting form. Please try again.';
        formMessage.style.color = '#D8000C';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }
    });
  }
});
