import { Meteor } from 'meteor/meteor';
import fetch from 'node-fetch'; 
import { Accounts } from 'meteor/accounts-base';
import { StocksCollection } from '../imports/api/stocksCollection';

const api_key = '6df9d08b-58ee-49c4-abf3-57941fb2b991';
const api_secret = 'tah3m5ui17';
const redirect_uri = 'http://localhost:3000/';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (StocksCollection.find().count() === 0) {
    const stocks = [
      {
        "name": "ADITYA BIRLA FASHION & RT",
        "exchange": "NSE",
        "isin": "INE647O01011",
        "asset_symbol": "ABFRL"
      },
      {
        "name": "GUJARAT GAS LIMITED",
        "exchange": "NSE",
        "isin": "INE844O01030",
        "asset_symbol": "GUJGASLTD"
      },
      {
        "name": "HINDUSTAN AERONAUTICS LTD",
        "exchange": "NSE",
        "isin": "INE066F01020",
        "asset_symbol": "HAL"
      },
      {
        "name": "HAVELLS INDIA LIMITED",
        "exchange": "NSE",
        "isin": "INE176B01034",
        "asset_symbol": "HAVELLS"
      },
      {
        "name": "HCL TECHNOLOGIES LTD",
        "exchange": "NSE",
        "isin": "INE860A01027",
        "asset_symbol": "HCLTECH"
      },
      {
        "name": "GTPL HATHWAY LIMITED",
        "exchange": "NSE",
        "isin": "INE869I01013",
        "asset_symbol": "GTPL"
      },
      {
        "name": "PRITIKA ENG COMPO LTD",
        "exchange": "NSE",
        "isin": "INE0MJQ01012",
        "asset_symbol": "PRITIKA"
      },
      {
        "name": "SUPRAJIT ENGINEERING LTD",
        "exchange": "NSE",
        "isin": "INE399C01030",
        "asset_symbol": "SUPRAJIT"
      },
      {
        "name": "THE INDIA CEMENTS LIMITED",
        "exchange": "NSE",
        "isin": "INE383A01012",
        "asset_symbol": "INDIACEM"
      },
      {
        "name": "BATA INDIA LTD",
        "exchange": "NSE",
        "isin": "INE176A01028",
        "asset_symbol": "BATAINDIA"
      },
      {
        "name": "MARUTI SUZUKI INDIA LTD.",
        "exchange": "NSE",
        "isin": "INE585B01010",
        "asset_symbol": "MARUTI"
      },
      {
        "name": "BANDHAN BANK LIMITED",
        "exchange": "NSE",
        "isin": "INE545U01014",
        "asset_symbol": "BANDHANBNK"
      }
    ];
    stocks.forEach(stock => StocksCollection.insert(stock));
  }

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});


Meteor.publish('stocks.all', function () {
  return StocksCollection.find({});
});


Meteor.methods({
  async getAccessToken(code) {
    const response = await fetch('https://api.upstox.com/v2/login/authorization/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: api_key,
        client_secret: api_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      })
    });
    if (!response.ok) {
      throw new Meteor.Error('Error fetching access token', `Status: ${response.status}, Message: ${response.statusText}`);
    }
    const data = await response.json();
    return data.access_token;
  },

  async getUserProfile(accessToken) {
  try {
    const response = await fetch('https://api.upstox.com/v2/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const userProfile = await response.json();
    //console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
},


  async getMarketQuote(data) {
    const response = await fetch(`https://api.upstox.com/v2/market-quote/quotes?instrument_key=NSE_EQ%7C${data.isin}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Meteor.Error('Error fetching market quote', `Status: ${response.status}, Message: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data[`NSE_EQ:${data.symbol}`];
  },

  async getHistoricalData(stocks) {
    try {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate()-7);
      const endDate = today.toISOString().split('T')[0];
      //console.log(endDate);
      const startDate = start.toISOString().split('T')[0];
      //console.log(startDate);
    
      const response = await fetch(`https://api.upstox.com/v2/historical-candle/NSE_EQ%7C${stocks.isin}/1minute/${endDate}/${startDate}`, {
        headers: {
          'Accept': 'application/json'
        } 
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      //console.log(data.data.candles);
      return data.data.candles.reverse();
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
    
  }
});


