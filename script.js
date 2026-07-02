let allJobb = [];

// Hämta jobb från Arbetsförmedlingen
async function hamtaJobbFranAF() {
    try {
        const apiUrl = 'https://jobsearch.api.jobtechdev.se/search?limit=30';
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + apiUrl;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error('API-svar: ' + response.status);
        }
        
        const data = await response.json();
        
        if (!data.hits || data.hits.length === 0) {
            console.log('Inga jobb hittades');
            visaTestJobb();
            return;
        }
        
        // Konvertera AF-data
        allJobb = data.hits.map((job, index) => ({
            id: index + 1,
            titel: job.headline || 'Okänd titel',
            typ: job.occupation ? job.occupation.label : 'Övrigt',
            omrade: job.workplace_address ? job.workplace_address.municipality : 'Sverige',
            beskrivning: job.description ? job.description.text.substring(0, 200) : 'Ingen beskrivning',
            lon: job.salary_description || 'Lön enligt överenskommelse',
            start: new Date().toISOString().split('T')[0],
            slut: '2026-12-31',
            arbetsgivare: job.employer ? job.employer.name : 'Okänd arbetsgivare',
            telefon: 'Kontakta arbetsförmedlingen'
        }));
        
        console.log('✓ Jobb hämtade:', allJobb.length);
        visaAllaJobb();
        
    } catch (error) {
        console.error('Fel:', error);
        console.log('Använder testjobb istället...');
        visaTestJobb();
    }
}

// Testjobb om API inte fungerar
function visaTestJobb() {
    allJobb = [
        {
            id: 1,
            titel: "Pizzabagare",
            typ: "Pizza",
            omrade: "Stockholm",
            beskrivning: "Vi söker motiverad pizzabagare för sommaren",
            lon: "150 kr/tim",
            start: "2026-06-15",
            slut: "2026-08-31",
            arbetsgivare: "Pizzeria Roma",
            telefon: "070-123 4567"
        },
        {
            id: 2,
            titel: "Lagerarbetare",
            typ: "Lager",
            omrade: "Södermalm",
            beskrivning: "Hjälpa till med lagerförvaltning och paketering",
            lon: "140 kr/tim",
            start: "2026-06-01",
            slut: "2026-08-31",
            arbetsgivare: "Logistik Sverige AB",
            telefon: "070-234 5678"
        }
    ];
    
    console.log('Testjobb laddat');
    visaAllaJobb();
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
    hamtaJobbFranAF();
    lastaProfilData();
});
