import LoadOut from "../models/transaction/LoadOut.js";

export const shortExcessSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    // UTC dates – safe
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    console.log("Short/Excess called with:", { 
      startDate, 
      endDate, 
      userDepo: req.user?.depo?.toString()  // convert ObjectId to string for log
    });

    const result = await LoadOut.aggregate([
      {
        $match: {
          depo: req.user.depo,
          date: { $gte: start, $lte: end }
        }
      },

      { $unwind: "$items" },

      {
        $lookup: {
          from: "rates",
          let: { itemCode: "$items.itemCode", saleDate: "$date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toUpper: "$itemCode" }, { $toUpper: "$$itemCode" }] },
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

      { $unwind: { path: "$price", preserveNullAndEmptyArrays: true } },

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
              { $multiply: ["$price.basePrice", { $divide: ["$safePerDisc", 100] }] }
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
          loadOutAmount: { $multiply: ["$items.qty", "$netRate"] }
        }
      },

      {
        $group: {
          _id: "$salesmanCode",
          totalQty: { $sum: "$items.qty" },
          totalSaleAmount: { $sum: "$loadOutAmount" }
        }
      },

      {
        $lookup: {
          from: "transaction_loadins",
          let: { salesmanCode: "$_id", s: start, e: end },
          pipeline: [
            {
              $match: {
                depo: req.user.depo,
                $expr: {
                  $eq: [{ $toUpper: "$salesmanCode" }, { $toUpper: "$$salesmanCode" }]
                },
                date: { $gte: "$$s", $lte: "$$e" }
              }
            },
            { $unwind: "$items" },
            {
              $addFields: {
                returnQty: { $add: [{ $ifNull: ["$items.Filled", 0] }, { $ifNull: ["$items.Burst", 0] }] }
              }
            },

            {
              $lookup: {
                from: "rates",
                let: { itemCode: "$items.itemCode", saleDate: "$date" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: [{ $toUpper: "$itemCode" }, { $toUpper: "$$itemCode" }] },
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
            { $unwind: { path: "$price", preserveNullAndEmptyArrays: true } },

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
                    { $multiply: ["$price.basePrice", { $divide: ["$safePerDisc", 100] }] }
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
                returnAmount: { $multiply: ["$returnQty", "$netRate"] }
              }
            },

            {
              $group: {
                _id: null,
                totalReturnQty: { $sum: "$returnQty" },
                totalReturnAmount: { $sum: "$returnAmount" }
              }
            }
          ],
          as: "loadin"
        }
      },

      {
        $addFields: {
          loadInQty: { $ifNull: [{ $arrayElemAt: ["$loadin.totalReturnQty", 0] }, 0] },
          loadInAmount: { $ifNull: [{ $arrayElemAt: ["$loadin.totalReturnAmount", 0] }, 0] }
        }
      },

      {
        $addFields: {
          netQty: { $subtract: ["$totalQty", "$loadInQty"] },
          netSaleAmount: { $subtract: ["$totalSaleAmount", "$loadInAmount"] }
        }
      },

      {
        $lookup: {
          from: "salesmen",
          localField: "_id",
          foreignField: "codeNo",
          as: "salesmen"
        }
      },
      { $unwind: { path: "$salesmen", preserveNullAndEmptyArrays: true } },

      // 10. Cash credits lookup – FINAL FIXED VERSION
{
  $lookup: {
    from: "transaction_cash_credits",
    let: { 
      sc: { $toString: "$_id" },  // force string
      s: start, 
      e: end 
    },
    pipeline: [
     {
  $match: {
    depo: req.user.depo,
    $expr: {
      $and: [
        {
          $eq: [
            { $toUpper: { $trim: { input: "$salesmanCode" } } },
            { $toUpper: { $trim: { input: "$$sc" } } }
          ]
        },
        { $gte: ["$date", "$$s"] },
        { $lte: ["$date", "$$e"] }
      ]
    }
  }
},
      {
        $group: {
          _id: null,
          totalCash: { $sum: { $ifNull: ["$cashDeposited", 0] } },
          totalCheque: { $sum: { $ifNull: ["$chequeDeposited", 0] } }
        }
      }
    ],
    as: "credits"
  }
},

// 11. s_sheets lookup – same fixed syntax
{
  $lookup: {
    from: "transaction_s_sheets",
    let: { 
      sc: { $toString: "$_id" },
      s: start, 
      e: end 
    },
    pipeline: [
      {
  $match: {
    depo: req.user.depo,
    $expr: {
      $and: [
        {
          $eq: [
            { $toUpper: { $trim: { input: "$salesmanCode" } } },
            { $toUpper: { $trim: { input: "$$sc" } } }
          ]
        },
        { $gte: ["$date", "$$s"] },
        { $lte: ["$date", "$$e"] }
      ]
    }
  }
},

      {
        $group: {
          _id: null,
          totalSchm: { $sum: { $ifNull: ["$schm", 0] } }
        }
      }
    ],
    as: "schemes"
  }
},

      {
        $addFields: {
          totalDeposit: {
            $add: [
              { $ifNull: [{ $arrayElemAt: ["$credits.totalCash", 0] }, 0] },
              { $ifNull: [{ $arrayElemAt: ["$credits.totalCheque", 0] }, 0] },
              { $ifNull: [{ $arrayElemAt: ["$schemes.totalSchm", 0] }, 0] }
            ]
          }
        }
      },

      {
        $addFields: {
          shortExcess: { $subtract: ["$totalDeposit", "$netSaleAmount"] }
        }
      },

      {
        $project: {
          _id: 0,
          salesmanCode: "$_id",
          salesmanName: { $ifNull: ["$salesmen.name", "Unknown"] },
          qtySale: "$netQty",
          netSaleAmount: { $round: ["$netSaleAmount", 2] },
          totalDeposit: { $round: ["$totalDeposit", 2] },
          shortExcess: { $round: ["$shortExcess", 2] }
        }
      },

      { $sort: { shortExcess: 1 } }
    ]);

    // Safe debug logs – AFTER success
    console.log("Short/Excess result count:", result.length);
    if (result.length > 0) {
      const first = result[0];
      console.log("First salesman result:", {
        salesmanCode: first.salesmanCode,
        salesmanName: first.salesmanName,
        qtySale: first.qtySale,
        netSaleAmount: first.netSaleAmount,
        totalDeposit: first.totalDeposit,
        shortExcess: first.shortExcess,
        creditsFound: first.credits?.length || 0,
        schemesFound: first.schemes?.length || 0
      });
    } else {
      console.log("No salesmen found in date range");
    }

    res.json(result || []);

  } catch (error) {
    console.error("❌ Short/Excess CRASH:", {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 6).join('\n')
    });
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};