import LoadOut from "../models/transaction/LoadOut.js";
import LoadIn from "../models/transaction/loadIn.js";


const createMonthMap = () => new Map([
    ["JAN", 0], ["FEB", 0], ["MAR", 0], ["APR", 0],
    ["MAY", 0], ["JUN", 0], ["JUL", 0], ["AUG", 0],
    ["SEP", 0], ["OCT", 0], ["NOV", 0], ["DEC", 0],
]);

const getMonthName = (date) =>
  ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
  [new Date(date).getMonth()];



const getMonthWiseGraph = async ({ start, end, depo }) => {
    const [loadouts, loadins    ] = await Promise.all([
        LoadOut.find({ depo, date: { $gte: start, $lte: end } }),
        LoadIn.find({ depo, date: { $gte: start, $lte: end } }),
    ]);

    const monthMap= createMonthMap();

    for(const loadout of loadouts){
        const monthKey = getMonthName(loadout.date);
        for (const item of loadout.items ){
            monthMap.set(
                monthKey,
                monthMap.get(monthKey) + item.qty 
            );
        }
        
    }

    for (const loadin of loadins) {
    const monthKey = getMonthName(loadin.date);

    for (const item of loadin.items) {

    if (item.Emt != 0 ) continue;

      monthMap.set(
        monthKey,
        monthMap.get(monthKey) - ((item.Filled || 0) + (item.Burst || 0))
      );
    }
  }

 return Object.fromEntries(monthMap);


}

export default getMonthWiseGraph;