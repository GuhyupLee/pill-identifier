document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const imageUploadLabel = document.querySelector('label[for="image-upload"]');
    const identifyBtn = document.getElementById('identify-btn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            imageUploadLabel.style.display = 'none';
        }

        reader.readAsDataURL(file);
    });

    identifyBtn.addEventListener('click', function() {
        const file = imageUpload.files[0];
        if (!file) {
            alert('먼저 이미지를 업로드해주세요.');
            return;
        }

        loadingDiv.classList.remove('hidden'); // 로딩 메시지 표시

        const url = 'http://139.84.134.82:22/identify';
        const formData = new FormData();
        formData.append('image', file);

        fetch(url, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('서버에서 응답을 받지 못했습니다.');
            return response.json();
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('알약 식별 중 에러 발생:', error);
            resultDiv.innerHTML = '<p>알약 식별 중 오류가 발생했습니다.</p>';
        })
        .finally(() => {
            loadingDiv.classList.add('hidden'); // 로딩 메시지 숨김
        });
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