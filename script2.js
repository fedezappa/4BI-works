let studenti = [];

// Funzione per parse la data dal formato stringa DD-MM-YYYY
function parseData(dataStr) {
    const parti = dataStr.split("-");
    return new Date(parti[2], parti[1] - 1, parti[0]);
}

// Carica il file XML quando la pagina è pronta
window.addEventListener("DOMContentLoaded", function() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "Classe5B.xml", true); // Modifica il percorso del file XML
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const xmlDoc = this.responseXML; // La risposta è già un documento XML
            studenti = parseXML(xmlDoc);
            mostraTabella(studenti);
        }
    };
});

// Funzione per analizzare il file XML
function parseXML(xmlDoc) {
    const studentiList = [];
    const studentiXML = xmlDoc.getElementsByTagName("studente");

    for (let i = 0; i < studentiXML.length; i++) {
        const studente = studentiXML[i];
        const nome = studente.getElementsByTagName("nome")[0].textContent;
        const cognome = studente.getElementsByTagName("cognome")[0].textContent;
        const dataNascita = studente.getElementsByTagName("dataNascita")[0].textContent;
        const classe = studente.getElementsByTagName("classe")[0].textContent;

        studentiList.push({
            nome: nome,
            cognome: cognome,
            dataNascita: parseData(dataNascita),
            classe: classe
        });
    }
    return studentiList;
}

const classeDefault = "5B";

// Funzione per mostrare i dati nella tabella
function mostraTabella(lista) {
    const tbody = document.querySelector("#tabellaUtenti tbody");
    tbody.innerHTML = "";
    for (let i = 0; i < lista.length; i++) {
        const s = lista[i];
        const data = s.dataNascita.toLocaleDateString("it-IT"); // Formatta la data in formato italiano
        const classe = s.classe || classeDefault;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.nome}</td>
            <td>${s.cognome}</td>
            <td>${classe}</td>
            <td>${data}</td>
        `;
        tbody.appendChild(tr);
    }
}

// Filtrare per cognome
document.getElementById("filtraBtn").addEventListener("click", function() {
    const lettera = document.getElementById("lettera").value.toUpperCase();
    const filtrati = [];
    for (let i = 0; i < studenti.length; i++) {
        if (studenti[i].cognome.toUpperCase().indexOf(lettera) === 0) {
            filtrati.push(studenti[i]);
        }
    }
    mostraTabella(filtrati);
});

// Funzione per calcolare l'età
function calcolaEta(nascitaStr) {
    const nascita = new Date(nascitaStr);
    const oggi = new Date();
    let eta = oggi.getFullYear() - nascita.getFullYear();
    if (
        oggi.getMonth() < nascita.getMonth() ||
        (oggi.getMonth() === nascita.getMonth() && oggi.getDate() < nascita.getDate())
    ) {
        eta--;
    }
    return eta;
}

// Filtrare per maggiorenni
document.getElementById("maggiorenniBtn").addEventListener("click", function() {
    const filtrati = [];
    for (let i = 0; i < studenti.length; i++) {
        if (calcolaEta(studenti[i].dataNascita) >= 18) {
            filtrati.push(studenti[i]);
        }
    }
    mostraTabella(filtrati);
});

// Filtrare per minorenni
document.getElementById("minorenniBtn").addEventListener("click", function() {
    const filtrati = [];
    for (let i = 0; i < studenti.length; i++) {
        if (calcolaEta(studenti[i].dataNascita) < 18) {
            filtrati.push(studenti[i]);
        }
    }
    mostraTabella(filtrati);
});

// Calcolare la generazione in base all'anno di nascita
document.getElementById("generazioneBtn").addEventListener("click", function() {
    const dataInput = document.getElementById("dataInput").value;
    const output = document.getElementById("generazioneOutput");
    if (!dataInput) {
        output.textContent = "Inserisci una data valida!";
        return;
    }
    const anno = new Date(dataInput).getFullYear();
    let generazione = "";
    if (anno >= 1901 && anno <= 1927) generazione = "Greatest Generation";
    else if (anno >= 1928 && anno <= 1945) generazione = "Generazione Silenziosa";
    else if (anno >= 1946 && anno <= 1964) generazione = "Baby Boomers";
    else if (anno >= 1965 && anno <= 1980) generazione = "Generazione X";
    else if (anno >= 1981 && anno <= 1996) generazione = "Millennials";
    else if (anno >= 1997 && anno <= 2012) generazione = "Generazione Z";
    else if (anno >= 2013) generazione = "Generazione Alpha";
    else generazione = "Data non riconosciuta";
    output.innerHTML = `<b>${generazione}</b>`;
});
