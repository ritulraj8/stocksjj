import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoginPage } from './LoginPage.jsx';
import { LoginForm } from './LoginForm.jsx';
import Chart from './chart.jsx';
import { StocksCollection } from '../api/stocksCollection.js';
import { Meteor } from 'meteor/meteor';

export const Sidebar = () => {
  const [marketQuote, setMarketQuote] = useState([]);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  if (code === null) {
    return <LoginForm />;
  }

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    if (code) {
      Meteor.call('getAccessToken', code, (error, result) => {
        if (error) {
          console.error('Error fetching access token', error);
        } else {
          setToken(result);
        }
      });
    }
  }, []);

  useEffect(() => {
    Meteor.call('getUserProfile', token, (error, result) => {
      if (error) {
        console.error('Error fetching user profile', error);
      } else {
        setUser(result.data.user_name);
      }
    });
  }, [token]);

  useEffect(() => {
    if (token) {
      const fetchMarketQuotes = async () => {
        const quote = [];
        for (const stock of stocks) {
          await new Promise((resolve) => {
            Meteor.call('getMarketQuote', { isin: stock.isin, access_token: token, symbol: stock.asset_symbol }, (error, result) => {
              if (error) {
                console.error('Error fetching market quote for', stock.asset_symbol, error);
              } else {
                quote.push(result);
              }
              resolve();
            });
          });
        }
        setMarketQuote(quote);
      };

      fetchMarketQuotes();
    }
  }, [token]);

  useEffect(() => {
    const updatedStocks = stocks.map(stock => {
      const quote = marketQuote.find(q => q.symbol === stock.asset_symbol);
      return quote ? { ...stock, net_change: quote.net_change, last_price: quote.last_price } : stock;
    });
    setFilteredStocks(updatedStocks);
  }, [marketQuote]);

  useEffect(() => {
    const filtered = stocks.filter(stock =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.asset_symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(stock => {
      const quote = marketQuote.find(q => q.symbol === stock.asset_symbol);
      return quote ? { ...stock, net_change: quote.net_change, last_price: quote.last_price } : stock;
    });
    setFilteredStocks(filtered);
  }, [searchQuery, marketQuote]);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    Meteor.call('getHistoricalData', stock, (error, result) => {
      if (error) {
        console.error("Error fetching historical data", error);
      } else {
        setHistoricalData(result);
      }
    });
  };

  const handleUserClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSignOut = () => {
    setUser(null);
    setToken(null);
    Meteor.logout();
    navigate('/loginpage'); 
  };

  const stocklist = filteredStocks.map(stock => (
    <div key={stock.isin} className='mb-5 hover:bg-indigo-100 rounded cursor-pointer overflow-y-visible' onClick={() => handleStockClick(stock)}>
      <div className="flex justify-between items-center">
        <h1 className='text-sm font-semibold'>{stock.name}</h1>
        <p className='text-sm font-semibold'>{stock.last_price}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className='text-grey text-sm'>{stock.asset_symbol}</p>
        <p className={`text-sm ${stock.net_change < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {stock.net_change}
        </p>
      </div>
    </div>
  ));

  return (
    <div>
      <h1 className='bg-indigo-600 p-5 text-white font-semibold text-lg flex justify-between items-center'>
        <span>Downstox</span>
        <span onClick={handleUserClick} className="cursor-pointer relative">
          {user}
          {dropdownVisible && (
            <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded p-3 z-10'>
              <p className='text-sm mb-2 font-medium text-gray-700'>{user}</p>
              <hr className="my-2"/>
              <button
                className='text-red-500 hover:underline text-sm block text-left w-full'
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </span>
      </h1>

      <div className='fixed flex flex-col h-full w-1/4 bg-white shadow-xl p-5 rounded'>
        <div>
          <input
            type='search'
            placeholder="Search for Stocks"
            className='rounded shadow-md h-5 p-5 outline-none w-60'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='mt-5 -px-5 overflow-hidden'>
          {stocklist}
        </div>
      </div>
      {selectedStock && (
        <div className='fixed right-0 top-20 h-full w-3/4 bg-white shadow-xl p-5 rounded'>
          <h2 className='text-lg font-semibold'>{selectedStock.name}</h2>
          <div className='fixed top-20 m-20 w-1/2 h-1/2 shadow-2xl bg-white rounded border-black'>
            <Chart stock={selectedStock} historicalData={historicalData} />
          </div>
        </div>
      )}
    </div>
  );
};




