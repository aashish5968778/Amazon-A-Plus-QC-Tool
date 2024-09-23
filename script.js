// Function to preview the uploaded image in modules and auto-start QC
function startQC(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const report = document.getElementById(`${imgId}Report`);

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            runQC(input.files[0], report);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// QC Function to validate image size, dimensions, and format
function runQC(file, reportElement) {
    const maxSize = 2; // Maximum file size in MB
    const requiredWidth = 970;
    const requiredHeight = 600;
    
    // Validate file size
    const size = file.size / 1024 / 1024; // Convert to MB
    const sizeStatus = size <= maxSize ? "Pass" : `Fail (${size.toFixed(2)} MB)`;

    // Validate dimensions
    const img = new Image();
    img.onload = function() {
        const dimensionsStatus = (img.width === requiredWidth && img.height === requiredHeight)
            ? "Pass"
            : `Fail (${img.width}x${img.height})`;
        // Display the report
        reportElement.innerHTML = `
            <p>File Size: ${sizeStatus}</p>
            <p>Dimensions: ${dimensionsStatus}</p>
        `;
    };
    img.src = URL.createObjectURL(file);

    // Validate format
    const formatStatus = file.type === "image/jpeg" ? "Pass" : `Fail (${file.type})`;
    reportElement.innerHTML += `<p>Format: ${formatStatus}</p>`;
}

// Function to type or paste text into a module
function typeOrPasteText(elementId) {
    const text = prompt("Type or paste the text:", "");
    if (text !== null) {
        document.getElementById(elementId).innerText = text;
    }
}
