// Create
var fs = require('fs');
function filterbuilds(input1, input2) {
    var valids = [];
    if (input1.builds && input1.builds.apartments) {
        valids.push(filterApartmentPetfriendly(input1, input2));
    }
    if (input1.builds && input1.builds.houses) {
        valids.push(filterHousesZonedangerous(input1, input2));
    }
    if (input1.builds && input1.builds.premises) {
        valids.push(filterPremisesByComercialActivities(input1, input2));
    }
    return valids;
}
function filterPremisesByComercialActivities(input1, input2) {
    var premises = input1.builds.premises;
    var commercialActivity = input2.commercialActivity;
    var budget = input2.budget;
    return premises.filter(function (premise) {
        return premise.commercialActivities.includes(commercialActivity) &&
            premise.price <= budget;
    });
}
function filterApartmentPetfriendly(input1, input2) {
    var apartments = input1.builds.apartments;
    var isPetfriendly = input2.petfriendly;
    var budget = input2.budget;
    return apartments.filter(function (apartment) {
        return apartment.isPetfriendly === isPetfriendly &&
            apartment.price <= budget;
    });
}
function filterHousesZonedangerous(input1, input2) {
    var houses = input1.builds.houses;
    var zoneDangerous = input2.zoneDangerous;
    var budget = input2.budget;
    var dangerZones = ["Red", "Orange", "Yellow", "Green"].slice(0, parseInt(zoneDangerous.slice(-1)) + 1);
    return houses.filter(function (house) {
        return dangerZones.includes(house.zoneDangerous) && house.price <= budget;
    });
}
function printBestApartmentOfEachMapFile(list, outputFilePath) {
    try {
        var idsList = list.map(function (Map) {
            if (Map === null) {
                return [];
            }
            else {
                return Map.map(function (building) { return building.commonConditions.id; });
            }
        });
        var idsListString = idsList.join('\n');
        fs.writeFileSync(outputFilePath, idsListString);
        fs.closeSync(fs.openSync(outputFilePath));
    }
    catch (err) {
        console.error('Error writing to the file:', err);
    }
}
function processFile(filePath) {
    var data = fs.readFileSync(filePath, 'utf8');
    var lines = data.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.trim() === '') {
            continue;
        }
        try {
            var jsonData = JSON.parse(line);
            var filteredBuildings = filterbuilds(jsonData.input1, jsonData.input2);
            printBestApartmentOfEachMapFile(filteredBuildings, 'Output2_JLDRL_1247723.txt');
        }
        catch (error) {
            console.error("Error parsing line ".concat(lines.indexOf(line) + 1, ": ").concat(error));
        }
    }
}
