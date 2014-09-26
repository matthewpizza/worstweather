# Today’s Worst Weather

<http://www.accuweather.com/en/weather-news>

## Installation

Install npm modules:

```
npm install
```

## Usage

```
node index.js
```

## Automatic Updates

Add a cronjob to the crontab for automatic updates.

Edit the crontab:

```
crontab -e
```

Add the cronjob:

```
*/15 * * * * /usr/local/bin/node path/to/worstweather/index.js
```