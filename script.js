document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('acl-study-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const aclRadios = document.querySelectorAll('input[name="acl_tear"]');
    const conditionalFields = document.getElementById('injury-details');

    // 1. Navigation Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Conditional Form Logic
    // Initially hide details if "No" or nothing is selected
    const toggleInjuryDetails = () => {
        const selected = document.querySelector('input[name="acl_tear"]:checked');
        if (selected && selected.value === 'yes') {
            conditionalFields.style.display = 'block';
            // Make inner fields required if shown
            conditionalFields.querySelectorAll('select, input').forEach(el => el.required = true);
        } else {
            conditionalFields.style.display = 'none';
            conditionalFields.querySelectorAll('select, input').forEach(el => el.required = false);
        }
    };

    aclRadios.forEach(radio => radio.addEventListener('change', toggleInjuryDetails));
    toggleInjuryDetails(); // Run on load

    // 3. Formspree Submission Handling
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Basic check for placeholder ID
        if (form.action.includes("your_form_id")) {
            status.innerHTML = "<strong>Setup Required:</strong> Please replace 'your_form_id' in the index.html form action with your actual Formspree ID.";
            status.className = "error";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Thank you for your participation! Your data has been successfully collected.";
                status.className = "success";
                form.reset();
                toggleInjuryDetails();
            } else {
                const result = await response.json();
                if (Object.hasOwn(result, 'errors')) {
                    status.innerHTML = result.errors.map(error => error.message).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form.";
                }
                status.className = "error";
            }
        } catch (error) {
            status.innerHTML = "Oops! Connection failed. Please try again later.";
            status.className = "error";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit Participation";
        }
    }

    form.addEventListener("submit", handleSubmit);

    // 4. Subtle Parallax / Animations
    window.addEventListener('scroll', () => {
        const shape = document.querySelector('.abstract-shape');
        const scrolled = window.pageYOffset;
        if (shape) {
            shape.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.05}deg)`;
        }
    });

    // 5. Success Toast Simulation (Developer Note)
    console.log("ACL Study Template Initialized.");
});
