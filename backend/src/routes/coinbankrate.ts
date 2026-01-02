import { Router } from 'express';
import { requireSupabaseUser } from '../middlewares/supabaseAuth.js'
import { 
  getExchangeRates, 
  getAllCountries, 
  getCryptoMarkets, 
  getBanksByCountry 
} from '../controllers/coinbankratecontroller.js';

const router = Router();

// Apply Supabase user verification to all routes
router.use(requireSupabaseUser);

// Exchange rates routes
router.get('/exchange-rates', getExchangeRates);

// Countries routes
router.get('/countries', getAllCountries);

// Crypto market data routes
router.get('/crypto-markets', getCryptoMarkets);

// Bank data routes
router.get('/banks', getBanksByCountry);

export default router;