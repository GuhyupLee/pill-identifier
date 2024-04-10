document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const identifyBtn = document.getElementById('identify-btn');
    const resultDiv = document.getElementById('result');

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.createElement('img');
                imagePreview.src = e.target.result;
                imagePreview.alt = 'Uploaded Image';
                imagePreview.width = 250;
                resultDiv.before(imagePreview);
            };
            reader.readAsDataURL(file);
        }
    });

    identifyBtn.addEventListener('click', async function() {
        const file = imageUpload.files[0];
        if (!file) {
            alert('먼저 이미지를 업로드해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://mu0ivb40lh.execute-api.us-east-2.amazonaws.com/pill-identifier', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('서버에서 응답을 받지 못했습니다.');

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('알약 식별 중 에러 발생:', error);
            resultDiv.innerHTML = '<p>알약 식별 중 오류가 발생했습니다.</p>';
        }
    });

    function displayResults(data) {
        resultDiv.innerHTML = `
            <h2>${data.pill_name}</h2>
            <p>효능효과: ${data.efficacy}</p>
            <p>용법용량: ${data.dosage}</p>
            <p>주의사항: ${data.precautions}</p>
        `;
    }
});
