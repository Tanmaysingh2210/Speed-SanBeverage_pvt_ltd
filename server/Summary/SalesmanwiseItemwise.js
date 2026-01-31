import express from "express";
import LoadOut from "../models/transaction/LoadOut.js";

console.log("✅ SalesmanWiseItemWise Summary Loaded");
export const salesmanwiseItemwiseSummary = async (req, res) => {
  try {
    console.log("→ SalesmanWiseItemwise called", {
      salesmanCode: req.query.salesmanCode,
      start: req.query.startDate,
      end: req.query.endDate,
      user: req.user ? req.user._id : "NO USER",
      depo: req.user?.depo || "NO DEPO"
    });

    const { salesmanCode, startDate, endDate } = req.query;

    if (!salesmanCode || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    if (!req.user?.depo) {
      console.log("CRITICAL: No depo in req.user");
      return res.status(401).json({ message: "User depo not found - authentication issue" });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = await LoadOut.aggregate([
      // Step 1: LoadOut ke saare relevant records
      {
        $match: {
          salesmanCode,
          depo: req.user.depo,
          date: { $gte: start, $lte: end }
        }
      },
      { $unwind: "$items" },
      // Filter out EMT (empty) items
      {
        $match: {
          "items.itemCode": { $not: /EMT/ }
        }
      },
      {
        $project: {
          _id: 0,                       // exclude _id if you don't want it
          date: 1,
          "itemCode": "$items.itemCode",
          "loadOutQty": "$items.qty",
          "loadInQty": { $literal: 0 }, // or just 0
          "source": { $literal: "loadout" }
        }
      },

      // Step 2: Union with LoadIn (Emt ignore → sirf Filled + Burst)
      {
        $unionWith: {
          coll: "transaction_loadins",
          pipeline: [
            {
              $match: {
                salesmanCode,
                depo: req.user.depo,
                date: { $gte: start, $lte: end }
              }
            },
            { $unwind: "$items" },
            // Filter out EMT (empty) items
            {
              $match: {
                "items.itemCode": { $not: /EMT/ }
              }
            },
            {
              $project: {
                _id: 0,
                date: 1,
                "itemCode": "$items.itemCode",
                "loadOutQty": { $literal: 0 },
                "loadInQty": {
                  $add: [
                    { $ifNull: ["$items.Filled", 0] },
                    { $ifNull: ["$items.Burst", 0] }
                  ]
                },
                "source": { $literal: "loadin" }
              }
            },
          ]
        }
      },

      // Step 3: date + itemCode pe group → net qty per day per item
      {
        $group: {
          _id: { date: "$date", itemCode: "$itemCode" },
          date: { $first: "$date" },
          itemCode: { $first: "$itemCode" },
          loadOutQty: { $sum: "$loadOutQty" },
          loadInQty: { $sum: "$loadInQty" }
        }
      },
      {
        $addFields: {
          netQty: { $subtract: ["$loadOutQty", "$loadInQty"] }
        }
      },

      // Step 4: Is date ke liye latest rate lookup (depo bhi match karo!)
      {
        $lookup: {
          from: "rates",
          let: {
            itemCode: "$itemCode",
            saleDate: "$date",
            depo: req.user.depo
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toUpper: "$itemCode" }, { $toUpper: "$$itemCode" }] },
                    { $eq: ["$depo", "$$depo"] },
                    { $lte: ["$date", "$$saleDate"] }
                  ]
                }
              }
            },
            { $sort: { date: -1 } },
            { $limit: 1 }
          ],
          as: "rateDoc"
        }
      },
      { $unwind: { path: "$rateDoc", preserveNullAndEmptyArrays: true } },

      // Step 5: netRate calculate
      {
        $addFields: {
          safePerDisc: { $ifNull: ["$rateDoc.perDisc", 0] },
          safePerTax: { $ifNull: ["$rateDoc.perTax", 0] },
          basePrice: { $ifNull: ["$rateDoc.basePrice", 0] }
        }
      },
      {
        $addFields: {
          taxablePrice: {
            $subtract: [
              "$basePrice",
              { $multiply: ["$basePrice", { $divide: ["$safePerDisc", 100] }] }
            ]
          }
        }
      },
      {
        $addFields: {
          netRate: {
            $add: [
              "$taxablePrice",
              { $multiply: ["$taxablePrice", { $divide: ["$safePerTax", 100] }] }
            ]
          }
        }
      },
      {
        $addFields: {
          netRate: { $ifNull: ["$netRate", 0] },
          dailyAmount: { $multiply: ["$netQty", "$netRate"] }
        }
      },

      // Step 6: Final group by itemCode → total qty + total amount
  
      {
        $group: {
          _id: "$itemCode",
          itemCode: { $first: "$itemCode" },
          qtySale: { $sum: "$netQty" },
          netPrice: { $sum: "$dailyAmount" }
        }
      },

      // Step 7: Item name lookup
      {
        $lookup: {
          from: "sku_items",
          localField: "_id",
          foreignField: "code",
          as: "item"
        }
      },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },

      // Step 8: Final projection
      {
        $project: {
          _id: 0,
          itemCode: "$itemCode",
          itemName: { $ifNull: ["$item.name", "Unknown"] },
          qtySale: 1,
          netPrice: { $round: ["$netPrice", 2] }
        }
      },

      // Optional: sort by qty descending or itemCode
      { $sort: { qtySale: -1 } }
    ]);
    console.log("RESULT COUNT:", result.length);
    res.json(result);
  } catch (err) {
    console.error("SALESMAN-WISE-ITEM-WISE ERROR:", {
      message: err.message,
      stack: err.stack?.substring(0, 400),
      name: err.name
    });
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      // only in dev → remove in prod
      stack: err.stack
    });
  }
};