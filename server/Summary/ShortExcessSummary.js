import express from "express";
import LoadOut from "../models/transaction/LoadOut.js";

export const shortExcessSummary = async (req, res) => {

    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "startDate and endDate are required"
            });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const result = await LoadOut.aggregate([

            {
                $match: {
                    depo: req.user.depo,
                    date: {
                        $gte: start,
                        $lte: end,
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

            { $unwind: "$price" },


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
                    _id: "$salesmanCode",
                    totalQty: { $sum: "$items.qty" },
                    totalSaleAmount: { $sum: "$loadOutAmount" }
                }

            },


            {
                $lookup: {
                    from: "transaction_loadins",
                    let: {
                        salesmanCode: "$_id",
                        startDate: start,
                        endDate: end,
                    },
                    pipeline: [
                        {
                            $match: {
                                depo: req.user.depo,
                                $expr: {
                                    $eq: [
                                        { $toUpper: "$salesmanCode" },
                                        { $toUpper: "$$salesmanCode" }
                                    ]
                                },
                                date: {
                                    $gte: start,
                                    $lte: end
                                }
                            }
                        },

                        { $unwind: "$items" },

                        // returnQty = filled + leaked
                        {
                            $addFields: {
                                returnQty: { $add: ["$items.Filled", "$items.Burst"] }
                            }
                        },

                        // rate lookup for each item
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

                        // safe discount & tax
                        {
                            $addFields: {
                                safePerDisc: { $ifNull: ["$price.perDisc", 0] },
                                safePerTax: { $ifNull: ["$price.perTax", 0] }
                            }
                        },

                        // taxable price
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

                        // net rate
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

                        // return amount
                        {
                            $addFields: {
                                returnAmount: {
                                    $multiply: ["$returnQty", "$netRate"]
                                }
                            }
                        },

                        // group per salesman
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
                    loadInQty: {
                        $ifNull: [{ $arrayElemAt: ["$loadin.totalReturnQty", 0] }, 0]
                    },
                    loadInAmount: {
                        $ifNull: [{ $arrayElemAt: ["$loadin.totalReturnAmount", 0] }, 0]
                    }
                }
            },


            {
                $addFields: {
                    netQty: { $subtract: ["$totalQty", "$loadInQty"] },
                    netSaleAmount: {
                        $subtract: ["$totalSaleAmount", "$loadInAmount"]
                    }
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

            { $unwind: "$salesmen" },

            {
                $lookup: {
                    from: "transaction_cash_credits",
                    let: {
                        salesmanCode: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                depo: req.user.depo,
                                $expr: {
                                    $eq: [
                                        { $toUpper: "$salesmanCode" },
                                        { $toUpper: "$$salesmanCode" }
                                    ]

                                },
                                date: {
                                    $gte: start,
                                    $lte: end,
                                }
                            }
                        },


                        {
                            $addFields: {
                                value: {
                                    $add: ["$ref",
                                        {
                                            $add: [
                                                "$value", {
                                                    $multiply: [
                                                        "$value",
                                                        { $divide: ["$tax", 100] }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },

                        {
                            $lookup: {
                                from: "transaction_s_sheets",
                                let: {
                                    salesmanCode: "$salesmanCode",
                                    startDate: start,
                                    endDate: end
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            { $toUpper: "$salesmanCode" },
                                                            { $toUpper: "$$salesmanCode" }
                                                        ]
                                                    },
                                                    { $gte: ["$date", "$$startDate"] },
                                                    { $lte: ["$date", "$$endDate"] }
                                                ]

                                            }
                                        }
                                    }
                                ],
                                as: "sheets"
                            }
                        },

                        {
                            $addFields: {
                                schm: { $ifNull: [{ $arrayElemAt: ["$sheets.schm", 0] }, 0] }
                            }
                        },

                        {
                            $addFields: {
                                netvalue: { $add: ["$value", "$schm"] }
                            }
                        },

                        {
                            $group: {
                                _id: null,
                                totalDeposit: { $sum: "$netvalue" }
                            }
                        }

                    ],
                    as: "deposits"
                }
            },

            {
                $addFields: {
                    totalDeposit: {
                        $ifNull: [{ $arrayElemAt: ["$deposits.totalDeposit", 0] }, 0]
                    }
                }
            },

            {
                $addFields: {
                    shortExcess: {
                        $subtract: [
                            "$totalDeposit", "$netSaleAmount"
                        ]
                    }
                }
            },

            {
                $project: {
                    _id: 0,
                    salesmanCode: "$_id",
                    salesmanName: "$salesmen.name",
                    qtySale: "$netQty",
                    netSaleAmount: { $round: ["$netSaleAmount", 2] },
                    totalDeposit: 1,
                    shortExcess: 1
                }
            }
        ]);

        res.json(result);

    } catch (error) {
        console.error("❌ Summary error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

