let allJobb = [];
let sparadeJobb = [];
let minProfil = null;
let minProfilReferenser = [];

window.addEventListener('load', function() {
    initiera();
});

function initiera() {
    allJobb = [
        {id: 1, titel: "Pizzabagare", typ: "Pizza", omrade: "Stockholm", beskrivning: "Vi söker pizzabagare", lon: "150 kr/tim", start: "2026-06-15", slut: "2026-08-31", arbetsgivare: "Pizzeria Roma", telefon: "070-123 4567"},
        {id: 2, titel: "Lagerarbetare", typ: "Lager", omrade: "Södermalm", beskrivning: "Lagerarbete", lon: "140 kr/tim", start: "2026-06-01", slut: "2026-08-31", arbetsgivare: "Logistik Sverige AB", telefon: "070-234 5678"},
        {id: 3, titel: "Städare", typ: "Städ", omrade: "Norrmalm", beskrivning: "Städning", lon: "130 kr/tim", start: "2026-06-15", slut: "2026-08-30", arbetsgivare: "ReNy Städservice", telefon: "070-345 6789"},
        {id: 4, titel: "Kassörsarbetare", typ: "Kassörsarbete", omrade: "Östermalm", beskrivning: "Kassaarbete", lon: "135 kr/tim", start: "2026-07-01", slut: "2026-08-31", arbetsgivare: "ICA Supermarket", telefon: "070-456 7890"}
    ];
    
    minProfil = {id: Math.floor(Math.random() * 9000) + 1000, namn: '', email: '', telefon: '', omBeskrivning: '', meriter: [], skola: '', utbildningsNiva: 'Grundskola', egenskaper: [], certifikat: [], betyg: 5};
    minProfilReferenser = [];
    
    sparadeJobb = JSON.parse(localStorage.getItem('sparadeJobb')) || [];
    lastaProfilFranStorage();
    lastaReferenser();
    visaAllaJobb();
    visaMinAnonymaProfil();
}

function showPage(event, pageName) {
    event.preventDefault();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('aktiv'));
    document.getElementById(pageName).classList.add('aktiv');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('aktiv'));
    event.target.classList.add('aktiv');
}

function visaAllaJobb() {
    const lista = document.getElementById('jobbLista');
    if (!lista) return;
    lista.innerHTML = '';
    allJobb.forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        const kort = document.createElement('div');
        kort.className = 'jobb-kort';
        kort.innerHTML = `<h3>${jobb.titel}</h3><div class="omrade">📍 ${jobb.omrade}</div><div class="lon">${jobb.lon}</div><p>${jobb.beskrivning}</p><small>Från: ${jobb.start} till ${jobb.slut}</small><div class="jobb-buttons" style="margin-top: 1rem;"><button class="btn btn-info" onclick="visaJobbDetalj(${jobb.id})">Läs mer</button><button class="btn btn-spara ${sparad ? 'sparad' : ''}" onclick="sparaJobb(${jobb.id})">${sparad ? '❤️ Sparad' : '🤍 Spara'}</button></div>`;
        lista.appendChild(kort);
    });
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
    visaAllaJobb();
}

function filterJobb(typ) {
    const lista = document.getElementById('jobbLista');
    lista.innerHTML = '';
    allJobb.filter(j => j.typ === typ).forEach(jobb => {
        const sparad = sparadeJobb.some(j => j.id === jobb.id);
        const kort = document.createElement('div');
        kort.className = 'jobb-kort';
        kort.innerHTML = `<h3>${jobb.titel}</h3><div class="omrade">📍 ${jobb.omrade}</div><div class="lon">${jobb.lon}</div><p>${jobb.beskrivning}</p><small>Från: ${jobb.start} till ${jobb.slut}</small><div class="jobb-buttons" style="margin-top: 1rem;"><button class="btn btn-info" onclick="visaJobbDetalj(${jobb.id})">Läs mer</button><button class="btn btn-spara ${sparad ? 'sparad' : ''}" onclick="sparaJobb(${jobb.id})">${sparad ? '❤️ Sparad' : '🤍 Spara'}</button></div>`;
        lista.appendChild(kort);
    });
}

