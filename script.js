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
    const toggleInjuryDetails = () => {
        const selected = document.querySelector('input[name="acl_tear"]:checked');
        const aclSpecificFields = document.getElementById('acl-specific-fields');
        const bootsSelect = document.getElementById('boots');

        if (selected) {
            conditionalFields.style.display = 'block';

            // Always require the generic fields if any box is checked
            document.getElementById('surface').required = true;
            if (bootsSelect) bootsSelect.required = true;

            const surfaceLabel = document.querySelector('label[for="surface"]');
            const bootsLabel = document.querySelector('label[for="boots"]');

            if (selected.value === 'Yes') {
                if (aclSpecificFields) {
                    aclSpecificFields.style.display = 'block';
                    document.getElementById('injury-age').required = true;
                    document.getElementById('leg').required = true;
                }
                if (surfaceLabel) surfaceLabel.textContent = 'Playing surface at time of injury';
                if (bootsLabel) bootsLabel.textContent = 'Footwear at time of injury';
            } else {
                if (aclSpecificFields) {
                    aclSpecificFields.style.display = 'none';
                    document.getElementById('injury-age').required = false;
                    document.getElementById('leg').required = false;
                }
                if (surfaceLabel) surfaceLabel.textContent = 'Primary playing surface (past year)';
                if (bootsLabel) bootsLabel.textContent = 'Primary footwear (past year)';
            }

            // Resync the footwear validation so studs are only required if Cleats is active
            if (bootsSelect) bootsSelect.dispatchEvent(new Event('change'));

        } else {
            conditionalFields.style.display = 'none';
            conditionalFields.querySelectorAll('select, input').forEach(el => el.required = false);
        }
    };

    aclRadios.forEach(radio => radio.addEventListener('change', toggleInjuryDetails));
    toggleInjuryDetails(); // Run on load

    // 2.5 Conditional Footwear Logic
    const bootsSelect = document.getElementById('boots');
    const studPatternGroup = document.getElementById('stud-pattern-group');
    const studsSelect = document.getElementById('studs');

    if (bootsSelect && studPatternGroup) {
        bootsSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Cleats') {
                studPatternGroup.style.display = 'block';
                studsSelect.required = true;
            } else {
                studPatternGroup.style.display = 'none';
                studsSelect.required = false;
                studsSelect.value = ''; // Reset value
            }
        });
    }

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

    // 4. Spotlight Hover Effect
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hero.style.setProperty('--mouse-x', `${x}px`);
            hero.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // 5. Success Toast Simulation (Developer Note)
    console.log("ACL Study Template Initialized.");
});
