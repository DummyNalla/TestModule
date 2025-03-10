const baseUrl = "https://api.dailymotion.com";

async function searchResults(keyword) {
    try {
        const response = await fetch(`${baseUrl}/videos?fields=id,title,thumbnail_360_url&limit=10&search=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        
        const results = data.list.map(item => ({
            title: item.title,
            href: `https://www.dailymotion.com/video/${item.id}`,
            image: item.thumbnail_360_url
        }));

        return JSON.stringify(results);
    } catch (error) {
        console.log('Error during search: ', error);
        return JSON.stringify([]);
    }
}

async function extractDetails(url) {
    try {
        const videoId = url.split('/video/')[1];
        const response = await fetch(`${baseUrl}/video/${videoId}?fields=id,title,description,thumbnail_720_url`);
        const data = await response.json();
        
        const details = [{
            description: data.description || 'No description available',
            aliases: '',  // Aliases can be fetched if available
            airdate: ''   // Airdate can be fetched if available
        }];
        
        return JSON.stringify(details);
    } catch (error) {
        console.log('Error fetching video details: ', error);
        return JSON.stringify([{
            description: 'Error loading description',
            aliases: '',
            airdate: 'Aired: Unknown'
        }]);
    }
}

async function extractEpisodes(url) {
    // Assuming episodes are not applicable for this type, but can be added later.
    return JSON.stringify([]);
}

async function extractStreamUrl(url) {
    const videoId = url.split('/video/')[1];
    try {
        const response = await fetch(`${baseUrl}/video/${videoId}?fields=id`);
        const data = await response.json();
        const streamUrl = `https://www.dailymotion.com/embed/video/${data.id}`;
        return streamUrl;  // Return the direct streaming URL
    } catch (error) {
        console.log('Error fetching stream URL: ', error);
        return '';
    }
}