function sokJobb() {
    const text = document.getElementById('sokRuta').value.toLowerCase();
    const lista = document.getElementById('sokResultat');
    lista.innerHTML = '';
    if (text === '') return;
    allJobb.filter(j => j.titel.toLowerCase().includes(text) || j.typ.toLowerCase().includes(text)).forEach(jobb => {
        const kort = document.createElement('div');
        kort.className = 'jobb-kort';
        kort.innerHTML = `<h3>${jobb.titel}</h3><div class="omrade">📍 ${jobb.omrade}</div><div class="lon">${jobb.lon}</div><p>${jobb.beskrivning}</p><div class="jobb-buttons" style="margin-top: 1rem;"><button class="btn btn-info" onclick="visaJobbDetalj(${jobb.id})">Läs mer</button></div>`;
        lista.appendChild(kort);
    });
}

function visaJobbDetalj(jobbId) {
    const jobb = allJobb.find(j => j.id === jobbId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `<h2>${jobb.titel}</h2><p><strong>Lön:</strong> ${jobb.lon}</p><p><strong>Plats:</strong> ${jobb.omrade}</p><p>${jobb.beskrivning}</p><button class="btn btn-info" style="width: 100%; padding: 12px; margin-top: 20px;" onclick="alert('Du har ansökt på ${jobb.titel}'); stangModal();">Ansök nu</button>`;
    modal.classList.add('aktiv');
}

function stangModal() {
    document.getElementById('modal').classList.remove('aktiv');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) modal.classList.remove('aktiv');
};

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
    if (!merit) return alert('Skriv en merit!');
    if (minProfil.meriter.includes(merit)) return alert('Du har redan denna!');
    minProfil.meriter.push(merit);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    document.getElementById('inputMerit').value = '';
    visaMinAnonymaProfil();
}

