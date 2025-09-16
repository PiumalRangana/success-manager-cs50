// Wait until the DOM (HTML structure) is fully loaded before running JS
document.addEventListener("DOMContentLoaded", () => {

    // ================= Toggle Password Visibility =================
    const togglePassword = document.getElementById("togglePassword"); // Eye icon for password field
    const passwordInput = document.getElementById("password");        // Password input field

    // When the eye icon is clicked, toggle between "password" and "text" type
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;

        // Switch the icon between "eye" and "eye-slash"
        togglePassword.classList.toggle("bi-eye");
        togglePassword.classList.toggle("bi-eye-slash");
    });


    // ================= Toggle Confirm Password Visibility =================
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword"); // Eye icon for confirm password
    const confirmPasswordInput = document.getElementById("confirm_password");       // Confirm password input field

    // When the eye icon is clicked, toggle between "password" and "text" type
    toggleConfirmPassword.addEventListener("click", () => {
        const type = confirmPasswordInput.type === "password" ? "text" : "password";
        confirmPasswordInput.type = type;

        // Switch the icon between "eye" and "eye-slash"
        toggleConfirmPassword.classList.toggle("bi-eye");
        toggleConfirmPassword.classList.toggle("bi-eye-slash");
    });
    // ================= Confirm password Validation =================
    const registerForm = document.getElementById("registerForm");
    const errorField = document.getElementById("errorField")
        registerForm.addEventListener("submit", (e) => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault(); // stop form from submitting
            errorField.textContent = "Passwords do not match!";
            confirmPasswordInput.focus();
        }
    });
});
