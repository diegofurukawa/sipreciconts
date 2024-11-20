#!/bin/bash

# Create Logs directory if it doesn't exist
mkdir -p Logs

# Run backend server and log output
cd backend
python manage.py runserver 2>&1 | tee ../Logs/backend.log