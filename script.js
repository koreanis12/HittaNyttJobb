// Exempeljobb data
const allJobb = [
    {
        id: 1,
        titel: "Pizza Maker",
        typ: "Pizza",
        omrade: "Stockholm",
        beskrivning: "Sök efter motiverad person för pizzabakeri",
        lon: "150 kr/tim",
        start: "2026-06-15",
        slut: "2026-08-31"
    },
    {
        id: 2,
        titel: "Lagerarbetare",
        typ: "Lager",
        omrade: "Södermalm",
        beskrivning: "Hjälpa till med lagerförvaltning och paketering",
        lon: "140 kr/tim",
        start: "2026-06-01",
        slut: "2026-08-31"
    },
    {
        id: 3,
        titel: "Städare",
        typ: "Städ",
        omrade: "Norrmalm",
        beskrivning: "Städning av kontorlokaler och gemensamma utrymmen",
        lon: "130 kr/tim",
        start: "2026-06-15",
        slut: "2026-08-30"
    },
    {
        id: 4,
        titel: "Kassörsarbetare",
        typ: "Kassörsarbete",
        omrade: "Östermalm",
        beskrivning: "Kassaarbete i mindre butik, flexibla tider",
        lon: "135 kr/tim",
        start: "2026-07-01",
        slut: "2026-08-31"
    },
    {
        id: 5,
        titel: "Barnavaksare",
        typ: "Barnsyn",
        omrade: "Kungsholmen",
        beskrivning: "Barnavårdare för sommarpraktik, 2-3 barn",
        lon: "160 kr/tim",
        start: "2026-06-15",
        slut: "2026-08-15"
    },
    {
        id: 6,
        titel: "Träningsinstruktör",
        typ: "Tränare",
        omrade: "Stockholm",
        beskrivning: "Sommarevent instruktör för ungdomar",
        lon: "155 kr/tim",
        start: "2026-07-01",
        slut: "2026-08-31"
    },
    {
        id: 7,
        titel: "Pizza Pizzeria Nord",
        typ: "Pizza",
        omrade: "Norrmalm",
        beskrivning: "Pizzabagare med erfarenhet sökes",
        lon: "160 kr/tim",
        start: "2026-06-20",
        slut: "2026-08-31"
    },
    {
        id: 8,
        titel: "Lagerchef Assistent",
        typ: "Lager",
        omrade: "Stockholm",
        beskrivning: "Assistera lagerchefen med inventering",
        lon: "145 kr/tim",
        start: "2026-07-15",
        slut: "2026-08-30"
    }
];

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
    visaHemSida();
    lastaProfilData();
});

// Visa hemsida
function visaHemSida() {
    showPage('hem');
    visaAllaJobb();
}

// Sida navigering
function showPage(pageName) {
    // Dölj alla sidor
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('aktiv');
    });

    // Visa vald sida
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('aktiv');
    }

    // Uppdatera nav-länkar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('aktiv');
    });
    event.target.classList.add('aktiv');

    // Läs in innehål för respektive sida
    if (pageName === 'hem') {
        visaAllaJobb();
    } else if (pageName === 'mina') {
        visaMinaJobb();
    }
}

// Visa alla jobb
function visaAllaJobb() {
    const jobbLista = document.getElementById('jobbLista');
    jobbLista.innerHTML = '';
    
    allJobb.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        jobbLista.appendChild(skapaJobbKort(jobb, sparad));
    });
}

// Skapa jobbkort
function skapaJobbKort(jobb, sparad = false) {
    const kort = document.createElement('div');
    kort.className = 'jobb-kort';
    
    const sparadClass = sparad ? 'sparad' : '';
    
    kort.innerHTML = `
        <h3>${jobb.titel} ${jobb.typ}</h3>
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

// Spara jobb
function sparaJobb(jobbId) {
    const jobb = allJobb.find(j => j.id === jobbId);
    const index = sparadeJobb.findIndex(j => j.id === jobbId);
    
    if (index === -1) {
        // Lägg till
        sparadeJobb.push(jobb);
    } else {
        // Ta bort
        sparadeJobb.splice(index, 1);
    }
    
    localStorage.setItem('sparadeJobb', JSON.stringify(sparadeJobb));
    
    // Uppdatera knapptext
    const btn = document.getElementById(`btn-${jobbId}`);
    if (btn) {
        const isSaved = sparadeJobb.some(j => j.id === jobbId);
        btn.textContent = isSaved ? '❤️ Sparad' : '🤍 Spara';
        btn.classList.toggle('sparad');
    }
    
    // Uppdatera andra sidor
    visaAllaJobb();
    if (document.getElementById('mina').classList.contains('aktiv')) {
        visaMinaJobb();
    }
}

// Visa mina sparade jobb
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

// Visa jobbdetalj i modal
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

// Stäng modal
function stangModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('aktiv');
}

// Stäng modal när man klickar utanför
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.classList.remove('aktiv');
    }
}

// Filtrera jobb
function filterJobb(typ) {
    const jobbLista = document.getElementById('jobbLista');
    jobbLista.innerHTML = '';
    
    const filteredJobb = allJobb.filter(jobb => jobb.typ === typ);
    
    filteredJobb.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        jobbLista.appendChild(skapaJobbKort(jobb, sparad));
    });
}

// Sök jobb
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
        jobb.omrade.toLowerCase().includes(sokText) ||
        jobb.beskrivning.toLowerCase().includes(sokText)
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

// Spara profil
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

// Ladda profildata
function lastaProfilData() {
    if (profil.namn) {
        document.getElementById('namn').value = profil.namn;
        document.getElementById('email').value = profil.email;
        document.getElementById('telefon').value = profil.telefon;
    }
}

// Ansök om jobb
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
