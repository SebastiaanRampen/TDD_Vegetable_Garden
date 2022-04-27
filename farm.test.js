const {
  getYieldForPlant,
  getYieldForCrop,
  getTotalYield,
  getCostsForCrop,
  getRevenueForCrop,
  getProfitForCrop,
  getTotalProfit,
} = require("./farm");

describe("getYieldForPlant", () => {
  test("Get yield for plant with no environment factors", () => {
    const corn = {
      name: "corn",
      yield: 30,
    };

    expect(getYieldForPlant(corn)).toBe(30);
  });

  test("Get yield for plant with one environment factor", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
      },
    };

    const environmentFactors = {
      sun: "low",
    };

    expect(getYieldForPlant(corn, environmentFactors)).toBe(15);
  });

  test("Get yield for plant with two environment factors", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
        wind: {
          low: -60,
          medium: -30,
          high: 0,
        },
      },
    };

    const environmentFactors = {
      sun: "high",
      wind: "medium",
    };

    expect(getYieldForPlant(corn, environmentFactors)).toBeCloseTo(31.5);
  });

  test("Get yield for plant with irrelevant environment factors", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
        wind: {
          low: -60,
          medium: -30,
          high: 0,
        },
      },
    };

    const environmentFactors = {
      sun: "high",
      wind: "medium",
      clay: "high",
    };

    expect(getYieldForPlant(corn, environmentFactors)).toBeCloseTo(31.5);
  });

  test("Get yield for plant with irrelevant crop factors", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
        wind: {
          low: -60,
          medium: -30,
          high: 0,
        },
        clay: {
          low: -30,
          medium: 20,
          high: -50,
        },
      },
    };

    const environmentFactors = {
      sun: "high",
      wind: "medium",
    };

    expect(getYieldForPlant(corn, environmentFactors)).toBeCloseTo(31.5);
  });
});

describe("getYieldForCrop", () => {
  test("Get yield for crop, simple", () => {
    const corn = {
      name: "corn",
      yield: 3,
    };
    const input = {
      crop: corn,
      numCrops: 10,
    };
    expect(getYieldForCrop(input)).toBe(30);
  });

  test("Get yield for crop with one environment factor", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
      },
    };

    const environmentFactors = {
      sun: "low",
    };

    const input = {
      crop: corn,
      numCrops: 10,
    };

    expect(getYieldForCrop(input, environmentFactors)).toBe(150);
  });

  test("Get yield for crop with two environment factors", () => {
    const corn = {
      name: "corn",
      yield: 30,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
        wind: {
          low: -60,
          medium: -30,
          high: 0,
        },
        clay: {
          low: -30,
          medium: 20,
          high: -50,
        },
      },
    };

    const environmentFactors = {
      sun: "high",
      wind: "medium",
    };

    const input = {
      crop: corn,
      numCrops: 10,
    };

    expect(getYieldForCrop(input, environmentFactors)).toBeCloseTo(315);
  });
});

describe("getTotalYield", () => {
  test("Calculate total yield with multiple crops", () => {
    const corn = {
      name: "corn",
      yield: 3,
    };
    const pumpkin = {
      name: "pumpkin",
      yield: 4,
    };
    const crops = [
      { crop: corn, numCrops: 5 },
      { crop: pumpkin, numCrops: 2 },
    ];
    expect(getTotalYield({ crops })).toBe(23);
  });

  test("Calculate total yield with 0 amount", () => {
    const corn = {
      name: "corn",
      yield: 3,
    };
    const crops = [{ crop: corn, numCrops: 0 }];
    expect(getTotalYield({ crops })).toBe(0);
  });

  test("Calculate total yield with multiple crops and environment", () => {
    const corn = {
      name: "corn",
      yield: 3,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
      },
    };
    const pumpkin = {
      name: "pumpkin",
      yield: 4,
      factor: {
        sun: {
          low: -25,
          medium: 10,
          high: 30,
        },
      },
    };

    const environmentFactors = {
      sun: "low",
    };

    const crops = [
      { crop: corn, numCrops: 5 }, // 5*3*0.5=7.5
      { crop: pumpkin, numCrops: 2 }, //2*4*0.75=6
    ];
    expect(getTotalYield({ crops }, environmentFactors)).toBe(13.5);
  });
});

