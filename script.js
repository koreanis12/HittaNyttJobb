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
    if (document.getElementById('mina').classList.contains('aktiv')) {
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
    meriter: ['Pizza 1 år', 'Lager 6 mån'], // Exempel
    färdigheter: ['Snabb', 'Pålitlig', 'Svenska, engelska'],
    betyg: 5,
    verifierad: false
};

function sparaProfilNy() {
    minProfil.namn = document.getElementById('namn').value;
    minProfil.email = document.getElementById('email').value;
    minProfil.telefon = document.getElementById('telefon').value;
    
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    alert('✓ Profil sparad!\n\nDin anonyma kandidat-ID: #' + minProfil.id);
}

function visaMinAnonymaProfil() {
    return `
        <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px;">
            <h3>Kandidat #${minProfil.id}</h3>
            <p>⭐⭐⭐⭐⭐ (${minProfil.betyg}/5)</p>
            <p><strong>Meriter:</strong></p>
            <ul>
                ${minProfil.meriter.map(m => `<li>${m}</li>`).join('')}
            </ul>
            <p><strong>Färdigheter:</strong></p>
            <ul>
                ${minProfil.färdigheter.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <p style="color: #999; font-size: 0.9rem;">💡 Endast meriter visas för företag — inte namn eller personuppgifter</p>
        </div>
    `;
}
