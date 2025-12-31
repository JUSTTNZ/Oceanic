import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import NodeCache from "node-cache";

// ===== Types =====
interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

interface CountryApiResponse {
  name: { common: string };
  capital?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  flags?: { png: string; svg: string };
}

interface CryptoMarket {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface Bank {
  id?: number | string;
  name: string;
  code: string;
  [key: string]: unknown;
}

interface PaystackBankApiResponse {
  status: boolean;
  message: string;
  data: Bank[];
}

// ===== Cache Configuration =====
// Exchange rates: 1 hour cache (rates don't change frequently)
const rateCache = new NodeCache({ stdTTL: 3600 });

// Crypto markets: 2 minutes cache (prices change frequently)
const cryptoCache = new NodeCache({ stdTTL: 120 });

// Countries: 24 hours cache (static data)
const countryCache = new NodeCache({ stdTTL: 86400 });

// Banks: 24 hours cache (static data)
const bankCache = new NodeCache({ stdTTL: 86400 });

/**
 * Fetches exchange rates from USD to other currencies with caching
 */
const getExchangeRates = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cachedRates = rateCache.get<ExchangeRateApiResponse>("exchange_rates");
    
    if (cachedRates) {
      console.log("✅ Returning cached exchange rates");
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Exchange rates fetched successfully (cached)", cachedRates)
        );
    }

    // Fetch fresh data
    console.log("🔄 Fetching fresh exchange rates from API...");
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/5b6cdce3d58b3bf1330f360e/latest/USD"
    );

    if (!response.ok) {
      throw new ApiError({
        statusCode: response.status,
        message: "Failed to fetch exchange rates",
        errors: [{ field: "exchange_api", message: `API request failed with status ${response.status}` }],
      });
    }

    const data = (await response.json()) as ExchangeRateApiResponse;
    
    // Store in cache
    rateCache.set("exchange_rates", data);
    console.log("✅ Exchange rates cached successfully");
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Exchange rates fetched successfully", data)
      );
  } catch (error) {
    console.error("❌ Exchange rates error:", error);
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch exchange rates",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches all countries data with caching
 */
const getAllCountries = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cachedCountries = countryCache.get<CountryApiResponse[]>("all_countries");
    
    if (cachedCountries) {
      console.log("✅ Returning cached countries data");
      return res
        .status(200)
        .json(new ApiResponse(200, "Countries data fetched successfully (cached)", cachedCountries));
    }

    // Fetch fresh data
    console.log("🔄 Fetching fresh countries data from API...");
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,flags"
    );

    if (!response.ok) {
      throw new ApiError({
        statusCode: response.status,
        message: "Failed to fetch countries",
        errors: [{ field: "countries_api", message: "Countries API unavailable" }],
      });
    }

    const data = (await response.json()) as CountryApiResponse[];
    
    // Store in cache
    countryCache.set("all_countries", data);
    console.log("✅ Countries data cached successfully");
    
    return res
      .status(200)
      .json(new ApiResponse(200, "Countries data fetched successfully", data));
  } catch (error) {
    console.error("❌ Countries data error:", error);
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch countries data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches cryptocurrency market data with caching and pagination
 */
const getCryptoMarkets = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  const cacheKey = `crypto_markets_page_${page}`;

  try {
    // Check cache first
    const cachedCrypto = cryptoCache.get<CryptoMarket[]>(cacheKey);
    
    if (cachedCrypto) {
      console.log(`✅ Returning cached crypto data for page ${page}`);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Cryptocurrency data fetched successfully (cached)",
            cachedCrypto
          )
        );
    }

    // Fetch fresh data
    console.log(`🔄 Fetching fresh crypto data for page ${page} from API...`);
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false`
    );

    if (!response.ok) {
      throw new ApiError({
        statusCode: response.status,
        message: "Failed to fetch cryptocurrency data",
        errors: [{ field: "crypto_api", message: "CoinGecko API unavailable" }],
      });
    }

    const data = (await response.json()) as CryptoMarket[];

    if (!Array.isArray(data)) {
      throw new ApiError({
        statusCode: 500,
        message: "Invalid cryptocurrency data format",
        errors: [{ field: "data_format", message: "Expected array but got different type" }],
      });
    }

    const filteredData = data.map(
      ({ id, name, symbol, image, current_price }) => ({
        id,
        name,
        symbol,
        image,
        current_price,
      })
    );

    // Store in cache
    cryptoCache.set(cacheKey, filteredData);
    console.log(`✅ Crypto data for page ${page} cached successfully`);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Cryptocurrency data fetched successfully",
          filteredData
        )
      );
  } catch (error) {
    console.error("❌ Crypto markets error:", error);
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch cryptocurrency data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches banks by country code with caching
 */
const getBanksByCountry = asyncHandler(async (req: Request, res: Response) => {
  const { country } = req.query;

  if (!country || typeof country !== "string") {
    throw new ApiError({
      statusCode: 400,
      message: "Valid country code is required",
      errors: [{ field: "country", message: "Country parameter must be a string" }],
    });
  }

  const cacheKey = `banks_${country.toLowerCase()}`;

  try {
    // Check cache first
    const cachedBanks = bankCache.get<Bank[]>(cacheKey);
    
    if (cachedBanks) {
      console.log(`✅ Returning cached banks for ${country}`);
      return res
        .status(200)
        .json(new ApiResponse(200, "Bank data fetched successfully (cached)", { banks: cachedBanks }));
    }

    // Fetch fresh data
    console.log(`🔄 Fetching fresh banks data for ${country} from API...`);
    const response = await fetch(
      `https://api.paystack.co/bank?country=${country}`
    );

    if (!response.ok) {
      throw new ApiError({
        statusCode: response.status,
        message: "Failed to fetch bank data",
        errors: [{ field: "bank_api", message: "Paystack API unavailable" }],
      });
    }

    const data = (await response.json()) as PaystackBankApiResponse;

    if (!Array.isArray(data.data)) {
      throw new ApiError({
        statusCode: 500,
        message: "Invalid bank data format",
        errors: [{ field: "data_format", message: "Expected array in data property" }],
      });
    }

    // Store in cache
    bankCache.set(cacheKey, data.data);
    console.log(`✅ Banks for ${country} cached successfully`);

    return res
      .status(200)
      .json(new ApiResponse(200, "Bank data fetched successfully", { banks: data.data }));
  } catch (error) {
    console.error("❌ Banks data error:", error);
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch bank data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

// Optional: Add cache clearing endpoints for admin use
const clearAllCaches = asyncHandler(async (req: Request, res: Response) => {
  rateCache.flushAll();
  cryptoCache.flushAll();
  countryCache.flushAll();
  bankCache.flushAll();
  
  console.log("🗑️ All caches cleared");
  
  return res
    .status(200)
    .json(new ApiResponse(200, "All caches cleared successfully", null));
});

export {
  getExchangeRates,
  getAllCountries,
  getCryptoMarkets,
  getBanksByCountry,
  clearAllCaches,
};