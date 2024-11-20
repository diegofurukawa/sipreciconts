#!/bin/bash

# Create Logs directory if it doesn't exist
mkdir -p Logs

# Run frontend server and log output
cd frontend
npm run dev 2>&1 | tee ../Logs/frontend.log