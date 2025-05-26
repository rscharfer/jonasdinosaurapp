async function getGeneratedImage(prompt) {
    // takes in a prompt and makes a call to an endpoint which holds API key

    const endpointWithKey = '/.netlify/functions/getGeneratedImage';
    // perhaps this could point to a serverless function?? ^^

    let response;
        try {
            response = await fetch(endpointWithKey, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({prompt}),
             });
             
             return await response.json();

        } catch(e) {
            throw new Error('request to proxy server did not work')
        }
}

export default getGeneratedImage;