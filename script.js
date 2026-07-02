// Testjobb
let allJobb = [
    {
        id: 1,
        titel: "Pizzabagare",
        typ: "Pizza",
        omrade: "Stockholm",
        beskrivning: "Vi söker motiverad pizzabagare",
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
        beskrivning: "Lagerarbete",
        lon: "140 kr/tim",
        start: "2026-06-01",
        slut: "2026-08-31",
        arbetsgivare: "Logistik Sverige AB",
        telefon: "070-234 5678"
    },
    {
        id: 3,
        titel: "Städare",
        typ: "Städ",
        omrade: "Norrmalm",
        beskrivning: "Städning",
        lon: "130 kr/tim",
        start: "2026-06-15",
        slut: "2026-08-30",
        arbetsgivare: "ReNy Städservice",
        telefon: "070-345 6789"
    },
    {
        id: 4,
        titel: "Kassörsarbetare",
        typ: "Kassörsarbete",
        omrade: "Östermalm",
        beskrivning: "Kassaarbete",
        lon: "135 kr/tim",
        start: "2026-07-01",
        slut: "2026-08-31",
        arbetsgivare: "ICA Supermarket",
        telefon: "070-456 7890"
    }
];

let sparadeJobb = JSON.parse(localStorage.getItem('sparadeJobb')) || [];
let profil = JSON.parse(localStorage.getItem('profil')) || {
    namn: '',
    email: '',
    telefon: ''
};

document.addEventListener('DOMContentLoaded', function() {
    visaAllaJobb();
    lastaProfilData();
    lastaProfilFranStorage();
    lastaReferenser();
    visaMinAnonymaProfil();
});

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('aktiv');
    });

    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('aktiv');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('aktiv');
    });
    event.target.classList.add('aktiv');

    if (pageName === 'hem') {
        visaAllaJobb();
    } else if (pageName === 'mina') {
        visaMinaJobb();
    } else if (pageName === 'profil') {
        visaMinAnonymaProfil();
    }
}

function visaAllaJobb() {
    const jobbLista = document.getElementById('jobbLista');
    jobbLista.innerHTML = '';
    
    allJobb.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        jobbLista.appendChild(skapaJobbKort(jobb, sparad));
    });
}

function skapaJobbKort(jobb, sparad = false) {
    const kort = document.createElement('div');
    kort.className = 'jobb-kort';
    
    const sparadClass = sparad ? 'sparad' : '';
    
    kort.innerHTML = `
        <h3>${jobb.titel}</h3>
        <div class="omrade">📍 ${jobb.omrade}</div>
        <div class="lon">${jobb.lon}</div>
        <p>${jobb.beskrivning}</p>
        <small>Från: ${jobb.start} till ${jobb.slut}</small>
        <div class="jobb-buttons" style="margin-top: 1rem;">
            <button class="btn btn-info" onclick="visaJobbDetalj(${jobb.id})">Läs mer</button>
            <button class="btn btn-spara ${sparadClass}" onclick="sparaJobb(${jobb.id})" id="btn-${jobb.id}">
                ${sparad ? '❤️ Sparad' : '🤍 Spara'}
            </button>
        </div>
    `;
    
    return kort;
}

function sparaJobb(jobbId) {
    const jobb = allJobb.find(j => j.id === jobbId);
    const index = sparadeJobb.findIndex(j => j.id === jobbId);
    
    if (index === -1) {
        sparadeJobb.push(jobb);
    } else {
        sparadeJobb.splice(index, 1);
    }
    
    localStorage.setItem('sparadeJobb', JSON.stringify(sparadeJobb));
    
    const btn = document.getElementById(`btn-${jobbId}`);
    if (btn) {
        const isSaved = sparadeJobb.some(j => j.id === jobbId);
        btn.textContent = isSaved ? '❤️ Sparad' : '🤍 Spara';
        btn.classList.toggle('sparad');
    }
    
    visaAllaJobb();
    if (document.getElementById('mina') && document.getElementById('mina').classList.contains('aktiv')) {
        visaMinaJobb();
    }
}

function visaMinaJobb() {
    const minaJobb = document.getElementById('minaJobb');
    minaJobb.innerHTML = '';
    
    if (sparadeJobb.length === 0) {
        minaJobb.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Du har inga sparade jobb ännu</p>';
        return;
    }
    
    sparadeJobb.forEach(jobb => {
        minaJobb.appendChild(skapaJobbKort(jobb, true));
    });
}

