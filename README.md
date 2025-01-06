Logify - Fitness and Sleep Tracking Application

Overview
Logify is a modern web application for tracking fitness activities and sleep patterns. Built with vanilla JavaScript and powered by Supabase for the backend, it features a responsive design and interactive data visualization.
Features

User Authentication

Discord OAuth integration
Secure user session management


Dashboard

Real-time workout metrics visualization
Sleep tracking statistics
Activity history cards
Weight loss progress tracking


Sleep Tracking

Record sleep start and end times
Calculate total sleep duration
Visual representation of sleep patterns
Goal tracking comparison



Tech Stack

Frontend

HTML5
Vanilla JavaScript
Tailwind CSS
Chart.js for data visualization


Backend

Supabase for database and authentication
PostgreSQL with Row Level Security (RLS)


Database Structure
Tables

logify_user_table

id (int8, primary key)
created_at (timestamp)


sleep_records

id (int8, primary key)
user_id (uuid, foreign key)
hours_slept (float8)
sleep_start (timestamp)
sleep_end (timestamp)
created_at (timestamp)



Security

Row Level Security (RLS) policies implemented
Secure user data isolation
OAuth integration for secure authentication



