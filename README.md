# BCC Fixed Hardware Reports

## API
### GET /v1/reports
```
curl -i http://localhost:3000/api/v1/reports
```

### POST /v1/reports
Happy request:
```
curl -X POST http://localhost:3000/api/v1/reports \
  -H "Content-Type: application/json" \
  -d '{"climb":"111222333","hardware_type":"bolt","assessed_at":1234567890,"description":"rusty spinning bolt"}' 
```
Unhappy request:
```
curl -X POST http://localhost:3000/api/v1/reports \
  -H "Content-Type: application/json" \
  -d '{"climb":"111222333","hardware_type":"bad_bolt","description":"rusty spinning bolt"}' 
```

### POST /v1/files
Happy request:
For now, images have to be under 1MB otherwise NextJS will error out.
```
curl -X POST http://localhost:3000/api/v1/files \
  -F 'files=@/Users/kao/Downloads/1.jpg' \
  -F 'report_id=rept_2222333344445555666677'
```

## Development
`cd ~/bcc-fixed-hardware-reports` to get into the base folder.
`npm install` to install dependencies.
`npm run dev` to run the development server.
`localhost:3000/reports` to see underlying reports table.

### Testing
`npm test` to run full suite of tests.

### Database
Dev and prod envs currently use the cloud-based DB. You should be using a .env.local URI based at mongodb.net.
To view raw data in mongodb, either go to cloud.mongodb.com and login or download MongoDB Compass and connect it.

### Deployment to prod
Commits pushed to the Github repo automatically get picked up by Vercel.
If anything breaks, ask Alex to log in and debug for you since adding a Vercel team would require us to pay.