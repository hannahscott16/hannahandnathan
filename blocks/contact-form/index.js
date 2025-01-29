// Contact form block initialization and functionality
const config = {
  formEndpoint: 'https://your-azure-function-url/api/sendEmail', // We'll get this URL after creating the Azure Function
  fields: {
    name: 'name',
    email: 'email',
    message: 'message'
  }
};

export default async function decorate(block) {
  // Create form structure
  const form = document.createElement('form');
  form.className = 'contact-form';
  
  // Create form fields
  const nameField = `
    <div class="form-field">
      <label for="${config.fields.name}">Name</label>
      <input type="text" id="${config.fields.name}" name="${config.fields.name}" required>
    </div>
  `;
  
  const emailField = `
    <div class="form-field">
      <label for="${config.fields.email}">Email</label>
      <input type="email" id="${config.fields.email}" name="${config.fields.email}" required>
    </div>
  `;
  
  const messageField = `
    <div class="form-field">
      <label for="${config.fields.message}">Message</label>
      <textarea id="${config.fields.message}" name="${config.fields.message}" required></textarea>
    </div>
  `;
  
  const submitButton = `
    <div class="form-field">
      <button type="submit">Send Message</button>
    </div>
  `;
  
  form.innerHTML = nameField + emailField + messageField + submitButton;
  
  // Update form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    const formData = new FormData(form);
    const data = {
      to: 'hannah_scott16@outlook.com',
      from: formData.get(config.fields.email),
      name: formData.get(config.fields.name),
      message: formData.get(config.fields.message)
    };
    
    try {
      const response = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        form.appendChild(successMessage);
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
      form.appendChild(errorMessage);
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
  
  block.textContent = '';
  block.appendChild(form);
} 