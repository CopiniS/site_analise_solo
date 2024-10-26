

window.addEventListener('load', function() {
    const path = window.location.pathname;

    if (path === "/") {
        window.location.href = "/login.html"; // Redireciona para login por padrão
    }
});

document.getElementById("inputGroupSelect04").addEventListener("change", function() {
    var selectedValue = this.value;
    var pdfDiv = document.getElementById("pdfDiv");

    if (selectedValue == "2") {
        formDiv.style.display = "none";
        pdfDiv.style.display = "flex";
    } else if (selectedValue == "1") {
        pdfDiv.style.display = "none";
        formDiv.style.display = "grid";
    }
});
