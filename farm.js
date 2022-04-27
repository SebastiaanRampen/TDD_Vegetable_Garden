const getFactor = (crop, environmentFactors) => {
  let factor = 1;

  const cropKeys = Object.keys(crop.factor);
  const environmentKeys = Object.keys(environmentFactors);

  environmentKeys.forEach((environmentKey) => {
    if (cropKeys.includes(environmentKey)) {
      const cropFactorArray = crop.factor[environmentKey];
      const conditionFactor =
        cropFactorArray[environmentFactors[environmentKey]];
      factor = ((100 + conditionFactor) / 100) * factor;
    }
  });

  return factor;
};

const getYieldForPlant = (crop, environmentFactors) => {
  if (!environmentFactors) {
    return crop.yield;
  }
  let factor;
  factor = getFactor(crop, environmentFactors);
  return crop.yield * factor;
};

const getYieldForCrop = (plants, environmentFactors) =>
  getYieldForPlant(plants.crop, environmentFactors) * plants.numCrops;

const getTotalYield = (plants, environmentFactors) => {
  return plants.crops.reduce((currentYield, plant) => {
    return getYieldForCrop(plant, environmentFactors) + currentYield;
  }, 0);
};

const getCostsForCrop = (plants) => plants.crop.costs * plants.numCrops;

const getRevenueForCrop = (plants, environmentFactors) =>
  getYieldForCrop(plants, environmentFactors) * plants.crop.salePrice;

const getProfitForCrop = (plants, environmentFactors) =>
  getRevenueForCrop(plants, environmentFactors) - getCostsForCrop(plants);

const getTotalProfit = (plants, environmentFactors) => {
  return plants.crops.reduce((currentProfit, plant) => {
    return getProfitForCrop(plant, environmentFactors) + currentProfit;
  }, 0);
};

module.exports = {
  getYieldForPlant,
  getYieldForCrop,
  getTotalYield,
  getCostsForCrop,
  getRevenueForCrop,
  getProfitForCrop,
  getTotalProfit,
};
