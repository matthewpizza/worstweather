# Today’s Worst Weather

<http://www.accuweather.com/en/weather-news>

This project is not affiliated with AccuWeather.

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

## Notifications

When the new Worst Weather image is posted, [node-notifier](https://github.com/mikaelbr/node-notifier/) will send a desktop notification:

![OS X Notification](https://github.com/matthewspencer/worstweather/raw/master/notification.png)

## Slack

Send notifications to [Slack](https://slack.com) when the new Worst Weather image is posted. Requires a `slack.json` config file with the following data:

```json
{
	"domain":  "",
	"token":   "",
	"channel": ""
}
```

![Slack message](https://cloud.githubusercontent.com/assets/97460/4531024/56ac74ec-4d86-11e4-90f1-dbba55bad9c7.png)
