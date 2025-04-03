document.getElementById('getValueButton').addEventListener('click', function() {
    const section = document.getElementById('redisSection').value; // 'redisSection' 입력값을 사용

    if (!section) {
        document.getElementById('result').innerText = 'Please enter a section';
        return;
    }

    fetch('http://fuelcelldr.nstek.com:11180/FDC/Proj/mjkoo/js/config/redis_config.php?section=' + encodeURIComponent(section))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                document.getElementById('result').innerText = 'Error: ' + data.error;
            } else {
                document.getElementById('result').innerText = JSON.stringify(data, null, 2); // JSON 포맷으로 출력
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'An error occurred: ' + error.message;
        });
});
