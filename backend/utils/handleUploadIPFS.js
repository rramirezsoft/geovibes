const uploadToPinata = async (fileBuffer, fileName) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    let data = new FormData();
    
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    data.append('file', blob, fileName);
    
    const metadata = JSON.stringify({
        name: fileName
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET,
            }
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }

        const responseData = JSON.parse(responseText);
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata:', error);
        throw error;
    }
};

module.exports = { uploadToPinata };