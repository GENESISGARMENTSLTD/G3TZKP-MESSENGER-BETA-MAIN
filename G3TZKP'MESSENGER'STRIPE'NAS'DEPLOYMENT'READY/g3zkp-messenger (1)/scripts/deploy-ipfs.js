
/**
 * G3ZKP IPFS Deployment Script
 * Requires PINATA_API_KEY and PINATA_SECRET_API_KEY
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const pinDirectoryToIPFS = async (src) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    
    const recursiveAppend = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                recursiveAppend(filePath);
            } else {
                data.append('file', fs.createReadStream(filePath), {
                    filepath: path.relative(path.join(src, '..'), filePath)
                });
            }
        }
    };

    recursiveAppend(src);

    const response = await axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; border=${data._boundary}`,
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
        }
    });

    console.log('Successfully pinned to IPFS!');
    console.log('CID:', response.data.IpfsHash);
};

// run with: node scripts/deploy-ipfs.js ./out
// pinDirectoryToIPFS(process.argv[2]);
