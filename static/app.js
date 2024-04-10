$(document).ready(function() {
    const imageUpload = $('#image-upload');
    const imagePreview = $('#image-preview');
    const identifyBtn = $('#identify-btn');
    const resultDiv = $('#result');

    imageUpload.change(function() {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            imagePreview.html(`<img src="${e.target.result}" alt="Uploaded Image" width="250">`);
        };

        reader.readAsDataURL(file);
    });

    identifyBtn.click(function() {
        const file = imageUpload[0].files[0];
        const formData = new FormData();
        formData.append('image', file);

        $.ajax({
            url: '/identify',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                resultDiv.html(`
                    <h2>${response.pill_name}</h2>
                    <p>효능효과: ${response.efficacy}</p>
                    <p>용법용량: ${response.dosage}</p>
                    <p>주의사항: ${response.precautions}</p>
                `);
            },
            error: function() {
                resultDiv.html('<p>Error identifying the pill.</p>');
            }
        });
    });
});