function raderaMerit(i) {
    minProfil.meriter.splice(i, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function laggaTillEgenskap() {
    const eg = document.getElementById('inputEgenskap').value.trim();
    if (!eg) return alert('Skriv en egenskap!');
    if (minProfil.egenskaper.includes(eg)) return alert('Du har redan denna!');
    minProfil.egenskaper.push(eg);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    document.getElementById('inputEgenskap').value = '';
    visaMinAnonymaProfil();
}

function raderaEgenskap(i) {
    minProfil.egenskaper.splice(i, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function laggaTillCertifikat() {
    const cert = document.getElementById('inputCertifikat').value.trim();
    if (!cert) return alert('Skriv ett certifikat!');
    if (minProfil.certifikat.includes(cert)) return alert('Du har redan detta!');
    minProfil.certifikat.push(cert);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    document.getElementById('inputCertifikat').value = '';
    visaMinAnonymaProfil();
}

function raderaCertifikat(i) {
    minProfil.certifikat.splice(i, 1);
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function andraBetyg(b) {
    minProfil.betyg = b;
    localStorage.setItem('minProfil', JSON.stringify(minProfil));
    visaMinAnonymaProfil();
}

function laggaTillReferens() {
    const namn = document.getElementById('inputReferensNamn').value.trim();
    const email = document.getElementById('inputReferensEmail').value.trim();
    if (!namn || !email) return alert('Fyll i namn och email!');
    const ref = {id: Math.random(), namn: namn, email: email, betyg: '⭐⭐⭐⭐⭐', beskrivning: 'Väntar på svar'};
    minProfilReferenser.push(ref);
    localStorage.setItem('minProfilReferenser', JSON.stringify(minProfilReferenser));
    alert('✓ Referensen ' + namn + ' lagd till!');
    document.getElementById('inputReferensNamn').value = '';
    document.getElementById('inputReferensEmail').value = '';
    visaMinAnonymaProfil();
}

function raderaReferens(i) {
    minProfilReferenser.splice(i, 1);
    localStorage.setItem('minProfilReferenser', JSON.stringify(minProfilReferenser));
    visaMinAnonymaProfil();
}

function lastaProfilFranStorage() {
    const sparad = localStorage.getItem('minProfil');
    if (sparad) minProfil = JSON.parse(sparad);
    if (minProfil && minProfil.namn) {
        document.getElementById('namn').value = minProfil.namn;
        document.getElementById('email').value = minProfil.email;
        document.getElementById('telefon').value = minProfil.telefon;
        document.getElementById('omBeskrivning').value = minProfil.omBeskrivning;
        document.getElementById('skola').value = minProfil.skola;
        document.getElementById('utbildningsNiva').value = minProfil.utbildningsNiva;
    }
}

function lastaReferenser() {
    const sparad = localStorage.getItem('minProfilReferenser');
    if (sparad) minProfilReferenser = JSON.parse(sparad);
}

function visaMinAnonymaProfil() {
    if (!minProfil) return;
    const stjarnor = '⭐'.repeat(minProfil.betyg) + '☆'.repeat(5 - minProfil.betyg);
    const meritHTML = !minProfil.meriter || minProfil.meriter.length === 0 ? '<p style="color: #999;">Lägg till meriter →</p>' : minProfil.meriter.map((m, i) => `<li>${m} <button onclick="raderaMerit(${i})" style="color: red; border: none; background: none; cursor: pointer;">✕</button></li>`).join('');
    const egenskapHTML = !minProfil.egenskaper || minProfil.egenskaper.length === 0 ? '<p style="color: #999;">Lägg till egenskaper →</p>' : minProfil.egenskaper.map((e, i) => `<li>${e} <button onclick="raderaEgenskap(${i})" style="color: red; border: none; background: none; cursor: pointer;">✕</button></li>`).join('');
    const certHTML = !minProfil.certifikat || minProfil.certifikat.length === 0 ? '<p style="color: #999;">Lägg till certifikat →</p>' : minProfil.certifikat.map((c, i) => `<li>${c} <button onclick="raderaCertifikat(${i})" style="color: red; border: none; background: none; cursor: pointer;">✕</button></li>`).join('');
    const refHTML = !minProfilReferenser || minProfilReferenser.length === 0 ? '<p style="color: #999;">Lägg till referenser →</p>' : minProfilReferenser.map((r, i) => `<li><strong>${r.namn}</strong> (${r.betyg})</li>`).join('');
    const betyg = [1,2,3,4,5].map(b => `<button onclick="andraBetyg(${b})" style="padding: 0.5rem 1rem; margin: 0.25rem; background: ${minProfil.betyg === b ? '#667eea' : '#f0f0f0'}; border: none; border-radius: 5px; cursor: pointer;">${'⭐'.repeat(b)}</button>`).join('');
    
    const html = `<div style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px;"><h3>Kandidat #${minProfil.id}</h3><p><strong>Betyg:</strong> ${stjarnor}</p><div style="margin-top: 0.5rem;">${betyg}</div>${minProfil.omBeskrivning ? `<p style="margin-top: 1rem;"><strong>Om mig:</strong><br>${minProfil.omBeskrivning}</p>` : ''}${minProfil.skola ? `<p><strong>Skola:</strong> ${minProfil.skola}<br><strong>Nivå:</strong> ${minProfil.utbildningsNiva}</p>` : ''}<p style="margin-top: 1rem;"><strong>Meriter:</strong></p><ul style="list-style: none; padding: 0;">${meritHTML}</ul><p style="margin-top: 1rem;"><strong>Egenskaper:</strong></p><ul style="list-style: none; padding: 0;">${egenskapHTML}</ul><p style="margin-top: 1rem;"><strong>Certifikat:</strong></p><ul style="list-style: none; padding: 0;">${certHTML}</ul><p style="margin-top: 1rem;"><strong>Referenser:</strong></p><ul style="list-style: none; padding: 0;">${refHTML}</ul><p style="color: #999; font-size: 0.9rem; margin-top: 1.5rem;">💡 Endast detta syns för företag!</p></div>`;
    
    const div = document.getElementById('anonymProfil');
    if (div) div.innerHTML = html;
}
