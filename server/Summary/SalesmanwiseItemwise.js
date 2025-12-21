const LoadOut = require('../models/transaction/LoadOut.js')
const express = require('express');
const router = express.Router();

router.get("/salesman-wise-item-wise", async (req, res) => {
  try {
    const { salesmanCode, startDate, endDate } = req.query;

    if (!salesmanCode || !startDate || !endDate) {
      return res.status(400).json({
        message: "salesmanCode, startDate and endDate are required"
      });
    }

    const result = await LoadOut.aggregate([
      // 1️⃣ filter loadout
      {
        $match: {
          salesmanCode,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },

      // 🔥 2️⃣ BREAK items ARRAY
      { $unwind: "$items" },

      // 3️⃣ price lookup
      {
        $lookup: {
          from: "rates",
          let: {
            itemCode: "$items.itemCode",
            saleDate: "$date"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$itemCode", "$$itemCode"] },
                    { $lte: ["$date", "$$saleDate"] },
                    { $eq: ["$status", "Active"] }
                  ]
                }
              }
            },
            { $sort: { date: -1 } },
            { $limit: 1 }
          ],
          as: "price"
        }
      },

      { $unwind: "$price" },

      // 4️⃣ calculate taxable price
      {
        $addFields: {
          taxablePrice: {
            $subtract: [
              "$price.basePrice",
              {
                $multiply: [
                  "$price.basePrice",
                  { $divide: ["$price.perDisc", 100] }
                ]
              }
            ]
          }
        }
      },

      // 5️⃣ calculate net rate
      {
        $addFields: {
          netRate: {
            $add: [
              "$taxablePrice",
              {
                $multiply: [
                  "$taxablePrice",
                  { $divide: ["$price.perTax", 100] }
                ]
              }
            ]
          }
        }
      },

      // 6️⃣ amount = qty × netRate
      {
        $addFields: {
          amount: {
            $multiply: ["$items.qty", "$netRate"]
          }
        }
      },

      // 7️⃣ group item-wise
      {
        $group: {
          _id: "$items.itemCode",
          qtySale: { $sum: "$items.qty" },
          netPrice: { $sum: "$amount" }
        }
      },

      // 8️⃣ item name lookup
      {
        $lookup: {
          from: "sku_items",
          localField: "_id",  // itemCode
          foreignField: "code",
          as: "item"
        }
      },
      { $unwind: "$item" },

      // 9️⃣ final output
      {
        $project: {
          _id: 0,
          itemCode: "$_id",
          itemName: "$item.name",
          qtySale: 1,
          netPrice: { $round: ["$netPrice", 2] }
        }
      }
    ]);

    res.json(result);

  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
