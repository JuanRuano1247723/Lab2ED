const fs = require('fs');

function buscarCasas(condicionesCliente, casas) {
    const casasValidas = [];
    const condicion = new Set(condicionesCliente);
    for (let i = 0; i < casas.length; i++) {
        for (const [key, value] of Object.entries(casas[i])) {
            if (condicion.has(key) && value) {
                casasValidas.push(i);
                break;
            }
        }
    }
    return casasValidas;
}

function crearTablaCondicionesPorApartamento(condicionesFaltantes, apartamentOfMap, indexApartaments) {
    const distance = [];
    for (let i = 0; i < condicionesFaltantes.length; i++) {
        let requirement = true;
        for (const [key, value] of Object.entries(apartamentOfMap[indexApartaments])) {
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

function encontrarApartamentoCercano(apartments, table) {
    if (apartments.length === 0) {
        return null;
    }
    for (let i = 0; i < table[0].length; i++) {
        for (let j = 0; j < apartments.length; j++) {
            let minimo = Number.MAX_VALUE;
            let k = 0;
            while (table[j][i] === 0 && j < apartments.length) {
                j++;
                if (j === apartments.length) {
                    k = apartments.length;
                    break;
                }
            }
            while (k < apartments.length) {
                if (j === k && k < apartments.length - 1) {
                    k++;
                }
                if (table[k][i] === 0) {
                    if (Math.abs(apartments[j] - apartments[k]) < minimo) {
                        minimo = Math.abs(apartments[j] - apartments[k]);
                        table[j][i] = minimo;
                    }
                }
                k++;
            }
        }
    }
    return table;
}

function bestMinimApartment(casa, tabla) {
    const minimo = casa.map(c => Math.max(...tabla[c]));
    return casa[minimo.indexOf(Math.min(...minimo))];
}

function sumaDeDistanciasDeApartamentosValidos(tabla) {
    const pluses = tabla.map(lista => lista.reduce((acc, curr) => acc + curr, 0));
    const minimos = Math.min(...pluses);
    const minim = pluses.reduce((acc, curr, index) => {
        if (curr === minimos) {
            acc.push(index);
        }
        return acc;
    }, []);
    if (minim.length > 1) {
        return bestMinimApartment(minim, tabla);
    }
    return pluses.indexOf(minimos);
}

function ValidacionTodasCondicionesCliente(tabla) {
    if (!tabla) {
        return -1;
    }
    for (const lista of tabla) {
        const minimoActual = Math.min(...lista);
        if (minimoActual !== 0) {
            return -1;
        }
    }
    return sumaDeDistanciasDeApartamentosValidos(tabla);
}

function printBestAparmentOfEachMap(list) {
    for (const Map of list) {
        if (Map === null) {
            console.log([]);
        }else{
        console.log([Map]);
        }
    }
}

async function main() {
    const fileContent = await fs.promises.readFile('input_lab_2_example(2).jsonl', 'utf-8');
    const lines = fileContent.split('\n');
    const indexOfApartmentsInEachMap = [];

    for (const line of lines) {
        const data = JSON.parse(line);
        const casasValidas = buscarCasas(data.input2, data.input1);
        const tablaDeCondicionesApartamentos = [];
        for (let i = 0; i < casasValidas.length; i++) {
            tablaDeCondicionesApartamentos.push(crearTablaCondicionesPorApartamento(data.input2, data.input1, casasValidas[i]));
        }
        encontrarApartamentoCercano(casasValidas, tablaDeCondicionesApartamentos);
        const condition = ValidacionTodasCondicionesCliente(tablaDeCondicionesApartamentos);
        if (condition === -1) {
            indexOfApartmentsInEachMap.push(null);
        } else {
            indexOfApartmentsInEachMap.push(casasValidas[condition]);
        }
    }
    printBestAparmentOfEachMap(indexOfApartmentsInEachMap);
}
main().catch(console.error);