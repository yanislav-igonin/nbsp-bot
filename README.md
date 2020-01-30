# nbsp-bot
Bot for inserting non-breaking space in text between 2 line breaks. Written for instagram posts writing help.

`'\n\n'` -> `'\n⠀\n'`

## Check it out
[Running in prod](https://t.me/nbsp_bot)

## Run
### Development
This will run container with `nodemon` that restarts app on every change in `src/` folder.
```bash
BOT_TOKEN=... docker-compsoe -f development.docker-compose.yml up --build
```

### Production
```bash
BOT_TOKEN=... WEBHOOK_HOST=... WEBHOOK_PORT=... WEBHOOK_PATH=... docker stack deploy -c production.docker-swarm.yml nbsp-bot
```