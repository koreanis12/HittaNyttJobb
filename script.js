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
    lastaPro