describe("getCostsForCrop", () => {
  test("Get costs for crop, simple", () => {
    const corn = {
      name: "corn",
      costs: 3,
    };
    const input = {
      crop: corn,
      numCrops: 10,
    };
    expect(getCostsForCrop(input)).toBe(30);
  });
});

describe("getRevenueForCrop", () => {
  test("Get revenue for crop with no environment factors", () => {
    const corn = {
      name: "corn",
      yield: 3,
      salePrice: 2,
    };
    const input = {
      crop: corn,
      numCrops: 10,
    };
    expect(getRevenueForCrop(input)).toBe(60);
  });

  test("Calculate revenue for crop with environment factors", () => {
    const corn = {
      name: "corn",
      yield: 3,
      salePrice: 2,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
      },
    };

    const environmentFactors = {
      sun: "low",
    };

    const crops = { crop: corn, numCrops: 5 }; // 5*3*0.5 *2=7.5 *2 =15
    expect(getRevenueForCrop(crops, environmentFactors)).toBeCloseTo(15);
  });
});

describe("getProfitForCrop", () => {
  test("Get profit for crop with no environment factors", () => {
    const corn = {
      name: "corn",
      costs: 3,
      yield: 3,
      salePrice: 2,
    };
    const input = {
      crop: corn,
      numCrops: 10,
    };
    expect(getProfitForCrop(input)).toBe(30);
  });

  test("Calculate profit for crop with environment factors", () => {
    const corn = {
      name: "corn",
      costs: 3,
      yield: 3,
      salePrice: 2,
      factor: {
        sun: {
          low: -50,
          medium: 0,
          high: 50,
        },
      },
    };

    const environmentFactors = {
      sun: "low",
    };

    const crops = { crop: corn, numCrops: 5 }; //(5*3*2*0.5) - 5*3
    expect(getProfitForCrop(crops, environmentFactors)).toBeCloseTo(0);
  });
});

describe("getTotalProfit", () => {
  const corn = {
    name: "corn",
    costs: 3,
    yield: 3,
    salePrice: 2,
    factor: {
      sun: {
        low: -50,
        medium: 0,
        high: 50,
      },
      wind: {
        low: 10,
        medium: -10,
        high: -30,
      },
      soil: {
        low: -20,
        medium: 0,
        high: -10,
      },
    },
  };
  const pumpkin = {
    name: "pumpkin",
    costs: 5,
    yield: 4,
    salePrice: 3,
    factor: {
      sun: {
        low: -30,
        medium: 10,
        high: 40,
      },
      wind: {
        low: 10,
        medium: -10,
        high: -50,
      },
    },
  };

  const smarties = {
    name: "smarties",
    costs: 10,
    yield: 8,
    salePrice: 6,
    factor: {
      sun: {
        low: -75,
        medium: -30,
        high: 50,
      },
      wind: {
        low: 30,
        medium: -30,
        high: -50,
      },
      smiles: {
        low: -10,
        medium: 50,
        high: 200,
      },
    },
  };

  test("Get Total profit for various crops with no environmental factors", () => {
    const crops = [
      { crop: corn, numCrops: 5 },
      { crop: pumpkin, numCrops: 2 },
    ];
    expect(getTotalProfit({ crops })).toBe(29);
  });
  test("Get Total profit for various crops with 0", () => {
    const crops = [
      { crop: corn, numCrops: 5 },
      { crop: pumpkin, numCrops: 0 },
    ];
    expect(getTotalProfit({ crops })).toBe(15);
  });

  test("get Total Profit for various crops with environmental factors", () => {
    const crops = [
      { crop: corn, numCrops: 2 }, //    (2 * 3 * 2 * 0.5 * 0.9) - (2 * 3) = 5.4 - 6
      { crop: pumpkin, numCrops: 4 }, // (4 * 4 * 3 * 0.7 * 0.9) - (4 * 5) = 30.24 - 20
      { crop: smarties, numCrops: 0 },
    ]; //                                 -0.6 + 10.24 = 9.64

    const environmentFactors = {
      sun: "low",
      wind: "medium",
    };
    expect(getTotalProfit({ crops }, environmentFactors)).toBeCloseTo(9.64);
  });
});
