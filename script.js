// Function to preview the uploaded image in modules and trigger QC automatically
function previewImage(inputId, imgId, qcResultId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            startQC(input.files[0], qcResultId); // Automatically start QC after image is uploaded
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

// Function to start the QC process
function startQC(file, qcResultId) {
    const qcResult = document.getElementById(qcResultId);

    if (!file) {
        qcResult.innerText = "Please upload an image before starting QC.";
        return;
    }

    // Validate Size (under 2MB)
    const size = file.size / 1024 / 1024; // in MB
    if (size > 2) {
        qcResult.innerHTML += `<p>Size: <span style="color:red;">Fail (${size.toFixed(2)} MB)</span></p>`;
    } else {
        qcResult.innerHTML += `<p>Size: <span style="color:green;">Pass (${size.toFixed(2)} MB)</span></p>`;
    }

    // Validate Dimensions
    const img = new Image();
    img.onload = function() {
        const width = img.width;
        const height = img.height;
        const dimensionsText = `${width}x${height}px`;

        // Assuming 970x600px is the valid dimension for A+ content (customize as needed)
        if (width === 970 && height === 600) {
            qcResult.innerHTML += `<p>Dimensions: <span style="color:green;">Pass (${dimensionsText})</span></p>`;
        } else {
            qcResult.innerHTML += `<p>Dimensions: <span style="color:red;">Fail (${dimensionsText})</span></p>`;
        }
    };
    img.src = URL.createObjectURL(file);

    // Validate Format (JPEG only)
    const fileFormat = file.type;
    if (fileFormat === "image/jpeg") {
        qcResult.innerHTML += `<p>Format: <span style="color:green;">Pass (JPEG)</span></p>`;
    } else {
        qcResult.innerHTML += `<p>Format: <span style="color:red;">Fail (${fileFormat})</span></p>`;
    }

    qcResult.innerText += "QC completed!";
}
