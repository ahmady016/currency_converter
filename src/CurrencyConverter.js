import React from 'react'
import { useFetch, timestamp } from './helpers'
import Loading from './Loading'

const currencyConverter = {
  URL: 'https://free.currencyconverterapi.com/api/v6/convert?apiKey=8021ea652534cbd83c31&compact=ultra&q=',
  timeout: timestamp.hour
}

const allCurrencies = {
  key: 'allCurrencies',
  URL: 'https://openexchangerates.org/api/currencies.json',
  timeout: timestamp.day
}

export default function CurrencyConverter() {

  const [amount, setAmount] = React.useState(1);
  const [converted, setConverted] = React.useState(0);
  const [base, setBase] = React.useState('USD');
  const [target, setTarget] = React.useState('EGP');

  const key = `${base}_${target}`;

  const currencies = useFetch({
    key: allCurrencies.key,
    req: ['get', allCurrencies.URL],
    timeout: allCurrencies.timeout
  });

  const convertRate = useFetch({
    key: key,
    req: ['get', `${currencyConverter.URL}${key}`],
    timeout: currencyConverter.timeout,
    deps: [base, target]
  });

  React.useEffect(
    () => void setConverted((convertRate.data[key])? convertRate.data[key] * amount : 'calculating ...'),
    [convertRate.data, amount]
  );

  const handleAmount = (e) => {
    const value = e.target.value;
    if(!value)
      setAmount('');
    else if (/^[0-9]*\.?[0-9]*$/.test(value) )
      setAmount(parseFloat(value));
  };

  const renderOptions = Object.keys(currencies.data).map(key => (<option key={key} value={key}>{`${key} - ${currencies.data[key]}`}</option>) );

  if(currencies.loading)
    return <Loading />
  else if(currencies.error)
    return <div className="alert alert-danger" role="alert">{currencies.error}</div>
  return (
    <div className="card w-75 mx-auto my-3">
      <div className="card-header alert alert-success text-center">
        {amount} {currencies.data[base]} is equal to {converted} {currencies.data[target]}
      </div>
      <div className="card-body">
        <div className="flex-center">
          <div className="mx-2 my-2">
            <label className="sr-only" htmlFor="amount">Amount</label>
            <input id="amount" type="text" className="form-control"
                placeholder="type amount ..."
                value={amount}
                onChange={handleAmount} />
          </div>
          <div className="mx-2 my-2">
            <label className="mr-sm-2 sr-only" htmlFor="base">Base Currency</label>
            <select id="base" className="custom-select mr-sm-2"
                value={base}
                onChange={ e => setBase(e.target.value)} >
              <option value="">Choose base ...</option>
              { renderOptions }
            </select>
          </div>
        </div>
        <div className="flex-center">
          <div className="mx-2 my-2">
            <label className="sr-only" htmlFor="result">Result</label>
            <input type="text" id="result" className="form-control"
                placeholder="result ..."
                value={converted}
                readOnly={true} />
          </div>
          <div className="mx-2 my-2">
            <label className="mr-sm-2 sr-only" htmlFor="target">Target Currency</label>
            <select id="target" className="custom-select mr-sm-2"
                value={target}
                onChange={ e => setTarget(e.target.value)} >
              <option value="">Choose target ...</option>
              { renderOptions }
            </select>
          </div>
        </div>
      </div>
      <div className="card-footer text-center text-light bg-secondary">
        Date: { (new Date()).toLocaleString('en-gb') }
      </div>
    </div>
  )
}