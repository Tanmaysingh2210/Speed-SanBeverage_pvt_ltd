const express = require("express");
const LoadOut = require("../models/transaction/LoadOut");

// TEST LOG (optional but useful)
console.log("✅ SalesmanWiseItemWise Router Loaded");

exports.salesmanwiseItemwiseSummary=async (req, res) => {
  try {
    const { salesmanCode, startDate, endDate } = req.query;

    if (!salesmanCode || !startDate || !endDate) {
      return res.status(400).json({
        message: "salesmanCode, startDate and endDate are required"
      });
    }

    const result = await LoadOut.aggregate([
      {
        $match: {
          salesmanCode,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },

      { $unwind: "$items" },

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
                    {
                      $eq: [
                        { $toUpper: "$itemCode" },
                        { $toUpper: "$$itemCode" }
                      ]
                    },
                    { $lte: ["$date", "$$saleDate"] }
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

      {
        $unwind: {
          path: "$price",
          preserveNullAndEmptyArrays: false
        }
      },

      {
        $addFields: {
          safePerDisc: { $ifNull: ["$price.perDisc", 0] },
          safePerTax: { $ifNull: ["$price.perTax", 0] }
        }
      },

      {
        $addFields: {
          taxablePrice: {
            $subtract: [
              "$price.basePrice",
              {
                $multiply: [
                  "$price.basePrice",
                  { $divide: ["$safePerDisc", 100] }
                ]
              }
            ]
          }
        }
      },

      {
        $addFields: {
          netRate: {
            $add: [
              "$taxablePrice",
              {
                $multiply: [
                  "$taxablePrice",
                  { $divide: ["$safePerTax", 100] }
                ]
              }
            ]
          }
        }
      },

      {
        $addFields: {
          amount: {
            $multiply: ["$items.qty", "$netRate"]
          }
        }
      },

      {
        $group: {
          _id: "$items.itemCode",
          qtySale: { $sum: "$items.qty" },
          netPrice: { $sum: "$amount" }
        }
      },

      {
        $lookup: {
          from: "sku_items",
          localField: "_id",
          foreignField: "code",
          as: "item"
        }
      },

      { $unwind: "$item" },

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
    console.error("❌ Summary error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


