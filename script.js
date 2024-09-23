// Function to preview the uploaded image in modules
function previewImage(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Function to type or paste text into a module
function typeOrPasteText(elementId) {
    const text = prompt("Type or paste the text:", "");
    if (text !== null) {
        document.getElementById(elementId).innerText = text;
    }
}
