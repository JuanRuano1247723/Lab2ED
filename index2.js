const fs = require('fs');

function crearTablaCondicionesPorApartamento(condicionesFaltantes, apartamentOfMap, indexApartaments) {
    const distance = [];
    for (let i = 0; i < condicionesFaltantes.length; i++) {
        let requirement = true;
        for (const [key, value] of Object.entries(apartamentOfMaiptp[indexApartaments])) {
            if (key === condicionesFaltantes[i] && value) {
                distance.push(0);
                requirement = false;
                break;
            }
        }
        if (requirement) {
            distance.push(-1);
        }
    }
    return distance;
}

async function main() {
const fileContent = await fs.promises.readFile('input_challenge.jsonl', 'utf-8');
const lines = fileContent.split('\n');
const tablaDeCondicionesApartamentos = [];
for (const line of lines) {
    const data = JSON.parse(line);
    for (let i = 0; i < casasValidas.length; i++) {
        tablaDeCondicionesApartamentos.push(crearTablaCondicionesPorApartamento(data.input2, data.input1, casasValidas[i]));
    }
}

        
main().catch(console.error);
}

