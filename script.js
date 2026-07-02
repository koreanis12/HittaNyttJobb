async function hamtaJobbFranAF() {
    try {
        const response = await fetch('https://jobsearch.api.jobtechdev.se/search?q=jobb&limit=20');
        const data = await response.json();
        console.log(data.hits);
    } catch (error) {
        console.error('Fel:', error);
    }
}

hamtaJobbFranAF();
