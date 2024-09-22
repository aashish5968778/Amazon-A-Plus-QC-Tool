// Function to hide the welcome screen and show the main tool
document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById('welcomeScreen').style.display = 'none'; // Hide the welcome screen
    document.getElementById('mainTool').classList.remove('hidden'); // Show the main tool
});

// Function to preview the image upload
function previewImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
function handleCredentialResponse(response) {
    // Decode the credential response here
    console.log("ID token: " + response.credential);
    
    // For now, we’ll just hide the login screen and show the main tool
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainTool').classList.remove('hidden');
}
