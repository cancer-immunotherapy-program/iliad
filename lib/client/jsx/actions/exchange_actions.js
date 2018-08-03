import {showMessages} from './app_actions';

export const addExchange = (exchange)=>{
  return {
    type: 'ADD_EXCHANGE',
    exchange_name: exchange.exchange_name,
    exchange: exchange
  };x
};

export const removeExchange = (exchange_name)=>{
  return {
    type: 'REMOVE_EXCHANGE',
    exchange_name: exchange_name
  };
};

export class Exchange{
  constructor(dispatch, exchange_name){
    this.dispatch = dispatch;
    this.exchange_name = exchange_name;
  }

  fetch(path, options){
    this.dispatch(
      addExchange({
        exchange_name: this.exchange_name,
        exchange_path: path,
        start_time: new Date()
      })
    );

    let connectionError = (response)=>{
      this.dispatch(removeExchange(this.exchange_name));
      this.dispatch(showMessages([
        `We were unable to contact the server at: ${path}`
      ]));
    };

    let serverError = (response)=>{
      let err = [`There was an issue retrieving data from ${response.url}.`]

      if(response.status >= 500){
        err.push(`Reason: Server error. (${response.status})`);
      }
      else if(response.status >= 400){
        err.push(`Reason: Client error. (${response.status})`);
      }

      return err;
    };

    let localResponse = (response)=>{
      return new Promise((resolve, reject)=>{
        this.dispatch(removeExchange(this.exchange_name));

        // Catch any network/server issues.
        if(!response.ok) this.dispatch(showMessages(serverError(response)));

        /*
         * Carry on as usual. If there are any server specific problems (non
         * http related problems) then error codes should be caught by the
         * return handlers.
         */
        resolve(response);
      })
    };

    return fetch(path, options)
      .then(localResponse)
      .catch(connectionError);
  }
}
