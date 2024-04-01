// Create
const fs = require('fs');
interface commonConditions {
    address: string;
    price: number;
    id: string;
    contactPhone: string;
}
interface Houses extends commonConditions {
    zoneDangerous: string;
}

interface Apartments extends commonConditions{
    isPetfriendly:boolean;    
}

interface Premises extends commonConditions{
    commercialActivities: string[];
} 
  
interface Input1 {
    builds: {
        premises: Premises[];
        houses: Houses[];
        apartments: Apartments[];
    };
    services: string;
}
interface Input2 {
    petfriendly: boolean;
    requiredServices: string[];
    typeBuilder: string;
    budget: number;
    commercialActivity: string;
    zoneDangerous: string;
}

function filterbuilds(input1: Input1, input2: Input2) {
    const valids = [];
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

function filterPremisesByComercialActivities(input1: Input1, input2: Input2): Premises[] {
    const premises = input1.builds.premises;
    const commercialActivity = input2.commercialActivity;
    const budget = input2.budget;

    return premises.filter(premise => 
        premise.commercialActivities.includes(commercialActivity) &&
        premise.price <= budget
    );
}

function filterApartmentPetfriendly(input1: Input1, input2: Input2): Apartments[] {
    const apartments = input1.builds.apartments;
    const isPetfriendly = input2.petfriendly;
    const budget = input2.budget;

    return apartments.filter(apartment => 
        apartment.isPetfriendly === isPetfriendly &&
        apartment.price <= budget
    );
}

function filterHousesZonedangerous(input1: Input1, input2: Input2): Houses[] {
    const houses = input1.builds.houses;
    const zoneDangerous = input2.zoneDangerous;
    const budget = input2.budget;
  
    const dangerZones = ["Red", "Orange", "Yellow", "Green"].slice(0, parseInt(zoneDangerous.slice(-1)) + 1);
  
    return houses.filter(house => {
      return dangerZones.includes(house.zoneDangerous) && house.price <= budget;
    });
  }
  
  
  function printBestApartmentOfEachMapFile(list: any[], outputFilePath: string): void {
    try {
      const idsList = list.map((Map) => {
        if (Map === null) {
          return [];
        } else {
          return Map.map((building: any) => building.commonConditions.id);
        }
      });
  
      const idsListString = idsList.join('\n');
      fs.writeFileSync(outputFilePath, idsListString);
      fs.closeSync(fs.openSync(outputFilePath));
    } catch (err) {
      console.error('Error writing to the file:', err);
    }
  }

function processFile(filePath: string): void {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n');

        for (const line of lines) {
            if (line.trim() === '') {
                continue;
            }

            try {
                const jsonData = JSON.parse(line);
                const filteredBuildings = filterbuilds(jsonData.input1, jsonData.input2);
                printBestApartmentOfEachMapFile(filteredBuildings, 'Output2_JLDRL_1247723.txt');
            } catch (error) {
                console.error(`Error parsing line ${lines.indexOf(line) + 1}: ${error}`);
            }
        }
}