function visaJobbDetalj(jobbId) {
    const jobb = allJobb.find(j => j.id === jobbId);
    
    if (!jobb) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    const sparad = sparadeJobb.some(j => j.id === jobb.id);
    const sparadClass = sparad ? 'sparad' : '';
    
    modalBody.innerHTML = `
        <h2>${jobb.titel}</h2>
        <div style="margin-bottom: 1rem;">
            <p><strong>Typ:</strong> ${jobb.typ}</p>
            <p><strong>Område:</strong> 📍 ${jobb.omrade}</p>
            <p><strong>Lön:</strong> <span style="color: #28a745; font-weight: bold;">${jobb.lon}</span></p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
            <h3>Beskrivning</h3>
            <p>${jobb.beskrivning}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 1rem; border-radius: 5px; margin-bottom: 1.5rem;">
            <h3>Tidsperiod</h3>
            <p><strong>Start:</strong> ${jobb.start}</p>
            <p><strong>Slut:</strong> ${jobb.slut}</p>
        </div>
        
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-info" style="flex: 1;" onclick="ansok(${jobb.id})">Ansök nu</button>
            <button class="btn btn-spara ${sparadClass}" style="flex: 1;" onclick="sparaJobb(${jobb.id}); visaJobbDetalj(${jobb.id})">
                ${sparad ? '❤️ Sparad' : '🤍 Spara'}
            </button>
        </div>
    `;
    
    modal.classList.add('aktiv');
}

function stangModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('aktiv');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.classList.remove('aktiv');
    }
}

function filterJobb(typ) {
    const jobbLista = document.getElementById('jobbLista');
    jobbLista.innerHTML = '';
    
    const filteredJobb = allJobb.filter(jobb => jobb.typ === typ);
    
    filteredJobb.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        jobbLista.appendChild(skapaJobbKort(jobb, sparad));
    });
}

function sokJobb() {
    const sokRuta = document.getElementById('sokRuta');
    const sokresultat = document.getElementById('sokResultat');
    const sokText = sokRuta.value.toLowerCase();
    
    if (sokText === '') {
        sokresultat.innerHTML = '';
        return;
    }
    
    const resultat = allJobb.filter(jobb => 
        jobb.titel.toLowerCase().includes(sokText) ||
        jobb.typ.toLowerCase().includes(sokText) ||
        jobb.omrade.toLowerCase().includes(sokText)
    );
    
    sokresultat.innerHTML = '';
    
    if (resultat.length === 0) {
        sokresultat.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Ingen jobb hittade</p>';
        return;
    }
    
    resultat.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        sokresultat.appendChild(skapaJobbKort(jobb, sparad));
    });
}

function sparaProfil() {
    const namn = document.getElementById('namn').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    
    if (!namn || !email || !telefon) {
        alert('Vänligen fyll i alla fält');
        return;
    }
    
    profil = {
        namn: namn,
        email: email,
        telefon: telefon
    };
    
    localStorage.setItem('profil', JSON.stringify(profil));
    alert('Profil sparad!');
}

function lastaProfilData() {
    if (profil.namn) {
        document.getElementById('namn').value = profil.namn;
        document.getElementById('email').value = profil.email;
        document.getElementById('telefon').value = profil.telefon;
    }
}

function ansok(jobbId) {
    const jobb = allJobb.find(j => j.id === jobbId);
    
    if (!profil.namn || !profil.email) {
        alert('Vänligen fyll i din profil först innan du ansöker');
        showPage('profil');
        return;
    }
    
    alert(`Tack för din ansökan till ${jobb.titel}!\n\nVi kontaktar dig på ${profil.email}`);
    stangModal();
}

// === ANONYM PROFIL SYSTEM ===

function genereraProfilID() {
    return Math.floor(Math.random() * 9000) + 1000;
}

let minProfil = {
    id: genereraProfilID(),
    namn: '',
    email: '',
    telefon: '',
    omBeskrivning: '',
    meriter: [],
    skola: '',
    utbildningsNiva: 'Grundskola',
    egenskaper: [],
    certifikat: [],
    betyg: 5,
    verifierad: false
};

function lastaProfilFranStorage() {
    const sparad = localStorage.getItem('minProfil');
    if (sparad) {
        minProfil = JSON.parse(sparad);
    }
}

