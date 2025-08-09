import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

/**
 * Fetches exchange rates from USD to other currencies
 */
const getExchangeRates = asyncHandler(async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/6c726f2eef74105ff040df4b/latest/USD"
    );

    if (!response.ok) {
      throw new ApiError({
        statusCode: response.status,
        message: "Failed to fetch exchange rates",
        errors: [{ field: "exchange_api", message: "API request failed" }],
      });
    }

    const data = (await response.json()) as ExchangeRateApiResponse;
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Exchange rates fetched successfully", data)
      );
  } catch {
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch exchange rates",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches all countries data
 */
const getAllCountries = asyncHandler(async (req: Request, res: Response) => {
  try {
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
    return res
      .status(200)
      .json(new ApiResponse(200, "Countries data fetched successfully", data));
  } catch {
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch countries data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches cryptocurrency market data with pagination
 */
const getCryptoMarkets = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1 } = req.query;

  try {
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

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Cryptocurrency data fetched successfully",
          filteredData
        )
      );
  } catch {
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch cryptocurrency data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

/**
 * Fetches banks by country code
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

  try {
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

    return res
      .status(200)
      .json(new ApiResponse(200, "Bank data fetched successfully", { banks: data.data }));
  } catch {
    throw new ApiError({
      statusCode: 500,
      message: "Failed to fetch bank data",
      errors: [{ field: "server", message: "Internal server error" }],
    });
  }
});

export {
  getExchangeRates,
  getAllCountries,
  getCryptoMarkets,
  getBanksByCountry,
};
