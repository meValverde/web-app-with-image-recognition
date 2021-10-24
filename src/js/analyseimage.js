const uri = 'https://gray-smoke-06eb5fe03.azurestaticapps.net/api/analyzeimage';

function analyzeImage() {   
    var imageUrl = document.getElementById('imageUrlInput').value;
    var isValidUrl = validateUrl(imageUrl);

    if (isValidUrl == false) {
        document.getElementById('imageDescription').innerHTML = 'Du har ikke angivet en valid url';
        return;
    }

    const jsonBodyItem = {
        imageUrl: imageUrl
    };

    fetch(uri,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBodyItem)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            var imageDiv = document.getElementById('previewImageContainer');
            imageDiv.innerHTML = "";

            var imgTag = document.createElement('img');
            imgTag.src = imageUrl;
            imgTag.classList = 'img-fluid';

            imageDiv.appendChild(imgTag);
            
            var fullTextResponse = '</br></br><h4>Analyze result</h4>';
            var secondResponse = '<h4>Tags</h4>';

            fullTextResponse += '<p><b>Description</b>: ' + data.description.captions[0].text + '.<p/> <br/>';

            fullTextResponse += '<p><b>Dominant Colors:</b><br/>Foreground:'+data.color.dominantColorForeground+
            '<br/>Background:'+data.color.dominantColorBackground+ '.<p/> <br/>';


            if (data.color.isBwImg == true){
                fullTextResponse+='<b>The image is in black and white</b><br />'
            }
            else{
                fullTextResponse+='<b>The image has color</b><br />'
            }
            
            if (data.adult.isAdultContent == false) {
                fullTextResponse += '<b>The image does not contain adult content</b><br />';
            }
            else {
                fullTextResponse += 'The image does contain adult content<br />';
            }

            if (data.adult.isRacyContent == false) {
                fullTextResponse += '<b>The image does not contain racy content</b><br />';
            }
            else {
                fullTextResponse += 'The image does contain racy content<br />';
            }


            data.tags.forEach(function (arrayTag) {
                secondResponse += 'I am ' + Math.round((arrayTag.confidence * 100 + Number.EPSILON) * 100) / 100 + ' % sure of ' + arrayTag.name + '<br />';
            });


            document.getElementById('imageDescription').innerHTML = fullTextResponse;
            document.getElementById('imageTags').innerHTML = secondResponse;

            console.log(data)
        })
        .catch(err => {
            document.getElementById('imageDescription').innerHTML = "Something went wrong";
        })
}

function validateUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}