# BCC Fixed Hardware Reports

## Deployment to prod
Commits pushed to the Github repo automatically get picked up by Vercel.
If anything breaks, ask Alex to log in and debug for you since adding a Vercel team would require us to pay.

## Development
`cd ~/bcc-fixed-hardware-reports` to get into the base folder.
`npm install` to install dependencies.
`npm run dev` to run the development server.
`localhost:3000/reports` to see underlying reports table.


## Database
Dev and prod envs currently use the cloud-based DB. You should be using a .env.local URI based at mongodb.net.
To view raw data in mongodb, either go to cloud.mongodb.com and login or download MongoDB Compass and connect it.