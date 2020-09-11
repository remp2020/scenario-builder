## Install guide

1. Run `npm install`
2. Be sure to have scenario config filled in a global scope. It should look like this:

```js
window.Scenario = {
  config: {
    AUTH_TOKEN: '',
    CRM_HOST: '',
    CANCEL_PATH: '',
    SEGMENT_ID: null
  }
};
```

3. `npm run start` for development

## Build guide

1. Run `npm run build` if you want to build whole application for the deployment. Then you can host contents of `/build` folder as static files.