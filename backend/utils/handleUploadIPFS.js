require('dotenv').config();

const uploadToPinata = async (fileBuffer, fileName) => {
    const url = process.env.PINATA_UPLOAD_URL;

    let data = new FormData();
    
    const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
    data.append('file', blob, fileName);
    
    const metadata = JSON.stringify({ name: fileName });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({ cidVersion: 0 });
    data.append('pinataOptions', options);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET
            }
        });

        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata:', error);
        throw error;
    }
};

const deleteFileFromPinata = async (cid) => {
    try {
        const response = await fetch(`${process.env.PINATA_DELETE_URL}/${cid}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error eliminando la imagen: ${errorData.error || response.statusText}`);
        }

        console.log(`✅ Imagen ${cid} eliminada de Pinata`);
    } catch (error) {
        console.error(`❌ Error eliminando la imagen de Pinata:`, error.message);
    }
};

module.exports = { uploadToPinata, deleteFileFromPinata };
