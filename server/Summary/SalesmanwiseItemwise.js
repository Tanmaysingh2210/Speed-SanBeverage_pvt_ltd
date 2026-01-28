import express from "express";
import LoadOut from "../models/transaction/LoadOut.js";

console.log("✅ SalesmanWiseItemWise Summary Loaded");

export const salesmanwiseItemwiseSummary = async (req, res) => {
  try {
    const { salesmanCode, startDate, endDate } = req.query;

    if (!salesmanCode || !startDate || !endDate) {
      return res.status(400).json({
        message: "salesmanCode, startDate and endDate are required"
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = await LoadOut.aggregate([
    
      {
        $match: {
          salesmanCode,
          depo: req.user.depo,
          date: {
            $gte: start,
            $lte: end
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
          preserveNullAndEmptyArrays: true
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
          loadOutAmount: {
            $multiply: ["$items.qty", "$netRate"]
          }
        }
      },


      {
        $group: {
          _id: "$items.itemCode",
          itemCode: { $first: "$items.itemCode" },
          loadOutQty: { $sum: "$items.qty" },
          loadInQty: { $sum: 0 },
          netRate: { $first: "$netRate" }
        }
      },


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

            {
              $addFields: {
                itemCode: "$items.itemCode",
                loadOutQty: 0,
                saleDate: "$date",
                loadInQty: {
                  $add: ["$items.Filled", "$items.Burst"]
                }
              }
            }
          ]
        }
      },

      {
        $group: {
          _id: "$itemCode",
          saleDate: { $max: "$saleDate" },
          loadOutQty: { $sum: "$loadOutQty" },
          loadInQty: { $sum: "$loadInQty" },
          netRate: { $first: "$netRate" }
        }
      },

      {
        $lookup: {
          from: "rates",
          let: {
            itemCode: "$_id",
            saleDate: "$saleDate"
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
          preserveNullAndEmptyArrays: true
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
          netRate: { $ifNull: ["$netRate", 0] }
        }
      },


      {
        $addFields: {
          netQty: { $subtract: ["$loadOutQty", "$loadInQty"] }
        }
      },
      {
        $addFields: {
          netPrice: {
            $multiply: ["$netQty", "$netRate"]
          }
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
          qtySale: "$netQty",
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

