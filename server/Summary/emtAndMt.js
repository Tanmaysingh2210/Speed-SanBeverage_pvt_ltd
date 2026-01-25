import LoadOut from '../models/transaction/LoadOut.js';
import LoadIn from '../models/transaction/loadIn.js';
import {Item} from '../models/SKU.js';
import Salesman from '../models/salesman.js';

export const EmtAndMtSummary = async(req,res)=>{
    try{
        const {startDate , endDate} =req.body;

        if(!startDate || !endDate ) return res.status(400).json({message:"All field are required" , success :false});

        const start = new Date(startDate);
        const end= new Date(endDate);
        end.setHours(23,59,59,999);

        const loadouts = await LoadOut.find(
            { date:{ $gte :start , $lte :end}}
        );

        const salesmanMap = new Map();
        

        for(const loadout of loadouts){
            let mt = 0;
            for(const item of loadout.items){
                const itemDoc=await Item.findOne({
                    code : item.itemCode.trim().toUpperCase()
                });
                if(!itemDoc )continue;
                if(itemDoc.container.toLowerCase()==="mt"){
                    mt += item.qty;
                }

            }
            if(!salesmanMap.has(loadout.salesmanCode)){
                salesmanMap.set(loadout.salesmanCode , {
                    salesmanCode : loadout.salesmanCode,
                    totalMt:0,
                    totalEmt:0
                });
            }

            const agg =  salesmanMap.get(loadout.salesmanCode);
            agg.totalMt+=mt;
            console.log(`agg: ${agg.totalMt}`);
            
        }
        const loadins = await LoadIn.find({
            date:{ $gte :start , $lte :end}
        });
        for (const loadin of loadins){
            let emt =0;
            for (const item of loadin.items){
                const itemDoc= await Item.findOne({
                    code : item.itemCode.trim().toUpperCase() 
                });
                if(!itemDoc) continue;
                if(itemDoc.container.toLowerCase()==="emt"){
                    emt+=item.Emt;
                    console.log("emt:",emt);
                }
            }

            if(!salesmanMap.has(loadin.salesmanCode)){
                salesmanMap.set(loadin.salesmanCode , {
                    salesmanCode : loadin.salesmanCode,
                    totalMt:0,
                    totalEmt:0
                });

            }
            const agg = salesmanMap.get(loadin.salesmanCode);
            agg.totalEmt+=emt;
            console.log(`agg: ${agg.totalEmt}`);
            
         
        }
        const summary = [];
        let grandTotalMt=0;
        let grandTotalEmt = 0;
        for (const [salesmanCode , data] of salesmanMap){
            const salesmanDetails = await Salesman.findOne({
                codeNo: salesmanCode.trim().toUpperCase()
            });
            if(!salesmanDetails) continue;
            summary.push({
                salesmanCode,
                name : salesmanDetails.name,
                totalMt : data.totalMt,
                totalEmt : data.totalEmt
            })
            
            grandTotalMt +=data.totalMt;
            grandTotalEmt +=data.totalEmt;
        }
        res.status(200).json({
            success : true , 
            data :summary ,
            grandTotal : {
                grandTotalMt : grandTotalMt,
                grandTotalEmt : grandTotalEmt
            }
        })
    }
    catch(err){
         console.error('Error in Emt/mt  summary:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}