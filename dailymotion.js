async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://anitaku.to/search.html?keyword=${encodedKeyword}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        const results = [];
        
        doc.querySelectorAll(".last_episodes li").forEach(item => {
            const title = item.querySelector(".name").textContent.replace(" (Dub)", "");
            const url = item.querySelector(".name a").href;
            const poster = item.querySelector("img").src;
            results.push({
                title: title,
                image: poster,
                href: url
            });
        });

        return JSON.stringify(results);
    } catch (error) {
        console.log('Error:', error);
        return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        const title = doc.querySelector(".anime_info_body_bg h1").textContent.replace(" (Dub)", "");
        const description = doc.querySelector(".anime_info_body_bg p.plot")?.textContent || 'No description available';
        const year = doc.querySelector(".anime_info_body_bg p.released")?.textContent;
        
        return JSON.stringify([{
            description: description,
            year: year,
            title: title
        }]);
    } catch (error) {
        console.log('Details error:', error);
        return JSON.stringify([{ description: 'Error loading description', year: 'Unknown', title: 'Error' }]);
    }
}

async function extractEpisodes(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        const episodes = [];
        
        doc.querySelectorAll(".episodes a").forEach(item => {
            episodes.push({
                href: item.href,
                title: item.textContent
            });
        });
        
        return JSON.stringify(episodes);
    } catch (error) {
        console.log('Episodes error:', error);
        return JSON.stringify([]);
    }
}
