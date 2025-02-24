# My OS Simulator

## Description
My OS Simulator is a web application that simulates an operating system interface, similar to Windows. The application is built using Django for the backend, providing a robust framework for handling requests and managing data.

## Project Structure
```
my-os-simulator
├── my_os_simulator
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── launch.py
├── requirements.txt
├── Front
│   ├── public
│   │   ├── index.html         # The entry point of the web application.
│   │   └── styles
│   │       └── main.css       # CSS styles for the application.
│   ├── src
│   │   ├── components
│   │   │   └── Desktop.tsx    # React component representing the desktop interface.
│   │   ├── App.tsx            # Main application component that renders the Desktop.
│   │   └── index.tsx          # Entry point for the React application.
│   ├── package.json            # npm configuration file listing dependencies and scripts.
│   ├── tsconfig.json           # TypeScript configuration file specifying compiler options.
│   └── README.md               # Documentation for the frontend project.
├── Backend
│   ├── my_os_simulator
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md               # Documentation for the backend project.
```

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/my-os-simulator.git
    cd my-os-simulator
    ```

2. Then you can choose automatic installation and setup or to manually setup yourself :

## Automatic Installation and launch :

To automatically install dependencies and launch the application, you can use the provided `launch.py` script. This script will set up the virtual environment, install the required packages, and start both the backend and frontend servers.

Run the following command:
```
python launch.py
```

To stop the development server, press `Ctrl+C` in the terminal where you excuted launch.py



## Manually Setup
### Frontend Setup

To set up the frontend, follow these steps:

1. Navigate to the Frontend directory:
    ```
    cd Frontend
    ```

2. Install the dependencies:
    ```
    npm install
    ```

3. Start the development server:
    ```
    npm start
    ```

4. Open your browser and go to `http://localhost:3000` to view the frontend application.


### Backend Setup

1. Navigate to the Backend directory:
    ```
    cd Backend
    ```

2. Install the required packages:
    ```
    pip install -r requirements.txt
    ```

3. Start the development server:
    ```
    python manage.py runserver
    ```

4. Open your browser and go to `http://localhost:8000` to view the backend application.


## Contributing

Feel free to submit issues or pull requests for any improvements or features you'd like to see!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.