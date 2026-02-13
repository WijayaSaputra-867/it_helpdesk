# IT Helpdesk

A modern IT Helpdesk application built with Laravel, React (Inertia.js), and Tailwind CSS. Featuring Gemini AI integration for smarter ticket handling and Google reCAPTCHA for security.

## Features

- **Modern UI**: Clean and responsive administrative interface.
- **AI-Powered**: Integration with Google Gemini for intelligent assistance.
- **Secure**: Protected by Google reCAPTCHA v3.
- **Real-time Tracking**: Easy ticket creation and tracking for users.

## Prerequisites

- PHP ^8.4
- Node.js & NPM
- Composer
- SQLite (default) or other supported database

## Installation

### 1. Clone the repository
Clone the project repository using `git clone`:
```bash
git clone <repository-url>
cd it_helpdesk
```

### 2. Quick Setup
The project includes a setup script for easy installation:
```bash
composer setup
```
This script will automatically perform the following steps:
- Install PHP dependencies with `composer install`
- Create `.env` from `.env.example` (if not exists)
- Generate an application key with `php artisan key:generate`
- Run database migrations with `php artisan migrate`
- Install Node dependencies with `npm install`
- Build assets with `npm run build`

### 3. Manual Configuration (Optional)
If you prefer to configure manually or need to set specific environment variables:

1.  **Environment Variables**:
    Edit the `.env` file and configure your settings:
    - `DB_CONNECTION`: Database configuration (defaults to SQLite)
    - `GEMINI_API_KEY`: Your Google Gemini API key
    - `VITE_RECAPTCHA_SITE_KEY` & `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA credentials

2.  **Install PHP Dependencies**:
    Install all required PHP packages using Composer:
    ```bash
    composer install
    ```

3.  **Generate App Key**:
    Generate the application encryption key:
    ```bash
    php artisan key:generate
    ```

4.  **Run Migrations**:
    Prepare the database by running migrations:
    ```bash
    php artisan migrate
    ```

5.  **Install Node Dependencies**:
    Install all required frontend packages using NPM:
    ```bash
    npm install
    ```

6.  **Build Assets**:
    Compile the frontend assets:
    ```bash
    npm run build
    ```

## Running the Application

To start the development server including the queue processing and Vite:
```bash
composer dev
```
This command uses `concurrently` to run `php artisan serve`, `php artisan queue:listen`, and `npm run dev` in a single terminal.

## Testing
Run the test suite using Pest:
```bash
composer test
```
