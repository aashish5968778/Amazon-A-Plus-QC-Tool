// Handle start button click to show the login screen
document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("welcomeScreen").classList.add("hidden"); // Hide welcome screen
    document.getElementById("loginScreen").classList.remove("hidden"); // Show login screen
});

// Function to handle the response from Google Sign-In
function handleCredentialResponse(response) {
    // Decode the JWT token to get user info
    const data = parseJwt(response.credential);

    // Log the user information for debugging
    console.log(data);

    // Make sure that user data is available
    if (data) {
        // Display the user info on the page
        document.getElementById("user-info").innerHTML = `
            <h2>Welcome, ${data.name}</h2>
            <p>Email: ${data.email}</p>
            <img src="${data.picture}" alt="Profile Picture" style="border-radius: 50%;"/>
        `;

        // Hide the login screen and show the main tool
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("mainTool").classList.remove("hidden");
    } else {
        console.error('Failed to decode JWT token');
    }
}

// Function to decode JWT token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Function to preview the uploaded image
function previewImage() {
    const file = document.getElementById("imageUpload").files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        document.getElementById("previewImage").src = reader.result;
        document.getElementById("qcResult").innerText = "Image uploaded. Ready for QC.";
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Function to start the QC process
function startQC() {
    const file = document.getElementById("imageUpload").files[0];

    if (!file) {
        document.getElementById("qcResult").innerText = "Please upload an image before starting QC.";
        return;
    }

    // Validate Size (under 2MB)
    const size = file.size / 1024 / 1024; // in MB
    if (size > 2) {
        document.getElementById("sizeValidation").innerHTML = `<span style="color:red;">Fail (${size.toFixed(2)} MB)</span>`;
    } else {
        document.getElementById("sizeValidation").innerHTML = `<span style="color:green;">Pass (${size.toFixed(2)} MB)</span>`;
    }

    // Validate Dimensions
    const img = new Image();
    img.onload = function() {
        const width = img.width;
        const height = img.height;
        const dimensionsText = `${width}x${height}px`;

        // Assuming 970x600px is the valid dimension for A+ content (customize as needed)
        if (width === 970 && height === 600) {
            document.getElementById("dimensionsValidation").innerHTML = `<span style="color:green;">Pass (${dimensionsText})</span>`;
        } else {
            document.getElementById("dimensionsValidation").innerHTML = `<span style="color:red;">Fail (${dimensionsText})</span>`;
        }
    };
    img.src = URL.createObjectURL(file);

    // Validate Format (JPEG only)
    const fileFormat = file.type;
    if (fileFormat === "image/jpeg") {
        document.getElementById("formatValidation").innerHTML = `<span style="color:green;">Pass (JPEG)</span>`;
    } else {
        document.getElementById("formatValidation").innerHTML = `<span style="color:red;">Fail (${fileFormat})</span>`;
    }

    document.getElementById("qcResult").innerText = "QC completed!";
}