function sparaProfilNy() {
    minProfil.namn = document.getElementById('namn').value;
    minProfil.email = document.getElementById('email').value;
    minProfil.telefon = document.getElementById('telefon').value;
    minProfil.omBeskrivning = document.getElementById('omBeskrivning').value;
    minProfil.skola = document.getElementById('skola').value;
    minProfil.utbildningsNiva = document.getElementById('utbildningsNiva').value;
    
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    alert('✓ Profil sparad!');
    visaMinAnonymaProfil();
}

function laggaTillMerit() {
    const merit = document.getElementById('inputMerit').value.trim();
    
    if (!merit) {
        alert('Skriv en merit först!');
        return;
    }
    
    if (minProfil.meriter.includes(merit)) {
        alert('Du har redan denna merit!');
        return;
    }
    
    minProfil.meriter.push(merit);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    
    document.getElementById('inputMerit').value = '';
    visaMinAnonymaProfil();
}

function raderaMerit(index) {
    minProfil.meriter.splice(index, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function laggaTillEgenskap() {
    const egenskap = document.getElementById('inputEgenskap').value.trim();
    
    if (!egenskap) {
        alert('Skriv en egenskap först!');
        return;
    }
    
    if (minProfil.egenskaper.includes(egenskap)) {
        alert('Du har redan denna egenskap!');
        return;
    }
    
    minProfil.egenskaper.push(egenskap);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    
    document.getElementById('inputEgenskap').value = '';
    visaMinAnonymaProfil();
}

function raderaEgenskap(index) {
    minProfil.egenskaper.splice(index, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function laggaTillCertifikat() {
    const certifikat = document.getElementById('inputCertifikat').value.trim();
    
    if (!certifikat) {
        alert('Skriv ett certifikat först!');
        return;
    }
    
    if (minProfil.certifikat.includes(certifikat)) {
        alert('Du har redan detta certifikat!');
        return;
    }
    
    minProfil.certifikat.push(certifikat);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    
    document.getElementById('inputCertifikat').value = '';
    visaMinAnonymaProfil();
}

function raderaCertifikat(index) {
    minProfil.certifikat.splice(index, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function andraBetyg(nyBetyg) {
    minProfil.betyg = nyBetyg;
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function visaMinAnonymaProfil() {
    const stjarnor = '⭐'.repeat(minProfil.betyg) + '☆'.repeat(5 - minProfil.betyg);
    
    let meritHTML = '';
    if (minProfil.meriter.length === 0) {
        meritHTML = '<p style="color: #999; font-size: 0.9rem;">Lägg till dina meriter →</p>';
    } else {
        meritHTML = minProfil.meriter.map((m, i) => 
            `<li>${m} <button onclick="raderaMerit(${i})" style="color: red; border: none; background: none; cursor: pointer; font-size: 1rem;">✕</button></li>`
        ).join('');
    }
    
    let egenskaperHTML = '';
    if (minProfil.egenskaper.length === 0) {
        egenskaperHTML = '<p style="color: #999; font-size: 0.9rem;">Lägg till dina egenskaper →</p>';
    } else {
        egenskaperHTML = minProfil.egenskaper.map((e, i) => 
            `<li>${e} <button onclick="raderaEgenskap(${i})" style="color: red; border: none; background: none; cursor: pointer; font-size: 1rem;">✕</button></li>`
        ).join('');
    }
    
    let certifikatHTML = '';
    if (minProfil.certifikat.length === 0) {
        certifikatHTML = '<p style="color: #999; font-size: 0.9rem;">Lägg till certifikat →</p>';
    } else {
        certifikatHTML = minProfil.certifikat.map((c, i) => 
            `<li>${c} <button onclick="raderaCertifikat(${i})" style="color: red; border: none; background: none; cursor: pointer; font-size: 1rem;">✕</button></li>`
        ).join('');
    }
    
    let referenserHTML = '';
    if (minProfilReferenser.length === 0) {
        referenserHTML = '<p style="color: #999; font-size: 0.9rem;">Lägg till referenser →</p>';
    } else {
        referenserHTML = minProfilReferenser.map((r, i) => 
            `<li><strong>${r.namn}</strong> (${r.betyg}) - ${r.beskrivning}</li>`
        ).join('');
    }
    
    const betygsKnappar = [1, 2, 3, 4, 5].map(b => 
        `<button onclick="andraBetyg(${b})" style="padding: 0.5rem 1rem; margin: 0.25rem; background: ${minProfil.betyg === b ? '#667eea' : '#f0f0f0'}; color: ${minProfil.betyg === b ? 'white' : 'black'}; border: none; border-radius: 5px; cursor: pointer;">${'⭐'.repeat(b)}</button>`
    ).join('');
    
    const html = `
        <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px;">
            <h3>Kandidat #${minProfil.id}</h3>
            
            <div style="margin: 1rem 0;">
                <p><strong>Betyg:</strong></p>
                <p>${stjarnor} (${minProfil.betyg}/5)</p>
                <div style="margin-top: 0.5rem;">
                    ${betygsKnappar}
                </div>
            </div>
            
            ${minProfil.omBeskrivning ? `
            <div style="margin: 1rem 0; background: white; padding: 1rem; border-radius: 5px;">
                <p><strong>Om mig:</strong></p>
                <p style="color: #333; line-height: 1.6;">${minProfil.omBeskrivning}</p>
            </div>
            ` : ''}
            
            ${minProfil.skola ? `
            <div style="margin: 1rem 0;">
                <p><strong>Skola:</strong> ${minProfil.skola}</p>
                <p><strong>Utbildningsnivå:</strong> ${minProfil.utbildningsNiva}</p>
            </div>
            ` : ''}
            
            ${minProfil.meriter.length > 0 ? `
            <div style="margin: 1rem 0;">
                <p><strong>Meriter:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    ${meritHTML}
                </ul>
            </div>
            ` : ''}
            
            ${minProfil.egenskaper.length > 0 ? `
            <div style="margin: 1rem 0;">
                <p><strong>Egenskaper:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    ${egenskaperHTML}
                </ul>
            </div>
            ` : ''}
            
            ${minProfil.certifikat.length > 0 ? `
            <div style="margin: 1rem 0;">
                <p><strong>Certifikat:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    ${certifikatHTML}
                </ul>
            </div>
            ` : ''}
            
            ${minProfilReferenser.length > 0 ? `
            <div style="margin: 1rem 0;">
                <p><strong>Referenser:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    ${referenserHTML}
                </ul>
            </div>
            ` : ''}
            
            <p style="color: #999; font-size: 0.9rem; margin-top: 1.5rem;">
                💡 Företag ser bara detta — inte namn eller personuppgifter!
            </p>
        </div>
    `;
    
    const anonymDiv = document.getElementById('anonymProfil');
    if (anonymDiv) {
        anonymDiv.innerHTML = html;
    }
}

// === REFERENS-SYSTEM ===

let minProfilReferenser = [];

function laggaTillReferens() {
    const referensNamn = document.getElementById('inputReferensNamn').value.trim();
    const referensEmail = document.getElementById('inputReferensEmail').value.trim();
    
    if (!referensNamn || !referensEmail) {
        alert('Fyll i namn och email!');
        return;
    }
    
    const referensId = Math.floor(Math.random() * 10000);
    const googleScriptURL = https://script.google.com/macros/s/AKfycbzEfs1l12jiyGzMBxtOtt4U6grEe9LL-apdrMrXLKJCv5mKaMe-wNEoXmAhRjLlNVQM/exec
    const referensLink = googleScriptURL + '?jobsokande=' + encodeURIComponent(minProfil.namn);
    
    const referens = {
        id: referensId,
        namn: referensNamn,
        email: referensEmail,
        status: 'Väntar',
        betyg: '⭐⭐⭐⭐⭐',
        beskrivning: 'Väntar på svar',
        link: referensLink,
        datum: new Date().toLocaleDateString('sv-SE')
    };
    
    minProfilReferenser.push(referens);
    localStorage.setItem('minProfilReferenser', JSON.stringify(minProfilReferenser));
    
    alert('✓ Referensen ' + referensNamn + ' lagd till!\n\nSkicka denna länk till referensen:\n' + referensLink);
    
    document.getElementById('inputReferensNamn').value = '';
    document.getElementById('inputReferensEmail').value = '';
    
    visaMinAnonymaProfil();
}

function raderaReferens(id) {
    minProfilReferenser = minProfilReferenser.filter(r => r.id !== id);
    localStorage.setItem('minProfilReferenser', JSON.stringify(minProfilReferenser));
    visaMinAnonymaProfil();
}

function lastaReferenser() {
    const sparad = localStorage.getItem('minProfilReferenser');
    if (sparad) {
        minProfilReferenser = JSON.parse(sparad);
    }
}

window.addEventListener('load', function() {
    lastaProfilFranStorage();
    lastaReferenser();
    visaMinAnonymaProfil();
});
