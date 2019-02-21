import { BASE_URL } from './../constants/API';
import UserStore from './UserStore';
import NdaStore from './NdaStore';

export class ApiContext {
  session = null;
  authHeader = null;

  async callApi(endpoint, args) {
    let url = args && args.fullPath ? endpoint : (BASE_URL + endpoint);
    const method = args && args.method || 'GET';
    const headers = {};
    let body = null;

    if (args && args.params) {
      Object.keys(args.params).forEach((key, index) => {
        url += (index === 0 ? '?' : '&') + key + '=' + encodeURIComponent(args.params[key]);
      });
    }

    if (args && args.body) {
      headers['Accept'] = 'application/json';
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(args.body)
    }
    if (args && args.auth) {
      headers['Authorization'] = this.authHeader;
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'omit',
    });

    // if (args && args.cleanupCookies) {
    //   await CookieManager.clearAll();
    // }
    if (args && args.auth && response.status === 401) {
      console.log('token expired. logging out')
      // if (this.stores)
      //   await this.stores.authStore.logout(false);
      return response;
    }
    return response;
  }
}

const ctx = new ApiContext();
const stores = {
  userStore: new UserStore(ctx),
  ndaStore: new NdaStore(ctx),
};

ctx.stores = stores;
export default stores;