let allJobb = [];

// Hämta jobb från Arbetsförmedlingen
async function hamtaJobbFranAF() {
    try {
        const response = await fetch('https://jobsearch.api.jobtechdev.se/search?limit=50');
        const data = await response.json();
        
        // Konvertera AF-data till vårt format
        allJobb = data.hits.map(job => ({
            id: job.id,
            titel: job.headline,
            typ: job.occupation ? job.occupation.label : 'Övrigt',
            omrade: job.workplace_address ? job.workplace_address.municipality : 'Sverige',
            beskrivning: job.description ? job.description.text : 'Ingen beskrivning',
            lon: job.salary_description || 'Lön enligt överenskommelse',
            start: new Date().toISOString().split('T')[0],
            slut: '2026-12-31',
            arbetsgivare: job.employer ? job.employer.name : 'Okänd arbetsgivare',
            telefon: job.application_details ? job.application_details.phone : 'N/A'
        }));
        
        console.log('Jobb hämtade:', allJobb.length);
        visaAllaJobb();
    } catch (error) {
        console.error('Fel vid hämtning av jobb:', error);
        alert('Kunde inte hämta jobb från Arbetsförmedlingen');
    }
}

// Sparade jobb
let sparadeJobb = JSON.parse(localStorage.getItem('sparadeJobb')) || [];

// Profil data
let profil = JSON.parse(localStorage.getItem('profil')) || {
    namn: '',
    email: '',
    telefon: ''
};

// Initialisering
document.addEventListener('DOMContentLoaded', function() {
    hamtaJobbFranAF(); // Hämta jobb från API
    lastaProfilData();
});
