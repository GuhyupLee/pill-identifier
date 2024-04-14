document.addEventListener('DOMContentLoaded', function() {
    const frontImageUpload = document.getElementById('front-image-upload');
    const backImageUpload = document.getElementById('back-image-upload');
    const previewFrontImage = document.getElementById('preview-front-image');
    const previewBackImage = document.getElementById('preview-back-image');
    const identifyBtn = document.getElementById('identify-btn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    frontImageUpload.addEventListener('change', function(e) {
        previewImage(e, previewFrontImage);
    });

    backImageUpload.addEventListener('change', function(e) {
        previewImage(e, previewBackImage);
    });

    identifyBtn.addEventListener('click', function() {
        const frontFile = frontImageUpload.files[0];
        const backFile = backImageUpload.files[0];

        if (!frontFile || !backFile) {
            alert('앞면과 뒷면 이미지를 모두 업로드해주세요.');
            return;
        }

        loadingDiv.classList.remove('hidden');
        resultDiv.innerHTML = '';

        const url = 'http://172.30.1.48:8080/identify';
        const formData = new FormData();
        formData.append('front_image', frontFile);
        formData.append('back_image', backFile);

        fetch(url, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('서버에서 응답을 받지 못했습니다.');
            return response.json();
        })
        .then(data => {
            displayResults(data.pill_ids);
        })
        .catch(error => {
            console.error('알약 식별 중 에러 발생:', error);
            resultDiv.innerHTML = '<p>알약 식별 중 오류가 발생했습니다.</p>';
        })
        .finally(() => {
            loadingDiv.classList.add('hidden');
        });
    });

    function previewImage(event, previewElement) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        }

        reader.readAsDataURL(file);
    }

    function displayResults(pillIds) {
    const infoUrl = 'data/info.csv';
    const pillImagesDiv = document.getElementById('pill-images');
    const pillInfoDiv = document.getElementById('pill-info');

    fetch(infoUrl)
    .then(response => response.text())
    .then(text => {
        const rows = text.split('\n');
        const header = rows[0].split(',');
        const data = rows.slice(1).map(row => row.split(','));

        const matchingRows = data.filter(row => pillIds.includes(row[header.indexOf('품목일련번호')]));

        pillImagesDiv.innerHTML = matchingRows.map(row => `
            <div class="pill-item" data-id="${row[header.indexOf('품목일련번호')]}">
                <img src="images/${row[header.indexOf('품목일련번호')]}.png" alt="${row[header.indexOf('품목명')]}" class="mb-2">
                <span>${row[header.indexOf('품목명')]}</span>
            </div>
        `).join('');

        const pillItems = document.querySelectorAll('.pill-item');
        pillItems.forEach(item => {
            item.addEventListener('click', () => {
                const pillId = item.dataset.id;
                const selectedPill = matchingRows.find(row => row[header.indexOf('품목일련번호')] === pillId);

                document.getElementById('pill-name').textContent = selectedPill[header.indexOf('품목명')];
                document.getElementById('efficacy').textContent = selectedPill[header.indexOf('효능효과')];
                document.getElementById('dosage').textContent = selectedPill[header.indexOf('용법용량')];
                document.getElementById('precautions').textContent = selectedPill[header.indexOf('주의사항')];

                pillInfoDiv.classList.remove('hidden');
            });
        });
    })
    .catch(error => {
        console.error('정보 파일을 불러오는 중 에러 발생:', error);
        resultDiv.innerHTML = '<p>알약 정보를 불러오는 중 오류가 발생했습니다.</p>';
    });
}
});